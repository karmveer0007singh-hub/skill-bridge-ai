import React, { useState } from 'react';
import appLogo from '../assets/images/app_logo.jpg';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { authenticateWithSupabase, login } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateWithSupabase(
        mode,
        email,
        password,
        name,
        college || 'University Student'
      );

      if (!res.success) {
        setError(res.message || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      if (res.message && res.message.includes('email to confirm')) {
        setInfoMessage(res.message);
        setLoading(false);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 3000);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-[#0A1B33] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[rgba(75,180,220,0.35)] overflow-hidden"
      >
        {/* Subtle Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-[#16E0FF] blur-xl opacity-50" />

        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#91A4BD] hover:text-[#F4FAFF] p-1.5 rounded-xl hover:bg-[#0D2442] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[rgba(75,180,220,0.2)]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] shrink-0 bg-[#06152B]">
                <img
                  src={appLogo}
                  alt="SkillBridge AI"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-lg text-[#F4FAFF]">
                SkillBridge <span className="text-[#35E7FF]">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] text-emerald-300 font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Connected</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#F4FAFF] font-display">
            {mode === 'signup' ? 'Create Student Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#91A4BD] mt-1 leading-relaxed">
            {mode === 'signup'
              ? 'Analyze your skills, uncover missing competencies, and bridge the gap to your future career.'
              : 'Sign in to access your learning roadmaps and assessment scores across sessions.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-[#06152B] p-1 rounded-xl mt-4 border border-[rgba(75,180,220,0.25)]">
            <button
              id="tab-btn-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_12px_rgba(22,224,255,0.3)]'
                  : 'text-[#91A4BD] hover:text-[#F4FAFF]'
              }`}
            >
              Sign Up
            </button>
            <button
              id="tab-btn-login"
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_12px_rgba(22,224,255,0.3)]'
                  : 'text-[#91A4BD] hover:text-[#F4FAFF]'
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs rounded-xl leading-relaxed space-y-2">
              <div>{error}</div>
              {mode === 'login' && (
                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-200/80">Need to register first?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    Switch to Sign Up
                  </button>
                </div>
              )}
              {error.toLowerCase().includes('email not confirmed') && (
                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-200/80">Skip confirmation?</span>
                  <button
                    type="button"
                    onClick={() => {
                      login(email);
                      onSuccess();
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-[#16E0FF]/20 hover:bg-[#16E0FF]/30 text-[#35E7FF] border border-[#16E0FF]/40 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    Enter in Local Mode
                  </button>
                </div>
              )}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {infoMessage}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#91A4BD] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#657A95] absolute left-3 top-2.5" />
                  <input
                    id="input-auth-name"
                    type="text"
                    required
                    placeholder="e.g. Karmveer Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#91A4BD] mb-1">
                  University or College (Optional)
                </label>
                <input
                  id="input-auth-college"
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[#91A4BD] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#657A95] absolute left-3 top-2.5" />
              <input
                id="input-auth-email"
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#91A4BD] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#657A95] absolute left-3 top-2.5" />
              <input
                id="input-auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
              />
            </div>
            <span className="text-[10px] text-[#657A95] mt-1 block">
              Minimum 6 characters for secure authentication
            </span>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(22,224,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#020817]" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account & Continue' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-1 text-center">
            {mode === 'login' ? (
              <p className="text-[11px] text-[#91A4BD]">
                Don't have an account in Supabase?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-[#16E0FF] hover:underline font-semibold cursor-pointer"
                >
                  Create Account (Sign Up)
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-[#91A4BD]">
                Already registered in Supabase?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-[#16E0FF] hover:underline font-semibold cursor-pointer"
                >
                  Sign In here
                </button>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#657A95]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#35E29A]" />
            <span>Encrypted student session • SkillBridge AI</span>
          </div>
        </form>
      </div>
    </div>
  );
};
