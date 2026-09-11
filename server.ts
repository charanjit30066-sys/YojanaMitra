import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { SchemeData, UserProfile } from './src/types/scheme';
import { DEMO_SCHEMES } from './src/data/demoSchemes';
import { schemeRepository } from './src/services/schemeRepository';
import { eligibilityService } from './src/services/eligibilityService';
import { GovernmentLevel } from './src/types/catalog';

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Setup multer in-memory storage for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF documents are supported.'));
    }
  },
});

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check API
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Search & Browse Schemes from Catalog
app.get('/api/schemes', (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const governmentLevel = typeof req.query.govLevel === 'string' ? (req.query.govLevel as GovernmentLevel | 'all') : undefined;
    const state = typeof req.query.state === 'string' ? req.query.state : undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const sortBy = (req.query.sortBy as 'relevance' | 'popular' | 'updated') || 'relevance';

    const results = schemeRepository.search({
      query,
      category,
      governmentLevel,
      state,
      page,
      limit,
      sortBy,
    });

    res.json({
      success: true,
      ...results,
    });
  } catch (err: unknown) {
    console.error('Error fetching schemes:', err);
    res.status(500).json({ success: false, error: 'Failed to search scheme catalog' });
  }
});

// Get Scheme Details by ID
app.get('/api/schemes/:id', (req: Request, res: Response): void => {
  try {
    const scheme = schemeRepository.getById(req.params.id);
    if (!scheme) {
      res.status(404).json({ success: false, error: 'Scheme not found in catalog' });
      return;
    }
    res.json({ success: true, scheme });
  } catch (err: unknown) {
    console.error('Error fetching scheme by id:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch scheme details' });
  }
});

// Deterministic Scheme Matcher & Ranker for Citizen Profile
app.post('/api/schemes/match', (req: Request, res: Response): void => {
  try {
    const { profile, selectedNeeds } = req.body as { profile: UserProfile; selectedNeeds?: string[] };
    if (!profile) {
      res.status(400).json({ success: false, error: 'Citizen profile is required' });
      return;
    }

    const allSchemes = schemeRepository.getAll();
    const matches = eligibilityService.matchSchemes(allSchemes, {
      profile,
      selectedNeeds: selectedNeeds || [],
    });

    res.json({
      success: true,
      totalMatched: matches.length,
      highMatches: matches.filter(m => m.matchTier === 'HIGH_MATCH'),
      possibleMatches: matches.filter(m => m.matchTier === 'POSSIBLE_MATCH'),
      otherSchemes: matches.filter(m => m.matchTier === 'EXPLORE'),
      allMatches: matches,
    });
  } catch (err: unknown) {
    console.error('Error matching schemes:', err);
    res.status(500).json({ success: false, error: 'Failed to compute scheme eligibility' });
  }
});

// Voice Intent / Utterance Parser
app.post('/api/schemes/voice-intent', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, languageCode, languageName } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ success: false, error: 'Voice transcript is required' });
      return;
    }

    const ai = getAI();
    if (!ai) {
      // Rule-based fallback
      res.json({
        success: true,
        intent: {
          searchQuery: transcript,
          suggestedNeeds: [],
          extractedProfile: {},
        },
      });
      return;
    }

    const intentPrompt = `
You are YojanaMitra's conversational voice interpreter for Indian citizens.
The citizen spoke the following statement in ${languageName || 'an Indian language'} (Transcript: "${transcript}").
Extract any user profile attributes and welfare needs mentioned.

Return ONLY a JSON object with this format:
{
  "searchQuery": "Clean keywords for search (e.g. 'pension schemes', 'farmer support')",
  "suggestedNeeds": ["Pension" or "Farming" or "Education" or "Housing" or "Healthcare" or "Women" or "Disability" or "Business"],
  "extractedProfile": {
    "age": number or null,
    "state": "Indian state name like Telangana, Karnataka, etc." or null,
    "income": number or null,
    "occupation": "Farmer" or "Student" or "Senior citizen" or "Self-employed" or "Unemployed" or null,
    "category": "General" or "OBC" or "SC" or "ST" or "EWS" or null,
    "gender": "Female" or "Male" or null
  },
  "friendlyResponseInLanguage": "A one-sentence warm confirmation in the user's spoken language summarizing what was understood."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: intentPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      success: true,
      intent: parsed,
    });
  } catch (err: unknown) {
    console.error('Voice intent parsing error:', err);
    res.json({
      success: true,
      intent: {
        searchQuery: req.body.transcript || '',
        suggestedNeeds: [],
        extractedProfile: {},
      },
    });
  }
});

// List demo schemes API
app.get('/api/scheme/demos', (_req: Request, res: Response) => {
  res.json({
    success: true,
    demos: DEMO_SCHEMES.map(d => ({
      id: d.id,
      badge: d.badge,
      name: d.scheme.scheme_name,
      description: d.scheme.short_description,
      sampleEligibleProfile: d.sampleEligibleProfile,
      sampleIneligibleProfile: d.sampleIneligibleProfile,
      scheme: d.scheme,
    })),
  });
});

// PDF Upload and AI Extraction API
app.post('/api/scheme/upload', upload.single('scheme_pdf'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No PDF file uploaded. Please select a valid PDF.' });
      return;
    }

    const buffer = req.file.buffer;
    const fileName = req.file.originalname || 'uploaded_scheme.pdf';

    // 1. Extract text using PDFParse
    let rawText = '';
    let pageCount = 1;
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      rawText = textResult.text ? textResult.text.trim() : '';
      pageCount = textResult.pages?.length || 1;
      await parser.destroy();
    } catch (parseErr: unknown) {
      console.error('PDF text extraction error:', parseErr);
      res.status(422).json({
        success: false,
        error: 'Unable to extract text from this PDF. Please ensure the document contains readable text and is not an unreadable image scan.',
      });
      return;
    }

    if (!rawText || rawText.length < 50) {
      res.status(422).json({
        success: false,
        error: 'The uploaded PDF contains no readable text. If this is a scanned document, please provide a digitally generated PDF or try a demo scheme.',
      });
      return;
    }

    // Limit text size sent to Gemini to ~60,000 characters to keep it snappy and within budget
    const truncatedText = rawText.slice(0, 60000);

    const ai = getAI();
    if (!ai) {
      // Fallback response with warning if API key is not yet set
      res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment secrets. You can still test all features using our "Try Demo Scheme" mode!',
      });
      return;
    }

    const extractionPrompt = `
