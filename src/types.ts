export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type QuestionType = 'Technical' | 'Conceptual' | 'Scenario' | 'Behavioral';

export interface UserSkill {
  name: string;
  level: SkillLevel;
  category: string;
  evidence?: string;
  isExplicit: boolean; // Explicitly in resume vs inferred
  score: number; // 0 - 100
}

export interface SkillGap {
  name: string;
  priority: PriorityLevel;
  currentLevel: SkillLevel | 'None';
  requiredLevel: SkillLevel;
  category: string;
  reason: string;
  currentScore: number; // 0 - 100
  requiredScore: number; // 0 - 100
}

export interface RoadmapResource {
  title: string;
  type: 'Documentation' | 'Course' | 'Tutorial' | 'Book' | 'Interactive' | 'Article';
  provider: string;
  url?: string;
  isFree?: boolean;
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  skill: string;
  topic: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string; // e.g. "2 weeks"
  practiceTask: string;
  projectIdea: string;
  resources: RoadmapResource[];
  status: TaskStatus;
  completedAt?: string;
}

export interface SkillAnalysisResult {
  targetCareer: string;
  readinessScore: number; // 0 - 100
  summary: string;
  currentSkills: UserSkill[];
  requiredSkills: string[];
  skillGaps: SkillGap[];
  recommendations: string[];
  analyzedAt: string;
}

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  question: string;
  context?: string;
  targetSkill: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';
  sampleAnswerGuidelines?: string;
  category?: string;
  skill?: string;
}

export interface InterviewEvaluation {
  questionId: string;
  studentAnswer: string;
  score: number; // 0 - 100
  strengths: string[];
  areasForImprovement: string[];
  explanation: string;
  keyPointsCovered: string[];
  suggestedAnswer: string;
  evaluatedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  avatarUrl?: string;
  targetCareer: string;
  isCustomCareer?: boolean;
  resumeFileName?: string;
  resumeFileSize?: string;
  resumeUploadedAt?: string;
  resumeRawText?: string;
  readinessScore: number;
  analysis?: SkillAnalysisResult;
  roadmap?: RoadmapStep[];
  interviewHistory?: InterviewEvaluation[];
  isDemo?: boolean;
}

export interface CareerOption {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  popularSkills: string[];
  averageReadinessBenchmark: number;
}

export interface RecentActivity {
  id: string;
  type: 'resume_analyzed' | 'roadmap_updated' | 'task_completed' | 'interview_completed';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}
