import React, { useState, useEffect } from 'react';
import { UserProfile, View } from './types.ts';
import Survey from './components/Survey.tsx';
import Dashboard from './components/Dashboard.tsx';
import Roadmap from './components/Roadmap.tsx';
import CourseRecommendations from './components/CourseRecommendations.tsx';
import EventVerification from './components/EventVerification.tsx';
import ResumeAnalyzer from './components/ResumeAnalyzer.tsx';
import InterviewCoach from './components/InterviewCoach.tsx';
import MentorChat from './components/MentorChat.tsx';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Mic2, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<View>('survey');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(false);

  // ...existing code...

  useEffect(() => {
    const savedProfile = localStorage.getItem('btech_guide_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setCurrentView('dashboard');
    }

    const checkKey = async () => {
      // Check for API key in environment
      setHasKey(!!import.meta.env.VITE_API_KEY);
    };
    checkKey();
  }, []);

// ...existing code...

  const handleOpenKey = async () => {
    console.log("API Key is configured in environment variables");
    // Since we're using environment variables, just check if key exists
    setHasKey(!!import.meta.env.VITE_API_KEY);
  };

  const handleSurveyComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('btech_guide_profile', JSON.stringify(newProfile));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('btech_guide_profile');
    setProfile(null);
    setCurrentView('survey');
  };

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: View }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {currentView === view && <ChevronRight size={14} className="opacity-50" />}
    </button>
  );

  if (!profile && currentView === 'survey') {
    return <Survey onComplete={handleSurveyComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-slate-900">BTech Guide</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-inner">
              <Zap size={22} fill="white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">BTech Guide</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">Career Mentor</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
            <NavItem icon={Map} label="Career Roadmap" view="roadmap" />
            <NavItem icon={BookOpen} label="Courses" view="courses" />
            <NavItem icon={ShieldCheck} label="Event Verifier" view="events" />
            <div className="h-px bg-slate-100 my-4 mx-2" />
            <NavItem icon={FileText} label="Resume Hub" view="resume" />
            <NavItem icon={Mic2} label="Interview Coach" view="interview" />
            <NavItem icon={MessageSquare} label="AI Mentor" view="chat" />
          </nav>

          <div className="mt-auto pt-6 space-y-4">
            {!hasKey && (
              <button
                onClick={handleOpenKey}
                className="w-full p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:bg-amber-100 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                  <Zap size={14} className="fill-amber-600" />
                  API KEY REQUIRED
                </div>
                <p className="text-[10px] text-amber-600 text-left font-medium leading-relaxed">
                  Unlock Gemini Pro features by connecting your key. Click to select.
                </p>
              </button>
            )}

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} alt="Profile" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{profile?.name}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{profile?.branch}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all lg:ml-72 pt-20 lg:pt-0`}>
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-14">
          {currentView === 'dashboard' && profile && <Dashboard profile={profile} />}
          {currentView === 'roadmap' && profile && <Roadmap profile={profile} />}
          {currentView === 'courses' && profile && <CourseRecommendations profile={profile} />}
          {currentView === 'events' && <EventVerification />}
          {currentView === 'resume' && profile && <ResumeAnalyzer profile={profile} />}
          {currentView === 'interview' && profile && <InterviewCoach profile={profile} />}
          {currentView === 'chat' && profile && <MentorChat profile={profile} />}
        </div>
      </main>
    </div>
  );
};

export default App;