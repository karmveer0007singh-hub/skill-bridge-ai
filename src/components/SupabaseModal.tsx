import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveCustomSupabaseCredentials,
  testSupabaseConnection,
} from '../services/supabaseClient';
import { syncAllDataToSupabase } from '../services/authService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [configured, setConfigured] = useState(isSupabaseConfigured());
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success: boolean;
    message: string;
    tablesFound?: boolean;
  }>({
    tested: false,
    loading: false,
    success: false,
    message: '',
  });
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setKey(creds.key);
      setConfigured(isSupabaseConfigured());
      setSyncResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = () => {
    saveCustomSupabaseCredentials(url, key);
    const isNowConfigured = isSupabaseConfigured();
    setConfigured(isNowConfigured);
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setTestStatus({
      tested: false,
      loading: true,
      success: false,
      message: 'Testing connection to Supabase...',
    });

    const result = await testSupabaseConnection();
    setTestStatus({
      tested: true,
      loading: false,
      success: result.success,
      message: result.message,
      tablesFound: result.tablesFound,
    });
  };

  const handleSyncAllData = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await syncAllDataToSupabase();
    setSyncResult(res);
    setSyncing(false);
  };

  const sqlSetupCode = `-- SkillBridge AI - Supabase Database Setup
-- Paste into: Supabase Dashboard -> SQL Editor -> New Query -> Run

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  college TEXT DEFAULT 'University Student',
  avatar_url TEXT,
  target_career TEXT DEFAULT '',
  is_custom_career BOOLEAN DEFAULT FALSE,
  readiness_score INTEGER DEFAULT 0,
  resume_file_name TEXT,
  resume_file_size TEXT,
  resume_uploaded_at TEXT,
  resume_raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.roadmaps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Open RLS policies for prototyping
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on analyses" ON public.analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on roadmaps" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on roadmaps" ON public.roadmaps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on interviews" ON public.interviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on interviews" ON public.interviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSetupCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="supabase-modal-card"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0A1B33] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[rgba(75,180,220,0.35)] overflow-hidden text-left"
      >
        {/* Header Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-2 bg-[#16E0FF] blur-xl opacity-50" />

        {/* Modal Header */}
        <div className="p-6 border-b border-[rgba(75,180,220,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F4FAFF] font-display">
                  Supabase Database Setup
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    configured
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {configured ? 'Configured' : 'Needs Credentials'}
                </span>
              </div>
              <p className="text-xs text-[#91A4BD]">
                Persistent PostgreSQL cloud storage for profiles, skill roadmaps & interview history
              </p>
            </div>
          </div>

          <button
            id="btn-close-supabase-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#06152B] border border-[rgba(75,180,220,0.2)] flex items-center justify-center text-[#91A4BD] hover:text-[#F4FAFF] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Step 1: Credentials */}
          <div className="p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                1. Supabase Project Credentials
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#35E7FF] hover:underline flex items-center gap-1"
              >
                Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-[#91A4BD]">
              Found in your Supabase project under <strong>Project Settings &gt; API</strong>. You can also configure them in <code>.env</code> as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#91A4BD] mb-1">
                  Project URL (VITE_SUPABASE_URL)
                </label>
                <input
                  id="input-supabase-url"
                  type="text"
                  placeholder="https://your-project-id.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] rounded-xl text-[#F4FAFF] font-mono focus:outline-hidden focus:border-[#16E0FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#91A4BD] mb-1">
                  Anon / Public Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <input
                  id="input-supabase-anon-key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] rounded-xl text-[#F4FAFF] font-mono focus:outline-hidden focus:border-[#16E0FF]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  id="btn-save-supabase-creds"
                  onClick={handleSaveCredentials}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] text-[#020817] hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(22,224,255,0.3)] transition-all"
                >
                  Save &amp; Test Connection
                </button>

                <button
                  id="btn-test-supabase-connection"
                  onClick={handleTestConnection}
                  disabled={testStatus.loading || !url}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#0D2442] hover:bg-[#143258] border border-[rgba(75,180,220,0.25)] text-[#F4FAFF] flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin text-[#16E0FF]' : ''}`} />
                  Test Connection
                </button>
              </div>

              {testStatus.tested && (
                <div
                  className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
                    testStatus.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testStatus.message}</p>
                    {testStatus.success && testStatus.tablesFound === false && (
                      <p className="mt-1 text-[11px] text-emerald-200">
                        Please copy and run the SQL below in your Supabase SQL Editor to finish setting up the tables!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: SQL Schema Setup */}
          <div className="p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                2. Execute SQL Schema in Supabase
              </span>
              <div className="flex items-center gap-2">
                <a
                  id="link-open-supabase-sql"
                  href="https://supabase.com/dashboard/project/votvpqenrudocashbseh/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#06152B] hover:bg-[#0D2442] text-[#16E0FF] border border-[rgba(75,180,220,0.3)] flex items-center gap-1.5 transition-all"
                >
                  <span>Open SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  id="btn-copy-sql-schema"
                  onClick={copySqlToClipboard}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0D2442] hover:bg-[#16E0FF] hover:text-[#020817] text-[#35E7FF] border border-[rgba(75,180,220,0.3)] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied SQL!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy SQL Script
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#91A4BD]">
              Creates <code>profiles</code>, <code>analyses</code>, <code>roadmaps</code>, <code>interviews</code>, and <code>activities</code> tables with instant Row Level Security (RLS) policies.
            </p>

            <div className="relative rounded-xl bg-[#020817] border border-[rgba(75,180,220,0.15)] p-3 text-[11px] font-mono text-[#91A4BD] max-h-40 overflow-y-auto">
              <pre className="whitespace-pre">{sqlSetupCode}</pre>
            </div>
          </div>

          {/* Step 3: Cloud Synchronization */}
          <div className="p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                3. Push Current Local Data to Cloud
              </span>
              <button
                id="btn-sync-all-supabase"
                onClick={handleSyncAllData}
                disabled={syncing}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0D2442] hover:bg-[#143258] border border-[rgba(75,180,220,0.3)] text-[#F4FAFF] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-[#16E0FF]' : ''}`} />
                Sync Local Data Now
              </button>
            </div>

            <p className="text-xs text-[#91A4BD]">
              Uploads your active profile, AI skill analysis, personalized roadmap steps, and interview scorecards directly into your Supabase PostgreSQL database.
            </p>

            {syncResult && (
              <div
                className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
                  syncResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {syncResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                )}
                <p>{syncResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[rgba(75,180,220,0.2)] bg-[#06152B] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#91A4BD]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted transmission via HTTPS &amp; PostgreSQL</span>
          </div>

          <button
            id="btn-done-supabase-modal"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] text-[#020817] hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(22,224,255,0.25)] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
