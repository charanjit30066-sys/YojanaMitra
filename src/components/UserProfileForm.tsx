import React from 'react';
import {
  User,
  MapPin,
  IndianRupee,
  Briefcase,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { IndianLanguageCode, UserProfile } from '../types/scheme';
import {
  UI_TRANSLATIONS,
  INDIAN_STATES_AND_UTS,
  OCCUPATIONS_LIST,
  SOCIAL_CATEGORIES,
} from '../data/translations';

interface UserProfileFormProps {
  currentLanguage: IndianLanguageCode;
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFillSample: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  currentLanguage,
  profile,
  onChange,
  onSubmit,
  onFillSample,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto my-6" id="user-profile-section">
      {/* Form Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>Step 3: Citizen Profile</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.profileTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {t.profileSubtitle}
          </p>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          id="fill-sample-profile-btn"
          onClick={onFillSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.fillSampleBtn}</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Age Field */}
          <div>
            <label htmlFor="user-age" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.ageLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="user-age"
                type="number"
                min="0"
                max="120"
                required
                placeholder="e.g. 35"
                value={profile.age ?? ''}
                onChange={(e) => handleChange('age', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
              />
              <div className="absolute right-3 top-2.5 text-xs text-slate-600 font-semibold">
                Years
              </div>
            </div>
          </div>

          {/* State / UT Dropdown */}
          <div>
            <label htmlFor="user-state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.stateLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="user-state"
                required
                value={profile.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50 cursor-pointer"
              >
                <option value="">Select State or UT</option>
                {INDIAN_STATES_AND_UTS.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Annual Family Income */}
          <div>
            <label htmlFor="user-income" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.incomeLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-600 font-semibold text-sm">₹</span>
              <input
                id="user-income"
                type="number"
                min="0"
                step="5000"
                placeholder="e.g. 250000"
                value={profile.annual_income ?? ''}
                onChange={(e) => handleChange('annual_income', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
              />
            </div>
            {/* Quick Income Preset Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: '< ₹1.5 Lakh', val: 120000 },
                { label: '₹2.5 Lakh', val: 250000 },
                { label: '₹5 Lakh', val: 500000 },
                { label: '₹8 Lakh', val: 800000 },
              ].map((pill) => (
                <button
                  type="button"
                  key={pill.val}
                  onClick={() => handleChange('annual_income', pill.val)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occupation Dropdown */}
          <div>
            <label htmlFor="user-occupation" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.occupationLabel}
            </label>
            <div className="relative">
              <select
                id="user-occupation"
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50 cursor-pointer"
              >
                <option value="">Select Occupation</option>
                {OCCUPATIONS_LIST.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Social Category */}
          <div>
            <label htmlFor="user-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.categoryLabel}
            </label>
            <div className="relative">
              <select
                id="user-category"
                value={profile.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50 cursor-pointer"
              >
                <option value="General">General</option>
                {SOCIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="user-gender" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t.genderLabel}
            </label>
            <div className="relative">
              <select
                id="user-gender"
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50 cursor-pointer"
              >
                <option value="Any">Not specific / Open</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>
          </div>
        </div>

        {/* Small Privacy Message */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>{t.privacyNotice}</p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            id="evaluate-eligibility-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
          >
            <span>{t.checkEligibilityBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
