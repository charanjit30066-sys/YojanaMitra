import React from 'react';
import { Languages, Mic, Sparkles, UserCheck2, Compass, FileUp, Home } from 'lucide-react';
import { IndianLanguageCode } from '../types/scheme';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentLanguage: IndianLanguageCode;
  onLanguageChange: (lang: IndianLanguageCode) => void;
  onGoHome: () => void;
  onOpenWizard: () => void;
  onOpenBrowse: () => void;
  onOpenUpload: () => void;
  onOpenVoice: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onGoHome,
  onOpenWizard,
  onOpenBrowse,
  onOpenUpload,
  onOpenVoice,
  activeView,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" id="main-header">
      {/* Top subtle tri-color accent strip */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-amber-500" />
        <div className="flex-1 bg-white border-y border-slate-100" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onGoHome}
            id="brand-logo-button"
          >
            {/* Ashoka Chakra inspired circular emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="m5.6 5.6 12.8 12.8" />
                <path d="m18.4 5.6-12.8 12.8" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  Yojana<span className="text-amber-600">Mitra</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Making government schemes simple, personal, and accessible.
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onGoHome}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'home'
                  ? 'bg-amber-50 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>

            <button
              id="nav-wizard-btn"
              type="button"
              onClick={onOpenWizard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'wizard'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50'
              }`}
            >
              <UserCheck2 className="h-3.5 w-3.5" />
              <span>Find Schemes For Me</span>
            </button>

            <button
              id="nav-browse-btn"
              type="button"
              onClick={onOpenBrowse}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'browse'
                  ? 'bg-amber-50 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Browse Catalog</span>
            </button>

            <button
              id="nav-upload-btn"
              type="button"
              onClick={onOpenUpload}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'upload'
                  ? 'bg-amber-50 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileUp className="h-3.5 w-3.5" />
              <span>Upload PDF</span>
            </button>
          </nav>

          {/* Right Action Controls: Voice + Multilingual Selector */}
          <div className="flex items-center gap-2">
            {/* Voice Assistant Trigger */}
            <button
              id="nav-voice-btn"
              type="button"
              onClick={onOpenVoice}
              className="flex items-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
              title="Speak in your language"
            >
              <Mic className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>

            {/* 12 Indian Languages Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Languages className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                id="language-select-dropdown"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as IndianLanguageCode)}
                className="bg-transparent text-xs font-bold text-slate-800 border-none focus:outline-hidden cursor-pointer"
                aria-label="Select Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
