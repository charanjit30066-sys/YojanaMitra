import React from 'react';
import {
  Compass,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { IndianLanguageCode, ApplicationStep } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface HowToApplyCardProps {
  steps: ApplicationStep[];
  portalUrl?: string;
  currentLanguage: IndianLanguageCode;
}

export const HowToApplyCard: React.FC<HowToApplyCardProps> = ({
  steps,
  portalUrl,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="how-to-apply-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.howToApplyTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Step-by-step submission procedure outlined in the government document
            </p>
          </div>
        </div>

        {portalUrl && (
          <a
            href={portalUrl.startsWith('http') ? portalUrl : `https://${portalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{t.visitPortalBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        )}
      </div>

      <div className="relative">
        {/* Timeline connector line */}
        <div className="absolute left-4 sm:left-5 top-5 bottom-5 w-0.5 bg-slate-200" aria-hidden="true" />

        <div className="space-y-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 sm:gap-6">
              {/* Step circle */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm ring-4 ring-white z-10">
                {step.step_number || idx + 1}
              </div>

              {/* Step details */}
              <div className="flex-1 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 transition-colors">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