You are an expert government welfare analyst for YojanaMitra.
Analyze the following official Indian government scheme document text (${fileName}, ${pageCount} pages).
Extract comprehensive, accurate, structured information.

CRITICAL INSTRUCTIONS:
1. DO NOT hallucinate or invent information.
2. If any field is not stated in the document, return "Not specified in the document." or null.
3. Keep financial amounts, eligibility numbers, and limits exact as per the document.
4. Extract page numbers or section references wherever available (e.g., "Page 3, Section 2").
5. Return ONLY a valid JSON object matching the exact schema below.

JSON Schema to return:
{
  "scheme_name": "Exact official name of the scheme",
  "ministry_or_department": "Name of the implementing Ministry or State Department",
  "short_description": "2-3 sentence simple explanation of what the scheme is and its core objective",
  "target_beneficiaries": "Who this scheme is designed to help",
  "eligibility_criteria": {
    "age_requirements": {
      "min_age": 18 or null,
      "max_age": 60 or null,
      "description": "Clear explanation of age rules",
      "source_page": "Page X"
    },
    "income_requirements": {
      "max_annual_income": 300000 or null (number in INR),
      "description": "Clear explanation of family/individual income ceiling",
      "source_page": "Page X"
    },
    "state_requirements": {
      "applicable_states": ["List of states"] or [],
      "is_all_india": true or false,
      "description": "Geographical coverage explanation",
      "source_page": "Page X"
    },
    "occupation_requirements": {
      "eligible_occupations": ["Farmer", "Worker", "Student", etc.],
      "description": "Occupation or professional criteria",
      "source_page": "Page X"
    },
    "category_requirements": {
      "eligible_categories": ["General", "OBC", "SC", "ST", "EWS"],
      "description": "Social category requirements or open to all",
      "source_page": "Page X"
    },
    "gender_requirements": {
      "eligible_genders": ["Any", "Female", "Male"],
      "description": "Gender restrictions if any",
      "source_page": "Page X"
    },
    "other_requirements": [
      {
        "title": "Requirement title",
        "description": "Description of additional criteria (e.g. landholding, meter, disability)",
        "source_page": "Page X"
      }
    ]
  },
  "benefits": [
    {
      "title": "Benefit name",
      "amount_or_details": "Exact financial amount or direct assistance provided",
      "type": "financial" | "subsidy" | "insurance" | "training" | "other",
      "source_page": "Page X"
    }
  ],
  "required_documents": [
    {
      "name": "Document name (e.g. Aadhaar Card, Income Certificate)",
      "type": "required" | "optional" | "conditional",
      "description": "Why and when it is required",
      "condition": "Condition details if conditional",
      "source_page": "Page X"
    }
  ],
  "application_steps": [
    {
      "step_number": 1,
      "title": "Step title",
      "description": "Clear instruction for the citizen"
    }
  ],
  "application_portal": "Official website URL mentioned in document or null",
  "important_conditions": [
    {
      "title": "Condition or Exclusion title",
      "description": "Detailed explanation",
      "type": "exclusion" | "condition" | "deadline" | "renewal",
      "source_page": "Page X"
    }
  ],
  "exclusions": ["List of explicitly excluded individuals or groups"],
  "deadlines": "Application deadline or validity timeline if mentioned or null",
  "source_document": "${fileName}",
  "source_page_references": [
    { "topic": "Eligibility", "page": "Page X" },
    { "topic": "Benefits", "page": "Page Y" }
  ]
}

