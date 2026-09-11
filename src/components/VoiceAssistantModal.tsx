import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { IndianLanguageCode, UserProfile } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: IndianLanguageCode;
  onApplyIntent: (query: string, profile?: Partial<UserProfile>, needs?: string[]) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyIntent,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Language code map for Web Speech API
  const getSpeechLangCode = (lang: IndianLanguageCode): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'ta': return 'ta-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'mr': return 'mr-IN';
      case 'bn': return 'bn-IN';
      case 'gu': return 'gu-IN';
      case 'pa': return 'pa-IN';
      case 'or': return 'or-IN';
      case 'as': return 'as-IN';
      default: return 'en-IN';
    }
  };

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    }
  }, []);

  const startListening = () => {
    setErrorMsg(null);
    setAiResponse(null);
    setTranscript('');

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition is not supported in this browser. Please type your request below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode(language);
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions or type your question.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech was detected. Please try speaking again.');
        } else {
          setErrorMsg(`Voice input error (${event.error}). You can type your request below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: unknown) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
      setErrorMsg('Could not initialize microphone. Please type your query below.');
    }
  };

  const handleProcessTranscript = async (textToProcess?: string) => {
    const text = textToProcess || transcript;
    if (!text.trim()) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/schemes/voice-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          languageCode: language,
          languageName: t.langName,
        }),
      });

      const data = await res.json();
      if (data.success && data.intent) {
        setAiResponse(data.intent.friendlyResponseInLanguage || 'Understood your request. Finding relevant schemes now...');
        setTimeout(() => {
          onApplyIntent(
            data.intent.searchQuery || text,
            data.intent.extractedProfile,
            data.intent.suggestedNeeds
          );
          onClose();
        }, 1200);
      } else {
        // Fallback
        onApplyIntent(text);
        onClose();
      }
    } catch (err: unknown) {
      console.error('Failed to parse voice intent:', err);
      onApplyIntent(text);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        id="voice-assistant-modal"
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close voice assistant"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Speak to YojanaMitra</h3>
            <p className="text-sm text-slate-600">
              Speak in {t.langName} ({t.nativeName}) or English
            </p>
          </div>
        </div>

        {/* Example prompts */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-700 mb-1">You can say things like:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li>"I am 65 years old and live in Telangana. What schemes can help me?"</li>
            <li>"Farmer support schemes for seeds and fertilizer"</li>
            <li>"Scholarships for college students"</li>
          </ul>
        </div>

        {/* Recording Animation & Button */}
        <div className="my-6 flex flex-col items-center justify-center">
          <button
            id="mic-record-btn"
            type="button"
            onClick={isListening ? () => setIsListening(false) : startListening}
            disabled={isProcessing}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? (
              <MicOff className="h-10 w-10 animate-bounce" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </button>

          <p className="mt-4 font-medium text-sm text-slate-700">
            {isListening ? (
              <span className="flex items-center gap-2 text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                Listening now... Speak clearly
              </span>
            ) : (
              'Tap microphone to speak'
            )}
          </p>
        </div>

        {/* Transcript Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your spoken words will appear here, or you can type directly..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          {aiResponse && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{aiResponse}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="submit-voice-search-btn"
              type="button"
              onClick={() => handleProcessTranscript()}
              disabled={!transcript.trim() || isProcessing}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Understanding...
                </>
              ) : (
                <>
                  Find Schemes
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
