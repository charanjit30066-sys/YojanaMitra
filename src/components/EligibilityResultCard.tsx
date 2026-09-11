import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowDown,
  FileCheck,
} from 'lucide-react';
import { IndianLanguageCode, EligibilityAssessment } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface EligibilityResultCardProps {
  assessment: EligibilityAssessment;
  currentLanguage: IndianLanguageCode;
}

export const EligibilityResultCard: React.FC<EligibilityResultCardProps> = ({
  assessment,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const isEligible = assessment.status === 'LIKELY_ELIGIBLE';
  const isNotEligible = assessment.status === 'LIKELY_NOT_ELIGIBLE';
  const isMoreInfo = assessment.status === 'MORE_INFO_NEEDED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="eligibility-assessment-card">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {t.assessmentTitle}
        </span>
      </div>

      {/* Large Status Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border-2 transition-all text-center mb-8 ${
          isEligible
            ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
            : isNotEligible
            ? 'bg-rose-50/70 border-rose-500 text-rose-950'
            : 'bg-amber-50/70 border-amber-500 text-amber-950'
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          {isEligible && (
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-emerald-700" />
            </div>
          )}
          {isNotEligible && (
            <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-300 flex items-center justify-center shadow-inner">
              <XCircle className="w-9 h-9 text-rose-700" />
            </div>
          )}
          {isMoreInfo && (
            <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-9 h-9 text-amber-700" />
            </div>
          )}
        </div>

        {/* Status Headline */}
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          {isEligible
            ? `🟢 ${t.likelyEligible}`
            : isNotEligible
            ? `🔴 ${t.likelyNotEligible}`
            : `🟡 ${t.moreInfoNeeded}`}
        </h3>

        {/* Status Summary */}
        <p className="text-sm sm:text-base font-semibold max-w-2xl mx-auto leading-relaxed opacity-90">
          {assessment.summary}
        </p>

        {/* Mandatory preliminary assessment note */}
        <p className="text-xs text-slate-600 mt-3 font-medium">
          Based strictly on deterministic evaluation of the scheme criteria against your profile details.
        </p>
      </div>

      {/* "Why?" Section */}
      <div className="mt-8">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>{t.whySectionTitle}</span>
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </h4>

        <div className="space-y-3">
          {assessment.criteria_checks.map((check, index) => {
            const isMet = check.status === 'met';
            const isFailed = check.status === 'not_met';
            const isWarning = check.status === 'needs_verification';
            const isNA = check.status === 'not_applicable';

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  isMet
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isFailed
                    ? 'bg-rose-50/40 border-rose-200'
                    : isWarning
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isMet && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isFailed && <XCircle className="w-5 h-5 text-rose-600" />}
                    {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    {isNA && <Info className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                      {check.label}
                    </span>
                    <p
                      className={`text-sm font-semibold ${
                        isMet
                          ? 'text-emerald-900'
                          : isFailed
                          ? 'text-rose-900'
                          : isWarning
                          ? 'text-amber-900'
                          : 'text-slate-800'
                      }`}
                    >
                      {check.message}
                    </p>
                  </div>
                </div>

                {check.source_page && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0 whitespace-nowrap">
                    {check.source_page}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="mt-8 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Statutory Citizen Notice</span>
          <p className="leading-relaxed font-medium">{t.disclaimerText}</p>
        </div>
      </div>
    </div>
  );
};
