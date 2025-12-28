
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import { conductMockInterview } from '../services/geminiService.ts';
import { Mic, Send, Loader2, Award, Info, BrainCircuit } from 'lucide-react';

const InterviewCoach: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = async () => {
    setIsActive(true);
    setLoading(true);
    try {
      const response = await conductMockInterview(profile, [], "Start the interview. Greet me and ask the first technical or HR question for a " + profile.goal + " role.");
      setMessages([{ role: 'ai', content: response }]);
    } catch (e) {
      console.error(e);
      setMessages([{ role: 'ai', content: "Sorry, I'm having trouble connecting to the interview service. Please check your API key configuration." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    
    try {
      const response = await conductMockInterview(profile, messages, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble processing your response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-50">
          <BrainCircuit size={56} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900">AI Mock Interview</h2>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Ready to test your skills? Our AI coach will simulate a real interview scenario and provide detailed feedback on your answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Role Focused</h4>
            <p className="text-xs text-slate-500">Tailored for {profile.goal}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Live Evaluation</h4>
            <p className="text-xs text-slate-500">Detailed feedback per answer</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Confidence Hub</h4>
            <p className="text-xs text-slate-500">Build professional fluency</p>
          </div>
        </div>

        <button 
          onClick={startInterview}
          className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Begin Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Mic size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Interview in Progress</h3>
            <p className="text-xs text-emerald-600 font-bold animate-pulse">● Live AI Evaluation</p>
          </div>
        </div>
        <button 
          onClick={() => setIsActive(false)}
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
        >
          End Session
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-y-auto p-6 space-y-6 shadow-inner"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'ai' 
              ? 'bg-slate-100 text-slate-800 rounded-tl-none' 
              : 'bg-blue-600 text-white rounded-tr-none shadow-lg'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
              <Loader2 size={16} className="animate-spin text-blue-600" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-lg flex gap-3">
        <button className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
          <Mic size={20} />
        </button>
        <input 
          type="text"
          className="flex-1 bg-transparent outline-none text-slate-800 font-medium px-2"
          placeholder="Speak or type your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default InterviewCoach;
