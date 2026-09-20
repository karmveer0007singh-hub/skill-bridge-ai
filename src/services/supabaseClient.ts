import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StudentProfile, RoadmapStep, SkillAnalysisResult, InterviewEvaluation, RecentActivity } from '../types';

// Default to the user's Supabase Cloud project
const DEFAULT_SUPABASE_URL = 'https://votvpqenrudocashbseh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_G_7OK0h-uoO4mDStDMnWZA_DtAU7-rJ';

// Storage keys for optional browser-level config if user enters in UI
const CUSTOM_URL_KEY = 'skillbridge_supabase_url';
const CUSTOM_KEY_KEY = 'skillbridge_supabase_anon_key';

let supabaseInstance: SupabaseClient | null = null;
let lastInitUrl: string | null = null;
let lastInitKey: string | null = null;

export function getSupabaseCredentials(): { url: string; key: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let storedUrl = '';
  let storedKey = '';
  try {
    storedUrl = (localStorage.getItem(CUSTOM_URL_KEY) || '').trim();
    storedKey = (localStorage.getItem(CUSTOM_KEY_KEY) || '').trim();
  } catch {
    // Ignore storage restrictions
  }

  const url =
    (envUrl && envUrl !== 'https://your-project-id.supabase.co' ? envUrl : '') ||
    storedUrl ||
    DEFAULT_SUPABASE_URL;

  const key =
    (envKey && envKey !== 'your-anon-public-key' ? envKey : '') ||
    storedKey ||
    DEFAULT_SUPABASE_ANON_KEY;

  return { url, key };
}

export function saveCustomSupabaseCredentials(url: string, key: string) {
  try {
    if (url.trim()) {
      localStorage.setItem(CUSTOM_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(CUSTOM_URL_KEY);
    }

    if (key.trim()) {
      localStorage.setItem(CUSTOM_KEY_KEY, key.trim());
    } else {
      localStorage.removeItem(CUSTOM_KEY_KEY);
    }

    // Force reinitialization
    supabaseInstance = null;
    lastInitUrl = null;
    lastInitKey = null;
  } catch (e) {
    console.warn('Failed to save custom credentials:', e);
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http') && key.length > 20);
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key || !url.startsWith('http') || key.length < 20) {
    return null;
  }

  // Reuse existing instance if credentials haven't changed
  if (supabaseInstance && lastInitUrl === url && lastInitKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastInitUrl = url;
    lastInitKey = key;
    return supabaseInstance;
  } catch (err) {
    console.warn('Error creating Supabase client:', err);
    return null;
  }
}

/**
 * Tests connection to the configured Supabase database
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tablesFound?: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing or invalid.',
    };
  }

  try {
    // Test query on profiles table
    const { data, error } = await client.from('profiles').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, we still connected to Supabase project
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('relation "public.profiles" does not exist') ||
        error.message?.includes('does not exist') ||
        error.message?.toLowerCase().includes('schema cache')
      ) {
        return {
          success: true,
          tablesFound: false,
          message: 'Connected to Supabase project votvpqenrudocashbseh! Supabase Auth is active and ready. Database tables need to be created using the SQL script below.',
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message} (Code: ${error.code || 'unknown'})`,
      };
    }

    return {
      success: true,
      tablesFound: true,
      message: 'Successfully connected to Supabase database! All tables are active.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network connection failed: ${err.message || String(err)}`,
    };
  }
}

/**
 * Supabase Authentication Functions
 */

export async function supabaseSignUp(
  email: string,
  password: string,
  name: string,
  college: string = 'University Student'
): Promise<{ success: boolean; user?: any; session?: any; message?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not initialized.' };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
          college: college.trim(),
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return {
        success: false,
        message: 'An account with this email already exists in Supabase. Please switch to the Login tab to sign in.',
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: data.session
        ? 'Account successfully created and signed in!'
        : 'Account created in Supabase! Please check your email inbox to confirm your account if required by your Supabase project settings.',
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error signing up with Supabase' };
  }
}

export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; session?: any; message?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not initialized.' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      let customMessage = error.message;
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        customMessage = 'Invalid email or password. If you have not registered in this Supabase project yet, please click "Sign Up" above to create an account.';
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        customMessage = 'Email not confirmed yet in Supabase. Please check your inbox for the verification link.';
      }
      return { success: false, message: customMessage };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error signing in with Supabase' };
  }
}

export async function supabaseSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch (err) {
    console.warn('[Supabase] Sign out error:', err);
  }
}

export async function getSupabaseCurrentSession(): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getSession();
    return data?.session || null;
  } catch {
    return null;
  }
}

export function subscribeToSupabaseAuth(
  callback: (event: string, session: any) => void
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch {
    return null;
  }
}

/**
 * Syncs student profile to Supabase 'profiles' table
 */
export async function syncProfileToSupabase(profile: StudentProfile): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: profile.id,
      email: profile.email.toLowerCase().trim(),
      name: profile.name,
      college: profile.college || 'University Student',
      avatar_url: profile.avatarUrl,
      target_career: profile.targetCareer,
      is_custom_career: Boolean(profile.isCustomCareer),
      readiness_score: profile.readinessScore || 0,
      resume_file_name: profile.resumeFileName || null,
      resume_file_size: profile.resumeFileSize || null,
      resume_uploaded_at: profile.resumeUploadedAt || null,
      resume_raw_text: profile.resumeRawText || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from('profiles').upsert(payload, { onConflict: 'email' });
    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.toLowerCase().includes('schema cache') ||
        error.message?.includes('does not exist')
      ) {
        console.info('[Supabase] profiles table not yet created. Profile saved in local browser state.');
      } else {
        console.warn('[Supabase] Failed to sync profile:', error.message);
      }
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] syncProfile exception:', e);
    return false;
  }
}

