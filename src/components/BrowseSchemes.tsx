import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SchemeRecord } from '../types/catalog';
import { SCHEME_CATEGORIES, ALL_INDIAN_STATES } from '../data/categories';
import { schemeRepository } from '../services/schemeRepository';
import { IndianLanguageCode } from '../types/scheme';

interface BrowseSchemesProps {
  language: IndianLanguageCode;
  onSelectScheme: (scheme: SchemeRecord) => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export const BrowseSchemes: React.FC<BrowseSchemesProps> = ({
  language,
  onSelectScheme,
  initialCategory,
  initialSearchQuery = '',
}) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All Categories');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedGovLevel, setSelectedGovLevel] = useState<'all' | 'central' | 'state'>('all');
  const [schemes, setSchemes] = useState<SchemeRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const result = schemeRepository.search({
      query,
      category: selectedCategory,
      state: selectedState,
      governmentLevel: selectedGovLevel,
      limit: 50,
    });
    setSchemes(result.schemes);
    setTotalCount(result.total);
  }, [query, selectedCategory, selectedState, selectedGovLevel]);

  return (
    <div id="browse-schemes-section" className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Catalog Directory
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Government Schemes
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Browse verified welfare programs from Central & State governments across India.
          </p>
        </div>

        {/* Search inside catalog */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            id="browse-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, keyword, benefit..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
        {/* Government Level Toggle & State Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          {/* Central vs State tabs */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setSelectedGovLevel('all')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                selectedGovLevel === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Schemes ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedGovLevel('central')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                selectedGovLevel === 'central'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇳 Central Government
            </button>
            <button
              type="button"
              onClick={() => setSelectedGovLevel('state')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                selectedGovLevel === 'state'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏛️ State Governments
            </button>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-amber-500 focus:outline-hidden"
            >
              {ALL_INDIAN_STATES.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Scroll */}
        <div className="flex flex-wrap gap-2">
          {SCHEME_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {schemes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-base font-bold text-slate-700">No schemes found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search keywords, category filters, or state selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('All Categories');
              setSelectedState('All India');
              setSelectedGovLevel('all');
            }}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map(scheme => (
            <div
              key={scheme.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {scheme.government_level === 'central' ? 'Central Scheme' : scheme.state}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {scheme.category}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900 hover:text-amber-700 transition-colors">
                  {scheme.scheme_name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {scheme.short_description}
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs border border-slate-100">
                  <p className="font-semibold text-slate-700">Who is this for?</p>
                  <p className="text-slate-600 mt-0.5">{scheme.who_is_this_for}</p>
                </div>

                <div className="mt-3 text-xs font-extrabold text-emerald-700">
                  Benefit: {scheme.benefit_amount}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Updated: {scheme.last_updated}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectScheme(scheme)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                >
                  View Scheme
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
