import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Users,
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, IndianLanguageCode } from '../types/scheme';
import { CITIZEN_NEEDS, ALL_INDIAN_STATES, INCOME_RANGES } from '../data/categories';
import { DEMO_PERSONAS } from '../data/schemeCatalog';
import { UI_TRANSLATIONS } from '../data/translations';

interface FindSchemesWizardProps {
  initialProfile?: UserProfile;
  initialNeeds?: string[];
  language: IndianLanguageCode;
  onComplete: (profile: UserProfile, selectedNeeds: string[]) => void;
  onCancel: () => void;
}

export const FindSchemesWizard: React.FC<FindSchemesWizardProps> = ({
  initialProfile,
  initialNeeds = [],
  language,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(initialNeeds);
  const [age, setAge] = useState<number | ''>(initialProfile?.age ?? 65);
  const [state, setState] = useState<string>(initialProfile?.state || 'Telangana');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(initialProfile?.annual_income ?? 150000);
  const [occupation, setOccupation] = useState<string>(initialProfile?.occupation || 'Senior citizen');
  const [category, setCategory] = useState<string>(initialProfile?.category || 'OBC');
  const [gender, setGender] = useState<string>(initialProfile?.gender || 'Any');
  const [additionalTraits, setAdditionalTraits] = useState<string[]>([]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const toggleNeed = (title: string) => {
    if (selectedNeeds.includes(title)) {
      setSelectedNeeds(selectedNeeds.filter(n => n !== title));
    } else {
      setSelectedNeeds([...selectedNeeds, title]);
    }
  };

  const toggleTrait = (trait: string) => {
    if (additionalTraits.includes(trait)) {
      setAdditionalTraits(additionalTraits.filter(t => t !== trait));
    } else {
      setAdditionalTraits([...additionalTraits, trait]);
    }
  };

  const applyPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    setAge(persona.profile.age ?? '');
    setState(persona.profile.state);
    setAnnualIncome(persona.profile.annual_income ?? '');
    setOccupation(persona.profile.occupation);
    setCategory(persona.profile.category);
    setGender(persona.profile.gender);
    setSelectedNeeds(persona.selectedNeeds);
    // Proceed directly to final step or submission
    setStep(6);
  };

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      age,
      state,
      annual_income: annualIncome,
      occupation,
      category,
      gender,
    };
    onComplete(finalProfile, selectedNeeds);
  };

  const occupationOptions = [
    'Farmer',
    'Student',
    'Senior citizen',
    'Unemployed',
    'Employee',
    'Self-employed',
    'Business owner',
    'Homemaker',
    'Person with disability',
    'Other',
  ];

  const traitOptions = [
    'Woman',
    'Senior citizen',
    'Person with disability',
    'Student',
    'Farmer',
    'Low-income household',
    'Rural resident',
    'Other',
  ];

  return (
    <div id="find-schemes-wizard" className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-xl">
      {/* Header & Step Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-700 uppercase">
            <Sparkles className="h-4 w-4" />
            Citizen Scheme Finder
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Step {step} of 6
          </span>
        </div>

        <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Let's find schemes for you
        </h2>
        <p className="mt-1 text-sm md:text-base text-slate-600">
          Answer simple questions to discover benefits you and your family qualify for.
        </p>

        {/* Progress Bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Demo Personas Banner */}
      <div className="mb-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-amber-600" />
            <span>Try sample demo citizen profile (1-Click):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPersona(p)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-xs hover:bg-amber-100 transition-colors"
              >
                <span>{p.icon}</span>
                <span>{p.name.split(' ')[0]} ({p.roleTitle.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: What kind of help are you looking for? */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              1. What kind of help are you looking for?
            </h3>
            <p className="text-sm text-slate-500">
              You can choose multiple options that apply to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {CITIZEN_NEEDS.map(need => {
              const isSelected = selectedNeeds.includes(need.title);
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => toggleNeed(need.title)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{need.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-500">{need.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Age */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              2. What is your age?
            </h3>
            <p className="text-sm text-slate-500">
              Many government schemes have age criteria (e.g. senior citizen pensions or student scholarships).
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative max-w-xs">
              <input
                id="wizard-age-input"
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="Enter age in years"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-lg font-bold text-slate-900 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
              />
              <span className="absolute right-4 top-4 text-sm font-semibold text-slate-400">
                years
              </span>
            </div>

            {/* Quick age chips */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {[19, 25, 42, 57, 60, 65, 70].map(quickAge => (
                  <button
                    key={quickAge}
                    type="button"
                    onClick={() => setAge(quickAge)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      age === quickAge
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {quickAge} years
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: State or UT */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              3. Which state or Union Territory do you live in?
            </h3>
            <p className="text-sm text-slate-500">
              State-specific schemes (like Telangana Aasara or Rythu Bharosa) require residency in that state.
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="state-select" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Select State / UT
            </label>
            <select
              id="state-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base font-semibold text-slate-900 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
            >
              {ALL_INDIAN_STATES.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Popular state quick selectors */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 mb-2">Frequently selected:</p>
              <div className="flex flex-wrap gap-2">
                {['Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'All India'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setState(st)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      state === st
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Income Range */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              4. About how much does your family earn in one year?
            </h3>
            <p className="text-sm text-slate-500">
              Select an approximate income range. You do not need an exact figure right now.
            </p>
          </div>

          <div className="space-y-3">
            {INCOME_RANGES.map(range => {
              const isSelected = annualIncome === range.value;
              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setAnnualIncome(range.value)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{range.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: Occupation */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              5. What best describes you?
            </h3>
            <p className="text-sm text-slate-500">
              Tell us your primary occupation or current life stage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {occupationOptions.map(occ => {
              const isSelected = occupation === occ;
              return (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccupation(occ)}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{occ}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 6: Additional traits & Review */}
      {step === 6 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              6. Do any of these apply to you?
            </h3>
            <p className="text-sm text-slate-500">
              Optional details that unlock specific reserved welfare benefits.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {traitOptions.map(trait => {
              const isSelected = additionalTraits.includes(trait);
              return (
                <button
                  key={trait}
                  type="button"
                  onClick={() => toggleTrait(trait)}
                  className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {trait}
                </button>
              );
            })}
          </div>

          {/* Social Category selector */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              Social Category (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {['General', 'OBC', 'SC', 'ST', 'EWS'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Preview Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900 text-sm">Citizen Profile Summary:</p>
            <p>• Age: <span className="font-semibold">{age || 'Not specified'} years</span></p>
            <p>• State: <span className="font-semibold">{state}</span></p>
            <p>• Annual Income: <span className="font-semibold">₹{annualIncome ? annualIncome.toLocaleString('en-IN') : 'Not specified'}</span></p>
            <p>• Occupation: <span className="font-semibold">{occupation}</span></p>
            {selectedNeeds.length > 0 && (
              <p>• Assistance needed: <span className="font-semibold">{selectedNeeds.join(', ')}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}

        {step < 6 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            id="wizard-find-schemes-btn"
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-7 py-3 text-base font-extrabold text-white shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all hover:scale-102"
          >
            <Sparkles className="h-5 w-5" />
            Find My Schemes
          </button>
        )}
      </div>
    </div>
  );
};
