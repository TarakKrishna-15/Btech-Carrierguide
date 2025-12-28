import React, { useState } from 'react';
import { UserProfile, AcademicYear, Branch, CareerGoal } from '../types.ts';
import { ChevronRight, ChevronLeft, CheckCircle2, Globe, Linkedin, Code2, Terminal, User, GraduationCap, Briefcase } from 'lucide-react';

interface SurveyProps {
  onComplete: (profile: UserProfile) => void;
}

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    skills: [],
    skillLevel: 'Beginner',
    learningStyle: 'Videos',
    hasInternship: false,
    linkedin: '',
    leetcode: '',
    codeforces: '',
    hackerrank: ''
  });

  const TOTAL_STEPS = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const toggleSkill = (skill: string) => {
    const current = formData.skills || [];
    if (current.includes(skill)) {
      setFormData({ ...formData, skills: current.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...current, skill] });
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!(formData.name && formData.year && formData.branch);
    if (step === 2) return !!formData.goal;
    return true;
  };

  const handleFinish = () => {
    // Ensure critical fields are present
    if (formData.name && formData.year && formData.branch && formData.goal) {
      setIsLaunching(true);
      // Small delay for visual feedback then complete
      setTimeout(() => {
        onComplete(formData as UserProfile);
      }, 600);
    } else {
      alert("Missing required fields. Returning to Step 1 to verify your details.");
      setStep(1);
    }
  };

  const commonSkills = ['Python', 'Java', 'C++', 'React', 'Data Structures', 'Machine Learning', 'SQL', 'Git', 'Cloud Computing', 'AutoCAD'];

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 flex">
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <div 
              key={i}
              className={`flex-1 transition-all duration-700 ${i + 1 <= step ? 'bg-indigo-600' : 'bg-transparent'}`}
            />
          ))}
        </div>

        <div className="p-10 md:p-14">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                  <User size={28} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Academic Profile</h1>
                <p className="text-slate-500 font-medium">Let's personalize your career experience.</p>
              </header>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-lg focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                    placeholder="e.g. Rahul Sharma"
                    autoFocus
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Year of Study</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer appearance-none"
                      value={formData.year || ''}
                      onChange={e => setFormData({ ...formData, year: e.target.value as AcademicYear })}
                    >
                      <option value="" disabled>Select Year</option>
                      {Object.values(AcademicYear).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Branch</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer appearance-none"
                      value={formData.branch || ''}
                      onChange={e => setFormData({ ...formData, branch: e.target.value as Branch })}
                    >
                      <option value="" disabled>Select Branch</option>
                      {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                  <Briefcase size={28} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Career Goals</h1>
                <p className="text-slate-500 font-medium">Where do you want to be in 2 years?</p>
              </header>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(CareerGoal).map(goal => (
                    <button
                      key={goal}
                      onClick={() => setFormData({ ...formData, goal })}
                      className={`px-5 py-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                        formData.goal === goal 
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                        : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Technical Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          formData.skills?.includes(skill)
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                  <Globe size={28} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Online Presence</h1>
                <p className="text-slate-500 font-medium">Share your professional profile links.</p>
              </header>

              <div className="space-y-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600">
                    <Linkedin size={20} />
                  </div>
                  <input 
                    type="url"
                    placeholder="LinkedIn Profile"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                    value={formData.linkedin}
                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600">
                    <Code2 size={20} />
                  </div>
                  <input 
                    type="url"
                    placeholder="LeetCode Profile"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 outline-none transition-all placeholder:text-slate-300"
                    value={formData.leetcode}
                    onChange={e => setFormData({ ...formData, leetcode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                  <GraduationCap size={28} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Final Details</h1>
                <p className="text-slate-500 font-medium">Tuning GuideBot to your experience.</p>
              </header>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Skill Proficiency</label>
                  <div className="flex gap-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                      <button
                        key={l}
                        onClick={() => setFormData({ ...formData, skillLevel: l as any })}
                        className={`flex-1 py-4 rounded-2xl border font-bold text-sm transition-all ${
                          formData.skillLevel === l 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setFormData({ ...formData, hasInternship: !formData.hasInternship })}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                    formData.hasInternship ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.hasInternship ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200'}`}>
                    {formData.hasInternship && <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-sm font-bold">I have prior internship experience</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-14 flex justify-between items-center pt-8 border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors px-4 py-2"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button 
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={isLaunching}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all disabled:opacity-70"
              >
                {isLaunching ? (
                  <span className="flex items-center gap-2">
                    Launching... <CheckCircle2 size={18} className="animate-pulse" />
                  </span>
                ) : (
                  <>Launch Mentor <CheckCircle2 size={18} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;