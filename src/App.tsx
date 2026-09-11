import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FindSchemesWizard } from './components/FindSchemesWizard';
import { MatchedSchemesView } from './components/MatchedSchemesView';
import { BrowseSchemes } from './components/BrowseSchemes';
import { UploadSection } from './components/UploadSection';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DisclaimerFooter } from './components/DisclaimerFooter';

import {
  SchemeData,
  UserProfile,
  IndianLanguageCode,
} from './types/scheme';
import { SchemeRecord, SchemeMatchResult } from './types/catalog';
import { VERIFIED_SCHEME_CATALOG, DEMO_PERSONAS } from './data/schemeCatalog';
import { eligibilityService } from './services/eligibilityService';
import { schemeRepository } from './services/schemeRepository';
import { searchService } from './services/searchService';
import { UI_TRANSLATIONS } from './data/translations';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building2,
  FileCheck,
} from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  age: 65,
  state: 'Telangana',
  annual_income: 150000,
  occupation: 'Senior citizen',
  category: 'OBC',
  gender: 'Any',
};

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<IndianLanguageCode>('en');
  const [activeView, setActiveView] = useState<'home' | 'wizard' | 'matched' | 'browse' | 'upload'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Pension', 'Healthcare']);
  const [matchResults, setMatchResults] = useState<SchemeMatchResult[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<SchemeRecord | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [browseCategory, setBrowseCategory] = useState<string>('All Categories');
  const [browseSearchQuery, setBrowseSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Compute matches whenever user finishes wizard
  const handleWizardComplete = (profile: UserProfile, needs: string[]) => {
    setUserProfile(profile);
    setSelectedNeeds(needs);

    const allSchemes = schemeRepository.getAll();
    const results = eligibilityService.matchSchemes(allSchemes, {
      profile,
      selectedNeeds: needs,
    });

    setMatchResults(results);
    setActiveView('matched');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick 1-Click Demo Persona loader from Homepage
  const handleLoadPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    setUserProfile(persona.profile);
    setSelectedNeeds(persona.selectedNeeds);

    const allSchemes = schemeRepository.getAll();
    const results = eligibilityService.matchSchemes(allSchemes, {
      profile: persona.profile,
      selectedNeeds: persona.selectedNeeds,
    });

    setMatchResults(results);
    setActiveView('matched');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search submission from Hero
  const handleHeroSearch = (query: string) => {
    setBrowseSearchQuery(query);
    setActiveView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Voice intent handler
  const handleVoiceIntent = (
    query: string,
    extractedProfile?: any,
    suggestedNeeds?: string[]
  ) => {
    if (extractedProfile && (extractedProfile.age || extractedProfile.state || extractedProfile.occupation || extractedProfile.income)) {
      // Pre-fill profile and run matching
      const mergedProfile: UserProfile = {
        age: extractedProfile.age ?? userProfile.age,
        state: extractedProfile.state ?? userProfile.state,
        annual_income: extractedProfile.income ?? extractedProfile.annual_income ?? userProfile.annual_income,
        occupation: extractedProfile.occupation ?? userProfile.occupation,
        category: extractedProfile.category ?? userProfile.category,
        gender: extractedProfile.gender ?? userProfile.gender,
      };
      const mergedNeeds = suggestedNeeds && suggestedNeeds.length > 0 ? suggestedNeeds : selectedNeeds;
      handleWizardComplete(mergedProfile, mergedNeeds);
    } else {
      // Fallback to browse search
      handleHeroSearch(query);
    }
  };

  // Scheme loaded from custom PDF upload
  const handleCustomSchemeLoaded = (customScheme: SchemeData, sampleProfile?: UserProfile) => {
    const isState = customScheme.eligibility_criteria?.state_requirements?.is_all_india === false;
    const applicableStates = customScheme.eligibility_criteria?.state_requirements?.applicable_states || ['All India'];
    const primaryState = applicableStates[0] || 'All India';

    // Wrap SchemeData into SchemeRecord
    const newRecord: SchemeRecord = {
      id: 'custom-' + Date.now(),
      scheme_name: customScheme.scheme_name,
      official_name: customScheme.scheme_name,
      short_description: customScheme.short_description,
      description: customScheme.short_description,
      simple_explanation: customScheme.short_description,
      government_level: isState ? 'state' : 'central',
      state: primaryState,
      applicable_states: applicableStates,
      category: 'Uploaded Scheme',
      categories: ['Uploaded Scheme', 'Custom'],
      ministry: customScheme.ministry_or_department || 'Government Authority',
      benefit_amount: customScheme.benefits?.[0]?.amount_or_details || 'As specified in document',
      benefits: customScheme.benefits || [],
      who_is_this_for: customScheme.target_beneficiaries || 'Eligible citizens',
      target_beneficiaries: customScheme.target_beneficiaries || 'Eligible citizens',
      age_min: customScheme.eligibility_criteria?.age_requirements?.min_age ?? null,
      age_max: customScheme.eligibility_criteria?.age_requirements?.max_age ?? null,
      income_limit: customScheme.eligibility_criteria?.income_requirements?.max_annual_income ?? null,
      occupation_requirements: customScheme.eligibility_criteria?.occupation_requirements?.eligible_occupations || [],
      category_requirements: customScheme.eligibility_criteria?.category_requirements?.eligible_categories || [],
      gender_requirements: customScheme.eligibility_criteria?.gender_requirements?.eligible_genders || ['Any'],
      other_eligibility: customScheme.eligibility_criteria?.other_requirements?.map(r => r.title) || [],
      required_documents: customScheme.required_documents || [],
      application_steps: customScheme.application_steps || [],
      application_url: customScheme.application_portal,
      official_source_url: customScheme.application_portal || 'https://india.gov.in',
      source_reference: customScheme.source_document || 'Uploaded PDF Gazette',
      last_updated: new Date().toISOString().split('T')[0],
      keywords: ['uploaded', 'gazette', 'custom'],
      status: 'active',
      schemeData: customScheme,
    };

    schemeRepository.importSchemes([newRecord]);
    if (sampleProfile) {
      setUserProfile(sampleProfile);
    }
    setSelectedScheme(newRecord);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onGoHome={() => setActiveView('home')}
        onOpenWizard={() => setActiveView('wizard')}
        onOpenBrowse={() => setActiveView('browse')}
        onOpenUpload={() => setActiveView('upload')}
        onOpenVoice={() => setIsVoiceOpen(true)}
        activeView={activeView}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <div className="space-y-12">
            <HeroSection
              currentLanguage={currentLanguage}
              onOpenWizard={() => setActiveView('wizard')}
              onOpenBrowse={() => setActiveView('browse')}
              onOpenUpload={() => setActiveView('upload')}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onSearchSubmit={handleHeroSearch}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* 1-Click Demo Personas Showcase */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Live Testing Personas
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                      Test With Ready Citizen Profiles
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500">
                      Click any persona below to see deterministic eligibility matching in real-time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DEMO_PERSONAS.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-amber-400 hover:bg-amber-50/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{p.icon}</span>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                            <p className="text-xs font-semibold text-amber-800">{p.roleTitle}</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {p.description}
                        </p>

                        <div className="space-y-1 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80">
                          <p>• Age: <strong className="text-slate-800">{p.profile.age} yrs</strong></p>
                          <p>• State: <strong className="text-slate-800">{p.profile.state}</strong></p>
                          <p>• Income: <strong className="text-slate-800">₹{p.profile.annual_income?.toLocaleString('en-IN')} / yr</strong></p>
                          <p>• Needs: <strong className="text-slate-800">{p.selectedNeeds.join(', ')}</strong></p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLoadPersona(p)}
                        className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 hover:bg-amber-600 py-2.5 text-xs font-bold text-white transition-colors"
                      >
                        <span>Match Schemes for {p.name.split(' ')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Catalog Schemes Preview */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Pre-loaded Indian Welfare Schemes
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                      Popular Government Schemes
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500">
                      Official programs with verified benefit amounts, eligibility criteria, and application steps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('browse')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
                  >
                    <span>View All Schemes in Catalog</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {VERIFIED_SCHEME_CATALOG.slice(0, 6).map((scheme) => (
                    <div
                      key={scheme.id}
                      className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {scheme.government_level === 'central' ? 'Central Scheme' : scheme.state}
                          </span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            {scheme.category}
                          </span>
                        </div>

                        <h4 className="mt-3 text-lg font-extrabold text-slate-900">
                          {scheme.scheme_name}
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                          {scheme.official_name}
                        </p>

                        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs border border-slate-100">
                          <p className="font-bold text-slate-700">Who is this for?</p>
                          <p className="text-slate-600 mt-0.5 line-clamp-2">{scheme.who_is_this_for}</p>
                        </div>

                        <div className="mt-3 text-xs font-extrabold text-emerald-700">
                          Benefit: {scheme.benefit_amount}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {scheme.applicable_states.join(', ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedScheme(scheme)}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                        >
                          Details
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How YojanaMitra Works 3-Step Educational Banner */}
              <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Transparent Welfare Matching
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    How YojanaMitra Works
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Built specifically for Indian citizens with zero technical jargon.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm mb-3">
                      1
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Tell Us About Yourself</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Simply share your age, state, approximate income, and kind of help needed. Or tap the mic to speak in your mother tongue.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm mb-3">
                      2
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Deterministic Eligibility</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      We never let AI hallucinate eligibility rules. Our deterministic engine verifies real gazette criteria: age, residency, and thresholds.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm mb-3">
                      3
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Apply with Confidence</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Receive an interactive document checklist, numbered application steps, and official verified government portal links (.gov.in).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WIZARD */}
        {activeView === 'wizard' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <FindSchemesWizard
              initialProfile={userProfile}
              initialNeeds={selectedNeeds}
              language={currentLanguage}
              onComplete={handleWizardComplete}
              onCancel={() => setActiveView('home')}
            />
          </div>
        )}

        {/* VIEW 3: MATCHED SCHEMES */}
        {activeView === 'matched' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <MatchedSchemesView
              userProfile={userProfile}
              selectedNeeds={selectedNeeds}
              matchResults={matchResults}
              language={currentLanguage}
              onEditProfile={() => setActiveView('wizard')}
              onSelectScheme={(scheme) => setSelectedScheme(scheme)}
            />
          </div>
        )}

        {/* VIEW 4: BROWSE CATALOG */}
        {activeView === 'browse' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <BrowseSchemes
              language={currentLanguage}
              onSelectScheme={(scheme) => setSelectedScheme(scheme)}
              initialCategory={browseCategory}
              initialSearchQuery={browseSearchQuery}
            />
          </div>
        )}

        {/* VIEW 5: UPLOAD PDF */}
        {activeView === 'upload' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                ← Back to Home
              </button>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Upload Official Scheme Document
              </h2>
              <p className="text-sm text-slate-600">
                Upload any central or state government scheme PDF to let YojanaMitra extract and explain it in plain language.
              </p>
            </div>

            <UploadSection
              currentLanguage={currentLanguage}
              onSchemeLoaded={handleCustomSchemeLoaded}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        )}
      </main>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          userProfile={userProfile}
          language={currentLanguage}
          onClose={() => setSelectedScheme(null)}
          onOpenEligibilityWizard={() => {
            setSelectedScheme(null);
            setActiveView('wizard');
          }}
        />
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={currentLanguage}
        onApplyIntent={handleVoiceIntent}
      />

      {/* Statutory Footer */}
      <DisclaimerFooter
        currentLanguage={currentLanguage}
        onLanguageSelect={setCurrentLanguage}
      />
    </div>
  );
}
