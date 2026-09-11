import {
  SchemeData,
  UserProfile,
  EligibilityAssessment,
  CriterionCheck,
  EligibilityStatus,
} from '../types/scheme';

export function evaluateEligibility(
  scheme: SchemeData,
  profile: UserProfile
): EligibilityAssessment {
  const criteria = scheme.eligibility_criteria;
  const checks: CriterionCheck[] = [];
  const missingInfo: string[] = [];

  // 1. Age Evaluation
  const ageReq = criteria.age_requirements;
  const hasAgeLimits = (ageReq.min_age !== null && ageReq.min_age !== undefined) ||
                       (ageReq.max_age !== null && ageReq.max_age !== undefined);

  if (hasAgeLimits) {
    if (profile.age === '' || profile.age === undefined || profile.age === null) {
      checks.push({
        criterion: 'age',
        label: 'Age Requirement',
        status: 'needs_verification',
        message: `Age needs verification (Scheme specifies: ${ageReq.description || 'Age limit applies'})`,
        source_page: ageReq.source_page,
      });
      missingInfo.push('Age');
    } else {
      const userAge = Number(profile.age);
      const minAge = ageReq.min_age ?? 0;
      const maxAge = ageReq.max_age ?? 120;

      if (userAge < minAge) {
        checks.push({
          criterion: 'age',
          label: 'Age Requirement',
          status: 'not_met',
          message: `Age below minimum required (${userAge} years vs minimum ${minAge} years)`,
          source_page: ageReq.source_page,
        });
      } else if (userAge > maxAge) {
        checks.push({
          criterion: 'age',
          label: 'Age Requirement',
          status: 'not_met',
          message: `Age exceeds maximum limit (${userAge} years vs maximum ${maxAge} years)`,
          source_page: ageReq.source_page,
        });
      } else {
        checks.push({
          criterion: 'age',
          label: 'Age Requirement',
          status: 'met',
          message: `Age requirement satisfied (${userAge} years is within ${minAge ? minAge + '+' : ''}${minAge && maxAge !== 120 ? ' to ' : ''}${maxAge !== 120 ? maxAge : ''})`,
          source_page: ageReq.source_page,
        });
      }
    }
  } else {
    checks.push({
      criterion: 'age',
      label: 'Age Requirement',
      status: 'not_applicable',
      message: 'No restrictive age limit specified in document',
      source_page: ageReq.source_page,
    });
  }

  // 2. Income Evaluation
  const incomeReq = criteria.income_requirements;
  const hasIncomeCap = incomeReq.max_annual_income !== null && incomeReq.max_annual_income !== undefined && incomeReq.max_annual_income > 0;

  if (hasIncomeCap) {
    if (profile.annual_income === '' || profile.annual_income === undefined || profile.annual_income === null) {
      checks.push({
        criterion: 'income',
        label: 'Income Requirement',
        status: 'needs_verification',
        message: `Income needs verification (Scheme limit: ₹${(incomeReq.max_annual_income || 0).toLocaleString('en-IN')})`,
        source_page: incomeReq.source_page,
      });
      missingInfo.push('Annual Income');
    } else {
      const userIncome = Number(profile.annual_income);
      const maxIncome = Number(incomeReq.max_annual_income);

      if (userIncome > maxIncome) {
        checks.push({
          criterion: 'income',
          label: 'Income Requirement',
          status: 'not_met',
          message: `Income exceeds stated limit (₹${userIncome.toLocaleString('en-IN')} vs max ₹${maxIncome.toLocaleString('en-IN')})`,
          source_page: incomeReq.source_page,
        });
      } else {
        checks.push({
          criterion: 'income',
          label: 'Income Requirement',
          status: 'met',
          message: `Income requirement satisfied (₹${userIncome.toLocaleString('en-IN')} is within ceiling of ₹${maxIncome.toLocaleString('en-IN')})`,
          source_page: incomeReq.source_page,
        });
      }
    }
  } else {
    checks.push({
      criterion: 'income',
      label: 'Income Requirement',
      status: 'not_applicable',
      message: incomeReq.description || 'No strict income ceiling specified in document',
      source_page: incomeReq.source_page,
    });
  }

  // 3. State Evaluation
  const stateReq = criteria.state_requirements;
  if (stateReq.is_all_india) {
    checks.push({
      criterion: 'state',
      label: 'State & Territory Coverage',
      status: 'met',
      message: profile.state
        ? `State requirement satisfied (${profile.state} is covered under Pan-India scheme)`
        : 'State requirement satisfied (Applicable across all Indian States & UTs)',
      source_page: stateReq.source_page,
    });
  } else if (stateReq.applicable_states && stateReq.applicable_states.length > 0) {
    if (!profile.state) {
      checks.push({
        criterion: 'state',
        label: 'State & Territory Coverage',
        status: 'needs_verification',
        message: `State needs verification (Applicable in: ${stateReq.applicable_states.join(', ')})`,
        source_page: stateReq.source_page,
      });
      missingInfo.push('State');
    } else {
      const stateMatch = stateReq.applicable_states.some(
        s => s.toLowerCase() === profile.state.toLowerCase()
      );
      if (stateMatch) {
        checks.push({
          criterion: 'state',
          label: 'State & Territory Coverage',
          status: 'met',
          message: `State requirement satisfied (${profile.state} is eligible)`,
          source_page: stateReq.source_page,
        });
      } else {
        checks.push({
          criterion: 'state',
          label: 'State & Territory Coverage',
          status: 'not_met',
          message: `Scheme is not currently applicable in ${profile.state}`,
          source_page: stateReq.source_page,
        });
      }
    }
  } else {
    checks.push({
      criterion: 'state',
      label: 'State & Territory Coverage',
      status: 'met',
      message: 'Pan-India or universal geographical scope',
      source_page: stateReq.source_page,
    });
  }

  // 4. Occupation Evaluation
  const occReq = criteria.occupation_requirements;
  const specifiedOccs = occReq.eligible_occupations || [];
  const hasSpecificOcc = specifiedOccs.length > 0 &&
    !specifiedOccs.some(o => ['all', 'any', 'general'].includes(o.toLowerCase()));

  if (hasSpecificOcc) {
    if (!profile.occupation || profile.occupation === 'Other') {
      checks.push({
        criterion: 'occupation',
        label: 'Occupation Requirement',
        status: 'needs_verification',
        message: `Occupation needs verification (Target group: ${specifiedOccs.join(', ')})`,
        source_page: occReq.source_page,
      });
      missingInfo.push('Occupation verification');
    } else {
      const occMatch = specifiedOccs.some(o =>
        profile.occupation.toLowerCase().includes(o.toLowerCase()) ||
        o.toLowerCase().includes(profile.occupation.toLowerCase())
      );
      if (occMatch) {
        checks.push({
          criterion: 'occupation',
          label: 'Occupation Requirement',
          status: 'met',
          message: `Occupation requirement satisfied (${profile.occupation} matches target group)`,
          source_page: occReq.source_page,
        });
      } else {
        checks.push({
          criterion: 'occupation',
          label: 'Occupation Requirement',
          status: 'needs_verification',
          message: `Target occupation is ${specifiedOccs.join(', ')}. Selected: ${profile.occupation}`,
          source_page: occReq.source_page,
        });
      }
    }
  } else {
    checks.push({
      criterion: 'occupation',
      label: 'Occupation Requirement',
      status: 'not_applicable',
      message: occReq.description || 'Open to all citizens regardless of specific occupation',
      source_page: occReq.source_page,
    });
  }

  // 5. Social Category Evaluation
  const catReq = criteria.category_requirements;
  const specifiedCats = catReq.eligible_categories || [];
  const hasSpecificCat = specifiedCats.length > 0 &&
    !specifiedCats.some(c => ['all', 'any', 'general public'].includes(c.toLowerCase()));

  if (hasSpecificCat) {
    if (!profile.category || profile.category === 'Any') {
      checks.push({
        criterion: 'category',
        label: 'Social Category',
        status: 'needs_verification',
        message: `Specific categories targeted: ${specifiedCats.join(', ')}`,
        source_page: catReq.source_page,
      });
      missingInfo.push('Social Category');
    } else {
      const catMatch = specifiedCats.some(c =>
        c.toLowerCase() === profile.category.toLowerCase()
      );
      if (catMatch) {
        checks.push({
          criterion: 'category',
          label: 'Social Category',
          status: 'met',
          message: `Social category requirement satisfied (${profile.category})`,
          source_page: catReq.source_page,
        });
      } else {
        checks.push({
          criterion: 'category',
          label: 'Social Category',
          status: 'not_met',
          message: `Category does not match target group (${specifiedCats.join(', ')})`,
          source_page: catReq.source_page,
        });
      }
    }
  }

  // 6. Gender Evaluation (if applicable)
  const genderReq = criteria.gender_requirements;
  if (genderReq && genderReq.eligible_genders && genderReq.eligible_genders.length > 0) {
    const isGenderRestricted = !genderReq.eligible_genders.some(g => ['all', 'any'].includes(g.toLowerCase()));
    if (isGenderRestricted) {
      if (!profile.gender || profile.gender === 'Any') {
        checks.push({
          criterion: 'gender',
          label: 'Gender Requirement',
          status: 'needs_verification',
          message: `Gender restriction applies: ${genderReq.eligible_genders.join(', ')}`,
          source_page: genderReq.source_page,
        });
        missingInfo.push('Gender');
      } else {
        const genderMatch = genderReq.eligible_genders.some(
          g => g.toLowerCase() === profile.gender.toLowerCase()
        );
        if (genderMatch) {
          checks.push({
            criterion: 'gender',
            label: 'Gender Requirement',
            status: 'met',
            message: `Gender requirement satisfied (${profile.gender})`,
            source_page: genderReq.source_page,
          });
        } else {
          checks.push({
            criterion: 'gender',
            label: 'Gender Requirement',
            status: 'not_met',
            message: `Scheme specifically targets: ${genderReq.eligible_genders.join(', ')}`,
            source_page: genderReq.source_page,
          });
        }
      }
    }
  }

  // Determine overall status
  const hasNotMet = checks.some(c => c.status === 'not_met');
  const hasNeedsVerification = checks.some(c => c.status === 'needs_verification');

  let status: EligibilityStatus;
  let headline: string;
  let summary: string;

  if (hasNotMet) {
    status = 'LIKELY_NOT_ELIGIBLE';
    headline = 'Likely Not Eligible';
    summary = 'Based on the information provided, one or more key scheme requirements do not appear to be satisfied.';
  } else if (hasNeedsVerification) {
    status = 'MORE_INFO_NEEDED';
    headline = 'More Information Needed';
    summary = 'Based on the available information, some requirements need further details to verify your eligibility.';
  } else {
    status = 'LIKELY_ELIGIBLE';
    headline = 'Likely Eligible';
    summary = 'Based on the information provided, you appear to meet the main eligibility requirements.';
  }

  return {
    status,
    headline,
    summary,
    criteria_checks: checks,
    missing_info: missingInfo,
  };
}
