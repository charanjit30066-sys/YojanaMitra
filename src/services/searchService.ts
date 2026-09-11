import { SchemeRecord } from '../types/catalog';
import { schemeRepository } from './schemeRepository';

export interface ParsedSearchIntent {
  rawQuery: string;
  detectedState?: string;
  detectedCategory?: string;
  detectedAge?: number;
  keywords: string[];
}

export class SearchService {
  /**
   * Parse natural language user queries like "pension for old people in telangana"
   * or "farmer schemes" or "student scholarship"
   */
  public parseQuery(query: string): ParsedSearchIntent {
    const lower = query.toLowerCase();
    const intent: ParsedSearchIntent = {
      rawQuery: query,
      keywords: query.split(/\s+/).filter(k => k.length > 2),
    };

    // Detect state
    const states = [
      'telangana', 'andhra pradesh', 'karnataka', 'tamil nadu', 'maharashtra',
      'uttar pradesh', 'bihar', 'gujarat', 'kerala', 'punjab', 'rajasthan', 'delhi'
    ];
    for (const st of states) {
      if (lower.includes(st)) {
        intent.detectedState = st.charAt(0).toUpperCase() + st.slice(1);
        break;
      }
    }

    // Detect category/need
    if (lower.includes('pension') || lower.includes('old age') || lower.includes('senior') || lower.includes('elderly')) {
      intent.detectedCategory = 'Pension';
    } else if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('agriculture') || lower.includes('crop')) {
      intent.detectedCategory = 'Agriculture';
    } else if (lower.includes('scholarship') || lower.includes('student') || lower.includes('college') || lower.includes('school')) {
      intent.detectedCategory = 'Education';
    } else if (lower.includes('house') || lower.includes('housing') || lower.includes('awas') || lower.includes('solar')) {
      intent.detectedCategory = 'Housing';
    } else if (lower.includes('health') || lower.includes('hospital') || lower.includes('medical') || lower.includes('insurance') || lower.includes('ayushman')) {
      intent.detectedCategory = 'Health';
    } else if (lower.includes('women') || lower.includes('girl') || lower.includes('daughter') || lower.includes('maternity')) {
      intent.detectedCategory = 'Women';
    } else if (lower.includes('business') || lower.includes('loan') || lower.includes('mudra') || lower.includes('shop') || lower.includes('artisan')) {
      intent.detectedCategory = 'Entrepreneurship';
    }

    // Detect age
    const ageMatch = lower.match(/\b(1[5-9]|[2-9][0-9])\s*(?:years?|yrs?|saal|old)?\b/);
    if (ageMatch && ageMatch[1]) {
      intent.detectedAge = parseInt(ageMatch[1], 10);
    }

    return intent;
  }

  public search(query: string): SchemeRecord[] {
    const intent = this.parseQuery(query);
    const response = schemeRepository.search({
      query,
      category: intent.detectedCategory,
      state: intent.detectedState,
      limit: 20,
    });
    return response.schemes;
  }
}

export const searchService = new SearchService();
