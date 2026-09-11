import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building2,
  MapPin,
  FileText,
} from 'lucide-react';
import { SchemeMatchResult, SchemeRecord } from '../types/catalog';
import { IndianLanguageCode } from '../types/scheme';

interface SchemeCardProps {
  matchResult: SchemeMatchResult;
  language: IndianLanguageCode;
  onSelect: (scheme: SchemeRecord) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  matchResult,
  language,
  onSelect,
}) => {
  const [showWhy, setShowWhy] = useState(false);
  const { scheme, matchTier, matchScore, eligibility, matchReasons, unmetReasons, missingDetails } = matchResult;

  const tierBadgeConfig = {
    HIGH_MATCH: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      label: 'HIGH MATCH',
    },
    POSSIBLE_MATCH: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      dot: 'bg-amber-500',
      label: 'POSSIBLE MATCH',
    },
    EXPLORE: {
      bg: 'bg-slate-100 border-slate-200 text-slate-700',
      dot: 'bg-slate-400',
      label: 'OTHER SCHEME',
    },
  };

  const badge = tierBadgeConfig[matchTier];

  return (
    <div
      id={`scheme-card-${scheme.id}`}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition-all"
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${badge.bg}`}>
              <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
              {badge.label} ({matchScore}% Match)
            </span>

            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {scheme.government_level === 'central' ? 'Central Govt' : `State: ${scheme.state}`}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {scheme.category}
          </span>
        </div>

        {/* Scheme Titles */}
        <div className="mt-4">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
            {scheme.scheme_name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
            {scheme.official_name}
          </p>
        </div>

        {/* Why it may help you */}
        <div className="mt-3.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
          <p className="text-xs font-bold text-slate-700">Why it may help you:</p>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {scheme.simple_explanation || scheme.short_description}
          </p>
          <div className="mt-2 text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Benefit: {scheme.benefit_amount}</span>
          </div>
        </div>

        {/* Eligibility Criteria Checklist Preview */}
        <div className="mt-4 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Eligibility Status:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {eligibility.criteria_checks.slice(0, 4).map((check, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium ${
                  check.status === 'met'
                    ? 'bg-emerald-50 text-emerald-800'
                    : check.status === 'not_met'
                    ? 'bg-rose-50 text-rose-800'
                    : 'bg-amber-50 text-amber-800'
                }`}
              >
                {check.status === 'met' && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                {check.status === 'not_met' && <AlertCircle className="h-3 w-3 text-rose-600" />}
                {check.status === 'needs_verification' && <HelpCircle className="h-3 w-3 text-amber-600" />}
                {check.label.replace(' Requirement', '')}
              </span>
            ))}
          </div>
        </div>

        {/* "Why am I seeing this?" collapsible */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors"
          >
            <span>Why am I seeing this?</span>
            {showWhy ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showWhy && (
            <div className="mt-2 rounded-xl bg-amber-50/50 p-3 text-xs border border-amber-200/60 space-y-1 text-slate-700">
              {matchReasons.map((r, i) => (
                <p key={i} className="flex items-start gap-1.5 text-emerald-900">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{r}</span>
                </p>
              ))}
              {missingDetails.length > 0 && (
                <p className="flex items-start gap-1.5 text-amber-900">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Needs verification: {missingDetails.join(', ')}</span>
                </p>
              )}
              {unmetReasons.map((u, i) => (
                <p key={i} className="flex items-start gap-1.5 text-rose-900">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span>{u}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Source: {scheme.source_reference ? 'Official Guidelines' : 'Gov Portal'}
        </span>
        <button
          type="button"
          onClick={() => onSelect(scheme)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-colors"
        >
          View Scheme
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