/**
 * Fetches user profile, analysis, and roadmap from Supabase
 */
export async function fetchProfileFromSupabase(email: string): Promise<StudentProfile | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: profileData, error: profileErr } = await client
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (profileErr || !profileData) return null;

    // Fetch latest analysis
    const { data: analysisData } = await client
      .from('analyses')
      .select('*')
      .eq('user_id', profileData.id)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch latest roadmap
    const { data: roadmapData } = await client
      .from('roadmaps')
      .select('*')
      .eq('user_id', profileData.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch interview history
    const { data: interviewData } = await client
      .from('interviews')
      .select('*')
      .eq('user_id', profileData.id)
      .order('evaluated_at', { ascending: false })
      .limit(20);

    let parsedAnalysis: SkillAnalysisResult | undefined = undefined;
    if (analysisData) {
      parsedAnalysis = {
        targetCareer: analysisData.target_career,
        readinessScore: analysisData.readiness_score,
        summary: analysisData.summary || '',
        currentSkills: analysisData.current_skills || [],
        requiredSkills: analysisData.required_skills || [],
        skillGaps: analysisData.skill_gaps || [],
        recommendations: analysisData.recommendations || [],
        analyzedAt: analysisData.analyzed_at,
      };
    }

    let parsedRoadmap: RoadmapStep[] | undefined = undefined;
    if (roadmapData && Array.isArray(roadmapData.steps)) {
      parsedRoadmap = roadmapData.steps;
    }

    const interviewHistory: InterviewEvaluation[] = (interviewData || []).map((row) => ({
      questionId: row.question_id || 'q',
      questionType: row.question_type || 'Technical',
      question: row.question,
      studentAnswer: row.student_answer || '',
      score: row.score,
      strengths: row.strengths || [],
      areasForImprovement: row.areas_for_improvement || [],
      explanation: row.explanation || '',
      keyPointsCovered: row.key_points_covered || [],
      suggestedAnswer: row.suggested_answer || '',
      evaluatedAt: row.evaluated_at,
    }));

    const result: StudentProfile = {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      college: profileData.college || 'University Student',
      avatarUrl: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name)}`,
      targetCareer:
        profileData.target_career === 'Software Developer' || profileData.target_career === 'Frontend Developer'
          ? (parsedAnalysis ? profileData.target_career : '')
          : (profileData.target_career || ''),
      isCustomCareer: profileData.is_custom_career || false,
      readinessScore: profileData.readiness_score || 0,
      resumeFileName: profileData.resume_file_name || undefined,
      resumeFileSize: profileData.resume_file_size || undefined,
      resumeUploadedAt: profileData.resume_uploaded_at || undefined,
      resumeRawText: profileData.resume_raw_text || undefined,
      analysis: parsedAnalysis,
      roadmap: parsedRoadmap,
      interviewHistory: interviewHistory.length > 0 ? interviewHistory : undefined,
    };

    return result;
  } catch (e) {
    console.warn('[Supabase] fetchProfile exception:', e);
    return null;
  }
}

/**
 * Saves or updates AI skill analysis in Supabase
 */
export async function syncAnalysisToSupabase(
  userId: string,
  analysis: SkillAnalysisResult
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      user_id: userId,
      target_career: analysis.targetCareer,
      readiness_score: analysis.readinessScore,
      summary: analysis.summary,
      current_skills: analysis.currentSkills,
      required_skills: analysis.requiredSkills,
      skill_gaps: analysis.skillGaps,
      recommendations: analysis.recommendations,
      analyzed_at: analysis.analyzedAt || new Date().toISOString(),
    };

    const { error } = await client.from('analyses').insert(payload);
    if (error) {
      console.warn('[Supabase] Failed to sync analysis:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] syncAnalysis exception:', e);
    return false;
  }
}

/**
 * Saves or updates personalized roadmap in Supabase
 */
export async function syncRoadmapToSupabase(
  userId: string,
  targetCareer: string,
  steps: RoadmapStep[]
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Delete older roadmap for this career or upsert
    const payload = {
      user_id: userId,
      target_career: targetCareer,
      steps: steps,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from('roadmaps').upsert(payload, { onConflict: 'user_id' });
    if (error) {
      // Try insert if unique constraint differs
      const { error: insertErr } = await client.from('roadmaps').insert(payload);
      if (insertErr) {
        console.warn('[Supabase] Failed to sync roadmap:', insertErr.message);
        return false;
      }
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] syncRoadmap exception:', e);
    return false;
  }
}

/**
 * Records interview result in Supabase
 */
export async function syncInterviewToSupabase(
  userId: string,
  evaluation: InterviewEvaluation
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      user_id: userId,
      question_id: evaluation.questionId,
      question_type: evaluation.questionType,
      question: evaluation.question,
      student_answer: evaluation.studentAnswer,
      score: evaluation.score,
      strengths: evaluation.strengths,
      areas_for_improvement: evaluation.areasForImprovement,
      explanation: evaluation.explanation,
      suggested_answer: evaluation.suggestedAnswer,
      evaluated_at: evaluation.evaluatedAt || new Date().toISOString(),
    };

    const { error } = await client.from('interviews').insert(payload);
    if (error) {
      console.warn('[Supabase] Failed to sync interview:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] syncInterview exception:', e);
    return false;
  }
}

/**
 * Records student activity in Supabase
 */
export async function syncActivityToSupabase(
  userId: string,
  activity: Omit<RecentActivity, 'id' | 'timestamp'>
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      user_id: userId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      created_at: new Date().toISOString(),
    };

    const { error } = await client.from('activities').insert(payload);
    if (error) {
      console.warn('[Supabase] Failed to sync activity:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] syncActivity exception:', e);
    return false;
  }
}
