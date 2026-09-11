import React from 'react';
import {
  Gift,
  IndianRupee,
  Shield,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { IndianLanguageCode, SchemeBenefit } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface BenefitsCardProps {
  benefits: SchemeBenefit[];
  currentLanguage: IndianLanguageCode;
}

export const BenefitsCard: React.FC<BenefitsCardProps> = ({
  benefits,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const getBenefitIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'subsidy':
      case 'financial':
        return <IndianRupee className="w-5 h-5 text-emerald-700" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-blue-700" />;
      case 'scholarship':
      case 'training':
        return <GraduationCap className="w-5 h-5 text-purple-700" />;
      case 'employment':
        return <Briefcase className="w-5 h-5 text-amber-700" />;
      default:
        return <Gift className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="benefits-section">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.benefitsTitle}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Direct provisions authorized under this government scheme
          </p>
        </div>
      </div>

      {benefits && benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                      {getBenefitIcon(benefit.type)}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {benefit.title}
                    </h4>
                  </div>

                  {benefit.source_page && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 whitespace-nowrap">
                      {benefit.source_page}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 font-medium leading-relaxed pl-11">
                  {benefit.amount_or_details}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 pl-11">
                <span className="capitalize font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {benefit.type}
                </span>
                <span className="text-[11px]">Verified from document</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-sm">
          No specific financial benefit amounts were listed in the scheme document.
        </div>
      )}
    </div>
  );
};
