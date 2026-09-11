import React from 'react';
import {
  FileText,
  Building2,
  Users,
  Calendar,
  IndianRupee,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { IndianLanguageCode, SchemeData } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface SchemeSummaryCardProps {
  scheme: SchemeData;
  currentLanguage: IndianLanguageCode;
  onProceedToProfile: () => void;
}

export const SchemeSummaryCard: React.FC<SchemeSummaryCardProps> = ({
  scheme,
  currentLanguage,
  onProceedToProfile,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const ageReq = scheme.eligibility_criteria.age_requirements;
  const incomeReq = scheme.eligibility_criteria.income_requirements;
  const stateReq = scheme.eligibility_criteria.state_requirements;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6">
      {/* Top Tag & Ministry */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            AI Scheme Summary
          </span>
          {scheme.source_document && (
            <span className="text-xs text-slate-700 font-medium truncate max-w-xs">
              Source: {scheme.source_document}
            </span>
          )}
        </div>

        {scheme.ministry_or_department && (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span className="truncate max-w-sm">{scheme.ministry_or_department}</span>
          </div>
        )}
      </div>

      {/* Main Scheme Name */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans mb-3">
        {scheme.scheme_name}
      </h2>

      {/* Plain Language Summary */}
      <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
        {scheme.short_description}
      </p>

      {/* Quick Summary Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Target Beneficiaries */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-blue-800" />
            <span>Target Group</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
            {scheme.target_beneficiaries || 'Citizens meeting eligibility criteria'}
          </p>
        </div>

        {/* Financial or Main Benefit */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-800" />
            <span>Primary Benefit</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
            {scheme.benefits?.[0]?.amount_or_details || scheme.benefits?.[0]?.title || 'Direct Welfare Assistance'}
          </p>
        </div>

        {/* Coverage / Area */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span>Geographic Scope</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
            {stateReq.is_all_india
              ? 'All Indian States & UTs'
              : stateReq.applicable_states?.join(', ') || 'Specified States'}
          </p>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-700 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>Extracted directly from official scheme guidelines</span>
        </div>

        <button
          id="proceed-to-profile-btn"
          onClick={onProceedToProfile}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>Step 3: Enter Your Details to Check Eligibility</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
