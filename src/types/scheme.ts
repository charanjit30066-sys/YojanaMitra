export type IndianLanguageCode =
  | 'en' // English
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as'; // Assamese

export interface LanguageOption {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  script: string;
}

export interface EligibilityRequirement<T = unknown> {
  description: string;
  source_page?: string;
  value?: T;
}

export interface AgeRequirement {
  min_age?: number | null;
  max_age?: number | null;
  description: string;
  source_page?: string;
}

export interface IncomeRequirement {
  max_annual_income?: number | null; // in INR
  description: string;
  source_page?: string;
}

export interface StateRequirement {
  applicable_states: string[];
  is_all_india: boolean;
  description: string;
  source_page?: string;
}

export interface OccupationRequirement {
  eligible_occupations: string[];
  description: string;
  source_page?: string;
}

export interface CategoryRequirement {
  eligible_categories: string[];
  description: string;
  source_page?: string;
}

export interface GenderRequirement {
  eligible_genders: string[];
  description: string;
  source_page?: string;
}

export interface OtherRequirement {
  title: string;
  description: string;
  source_page?: string;
}

export interface SchemeEligibilityCriteria {
  age_requirements: AgeRequirement;
  income_requirements: IncomeRequirement;
  state_requirements: StateRequirement;
  occupation_requirements: OccupationRequirement;
  category_requirements: CategoryRequirement;
  gender_requirements?: GenderRequirement;
  other_requirements: OtherRequirement[];
}

export interface SchemeBenefit {
  title: string;
  amount_or_details: string;
  type: string; // 'financial' | 'subsidy' | 'insurance' | 'training' | 'other'
  source_page?: string;
}

export interface SchemeDocument {
  name: string;
  type: 'required' | 'optional' | 'conditional';
  description?: string;
  condition?: string;
  source_page?: string;
}

export interface ApplicationStep {
  step_number: number;
  title: string;
  description: string;
}

export interface ImportantCondition {
  title: string;
  description: string;
  type: 'exclusion' | 'condition' | 'deadline' | 'renewal' | 'other';
  source_page?: string;
}

export interface SourcePageReference {
  topic: string;
  page: string;
}

export interface SchemeData {
  id?: string;
  scheme_name: string;
  ministry_or_department?: string;
  short_description: string;
  target_beneficiaries: string;
  eligibility_criteria: SchemeEligibilityCriteria;
  benefits: SchemeBenefit[];
  required_documents: SchemeDocument[];
  application_steps: ApplicationStep[];
  application_portal: string | null;
  important_conditions: ImportantCondition[];
  exclusions: string[];
  deadlines: string | null;
  source_document: string;
  source_page_references: SourcePageReference[];
}

export interface UserProfile {
  age?: number | '';
  state: string;
  annual_income?: number | '';
  occupation: string;
  category: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Any'
  gender: string; // 'Any' | 'Female' | 'Male' | 'Transgender'
}

export type EligibilityStatus = 'LIKELY_ELIGIBLE' | 'LIKELY_NOT_ELIGIBLE' | 'MORE_INFO_NEEDED';

export interface CriterionCheck {
  criterion: 'age' | 'income' | 'state' | 'occupation' | 'category' | 'gender' | 'other';
  label: string;
  status: 'met' | 'not_met' | 'needs_verification' | 'not_applicable';
  message: string;
  source_page?: string;
}

export interface EligibilityAssessment {
  status: EligibilityStatus;
  headline: string;
  summary: string;
  criteria_checks: CriterionCheck[];
  missing_info: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source_reference?: string;
}
