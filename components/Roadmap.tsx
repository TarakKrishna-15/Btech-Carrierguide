import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, RoadmapItem } from '../types.ts';
import { generateRoadmap } from '../services/geminiService.ts';
import { CheckCircle, Circle, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const Roadmap: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await generateRoadmap(profile);
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Designing your custom career roadmap...</p>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Roadmap not generated</h3>
          <p className="text-slate-500 mt-2 text-sm">We couldn't generate your tasks. This usually happens if your API Key is missing or blocked.</p>
        </div>
        <button 
          onClick={fetchRoadmap}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <RefreshCw size={18} />
          Retry Generating
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Career Roadmap</h2>
        <p className="text-slate-500 mt-2">A personalized step-by-step path to becoming a {profile.goal}.</p>
      </header>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

        <div className="space-y-12">
          {['Now', 'Next', 'Later'].map((stage) => {
            const stageItems = items.filter(item => item.stage === stage);
            if (stageItems.length === 0) return null;

            return (
              <div key={stage} className="space-y-6">
                <h3 className={`text-sm font-bold tracking-widest uppercase ml-0 md:ml-20 ${
                  stage === 'Now' ? 'text-blue-600' : stage === 'Next' ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {stage} Tasks
                </h3>
                
                <div className="space-y-6">
                  {stageItems.map((item, idx) => (
                    <div key={idx} className="relative md:pl-20">
                      {/* Circle on timeline */}
                      <div className="absolute left-7 top-6 w-3 h-3 rounded-full bg-white border-2 border-slate-300 -translate-x-1/2 hidden md:block" />
                      
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.resources.map((res, ridx) => (
                                <span key={ridx} className="px-2 py-1 bg-slate-50 text-slate-500 text-xs font-semibold rounded-lg border border-slate-100 flex items-center gap-1">
                                  <CheckCircle size={10} className="text-emerald-500" />
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline self-end md:self-start">
                            Start Now
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;