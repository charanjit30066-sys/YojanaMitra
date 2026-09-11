import { SchemeRecord, SchemeSearchParams, SchemeSearchResponse, GovernmentLevel } from '../types/catalog';
import { VERIFIED_SCHEME_CATALOG } from '../data/schemeCatalog';

/**
 * SchemeRepository provides a clean, decoupled data access layer.
 * This architecture is designed to handle 5,000+ schemes seamlessly,
 * either in-memory or bridged to a backend database or indexed search engine.
 */
export class SchemeRepository {
  private schemes: SchemeRecord[];

  constructor(initialSchemes: SchemeRecord[] = VERIFIED_SCHEME_CATALOG) {
    this.schemes = [...initialSchemes];
  }

  /**
   * Import additional official scheme records dynamically
   * without requiring any changes to frontend or eligibility engine.
   */
  public importSchemes(newRecords: SchemeRecord[]): void {
    const existingIds = new Set(this.schemes.map(s => s.id));
    for (const record of newRecords) {
      if (!existingIds.has(record.id)) {
        this.schemes.push(record);
        existingIds.add(record.id);
      }
    }
  }

  public getById(id: string): SchemeRecord | undefined {
    return this.schemes.find(s => s.id === id);
  }

  public getAll(): SchemeRecord[] {
    return [...this.schemes];
  }

  public search(params: SchemeSearchParams): SchemeSearchResponse {
    let filtered = [...this.schemes];

    // 1. Text / Keyword Search
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(t => t.length > 1);

      filtered = filtered.filter(scheme => {
        const searchableText = [
          scheme.scheme_name,
          scheme.official_name,
          scheme.short_description,
          scheme.description,
          scheme.ministry,
          scheme.category,
          ...scheme.categories,
          ...scheme.keywords,
          scheme.state,
          scheme.simple_explanation,
        ].join(' ').toLowerCase();

        // Exact match or token match
        return searchableText.includes(q) || tokens.some(t => searchableText.includes(t));
      });
    }

    // 2. Government Level Filter (central / state)
    if (params.governmentLevel && params.governmentLevel !== 'all') {
      filtered = filtered.filter(s => s.government_level === params.governmentLevel);
    }

    // 3. Category Filter
    if (params.category && params.category !== 'All Categories') {
      const targetCat = params.category.toLowerCase();
      filtered = filtered.filter(s =>
        s.category.toLowerCase() === targetCat ||
        s.categories.some(c => c.toLowerCase() === targetCat)
      );
    }

    // 4. State Filter
    if (params.state && params.state !== 'All India') {
      filtered = filtered.filter(s =>
        s.applicable_states.includes('All India') ||
        s.applicable_states.includes(params.state!) ||
        s.state === params.state
      );
    }

    // 5. Sorting
    if (params.sortBy === 'updated') {
      filtered.sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));
    } else if (params.sortBy === 'popular') {
      // Prioritize high-impact flagship schemes
      filtered.sort((a, b) => (a.government_level === 'central' ? -1 : 1));
    }

    // 6. Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 12);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Compute category counts
    const categoryCountMap = new Map<string, number>();
    this.schemes.forEach(s => {
      s.categories.forEach(cat => {
        categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
      });
    });

    const categoryList = Array.from(categoryCountMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // Collect all states
    const statesSet = new Set<string>(['All India']);
    this.schemes.forEach(s => {
      s.applicable_states.forEach(st => statesSet.add(st));
    });

    return {
      schemes: paginated,
      total,
      page,
      totalPages,
      categories: categoryList,
      states: Array.from(statesSet),
    };
  }
}

export const schemeRepository = new SchemeRepository();
