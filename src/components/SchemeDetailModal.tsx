import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { SchemeRecord } from '../types/catalog';
import { UserProfile, IndianLanguageCode, EligibilityAssessment } from '../types/scheme';
import { evaluateEligibility } from '../utils/eligibilityEngine';
import { SchemeChat } from './SchemeChat';

interface SchemeDetailModalProps {
  scheme: SchemeRecord;
  userProfile?: UserProfile;
  language: IndianLanguageCode;
  onClose: () => void;
  onOpenEligibilityWizard?: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  userProfile,
  language,
  onClose,
  onOpenEligibilityWizard,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

  // Evaluate deterministic eligibility if userProfile is present
  const defaultProfile: UserProfile = userProfile || {
    age: 65,
    state: scheme.state === 'All India' ? 'Telangana' : scheme.state,
    annual_income: 150000,
    occupation: scheme.occupation_requirements[0] || 'Senior citizen',
    category: 'General',
    gender: 'Any',
  };

  const assessment: EligibilityAssessment = evaluateEligibility(scheme.schemeData, defaultProfile);

  const toggleDoc = (docName: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div
        id="scheme-detail-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              {scheme.government_level === 'central' ? '🇮🇳 Central Govt' : `🏛️ ${scheme.state} State`}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {scheme.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              title="Print scheme summary"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Details vs Ask YojanaMitra Chat) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheme Overview & Eligibility
          </button>
          <button
            id="tab-ask-yojanamitra"
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            Ask YojanaMitra (AI Assistant)
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {activeTab === 'chat' ? (
            <div className="py-2">
              <SchemeChat scheme={scheme.schemeData} currentLanguage={language} />
            </div>
          ) : (
            <>
              {/* Scheme Main Heading */}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {scheme.scheme_name}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {scheme.official_name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {scheme.ministry}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Last Updated: {scheme.last_updated}
                  </span>
                </div>
              </div>

              {/* Simple Language Mode Banner */}
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  In Simple Words (Plain Language)
                </div>
                <p className="mt-2 text-sm md:text-base font-medium text-amber-950 leading-relaxed">
                  {scheme.simple_explanation || scheme.short_description}
                </p>
              </div>

              {/* 1. "Who is this for?" */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                    1
                  </span>
                  Who is this for?
                </h3>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900">
                    {scheme.who_is_this_for || scheme.target_beneficiaries}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {scheme.age_min && (
                      <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 border border-slate-200">
                        Age: {scheme.age_min}+ years
                      </span>
                    )}
                    {scheme.income_limit && (
                      <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 border border-slate-200">
                        Income Cap: ₹{scheme.income_limit.toLocaleString('en-IN')} / year
                      </span>
                    )}
                    <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 border border-slate-200">
                      Coverage: {scheme.applicable_states.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. "Are you likely eligible?" & "Why?" */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                      2
                    </span>
                    Are you likely eligible?
                  </h3>

                  {onOpenEligibilityWizard && (
                    <button
                      type="button"
                      onClick={onOpenEligibilityWizard}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                    >
                      Update Profile to Re-check
                    </button>
                  )}
                </div>

                {/* Status card */}
                <div className={`rounded-2xl border p-4 ${
                  assessment.status === 'LIKELY_ELIGIBLE'
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : assessment.status === 'MORE_INFO_NEEDED'
                    ? 'border-amber-200 bg-amber-50/70'
                    : 'border-rose-200 bg-rose-50/70'
                }`}>
                  <div className="flex items-center gap-2">
                    {assessment.status === 'LIKELY_ELIGIBLE' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Likely Eligible
                      </span>
                    )}
                    {assessment.status === 'MORE_INFO_NEEDED' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1 text-xs font-extrabold text-white">
                        <HelpCircle className="h-3.5 w-3.5" /> More Information Needed
                      </span>
                    )}
                    {assessment.status === 'LIKELY_NOT_ELIGIBLE' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold text-white">
                        <AlertCircle className="h-3.5 w-3.5" /> Likely Not Eligible
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs md:text-sm font-medium text-slate-700">
                    {assessment.summary}
                  </p>
                </div>

                {/* "Why?" Breakdown Table */}
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Why? Detailed Criteria Check:
                  </p>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {assessment.criteria_checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 text-xs">
                        <div className="mt-0.5 shrink-0">
                          {check.status === 'met' && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                          {check.status === 'not_met' && (
                            <AlertCircle className="h-4 w-4 text-rose-600" />
                          )}
                          {check.status === 'needs_verification' && (
                            <HelpCircle className="h-4 w-4 text-amber-600" />
                          )}
                          {check.status === 'not_applicable' && (
                            <CheckCircle2 className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{check.label}</p>
                          <p className="text-slate-600 mt-0.5">{check.message}</p>
                        </div>
                        <span className={`rounded-md px-2 py-0.5 font-semibold text-[10px] uppercase ${
                          check.status === 'met'
                            ? 'bg-emerald-100 text-emerald-800'
                            : check.status === 'not_met'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {check.status === 'met' ? 'Satisfied' : check.status === 'not_met' ? 'Not Met' : 'Check Needed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. "What can you receive?" (Benefits) */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                    3
                  </span>
                  What can you receive?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scheme.benefits.map((b, i) => (
                    <div key={i} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <p className="text-xs font-bold text-emerald-900">{b.title}</p>
                      <p className="mt-1 text-sm font-extrabold text-emerald-700">
                        {b.amount_or_details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. "Documents you may need" (Checklist) */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                    4
                  </span>
                  Documents you may need
                </h3>
                <p className="text-xs text-slate-500">
                  Tick the checkboxes to track which documents you have ready before applying:
                </p>
                <div className="space-y-2">
                  {scheme.required_documents.map((doc, idx) => {
                    const isChecked = Boolean(checkedDocs[doc.name]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDoc(doc.name)}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-emerald-300 bg-emerald-50/60'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-emerald-600">
                          {isChecked ? (
                            <CheckSquare className="h-5 w-5 fill-emerald-100" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                              {doc.name}
                            </span>
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              doc.type === 'required'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {doc.type}
                            </span>
                          </div>
                          {doc.description && (
                            <p className="mt-0.5 text-xs text-slate-500">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. "How to apply" */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                    5
                  </span>
                  How to apply
                </h3>
                <div className="space-y-3">
                  {scheme.application_steps.map((step) => (
                    <div key={step.step_number} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-extrabold text-xs text-amber-800">
                        {step.step_number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {scheme.application_url && (
                  <div className="pt-2">
                    <a
                      id="apply-official-portal-btn"
                      href={scheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-amber-700 transition-all"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* 6. "Official source" & Disclaimers */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Official Source Reference
                </p>
                <p>• Department: <span className="font-semibold text-slate-800">{scheme.ministry}</span></p>
                <p>• Reference: <span className="font-semibold text-slate-800">{scheme.source_reference}</span></p>
                <p>• Official Website: <a href={scheme.official_source_url} target="_blank" rel="noopener noreferrer" className="text-amber-700 font-semibold underline">{scheme.official_source_url}</a></p>
                <p className="pt-2 text-[11px] text-slate-500 italic border-t border-slate-200">
                  YojanaMitra provides preliminary guidance. Scheme rules and allocations are subject to official departmental notifications. Please verify the latest information on the official government website before applying.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
