import { UserProfile, EligibilityAssessment } from '../types/scheme';
import { SchemeRecord, SchemeMatchResult } from '../types/catalog';
import { evaluateEligibility } from '../utils/eligibilityEngine';

export interface CitizenNeedsProfile {
  profile: UserProfile;
  selectedNeeds: string[]; // e.g. ['Pension', 'Farming', 'Healthcare']
}

export class EligibilityService {
  /**
   * Deterministically evaluate and rank all schemes against citizen's profile and needs.
   */
  public matchSchemes(
    schemes: SchemeRecord[],
    needsProfile: CitizenNeedsProfile
  ): SchemeMatchResult[] {
    const { profile, selectedNeeds } = needsProfile;
    const results: SchemeMatchResult[] = [];

    for (const scheme of schemes) {
      // 1. Run deterministic criteria evaluation
      const eligibility: EligibilityAssessment = evaluateEligibility(scheme.schemeData, profile);

      // 2. Score calculation
      let score = 0;
      const matchReasons: string[] = [];
      const unmetReasons: string[] = [];
      const missingDetails: string[] = [...eligibility.missing_info];

      // A. Category / Need alignment (Weight: 35 points)
      const normalizedNeeds = selectedNeeds.map(n => n.toLowerCase());
      const schemeCategories = [scheme.category, ...scheme.categories].map(c => c.toLowerCase());
      const hasNeedMatch = normalizedNeeds.some(need =>
        schemeCategories.some(cat => cat.includes(need) || need.includes(cat)) ||
        scheme.keywords.some(kw => kw.includes(need) || need.includes(kw))
      );

      if (hasNeedMatch || selectedNeeds.length === 0) {
        score += 35;
        matchReasons.push(`Directly provides assistance for ${scheme.category}`);
      }

      // B. State Eligibility (Weight: 25 points)
      const userState = profile.state;
      const isAllIndia = scheme.applicable_states.includes('All India');
      const isStateEligible = isAllIndia || (userState && scheme.applicable_states.includes(userState));

      if (isStateEligible) {
        score += 25;
        if (!isAllIndia && userState) {
          matchReasons.push(`Exclusive state welfare initiative for ${userState} residents`);
        } else {
          matchReasons.push('Applicable to citizens across India');
        }
      } else {
        unmetReasons.push(`Scheme is restricted to ${scheme.applicable_states.join(', ')} (You selected ${userState})`);
      }

      // C. Deterministic Criteria Checks (Weight: 40 points)
      let criteriaScore = 0;
      for (const check of eligibility.criteria_checks) {
        if (check.status === 'met') {
          criteriaScore += 10;
          matchReasons.push(check.message);
        } else if (check.status === 'not_met') {
          unmetReasons.push(check.message);
        } else if (check.status === 'needs_verification') {
          missingDetails.push(check.label);
        } else if (check.status === 'not_applicable') {
          criteriaScore += 5;
        }
      }

      // Cap criteria contribution to 40
      score += Math.min(40, criteriaScore);

      // Penalize heavily if key deterministic criteria failed
      if (eligibility.status === 'LIKELY_NOT_ELIGIBLE' || !isStateEligible) {
        score = Math.max(10, score - 50);
      }

      // Determine match tier
      let matchTier: 'HIGH_MATCH' | 'POSSIBLE_MATCH' | 'EXPLORE';
      if (score >= 70 && isStateEligible && eligibility.status !== 'LIKELY_NOT_ELIGIBLE') {
        matchTier = 'HIGH_MATCH';
      } else if (score >= 45 && isStateEligible) {
        matchTier = 'POSSIBLE_MATCH';
      } else {
        matchTier = 'EXPLORE';
      }

      results.push({
        scheme,
        matchScore: Math.min(100, score),
        matchTier,
        eligibility,
        matchReasons,
        unmetReasons,
        missingDetails: Array.from(new Set(missingDetails)),
      });
    }

    // Sort by match tier and score descending
    const tierPriority = { HIGH_MATCH: 3, POSSIBLE_MATCH: 2, EXPLORE: 1 };
    results.sort((a, b) => {
      const tierDiff = tierPriority[b.matchTier] - tierPriority[a.matchTier];
      if (tierDiff !== 0) return tierDiff;
      return b.matchScore - a.matchScore;
    });

    return results;
  }
}

export const eligibilityService = new EligibilityService();
