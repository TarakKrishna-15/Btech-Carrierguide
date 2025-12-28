import React, { useState } from 'react';
import { analyzeEvent } from '../services/geminiService.ts';
import { EventAnalysis } from '../types.ts';
import { ShieldAlert, ShieldCheck, Search, Loader2, AlertCircle } from 'lucide-react';

const EventVerification: React.FC = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<EventAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeEvent(input);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Event Verifier</h2>
        <p className="text-slate-500 mt-2">Protect yourself from fake or low-quality events. Our AI analyzes credibility, registration links, and organizers.</p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Paste Event Details / URL</label>
          <textarea 
            className="w-full h-40 p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Paste description or link of a hackathon, workshop, or recruitment drive..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            onClick={handleVerify}
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Analyze Credibility
          </button>
        </div>
      </div>

      {analysis && (
        <div className={`p-8 rounded-3xl border animate-in slide-in-from-bottom duration-500 ${
          analysis.isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${
              analysis.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
            }`}>
              {analysis.isVerified ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-2xl font-bold ${analysis.isVerified ? 'text-emerald-900' : 'text-red-900'}`}>
                  Trust Score: {analysis.score}%
                </h3>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${
                  analysis.isVerified ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {analysis.isVerified ? 'Verified' : 'Unsafe'}
                </span>
              </div>
              
              <p className="text-slate-700 leading-relaxed font-medium">
                {analysis.verdict}
              </p>

              {analysis.redFlags.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    Key Observations
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.redFlags.map((flag, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-center gap-2 bg-white/50 p-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventVerification;