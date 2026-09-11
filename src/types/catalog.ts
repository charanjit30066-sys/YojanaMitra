import {
  SchemeData,
  SchemeBenefit,
  SchemeDocument,
  ApplicationStep,
  ImportantCondition,
  SourcePageReference,
  IndianLanguageCode,
  UserProfile,
  EligibilityAssessment,
  CriterionCheck,
  EligibilityStatus,
  ChatMessage,
  LanguageOption,
} from './scheme';

export type GovernmentLevel = 'central' | 'state';

export interface SchemeRecord {
  id: string;
  scheme_name: string;
  official_name: string;
  description: string;
  short_description: string;
  government_level: GovernmentLevel;
  ministry: string;
  department?: string;
  state: string; // 'All India' or specific state like 'Telangana'
  applicable_states: string[];
  category: string;
  categories: string[];
  target_beneficiaries: string;
  age_min: number | null;
  age_max: number | null;
  income_limit: number | null; // in INR per year
  occupation_requirements: string[];
  category_requirements: string[];
  gender_requirements: string[];
  residency_requirements?: string;
  other_eligibility: string[];
  benefits: SchemeBenefit[];
  benefit_amount: string;
  required_documents: SchemeDocument[];
  application_steps: ApplicationStep[];
  application_url: string | null;
  official_source_url: string;
  last_updated: string;
  source_reference: string;
  keywords: string[];
  status: 'active' | 'demo';
  simple_explanation: string;
  who_is_this_for: string;
  why_am_i_seeing_this?: string;
  schemeData: SchemeData;
}

export interface SchemeMatchResult {
  scheme: SchemeRecord;
  matchScore: number; // 0 to 100
  matchTier: 'HIGH_MATCH' | 'POSSIBLE_MATCH' | 'EXPLORE';
  eligibility: EligibilityAssessment;
  matchReasons: string[];
  unmetReasons: string[];
  missingDetails: string[];
}

export interface CitizenNeed {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
}

export interface SchemeSearchParams {
  query?: string;
  category?: string;
  governmentLevel?: GovernmentLevel | 'all';
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'popular' | 'updated';
}

export interface SchemeSearchResponse {
  schemes: SchemeRecord[];
  total: number;
  page: number;
  totalPages: number;
  categories: { name: string; count: number }[];
  states: string[];
}

export interface DemoPersona {
  id: string;
  name: string;
  roleTitle: string;
  icon: string;
  description: string;
  profile: UserProfile;
  selectedNeeds: string[];
}
