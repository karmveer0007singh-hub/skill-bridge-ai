-- ==============================================================================
-- SkillBridge AI - Supabase Database Setup Schema
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Profiles Table (Stores student credentials, current career goal, readiness score)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  college TEXT DEFAULT 'University Student',
  avatar_url TEXT,
  target_career TEXT DEFAULT 'Software Developer',
  is_custom_career BOOLEAN DEFAULT FALSE,
  readiness_score INTEGER DEFAULT 0,
  resume_file_name TEXT,
  resume_file_size TEXT,
  resume_uploaded_at TEXT,
  resume_raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Analyses Table (Stores AI skill analysis, gap assessments, recommendations)
CREATE TABLE IF NOT EXISTS public.analyses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  readiness_score INTEGER NOT NULL,
  summary TEXT,
  current_skills JSONB DEFAULT '[]'::jsonb,
  required_skills JSONB DEFAULT '[]'::jsonb,
  skill_gaps JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Roadmaps Table (Stores student personalized step-by-step milestones & completion status)
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Interviews Table (Stores AI mock interview evaluations and scores)
CREATE TABLE IF NOT EXISTS public.interviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT,
  question_type TEXT,
  question TEXT NOT NULL,
  student_answer TEXT,
  score INTEGER NOT NULL,
  strengths JSONB DEFAULT '[]'::jsonb,
  areas_for_improvement JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  suggested_answer TEXT,
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Activities Table (Recent career events, roadmap completions, resume audits)
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_analyses_user ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Setup open read/write access policies for Anon & Authenticated roles for seamless prototyping
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on analyses" ON public.analyses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on roadmaps" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on roadmaps" ON public.roadmaps FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on interviews" ON public.interviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on interviews" ON public.interviews FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
