import React from 'react';
import { ShieldCheck, Heart, Info, Globe, ExternalLink } from 'lucide-react';
import { IndianLanguageCode } from '../types/scheme';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

interface DisclaimerFooterProps {
  currentLanguage: IndianLanguageCode;
  onLanguageSelect: (lang: IndianLanguageCode) => void;
}

export const DisclaimerFooter: React.FC<DisclaimerFooterProps> = ({
  currentLanguage,
  onLanguageSelect,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Disclaimer Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Official Citizen Notice & Disclaimer
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold">
                YM
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                YojanaMitra
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                Citizen Welfare
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-4">
              A digital public welfare initiative built to demystify Indian central and state government schemes. Transforming multi-page complex notifications into clear citizen benefits, required documents, and eligibility evaluations in 12 Indian languages.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>🇮🇳 Made for Indian Citizens</span>
              <span>•</span>
              <span>Zero PII Storage</span>
              <span>•</span>
              <span>100% Free Public Tool</span>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              National Portals
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>DBT Bharat Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>UIDAI Aadhaar Services</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Languages Switch */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Languages Supported</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageSelect(lang.code)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-blue-800 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} YojanaMitra. Making government schemes simple, personal, and accessible.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for citizen empowerment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
