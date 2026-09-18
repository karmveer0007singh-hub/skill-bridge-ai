import { StudentProfile, RoadmapStep, TaskStatus, SkillAnalysisResult, InterviewEvaluation, RecentActivity } from '../types';
import { DEMO_STUDENT_PROFILE } from '../data/mockData';

const AUTH_STORAGE_KEY = 'skillbridge_auth_user';
const ACTIVITIES_STORAGE_KEY = 'skillbridge_activities';

type AuthListener = (user: StudentProfile | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: StudentProfile | null) {
  listeners.forEach((listener) => listener(user));
}

export function subscribeToAuth(listener: AuthListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCurrentUser(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StudentProfile | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  notifyListeners(user);
}

export function enableDemoMode(): StudentProfile {
  const demoUser = { ...DEMO_STUDENT_PROFILE };
  setCurrentUser(demoUser);
  addRecentActivity({
    type: 'resume_analyzed',
    title: 'Demo Profile Loaded',
    description: 'Explored Alex Chen (CS Junior) demo resume & Frontend roadmap.',
  });
  return demoUser;
}

export function signUp(name: string, email: string, college: string = 'University'): StudentProfile {
  const newUser: StudentProfile = {
    id: `user-${Date.now()}`,
    name,
    email,
    college,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    targetCareer: 'Frontend Developer',
    isCustomCareer: false,
    readinessScore: 0,
    isDemo: false,
  };
  setCurrentUser(newUser);
  addRecentActivity({
    type: 'resume_analyzed',
    title: 'Account Created',
    description: `Welcome to SkillBridge AI, ${name}!`,
  });
  return newUser;
}

export function login(email: string): StudentProfile {
  const existing = getCurrentUser();
  if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
    return existing;
  }
  // Standard instant login simulation for hackathon demo
  const user: StudentProfile = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student',
    email,
    college: 'University Student',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
    targetCareer: 'Software Developer',
    readinessScore: 0,
    isDemo: false,
  };
  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}

export function updateUserAnalysis(
  analysis: SkillAnalysisResult,
  roadmap: RoadmapStep[],
  resumeInfo?: { fileName: string; fileSize: string; rawText: string }
): StudentProfile {
  let user = getCurrentUser();
  if (!user) {
    user = {
      id: `user-${Date.now()}`,
      name: 'Student Candidate',
      email: 'student@university.edu',
      targetCareer: analysis.targetCareer,
      readinessScore: analysis.readinessScore,
      isDemo: false,
    };
  }

  const updated: StudentProfile = {
    ...user,
    targetCareer: analysis.targetCareer,
    readinessScore: analysis.readinessScore,
    analysis,
    roadmap,
    resumeFileName: resumeInfo?.fileName || user.resumeFileName || 'Student_Resume.pdf',
    resumeFileSize: resumeInfo?.fileSize || user.resumeFileSize || '120 KB',
    resumeUploadedAt: 'Just now',
    resumeRawText: resumeInfo?.rawText || user.resumeRawText,
  };

  setCurrentUser(updated);

  addRecentActivity({
    type: 'resume_analyzed',
    title: 'Resume Analyzed by AI',
    description: `Benchmarked against ${analysis.targetCareer} with score ${analysis.readinessScore}%.`,
  });

  return updated;
}

export function updateRoadmapTaskStatus(stepId: string, status: TaskStatus): StudentProfile | null {
  const user = getCurrentUser();
  if (!user || !user.roadmap) return user;

  const updatedSteps = user.roadmap.map((step) => {
    if (step.id === stepId) {
      return {
        ...step,
        status,
        completedAt: status === 'completed' ? new Date().toLocaleDateString() : undefined,
      };
    }
    return step;
  });

  // Calculate new roadmap completion percentage
  const total = updatedSteps.length;
  const completedCount = updatedSteps.filter((s) => s.status === 'completed').length;
  const inProgressCount = updatedSteps.filter((s) => s.status === 'in-progress').length;
  const progressRatio = total > 0 ? (completedCount + inProgressCount * 0.4) / total : 0;

  // Dynamically boost readiness score proportionally as student completes roadmap steps!
  const baseScore = user.analysis?.readinessScore || 65;
  const potentialGain = 100 - baseScore;
  const newReadiness = Math.min(99, Math.round(baseScore + potentialGain * (completedCount / Math.max(total, 1)) * 0.7));

  const updatedUser: StudentProfile = {
    ...user,
    roadmap: updatedSteps,
    readinessScore: newReadiness,
  };

  setCurrentUser(updatedUser);

  if (status === 'completed') {
    const targetStep = updatedSteps.find((s) => s.id === stepId);
    addRecentActivity({
      type: 'task_completed',
      title: `Completed Step: ${targetStep?.title || 'Milestone'}`,
      description: `Skill progress updated. Career readiness increased to ${newReadiness}%.`,
    });
  }

  return updatedUser;
}

export function recordInterviewResult(evaluation: InterviewEvaluation): StudentProfile | null {
  const user = getCurrentUser();
  if (!user) return null;

  const history = user.interviewHistory ? [evaluation, ...user.interviewHistory] : [evaluation];
  const updatedUser: StudentProfile = {
    ...user,
    interviewHistory: history,
  };

  setCurrentUser(updatedUser);

  addRecentActivity({
    type: 'interview_completed',
    title: 'AI Mock Interview Practiced',
    description: `Scored ${evaluation.score}% on question evaluation.`,
  });

  return updatedUser;
}

export function getRecentActivities(): RecentActivity[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (!raw) {
      return [
        {
          id: 'act-1',
          type: 'resume_analyzed',
          title: 'Skill Analysis Initialized',
          description: 'Ready to bridge career gaps and track roadmap progress.',
          timestamp: 'Today',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>) {
  try {
    const current = getRecentActivities();
    const newActivity: RecentActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    const next = [newActivity, ...current.slice(0, 7)];
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Failed to store activity:', e);
  }
}
