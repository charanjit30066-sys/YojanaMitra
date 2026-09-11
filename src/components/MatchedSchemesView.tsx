import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  User,
  MapPin,
  Briefcase,
  IndianRupee,
  Building2,
} from 'lucide-react';
import { SchemeMatchResult, SchemeRecord } from '../types/catalog';
import { UserProfile, IndianLanguageCode } from '../types/scheme';
import { SchemeCard } from './SchemeCard';

interface MatchedSchemesViewProps {
  userProfile: UserProfile;
  selectedNeeds: string[];
  matchResults: SchemeMatchResult[];
  language: IndianLanguageCode;
  onEditProfile: () => void;
  onSelectScheme: (scheme: SchemeRecord) => void;
}

export const MatchedSchemesView: React.FC<MatchedSchemesViewProps> = ({
  userProfile,
  selectedNeeds,
  matchResults,
  language,
  onEditProfile,
  onSelectScheme,
}) => {
  const [tierFilter, setTierFilter] = useState<'ALL' | 'HIGH' | 'POSSIBLE'>('ALL');

  const highMatches = matchResults.filter(m => m.matchTier === 'HIGH_MATCH');
  const possibleMatches = matchResults.filter(m => m.matchTier === 'POSSIBLE_MATCH');
  const exploreMatches = matchResults.filter(m => m.matchTier === 'EXPLORE');

  const filteredResults = matchResults.filter(m => {
    if (tierFilter === 'HIGH') return m.matchTier === 'HIGH_MATCH';
    if (tierFilter === 'POSSIBLE') return m.matchTier === 'POSSIBLE_MATCH';
    return true;
  });

  return (
    <div id="matched-schemes-view" className="space-y-8">
      {/* Header Banner & Citizen Profile Summary Card */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Preliminary Eligibility Results
            </div>
            <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
              Schemes Matched for You
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Found <strong className="text-slate-900">{highMatches.length} High Matches</strong> and{' '}
              <strong className="text-slate-900">{possibleMatches.length} Possible Matches</strong> based on your answers.
            </p>
          </div>

          <button
            id="edit-profile-btn"
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Edit Profile & Needs</span>
          </button>
        </div>

        {/* Profile Attributes Chips */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-amber-200/60">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 border border-amber-200/70 shadow-2xs">
            <User className="h-3.5 w-3.5 text-amber-600" />
            Age: {userProfile.age ?? 'Not specified'} yrs
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 border border-amber-200/70 shadow-2xs">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            State: {userProfile.state}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 border border-amber-200/70 shadow-2xs">
            <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
            Income: ₹{userProfile.annual_income ? userProfile.annual_income.toLocaleString('en-IN') : 'N/A'} / yr
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 border border-amber-200/70 shadow-2xs">
            <Briefcase className="h-3.5 w-3.5 text-amber-600" />
            {userProfile.occupation || 'Any Occupation'}
          </span>

          {userProfile.category && (
            <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 border border-amber-200/70 shadow-2xs">
              Category: {userProfile.category}
            </span>
          )}

          {selectedNeeds.map((need, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
            >
              Need: {need}
            </span>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTierFilter('ALL')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              tierFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Matched ({matchResults.length})
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('HIGH')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              tierFilter === 'HIGH'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟢 High Matches ({highMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('POSSIBLE')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              tierFilter === 'POSSIBLE'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟡 Possible Matches ({possibleMatches.length})
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Click "Why am I seeing this?" on any card for exact criteria transparency.
        </p>
      </div>

      {/* High Matches Section */}
      {(tierFilter === 'ALL' || tierFilter === 'HIGH') && highMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-900">
              High Match Schemes ({highMatches.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highMatches.map(match => (
              <SchemeCard
                key={match.scheme.id}
                matchResult={match}
                language={language}
                onSelect={onSelectScheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Possible Matches Section */}
      {(tierFilter === 'ALL' || tierFilter === 'POSSIBLE') && possibleMatches.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-amber-500" />
            <h3 className="text-lg font-extrabold text-slate-900">
              Possible Match Schemes ({possibleMatches.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {possibleMatches.map(match => (
              <SchemeCard
                key={match.scheme.id}
                matchResult={match}
                language={language}
                onSelect={onSelectScheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Explore Other Schemes Section */}
      {tierFilter === 'ALL' && exploreMatches.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-slate-400" />
            <h3 className="text-base font-bold text-slate-700">
              Other Central & State Schemes ({exploreMatches.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreMatches.map(match => (
              <SchemeCard
                key={match.scheme.id}
                matchResult={match}
                language={language}
                onSelect={onSelectScheme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
