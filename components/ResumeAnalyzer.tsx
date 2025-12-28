import React, { useState, useRef } from 'react';
import { UserProfile } from '../types.ts';
import { analyzeResume } from '../services/geminiService.ts';
import { Loader2, FileText, Sparkles, CheckCircle2, AlertTriangle, FileSearch, Upload, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Use a stable, standard worker URL for local development
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const ResumeAnalyzer: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF document.');
      return;
    }

    setParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let extractedText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ');
        extractedText += pageText + '\n';
      }

      setContent(extractedText.trim());
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Failed to parse PDF. Please ensure it is a valid, unencrypted document.');
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeResume(content, profile);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please check your API key selection.");
    } finally {
      setLoading(false);
    }
  };

  const clearEditor = () => {
    setContent('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Resume Hub</h2>
        <p className="text-slate-500 mt-2">Get your resume reviewed by our AI agent to match current industry standards and recruiter ATS systems.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col h-[600px] shadow-sm relative overflow-hidden">
          {parsing && (
            <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
              <p className="text-blue-700 font-bold">Reading PDF...</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Resume Editor
            </h3>
            <div className="flex items-center gap-2">
              {content && (
                <button onClick={clearEditor} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100">
                <Upload size={14} /> Upload PDF
              </button>
            </div>
          </div>
          
          <textarea 
            className="flex-1 w-full p-4 rounded-2xl bg-slate-50 border border-transparent outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm resize-none"
            placeholder="Paste your resume content or upload a PDF..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          
          <button 
            onClick={handleAnalyze}
            disabled={loading || !content.trim() || parsing}
            className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            Analyze with AI Agent
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <FileSearch size={32} className="text-slate-400 mb-4" />
              <h4 className="text-slate-800 font-bold">Awaiting Analysis</h4>
              <p className="text-slate-500 text-sm mt-2">Upload or paste your resume to start.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 animate-pulse">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
              <p className="text-slate-500 font-medium">Agent is scanning your keywords...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800">Recruiter Score</h3>
                    <p className="text-xs text-slate-400">Alignment with target role</p>
                  </div>
                  <div className={`text-3xl font-black ${result.score > 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.score}/100
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${result.score > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${result.score}%` }} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {result.suggestions?.map((s: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;