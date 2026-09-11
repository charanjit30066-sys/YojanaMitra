import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { IndianLanguageCode, SchemeData, UserProfile } from '../types/scheme';
import { UI_TRANSLATIONS } from '../data/translations';
import { DEMO_SCHEMES, DemoSchemeItem } from '../data/demoSchemes';

interface UploadSectionProps {
  currentLanguage: IndianLanguageCode;
  onSchemeLoaded: (scheme: SchemeData, sampleProfile?: UserProfile) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  currentLanguage,
  onSchemeLoaded,
  isLoading,
  setIsLoading,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const loadingMessages = [
    t.loadingStep1 || 'Reading your scheme document...',
    t.loadingStep2 || 'Understanding eligibility requirements...',
    t.loadingStep3 || 'Preparing your personalized summary...',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMessage('Please upload an official PDF document. Other file formats are not supported.');
      return;
    }

    // Validate size (25 MB max)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25 MB limit. Please upload a smaller PDF circular or guideline.');
      return;
    }

    setSelectedFile(file);
    uploadAndAnalyzePdf(file);
  };

  const uploadAndAnalyzePdf = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepIndex(0);

    // Progress timer for user reassurance
    const timer1 = setTimeout(() => setLoadingStepIndex(1), 1800);
    const timer2 = setTimeout(() => setLoadingStepIndex(2), 3800);

    try {
      const formData = new FormData();
      formData.append('scheme_pdf', file);

      const response = await fetch('/api/scheme/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract information from the PDF.');
      }

      onSchemeLoaded(data.scheme);
    } catch (err: unknown) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error('PDF upload error:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Could not process this document. Please try a different scheme PDF or test with a Demo Scheme below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (demo: DemoSchemeItem) => {
    setErrorMessage(null);
    setSelectedFile(null);
    setIsLoading(true);
    setLoadingStepIndex(0);

    const timer = setTimeout(() => {
      onSchemeLoaded(demo.scheme, demo.sampleEligibleProfile);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <section id="upload-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t.uploadTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          {t.uploadSubtitle}
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-blue-500 shadow-xs relative mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-file-input"
        />

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-800 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-800" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.analyzingDocument}
            </h3>

            {/* Dynamic loading progress message */}
            <p className="text-sm font-medium text-blue-900 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/60 inline-flex items-center gap-2 animate-pulse mt-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{loadingMessages[loadingStepIndex]}</span>
            </p>

            <p className="text-xs text-slate-700 mt-4">
              Extracting eligibility criteria, benefit amounts, required documents & official guidelines...
            </p>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`py-6 flex flex-col items-center justify-center transition-colors cursor-pointer rounded-xl ${
              isDragging ? 'bg-blue-50/70 scale-99' : ''
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-4 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <p className="text-base font-bold text-slate-900 mb-1">
              {t.dragDropText}
            </p>
            <p className="text-xs font-semibold text-blue-900 hover:text-blue-950 mb-3 underline underline-offset-4">
              {t.orClick}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.fileLimits}</span>
            </div>

            {selectedFile && (
              <div className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold truncate max-w-xs">{selectedFile.name}</span>
                <span className="text-emerald-600">({formatFileSize(selectedFile.size)})</span>
              </div>
            )}
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Upload Issue</p>
              <p>{errorMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Try Another File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Demo Schemes for 1-click Instant Hackathon Demonstration */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-slate-900">
              {t.quickDemoPrompt}
            </span>
          </div>
          <span className="text-xs text-slate-700">Pre-loaded with official guidelines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_SCHEMES.map((demo) => (
            <div
              key={demo.id}
              onClick={() => handleSelectDemo(demo)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer text-left group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {demo.badge}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium group-hover:text-amber-800 transition-colors">
                    Click to load →
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 mb-1">
                  {demo.scheme.scheme_name}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {demo.scheme.short_description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                <span className="truncate max-w-[180px]">{demo.scheme.ministry_or_department}</span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:translate-x-1 group-hover:text-amber-700 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
