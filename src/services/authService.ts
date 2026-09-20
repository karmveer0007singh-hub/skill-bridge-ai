import { StudentProfile, RoadmapStep, TaskStatus, SkillAnalysisResult, InterviewEvaluation, RecentActivity } from '../types';
import {
  syncProfileToSupabase,
  fetchProfileFromSupabase,
  syncAnalysisToSupabase,
  syncRoadmapToSupabase,
  syncInterviewToSupabase,
  syncActivityToSupabase,
  isSupabaseConfigured,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut,
} from './supabaseClient';

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
    const parsed: StudentProfile = JSON.parse(raw);

    // Purge demo profile Alex Chen if stored
    if (
      parsed.email === 'alex.chen@university.edu' ||
      parsed.name === 'Alex Chen' ||
      parsed.id === 'demo-user-1'
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    // Ensure readinessScore is strictly 0 if no resume analysis has been run
    if (!parsed.analysis && !parsed.resumeUploadedAt) {
      parsed.readinessScore = 0;
      // If targetCareer was defaulted without the user having an analysis or custom career, clear it
      if (
        (parsed.targetCareer === 'Frontend Developer' ||
          parsed.targetCareer === 'Software Developer' ||
          !parsed.isCustomCareer) &&
        !parsed.resumeFileName
      ) {
        parsed.targetCareer = '';
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StudentProfile | null) {
  if (user) {
    if (
      user.email === 'alex.chen@university.edu' ||
      user.name === 'Alex Chen' ||
      user.id === 'demo-user-1'
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      notifyListeners(null);
      return;
    }
    if (!user.analysis && !user.resumeUploadedAt) {
      user.readinessScore = 0;
      if (
        user.targetCareer === 'Software Developer' ||
        user.targetCareer === 'Frontend Developer'
      ) {
        user.targetCareer = '';
      }
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  notifyListeners(user);
}

export function signUp(name: string, email: string, college: string = 'University'): StudentProfile {
  const newUser: StudentProfile = {
    id: `user-${Date.now()}`,
    name,
    email,
    college,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    targetCareer: '',
    isCustomCareer: false,
    readinessScore: 0,
  };
  setCurrentUser(newUser);

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    syncProfileToSupabase(newUser).catch((err) => console.warn('[Supabase Sync Error]', err));
  }

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
    if (isSupabaseConfigured()) {
      // Refresh in background from Supabase
      fetchProfileFromSupabase(email).then((cloudProfile) => {
        if (cloudProfile) {
          setCurrentUser({ ...existing, ...cloudProfile });
        }
      }).catch((e) => console.warn('[Supabase Fetch Error]', e));
    }
    return existing;
  }
  const user: StudentProfile = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student',
    email,
    college: 'University Student',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
    targetCareer: '',
    readinessScore: 0,
  };
  setCurrentUser(user);

  // Attempt to restore cloud profile if exists in Supabase
  if (isSupabaseConfigured()) {
    fetchProfileFromSupabase(email).then((cloudProfile) => {
      if (cloudProfile) {
        setCurrentUser(cloudProfile);
      } else {
        syncProfileToSupabase(user).catch((e) => console.warn('[Supabase Sync Error]', e));
      }
    }).catch((e) => console.warn('[Supabase Fetch Error]', e));
  }

  return user;
}

export function logout() {
  if (isSupabaseConfigured()) {
    supabaseSignOut().catch((e) => console.warn('[Supabase] Signout error:', e));
  }
  setCurrentUser(null);
}

/**
 * Authenticates with real Supabase Auth (or falls back to local student profile)
 */
export async function authenticateWithSupabase(
  mode: 'login' | 'signup',
  email: string,
  password?: string,
  name?: string,
  college: string = 'University Student'
): Promise<{ success: boolean; message?: string; user?: StudentProfile }> {
  const normalizedEmail = email.trim().toLowerCase();

  // If Supabase is configured and a password was supplied, use Supabase Auth
  if (isSupabaseConfigured() && password) {
    if (mode === 'signup') {
      const res = await supabaseSignUp(normalizedEmail, password, name || 'Student', college);
      if (!res.success) {
        return { success: false, message: res.message };
      }

      const newUser: StudentProfile = {
        id: res.user?.id || `user-${Date.now()}`,
        name: name || 'Student',
        email: normalizedEmail,
        college,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        targetCareer: '',
        isCustomCareer: false,
        readinessScore: 0,
      };

      setCurrentUser(newUser);
      syncProfileToSupabase(newUser).catch(() => {});

      addRecentActivity({
        type: 'resume_analyzed',
        title: 'Account Registered',
        description: `Welcome to SkillBridge AI, ${name || 'Student'}!`,
      });

      return {
        success: true,
        user: newUser,
        message: res.message,
      };
    } else {
      // mode === 'login'
      const res = await supabaseSignIn(normalizedEmail, password);
      if (!res.success) {
        return { success: false, message: res.message };
      }

      // Restore existing profile from Supabase if available
      let profile = await fetchProfileFromSupabase(normalizedEmail);
      if (!profile) {
        const meta = res.user?.user_metadata || {};
        profile = {
          id: res.user?.id || `user-${Date.now()}`,
          name: meta.name || normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student',
          email: normalizedEmail,
          college: meta.college || college,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(normalizedEmail)}`,
          targetCareer: '',
          readinessScore: 0,
        };
        syncProfileToSupabase(profile).catch(() => {});
      }

      setCurrentUser(profile);

      addRecentActivity({
        type: 'resume_analyzed',
        title: 'Signed In (Supabase)',
        description: `Welcome back to SkillBridge AI!`,
      });

      return {
        success: true,
        user: profile,
      };
    }
  }

  // Fallback demo/offline mode
  if (mode === 'signup') {
    const user = signUp(name || 'Student', normalizedEmail, college);
    return { success: true, user };
  } else {
    const user = login(normalizedEmail);
    return { success: true, user };
  }
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

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    syncProfileToSupabase(updated).catch((err) => console.warn('[Supabase Profile Sync]', err));
    syncAnalysisToSupabase(updated.id, analysis).catch((err) => console.warn('[Supabase Analysis Sync]', err));
    syncRoadmapToSupabase(updated.id, updated.targetCareer, roadmap).catch((err) => console.warn('[Supabase Roadmap Sync]', err));
  }

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

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    syncRoadmapToSupabase(updatedUser.id, updatedUser.targetCareer, updatedSteps).catch((err) =>
      console.warn('[Supabase Roadmap Status Sync]', err)
    );
    syncProfileToSupabase(updatedUser).catch((err) => console.warn('[Supabase Profile Sync]', err));
  }

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

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    syncInterviewToSupabase(updatedUser.id, evaluation).catch((err) =>
      console.warn('[Supabase Interview Sync]', err)
    );
    syncProfileToSupabase(updatedUser).catch((err) => console.warn('[Supabase Profile Sync]', err));
  }

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

/**
 * Manually pushes all current user data (profile, roadmap, analysis, activities) to Supabase
 */
export async function syncAllDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials are not configured yet. Please provide your Supabase URL and Anon Key.',
    };
  }

  const user = getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: 'No student profile is currently active to sync.',
    };
  }

  try {
    const pSuccess = await syncProfileToSupabase(user);
    if (!pSuccess) {
      return {
        success: false,
        message: 'Could not sync profile to Supabase. Please ensure your database tables are created using the SQL schema.',
      };
    }

    if (user.analysis) {
      await syncAnalysisToSupabase(user.id, user.analysis);
    }

    if (user.roadmap && user.roadmap.length > 0) {
      await syncRoadmapToSupabase(user.id, user.targetCareer, user.roadmap);
    }

    return {
      success: true,
      message: 'All student profile data, skill analyses, and roadmap steps were successfully synced to Supabase!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'An unexpected error occurred while syncing to Supabase.',
    };
  }
}

