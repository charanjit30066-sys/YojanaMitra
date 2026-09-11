import { SchemeData, UserProfile } from '../types/scheme';

export interface DemoSchemeItem {
  id: string;
  badge: string;
  scheme: SchemeData;
  sampleEligibleProfile: UserProfile;
  sampleIneligibleProfile: UserProfile;
}

export const DEMO_SCHEMES: DemoSchemeItem[] = [
  {
    id: 'pm-surya-ghar',
    badge: 'Clean Energy & Savings',
    scheme: {
      id: 'pm-surya-ghar',
      scheme_name: 'PM-Surya Ghar: Muft Bijli Yojana',
      ministry_or_department: 'Ministry of New and Renewable Energy, Government of India',
      short_description: 'A national flagship scheme providing financial subsidy up to ₹78,000 to residential households to install rooftop solar systems and receive up to 300 units of free electricity every month.',
      target_beneficiaries: 'Residential electricity consumers living in their own homes across India with suitable roof space and grid connectivity.',
      eligibility_criteria: {
        age_requirements: {
          min_age: 18,
          max_age: 100,
          description: 'Applicant must be an adult citizen (18+ years) and electricity account holder in the household.',
          source_page: 'Page 3, Section 4.1',
        },
        income_requirements: {
          max_annual_income: null, // No strict income limit
          description: 'No restriction on household annual income. Open to all income classes.',
          source_page: 'Page 4, Section 4.3',
        },
        state_requirements: {
          applicable_states: [],
          is_all_india: true,
          description: 'Applicable in all States and Union Territories across India serviced by local electricity distribution companies (DISCOMs).',
          source_page: 'Page 2, Section 2.2',
        },
        occupation_requirements: {
          eligible_occupations: ['All Citizens', 'Employed', 'Self-Employed', 'Farmer', 'Homemaker', 'Retired'],
          description: 'Open to all occupations; applicant or family member must own a residential property with electricity connection.',
          source_page: 'Page 3, Section 4.2',
        },
        category_requirements: {
          eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
          description: 'Universal coverage regardless of social category.',
          source_page: 'Page 3, Section 4.4',
        },
        gender_requirements: {
          eligible_genders: ['Any', 'Female', 'Male', 'Transgender'],
          description: 'Open to all genders without restriction.',
          source_page: 'Page 3, Section 4.5',
        },
        other_requirements: [
          {
            title: 'Roof Ownership & Space',
            description: 'Must have an unshaded rooftop space of at least 100 sq. ft. per kW capacity.',
            source_page: 'Page 5, Section 5.2',
          },
          {
            title: 'Active Electricity Connection',
            description: 'Must possess an active domestic power meter and consumer account number (CA Number) with no unpaid arrears.',
            source_page: 'Page 5, Section 5.3',
          },
        ],
      },
      benefits: [
        {
          title: 'Direct Central Financial Subsidy (DBT)',
          amount_or_details: '₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW or higher capacity systems.',
          type: 'subsidy',
          source_page: 'Page 7, Section 7.1',
        },
        {
          title: 'Free Electricity Savings',
          amount_or_details: 'Up to 300 units of free green power every month, lowering monthly electricity bills to near-zero.',
          type: 'financial',
          source_page: 'Page 2, Section 1.3',
        },
        {
          title: 'Concessional Collateral-Free Bank Loans',
          amount_or_details: 'Low-interest loans at ~7% per annum available from scheduled public banks for systems up to 3 kW.',
          type: 'financial',
          source_page: 'Page 9, Section 9.4',
        },
        {
          title: 'Net Metering Revenue',
          amount_or_details: 'Export surplus generated solar units back to DISCOM grid at tariff credits.',
          type: 'financial',
          source_page: 'Page 8, Section 8.2',
        },
      ],
      required_documents: [
        {
          name: 'Recent Electricity Bill',
          type: 'required',
          description: 'Electricity bill of the residence issued within the last 6 months showing Consumer ID/Account number.',
          source_page: 'Page 11, Checklist Item 1',
        },
        {
          name: 'Aadhaar Card of Electricity Consumer',
          type: 'required',
          description: 'Identity and address proof linked to the mobile number for OTP authentication.',
          source_page: 'Page 11, Checklist Item 2',
        },
        {
          name: 'Bank Passbook / Cancelled Cheque',
          type: 'required',
          description: 'Account details of the consumer for direct bank transfer (DBT) subsidy deposit.',
          source_page: 'Page 11, Checklist Item 3',
        },
        {
          name: 'Proof of House Ownership / Roof Rights',
          type: 'required',
          description: 'Property tax receipt, sale deed, or municipal occupancy certificate.',
          source_page: 'Page 12, Checklist Item 4',
        },
        {
          name: 'NOC from Resident Welfare Association (RWA)',
          type: 'conditional',
          condition: 'Only required if residing in multi-story apartments or shared community buildings.',
          source_page: 'Page 12, Checklist Item 5',
        },
      ],
      application_steps: [
        {
          step_number: 1,
          title: 'Register on National Portal',
          description: 'Visit pmsuryaghar.gov.in, select your State and Electricity Distribution Company (DISCOM), and enter your Consumer Account Number.',
        },
        {
          step_number: 2,
          title: 'Apply for Rooftop Solar',
          description: 'Log in with mobile OTP, upload your latest electricity bill, and submit preliminary feasibility application.',
        },
        {
          step_number: 3,
          title: 'DISCOM Feasibility Approval',
          description: 'Wait for technical feasibility clearance from DISCOM (usually issued digitally within 7-15 days).',
        },
        {
          step_number: 4,
          title: 'Vendor Installation',
          description: 'Select an empaneled solar installer in your district to install Make-in-India (DCR compliant) solar modules and inverter.',
        },
        {
          step_number: 5,
          title: 'Net Metering & Commissioning',
          description: 'DISCOM inspector tests system, installs bi-directional net meter, and issues Commissioning Certificate online.',
        },
        {
          step_number: 6,
          title: 'Direct Subsidy Transfer',
          description: 'Upload bank details and cancelled cheque on the portal. Subsidy of ₹78,000 credited within 30 days.',
        },
      ],
      application_portal: 'https://pmsuryaghar.gov.in',
      important_conditions: [
        {
          title: 'Domestic Content Requirement (DCR)',
          description: 'Solar panels and cells must be manufactured in India to qualify for government central subsidy.',
          type: 'condition',
          source_page: 'Page 14, Section 12.1',
        },
        {
          title: 'Commercial & Industrial Exclusions',
          description: 'Commercial establishments, industrial premises, and government offices are not eligible for residential DBT subsidy.',
          type: 'exclusion',
          source_page: 'Page 4, Section 4.6',
        },
        {
          title: 'Empaneled Vendor Mandate',
          description: 'Work must strictly be executed through vendors registered on the National Solar Portal.',
          type: 'condition',
          source_page: 'Page 15, Section 13.2',
        },
      ],
      exclusions: [
        'Commercial and industrial properties',
        'Unauthorized buildings or structures without municipal plan approvals',
        'Imported non-DCR solar cells',
        'Properties with outstanding unpaid electricity bills',
      ],
      deadlines: 'Scheme active till 2026-27 or target of 1 Crore households achieved.',
      source_document: 'PM-Surya-Ghar-Operational-Guidelines-2024.pdf',
      source_page_references: [
        { topic: 'Subsidy Structure & Slab Rates', page: 'Page 7' },
        { topic: 'Eligibility Requirements', page: 'Page 3-4' },
        { topic: 'Document Checklist', page: 'Page 11-12' },
        { topic: 'Step-by-step Process', page: 'Page 13' },
      ],
    },
    sampleEligibleProfile: {
      age: 38,
      state: 'Maharashtra',
      annual_income: 650000,
      occupation: 'Self-Employed',
      category: 'General',
      gender: 'Male',
    },
    sampleIneligibleProfile: {
      age: 16,
      state: 'Maharashtra',
      annual_income: 1200000,
      occupation: 'Student',
      category: 'General',
      gender: 'Male',
    },
  },
  {
    id: 'pm-kisan',
    badge: 'Farmer Financial Assistance',
    scheme: {
      id: 'pm-kisan',
      scheme_name: 'PM-Kisan Samman Nidhi Yojana',
      ministry_or_department: 'Ministry of Agriculture & Farmers Welfare, Government of India',
      short_description: 'Central sector scheme that delivers income support of ₹6,000 per year directly to all landholding farmer families in three equal instalments of ₹2,000 each.',
      target_beneficiaries: 'Small, marginal, and all cultivable landholding farmer families across all Indian States.',
      eligibility_criteria: {
        age_requirements: {
          min_age: 18,
          max_age: 100,
          description: 'Farmer must be at least 18 years old and named in land records.',
          source_page: 'Page 2, Section 3.1',
        },
        income_requirements: {
          max_annual_income: null,
          description: 'No strict income cap, but institutional landholders, income-tax payers, and government employees are excluded.',
          source_page: 'Page 4, Exclusion Annexure A',
        },
        state_requirements: {
          applicable_states: [],
          is_all_india: true,
          description: 'All 28 States and 8 Union Territories across India.',
          source_page: 'Page 2, Section 2.1',
        },
        occupation_requirements: {
          eligible_occupations: ['Farmer', 'Agricultural Worker', 'Cultivator'],
          description: 'Must own cultivable agricultural land registered in their name.',
          source_page: 'Page 3, Section 3.4',
        },
        category_requirements: {
          eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
          description: 'Available to all landholding farmer categories.',
          source_page: 'Page 3, Section 3.2',
        },
        gender_requirements: {
          eligible_genders: ['Any', 'Female', 'Male', 'Transgender'],
          description: 'All farmer household heads or co-owners are eligible.',
          source_page: 'Page 3, Section 3.3',
        },
        other_requirements: [
          {
            title: 'Cultivable Land Record (Khatiyan / RoR)',
            description: 'Agricultural land must be officially registered in state revenue records in the farmer name.',
            source_page: 'Page 3, Section 3.5',
          },
          {
            title: 'Aadhaar e-KYC & NPCI Bank Seeding',
            description: 'Active Aadhaar authentication and NPCI direct benefit transfer seeding in bank account required.',
            source_page: 'Page 6, Section 6.1',
          },
        ],
      },
      benefits: [
        {
          title: 'Direct Income Support',
          amount_or_details: '₹6,000 per year transferred in 3 equal instalments of ₹2,000 every four months via DBT.',
          type: 'financial',
          source_page: 'Page 2, Section 1.2',
        },
        {
          title: 'Kisan Credit Card (KCC) Linkage',
          amount_or_details: 'Pre-approved crop loan access at concessional 4% interest rate upon timely repayment.',
          type: 'financial',
          source_page: 'Page 8, Section 7.3',
        },
      ],
      required_documents: [
        {
          name: 'Land Ownership Document (Khatauni / RoR)',
          type: 'required',
          description: 'Official revenue document demonstrating cultivable agricultural landholding.',
          source_page: 'Page 7, Section 6.3',
        },
        {
          name: 'Aadhaar Card with Linked Mobile Number',
          type: 'required',
          description: 'Mandatory for OTP-based e-KYC and biometric verification.',
          source_page: 'Page 7, Section 6.1',
        },
        {
          name: 'Aadhaar-Seeded Bank Account Passbook',
          type: 'required',
          description: 'Bank account enabled for Aadhaar Payment Bridge (APB) system.',
          source_page: 'Page 7, Section 6.2',
        },
      ],
      application_steps: [
        {
          step_number: 1,
          title: 'Access Farmers Corner',
          description: 'Visit pmkisan.gov.in and click on "New Farmer Registration".',
        },
        {
          step_number: 2,
          title: 'Aadhaar & Mobile Authentication',
          description: 'Enter 12-digit Aadhaar number, state, and mobile number to receive OTP verification.',
        },
        {
          step_number: 3,
          title: 'Enter Land & Personal Details',
          description: 'Input Survey / Khasra / Khatauni land numbers and upload scanned land title document.',
        },
        {
          step_number: 4,
          title: 'Nodal Officer Verification',
          description: 'Application is verified digitally by the District Agriculture Officer / Revenue Department.',
        },
        {
          step_number: 5,
          title: 'Instalment Credit',
          description: 'Direct credit of ₹2,000 every 4 months directly to farmer bank account.',
        },
      ],
      application_portal: 'https://pmkisan.gov.in',
      important_conditions: [
        {
          title: 'Income Tax Payer Exclusion',
          description: 'Any individual or family member who paid Income Tax in the last assessment year is ineligible.',
          type: 'exclusion',
          source_page: 'Page 4, Exclusion Criteria 2',
        },
        {
          title: 'Constitutional & Government Post Holders',
          description: 'Current or former ministers, MPs, MLAs, municipal mayors, and regular government staff cannot claim.',
          type: 'exclusion',
          source_page: 'Page 4, Exclusion Criteria 1',
        },
        {
          title: 'Mandatory e-KYC Completion',
          description: 'Instalments are paused until biometric or OTP-based e-KYC is updated on the PM-Kisan portal.',
          type: 'condition',
          source_page: 'Page 6, Section 5.4',
        },
      ],
      exclusions: [
        'Institutional landholders',
        'Persons who paid income tax in the previous assessment year',
        'Serving or retired officers and employees of state/central government',
        'All retired pensioners whose monthly pension is ₹10,000 or more',
        'Professionals like doctors, engineers, lawyers, and chartered accountants',
      ],
      deadlines: 'Continuous scheme, open for new registrations round the year.',
      source_document: 'PM-Kisan-Scheme-Operational-Guidelines.pdf',
      source_page_references: [
        { topic: 'Eligibility & Beneficiaries', page: 'Page 2-3' },
        { topic: 'Exclusion Categories', page: 'Page 4' },
        { topic: 'Mandatory e-KYC and DBT', page: 'Page 6' },
      ],
    },
    sampleEligibleProfile: {
      age: 44,
      state: 'Uttar Pradesh',
      annual_income: 180000,
      occupation: 'Farmer',
      category: 'OBC',
      gender: 'Male',
    },
    sampleIneligibleProfile: {
      age: 32,
      state: 'Karnataka',
      annual_income: 1400000,
      occupation: 'IT Software Engineer',
      category: 'General',
      gender: 'Female',
    },
  },
  {
    id: 'pmay-gramin',
    badge: 'Rural Housing Support',
    scheme: {
      id: 'pmay-gramin',
      scheme_name: 'Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)',
      ministry_or_department: 'Ministry of Rural Development, Government of India',
      short_description: 'Social welfare program to provide financial assistance to rural families living in kutcha (dilapidated) houses to construct a pucca house with basic amenities including water, LPG, and toilet.',
      target_beneficiaries: 'Homeless rural families and households living in zero, one, or two-room houses with kutcha wall and kutcha roof as identified by SECC data.',
      eligibility_criteria: {
        age_requirements: {
          min_age: 18,
          max_age: 95,
          description: 'Applicant must be an adult household head.',
          source_page: 'Page 3, Section 3.2',
        },
        income_requirements: {
          max_annual_income: 180000,
          description: 'Household must fall under low-income or BPL/SECC deprivation parameters with annual family income below ₹1,80,000.',
          source_page: 'Page 5, Section 4.1',
        },
        state_requirements: {
          applicable_states: [],
          is_all_india: true,
          description: 'All rural areas across all States and Union Territories of India (excluding Delhi and Chandigarh).',
          source_page: 'Page 2, Section 1.4',
        },
        occupation_requirements: {
          eligible_occupations: ['Daily Wage Worker', 'Agricultural Laborer', 'Artisan', 'Marginal Farmer', 'Unorganized Worker'],
          description: 'Rural unorganized workers, daily wage laborers, or small agricultural families without pucca house.',
          source_page: 'Page 4, Section 3.6',
        },
        category_requirements: {
          eligible_categories: ['SC', 'ST', 'Minority', 'OBC', 'EWS'],
          description: 'Priority given to SC, ST, primitive tribal groups, and vulnerable rural poor.',
          source_page: 'Page 4, Section 3.3',
        },
        gender_requirements: {
          eligible_genders: ['Any', 'Female', 'Male'],
          description: 'Ownership or joint ownership with female member of the household is strongly preferred/mandated.',
          source_page: 'Page 6, Section 5.1',
        },
        other_requirements: [
          {
            title: 'No Existing Pucca House',
            description: 'No member of the family should own a pucca house anywhere in India.',
            source_page: 'Page 5, Exclusion Clause 1',
          },
          {
            title: 'Rural Residence',
            description: 'Dwelling must be located inside an official Gram Panchayat / Rural village boundary.',
            source_page: 'Page 3, Section 2.1',
          },
        ],
      },
      benefits: [
        {
          title: 'Direct Construction Assistance',
          amount_or_details: '₹1,20,000 in plain areas, and ₹1,30,000 in hilly/difficult/North-Eastern states in 3 installments.',
          type: 'financial',
          source_page: 'Page 6, Section 4.2',
        },
        {
          title: 'MGNREGS Unskilled Labor Support',
          amount_or_details: '90 to 95 days of unskilled labor wages (approx. ₹20,000 - ₹25,000 additional benefit).',
          type: 'financial',
          source_page: 'Page 7, Section 4.5',
        },
        {
          title: 'Swachh Bharat Toilet Subsidy',
          amount_or_details: '₹12,000 additional assistance for building toilet under Swachh Bharat Mission Gramin.',
          type: 'subsidy',
          source_page: 'Page 8, Section 4.7',
        },
        {
          title: 'LPG Gas Connection under PM Ujjwala',
          amount_or_details: 'Free LPG stove and cylinder connection integrated at completion of house.',
          type: 'other',
          source_page: 'Page 8, Section 4.8',
        },
      ],
      required_documents: [
        {
          name: 'Aadhaar Card of Family Head & Spouse',
          type: 'required',
          description: 'Mandatory identity verification.',
          source_page: 'Page 9, Section 7.1',
        },
        {
          name: 'Job Card under MGNREGA',
          type: 'required',
          description: 'For linking wage labor component directly to beneficiary bank account.',
          source_page: 'Page 9, Section 7.2',
        },
        {
          name: 'Bank Passbook showing IFSC & Account No',
          type: 'required',
          description: 'For geo-tagged instalment releases based on stage of construction.',
          source_page: 'Page 9, Section 7.3',
        },
        {
          name: 'Gram Sabha Recommendation / Affidavit of No Pucca House',
          type: 'required',
          description: 'Self-declaration stamped by local village Panchayat secretary.',
          source_page: 'Page 10, Section 7.5',
        },
      ],
      application_steps: [
        {
          step_number: 1,
          title: 'Gram Sabha Priority List Verification',
          description: 'Contact Gram Panchayat office or check Awaas+ priority beneficiary list.',
        },
        {
          step_number: 2,
          title: 'Data Capture via AwaasApp',
          description: 'Gram Panchayat official captures geo-tagged photographs of existing kutcha house.',
        },
        {
          step_number: 3,
          title: 'Sanction Order Issuance',
          description: 'District Rural Development Agency (DRDA) issues digital sanction order and releases 1st installment.',
        },
        {
          step_number: 4,
          title: 'Plinth & Lintel Verification',
          description: 'After foundation is laid, photo inspection is done to release 2nd and 3rd installments.',
        },
        {
          step_number: 5,
          title: 'Final House Handover',
          description: 'Completion certificate issued with drinking water, power, and sanitation amenities.',
        },
      ],
      application_portal: 'https://pmayg.nic.in',
      important_conditions: [
        {
          title: 'Geo-tagged Progress Verification',
          description: 'Funds are released exclusively against geo-tagged timestamped mobile photos through AwaasApp at each construction stage.',
          type: 'condition',
          source_page: 'Page 11, Section 8.2',
        },
        {
          title: 'Motorized Vehicle Ownership Exclusion',
          description: 'Households owning motorized 2/3/4 wheelers, fishing boats, or mechanised agricultural equipment are excluded.',
          type: 'exclusion',
          source_page: 'Page 5, Exclusion Clause 3',
        },
      ],
      exclusions: [
        'Families owning a 2, 3, or 4-wheeler or mechanized 3/4-wheeler agricultural equipment',
        'Households with any member as a government employee',
        'Households paying income tax or professional tax',
        'Households owning 2.5 acres or more of irrigated land with at least 1 irrigation equipment',
      ],
      deadlines: 'Extended till December 2028 under revamped rural housing mission.',
      source_document: 'PMAY-G-Framework-For-Implementation.pdf',
      source_page_references: [
        { topic: 'Target Beneficiary Identification', page: 'Page 3-4' },
        { topic: 'Financial Package & Convergence', page: 'Page 6-8' },
        { topic: 'Geo-tagging & Payment Milestones', page: 'Page 11' },
      ],
    },
    sampleEligibleProfile: {
      age: 36,
      state: 'Odisha',
      annual_income: 95000,
      occupation: 'Daily Wage Worker',
      category: 'ST',
      gender: 'Female',
    },
    sampleIneligibleProfile: {
      age: 29,
      state: 'Punjab',
      annual_income: 450000,
      occupation: 'Government Employee',
      category: 'General',
      gender: 'Male',
    },
  },
];
