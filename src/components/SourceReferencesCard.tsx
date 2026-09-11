import React from 'react';
import {
  FileText,
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  Info,
} from 'lucide-react';
import { IndianLanguageCode, SchemeData } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface SourceReferencesCardProps {
  scheme: SchemeData;
  currentLanguage: IndianLanguageCode;
}

export const SourceReferencesCard: React.FC<SourceReferencesCardProps> = ({
  scheme,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const citations = scheme.source_page_references || [];

  return (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 max-w-5xl mx-auto my-6" id="source-citations-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {t.sourceReferencesTitle}
            </h4>
            <p className="text-xs text-slate-500">
              All benefits, rules, and conditions are verified from the uploaded source document
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700">
          <FileText className="w-3.5 h-3.5 text-blue-800" />
          <span className="truncate max-w-xs">{scheme.source_document || 'Official Scheme Circular'}</span>
        </div>
      </div>

      {citations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {citations.map((cite, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs"
            >
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                {cite.topic}
              </span>
              <span className="font-bold text-slate-800">{cite.page}</span>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Grounded Assessment Guarantee:</strong> Every requirement, benefit amount, and document listed in this report is extracted directly from the verified government text. Where rules were unspecified, they are explicitly tagged as such.
        </p>
      </div>
    </div>
  );
};
