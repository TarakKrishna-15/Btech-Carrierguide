
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import { getMentorAdvice } from '../services/geminiService.ts';
import { Send, Sparkles, MessageSquare, Loader2, Bot } from 'lucide-react';

const MentorChat: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [messages, setMessages] = useState<{role: 'mentor' | 'user', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'mentor',
        content: `Hi ${profile.name}! I'm GuideBot. Whether it's about placements, choosing between Core vs Tech, or just "what to do next" in your ${profile.year}, I'm here to help. What's on your mind?`
      }]);
    }
  }, [profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getMentorAdvice(profile, userMsg);
      setMessages(prev => [...prev, { role: 'mentor', content: response || "I'm sorry, I'm having a bit of trouble connecting right now." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'mentor', content: "Something went wrong. Let me try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-4">
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <Bot size={28} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 leading-none">GuideBot</h3>
          <p className="text-xs text-slate-500 mt-1">AI Career Mentor • Active Now</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 px-2"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'mentor' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
              m.role === 'mentor' 
              ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
              : 'bg-slate-900 text-white rounded-tr-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-lg flex gap-3 items-center">
        <input 
          type="text"
          className="flex-1 bg-transparent outline-none text-slate-800 font-medium px-4 h-12"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
      
      <div className="flex justify-center gap-2">
        <button 
          onClick={() => setInput("What skills should I learn this month?")}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full hover:bg-slate-100"
        >
          Skills?
        </button>
        <button 
          onClick={() => setInput("Am I job ready?")}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full hover:bg-slate-100"
        >
          Job Ready?
        </button>
        <button 
          onClick={() => setInput("Tell me about internship opportunities.")}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full hover:bg-slate-100"
        >
          Internships?
        </button>
      </div>
    </div>
  );
};

export default MentorChat;
