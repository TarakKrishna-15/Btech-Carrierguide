import React from 'react';
import { UserProfile } from '../types.ts';
import { 
  Trophy, 
  Target, 
  Flame, 
  Star,
  Calendar,
  Timer,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', progress: 30 },
  { name: 'Tue', progress: 42 },
  { name: 'Wed', progress: 38 },
  { name: 'Thu', progress: 55 },
  { name: 'Fri', progress: 78 },
  { name: 'Sat', progress: 85 },
  { name: 'Sun', progress: 92 },
];

const Dashboard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const getFutureDate = (daysAhead: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Hero */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest">Student Portal</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <Flame size={12} fill="currentColor" />
              7 Day Streak
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back, {profile.name}!</h2>
          <p className="text-slate-500 mt-1 font-medium italic">"Your future as a {profile.goal} starts with what you do today."</p>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {[1,2,3].map(i => (
            <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white" src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" />
          ))}
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 ring-4 ring-white text-[10px] font-bold text-slate-500">+12k</div>
        </div>
      </header>

      {/* Career Readiness Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Chart Card */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Career Trajectory</h3>
                <p className="text-xs text-slate-400 font-medium">Growth in technical competency vs. market expectations</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  Actual
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  Projected
                </div>
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorProgress)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={BrainCircuit} 
              label="Skills Verified" 
              value={profile.skills.length} 
              color="bg-indigo-50 text-indigo-600"
              trend="+2 this month"
            />
            <StatCard 
              icon={Target} 
              label="Goal Alignment" 
              value="82%" 
              color="bg-amber-50 text-amber-600"
              trend="Very High"
            />
            <StatCard 
              icon={Award} 
              label="Certifications" 
              value="3" 
              color="bg-emerald-50 text-emerald-600"
              trend="1 Pending"
            />
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          {/* Readiness Score Card */}
          <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/40 transition-all duration-500" />
            <h3 className="text-lg font-bold mb-6">Readiness Score</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.68)} className="text-indigo-400" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">68</div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Status</p>
                <h4 className="text-xl font-bold">Good Progress</h4>
              </div>
            </div>
            <button className="w-full py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              Optimize Profile <ChevronRight size={16} />
            </button>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600" />
                Deadlines
              </h3>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <div className="space-y-6">
              <DeadlineItem 
                title="Google STEP Internship" 
                deadline={getFutureDate(4)} 
                type="Internship"
              />
              <DeadlineItem 
                title="Flipkart GRiD 6.0" 
                deadline={getFutureDate(12)} 
                type="Hackathon"
              />
              <DeadlineItem 
                title="TCS NQT Registration" 
                deadline={getFutureDate(18)} 
                type="Placement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 group hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/20 transition-all duration-300">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">{label}</p>
    <div className="flex items-baseline justify-between mt-1">
      <h4 className="text-2xl font-black text-slate-900">{value}</h4>
      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{trend}</span>
    </div>
  </div>
);

const DeadlineItem = ({ title, deadline, type }: any) => (
  <div className="group cursor-pointer">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-extrabold uppercase tracking-tighter text-indigo-500">{type}</span>
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
        <Timer size={10} />
        {deadline}
      </div>
    </div>
    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{title}</h4>
    <div className="w-full h-1 bg-slate-50 rounded-full mt-2 overflow-hidden">
      <div className="h-full w-1/3 bg-slate-200 group-hover:bg-indigo-400 transition-all" />
    </div>
  </div>
);

export default Dashboard;