
export enum AcademicYear {
  FIRST = '1st Year',
  SECOND = '2nd Year',
  THIRD = '3rd Year',
  FOURTH = 'Final Year'
}

export enum Branch {
  CSE = 'Computer Science & Engineering',
  IT = 'Information Technology',
  AIML = 'AI & Machine Learning',
  ECE = 'Electronics & Communication',
  EEE = 'Electrical & Electronics',
  MECH = 'Mechanical Engineering',
  CIVIL = 'Civil Engineering'
}

export enum CareerGoal {
  SWE = 'Software Engineer',
  DS = 'Data Scientist',
  AI = 'AI / ML Engineer',
  CORE = 'Core Engineering',
  GOVT = 'Govt Jobs',
  HIGHER = 'Higher Studies',
  NOT_SURE = 'Not Sure'
}

export interface UserProfile {
  name: string;
  year: AcademicYear;
  branch: Branch;
  goal: CareerGoal;
  skills: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  learningStyle: 'Videos' | 'Projects' | 'Practice';
  hasInternship: boolean;
  linkedin?: string;
  leetcode?: string;
  codeforces?: string;
  hackerrank?: string;
}

export interface RoadmapItem {
  stage: 'Now' | 'Next' | 'Later';
  title: string;
  description: string;
  resources: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  reason: string;
  level: string;
  url: string;
}

export interface EventAnalysis {
  isVerified: boolean;
  score: number;
  verdict: string;
  redFlags: string[];
}

export type View = 'dashboard' | 'roadmap' | 'courses' | 'events' | 'resume' | 'interview' | 'chat' | 'survey';
