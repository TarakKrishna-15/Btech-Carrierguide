
import React, { useState, useEffect } from 'react';
import { UserProfile, Course } from '../types.ts';
import { getCourseRecommendations } from '../services/geminiService.ts';
import { ExternalLink, BookOpen, Loader2, Star } from 'lucide-react';

const CourseRecommendations: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourseRecommendations(profile);
        setCourses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-medium">Curating expert-vetted courses for you...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Recommended Courses</h2>
        <p className="text-slate-500 mt-2">Curated list of certifications and tutorials based on your learning style: <span className="text-blue-600 font-semibold">{profile.learningStyle}</span>.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-50">
            <div className="h-40 bg-slate-100 relative overflow-hidden">
               <img src={`https://picsum.photos/seed/${course.title}/400/200`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                 <Star size={12} className="text-amber-500 fill-amber-500" />
                 Best Match
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{course.provider}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  course.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {course.level}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{course.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">{course.reason}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <BookOpen size={16} />
                  <span>Interactive</span>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                  View Course
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;
