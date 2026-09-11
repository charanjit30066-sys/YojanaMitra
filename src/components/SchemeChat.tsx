import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  ShieldCheck,
  RotateCcw,
  CornerDownLeft,
} from 'lucide-react';
import { IndianLanguageCode, SchemeData } from '../types/scheme';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SchemeChatProps {
  scheme: SchemeData;
  currentLanguage: IndianLanguageCode;
}

export const SchemeChat: React.FC<SchemeChatProps> = ({ scheme, currentLanguage }) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when scheme or language changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: `Namaste! I am YojanaMitra. You can ask me any question about "${scheme.scheme_name}". I will answer based strictly on the uploaded official scheme document.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [scheme.scheme_name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isSending) return;

    const userMessageId = 'user-' + Date.now();
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/scheme/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          scheme,
          languageName: currentLangObj?.name || 'English',
          languageCode: currentLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const assistantMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'assistant',
        text: "I couldn't process this query right now. Please verify if your question is related to the scheme document or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto my-6" id="scheme-qa-chat-section">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.chatTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Grounded AI assistant responding strictly from the uploaded scheme document
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          No Hallucination Grounding
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-500 block mb-2">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {t.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isSending}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 text-slate-700 border border-slate-200 transition-all cursor-pointer disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 min-h-[280px] max-h-[420px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isAi
                    ? 'bg-white border border-slate-200/80 text-slate-800'
                    : 'bg-blue-900 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-end ${
                    isAi ? 'text-slate-400' : 'text-blue-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 font-medium flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
              <span>Checking scheme document guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative flex items-center gap-2">
        <input
          id="scheme-chat-input"
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          placeholder={t.chatPlaceholder}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
        />
        <button
          id="send-chat-btn"
          onClick={() => handleSend()}
          disabled={isSending || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
        <span>YojanaMitra answers are generated exclusively from the uploaded scheme text.</span>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
};
