import React from 'react';
import {
  AlertOctagon,
  Calendar,
  Clock,
  Ban,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { IndianLanguageCode, ImportantCondition } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface ImportantConditionsCardProps {
  conditions: ImportantCondition[];
  exclusions: string[];
  deadlines?: string;
  sourceDoc?: string;
  currentLanguage: IndianLanguageCode;
}

export const ImportantConditionsCard: React.FC<ImportantConditionsCardProps> = ({
  conditions,
  exclusions,
  deadlines,
  sourceDoc,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="important-conditions-section">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.conditionsTitle}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Exclusions, timelines, and mandatory terms to safeguard your benefit claim
          </p>
        </div>
      </div>

      {/* Deadlines if present */}
      {deadlines && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-0.5">
              Validity & Deadlines
            </span>
            <p className="text-sm font-semibold text-blue-950">{deadlines}</p>
          </div>
        </div>
      )}

      {/* Conditions list */}
      <div className="space-y-3 mb-6">
        {conditions.map((cond, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{cond.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cond.description}
                </p>
              </div>
            </div>

            {cond.source_page && (
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 whitespace-nowrap">
                {cond.source_page}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Explicit Exclusions list */}
      {exclusions && exclusions.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 mb-3">
            <Ban className="w-4 h-4 text-rose-600" />
            <span>Strict Exclusions (Who Cannot Apply)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exclusions.map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs text-rose-900 font-medium flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document citation footer */}
      {sourceDoc && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <FileText className="w-3.5 h-3.5" />
          <span>Extracted from verified source: {sourceDoc}</span>
        </div>
      )}
    </div>
  );
};