Document Text to analyze:
${truncatedText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: extractionPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text ? response.text.trim() : '{}';
    let parsedSchemeData: SchemeData;

    try {
      parsedSchemeData = JSON.parse(outputText);
      parsedSchemeData.source_document = fileName;
    } catch {
      // Clean possible markdown code fences
      const cleaned = outputText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      parsedSchemeData = JSON.parse(cleaned);
      parsedSchemeData.source_document = fileName;
    }

    res.json({
      success: true,
      scheme: parsedSchemeData,
      meta: {
        fileName,
        pageCount,
        characterCount: rawText.length,
      },
    });
  } catch (err: unknown) {
    console.error('Error processing uploaded scheme:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process the scheme document with AI. Please check your document and try again.',
    });
  }
});

// Translation API for dynamic scheme content
app.post('/api/scheme/translate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheme, targetLanguageCode, targetLanguageName } = req.body;

    if (!scheme || !targetLanguageCode || targetLanguageCode === 'en') {
      res.json({ success: true, translatedScheme: scheme });
      return;
    }

    const ai = getAI();
    if (!ai) {
      res.json({ success: true, translatedScheme: scheme, notice: 'API key not configured for live translation' });
      return;
    }

    const translationPrompt = `
You are YojanaMitra's linguistic translation engine.
Translate the following Indian Government Scheme content into ${targetLanguageName || targetLanguageCode}.
Use natural, respectful, and crystal-clear regional language phrasing suitable for everyday Indian citizens.
Preserve exact numbers, currency figures (₹), portal links, and page references unaltered.

Input Scheme JSON:
${JSON.stringify({
  scheme_name: scheme.scheme_name,
  ministry_or_department: scheme.ministry_or_department,
  short_description: scheme.short_description,
  target_beneficiaries: scheme.target_beneficiaries,
  benefits: scheme.benefits,
  required_documents: scheme.required_documents,
  application_steps: scheme.application_steps,
  important_conditions: scheme.important_conditions,
  exclusions: scheme.exclusions,
  deadlines: scheme.deadlines,
})}

Return ONLY a valid JSON object with the exact same structure containing the translated text fields.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: translationPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text ? response.text.trim() : '{}';
    const translatedFields = JSON.parse(outputText);

    // Merge translated fields into original scheme to preserve logic structure
    const mergedScheme: SchemeData = {
      ...scheme,
      scheme_name: translatedFields.scheme_name || scheme.scheme_name,
      ministry_or_department: translatedFields.ministry_or_department || scheme.ministry_or_department,
      short_description: translatedFields.short_description || scheme.short_description,
      target_beneficiaries: translatedFields.target_beneficiaries || scheme.target_beneficiaries,
      benefits: translatedFields.benefits || scheme.benefits,
      required_documents: translatedFields.required_documents || scheme.required_documents,
      application_steps: translatedFields.application_steps || scheme.application_steps,
      important_conditions: translatedFields.important_conditions || scheme.important_conditions,
      exclusions: translatedFields.exclusions || scheme.exclusions,
      deadlines: translatedFields.deadlines || scheme.deadlines,
    };

    res.json({ success: true, translatedScheme: mergedScheme });
  } catch (err: unknown) {
    console.error('Translation error:', err);
    // On translation error, gracefully fall back to original scheme without breaking UI
    res.json({ success: true, translatedScheme: req.body.scheme });
  }
});

// Grounded Scheme Chat API
app.post('/api/scheme/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, scheme, languageName, languageCode } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ success: false, error: 'Question is required' });
      return;
    }

    const ai = getAI();
    if (!ai) {
      res.json({
        success: true,
        answer: "Gemini API key is not connected. In live demo mode, YojanaMitra can answer questions about eligibility, income limits, documents, and benefits directly from the scheme document.",
      });
      return;
    }

    const chatPrompt = `
You are YojanaMitra, a trustworthy and friendly government benefits assistant for Indian citizens.
A citizen is asking a question about the government scheme: "${scheme?.scheme_name || 'Government Scheme'}".

Context from the verified scheme document:
${JSON.stringify(scheme, null, 2)}

Citizen's Question:
"${question}"

RULES:
1. Answer strictly using ONLY the provided scheme document context above.
2. DO NOT invent information or external rules.
3. If the answer cannot be found in the scheme document, explicitly state:
"I couldn't find that information in the uploaded scheme document. Please verify with the official government department or portal."
4. If the citizen asks in a particular language or if the target language is specified as ${languageName || 'English'}, answer fluently in ${languageName || 'English'}.
5. Keep the tone courteous, clear, and reassuring. Mention specific page numbers or sources from the context if available.
6. Always remind that this is informative guidance and not an official government sanction order.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatPrompt,
    });

    const answer = response.text ? response.text.trim() : "I couldn't find that information in the uploaded scheme document.";

    res.json({
      success: true,
      answer,
    });
  } catch (err: unknown) {
    console.error('Chat error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate answer. Please try asking again.',
    });
  }
});

// Vite middleware & production static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YojanaMitra server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
