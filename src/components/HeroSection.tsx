import React, { useState } from 'react';
import {
  Search,
  Mic,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Compass,
  FileUp,
  UserCheck2,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { IndianLanguageCode } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  currentLanguage: IndianLanguageCode;
  onOpenWizard: () => void;
  onOpenBrowse: () => void;
  onOpenUpload: () => void;
  onOpenVoice: () => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLanguage,
  onOpenWizard,
  onOpenBrowse,
  onOpenUpload,
  onOpenVoice,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const sampleSearchChips = [
    { label: '🌾 PM-Kisan (₹6,000/yr)', query: 'PM Kisan Samman Nidhi' },
    { label: '☀️ PM Surya Ghar (Solar Subsidy)', query: 'PM Surya Ghar' },
    { label: '👴 Telangana Aasara Pension', query: 'Telangana Aasara' },
    { label: '🏥 Ayushman Bharat (₹5 Lakh Cover)', query: 'Ayushman Bharat PMJAY' },
    { label: '🎓 Karnataka Vidyasiri Scholarship', query: 'Karnataka Vidyasiri' },
    { label: '💼 PM Mudra Loan', query: 'PM Mudra Yojana' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-b border-slate-200">
      {/* Subtle geometric background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
        {/* Flagship Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold tracking-wide uppercase shadow-xs mb-5">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>India Welfare Discovery & Eligibility Assistant</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight mb-3">
          Yojana<span className="text-amber-600">Mitra</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-bold text-slate-800 max-w-2xl mx-auto tracking-tight mb-3">
          &ldquo;Making government schemes simple, personal, and accessible.&rdquo;
        </p>

        {/* Mission Statement */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          You don't need to know the scheme name or read dense government PDFs.
          Simply tell us your age, state, and needs to discover official welfare schemes you qualify for.
        </p>

        {/* Natural Language Search Bar with Voice Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center rounded-3xl border-2 border-slate-300 bg-white p-2 shadow-lg focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200/50 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <Search className="h-5 w-5" />
            </div>

            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. farmer support, pension for 65+ in Telangana, solar rooftop..."
              className="w-full bg-transparent px-3 py-2 text-sm md:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
            />

            {/* Microphone Voice Button */}
            <button
              id="hero-voice-search-btn"
              type="button"
              onClick={onOpenVoice}
              className="group flex items-center gap-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-2 text-xs font-bold transition-all mr-2"
              title="Speak to YojanaMitra"
            >
              <Mic className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Voice</span>
            </button>

            {/* Search Submit Button */}
            <button
              id="hero-search-submit-btn"
              type="submit"
              className="rounded-2xl bg-slate-900 hover:bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Popular:</span>
            {sampleSearchChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSearchSubmit(chip.query)}
                className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 shadow-2xs transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Core Entry Point Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 text-left">
          {/* 1. Find Schemes For Me (Primary) */}
          <button
            id="hero-cta-wizard-btn"
            type="button"
            onClick={onOpenWizard}
            className="group flex flex-col justify-between rounded-3xl border-2 border-amber-500 bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs text-white mb-3">
                <UserCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold">Find Schemes For Me</h3>
              <p className="mt-1 text-xs text-amber-100 leading-relaxed">
                6 simple questions. Instant match across all central & state schemes.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>Start Assistant</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* 2. Speak to YojanaMitra */}
          <button
            id="hero-cta-voice-btn"
            type="button"
            onClick={onOpenVoice}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-3">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Speak in Any Language</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Talk in Hindi, Telugu, Tamil, or English. Built for elderly and voice-first citizens.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Open Microphone</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* 3. Browse Schemes */}
          <button
            id="hero-cta-browse-btn"
            type="button"
            onClick={onOpenBrowse}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-3">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Browse Catalog</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Filter by Central vs State, category, state, and target beneficiary.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
              <span>Explore Directory</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* 4. Upload Scheme PDF */}
          <button
            id="hero-cta-upload-btn"
            type="button"
            onClick={onOpenUpload}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 mb-3">
                <FileUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Upload Scheme PDF</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Have an official gazette or brochure? YojanaMitra extracts and explains it.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-800 group-hover:translate-x-1 transition-transform">
              <span>Upload Document</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
