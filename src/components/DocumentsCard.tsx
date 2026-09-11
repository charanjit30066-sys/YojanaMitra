import React, { useState } from 'react';
import {
  FileCheck2,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { IndianLanguageCode, SchemeDocument } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface DocumentsCardProps {
  documents: SchemeDocument[];
  currentLanguage: IndianLanguageCode;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({
  documents,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleCheck = (name: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const totalCount = documents.length;
  const completedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="documents-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.documentsTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Interactive document readiness checklist for your application
            </p>
          </div>
        </div>

        {totalCount > 0 && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
            Readiness: <span className="text-blue-900 font-extrabold">{completedCount}</span> / {totalCount} Ready
          </div>
        )}
      </div>

      <div className="space-y-3">
        {documents.map((doc, idx) => {
          const isChecked = Boolean(checkedDocs[doc.name]);
          const isRequired = doc.type === 'required';
          const isConditional = doc.type === 'conditional';
          const isOptional = doc.type === 'optional';

          return (
            <div
              key={idx}
              onClick={() => toggleCheck(doc.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                isChecked
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-slate-400 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {doc.name}
                    </span>

                    {/* Badge */}
                    {isRequired && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                        Mandatory
                      </span>
                    )}
                    {isConditional && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        Conditional
                      </span>
                    )}
                    {isOptional && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Optional
                      </span>
                    )}
                  </div>

                  {doc.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                  )}

                  {doc.condition && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Condition: {doc.condition}</span>
                    </div>
                  )}
                </div>
              </div>

              {doc.source_page && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 whitespace-nowrap">
                  {doc.source_page}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
