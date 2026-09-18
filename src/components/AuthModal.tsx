import React, { useState } from 'react';
import { X, Lock, Mail, User, School, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { signUp, login, enableDemoMode } from '../services/authService';

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
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      signUp(name, email, college || 'University Student');
    } else {
      login(email);
    }

    onSuccess();
    onClose();
  };

  const handleDemoLogin = () => {
    enableDemoMode();
    onSuccess();
    onClose();
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
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#0D2442] border border-[#16E0FF]/40 flex items-center justify-center text-[#16E0FF] shadow-[0_0_12px_rgba(22,224,255,0.3)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-lg text-[#F4FAFF]">
              SkillBridge <span className="text-[#35E7FF]">AI</span>
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#F4FAFF] font-display">
            {mode === 'signup' ? 'Create Student Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#91A4BD] mt-1 leading-relaxed">
            {mode === 'signup'
              ? 'Analyze your skills, uncover missing competencies, and bridge the gap to your future career.'
              : 'Sign in to view your learning roadmap progress and AI assessment telemetry.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-[#06152B] p-1 rounded-xl mt-4 border border-[rgba(75,180,220,0.25)]">
            <button
              id="tab-btn-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
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

        {/* Instant Demo Shortcut */}
        <div className="px-6 pt-4">
          <button
            id="btn-fast-demo-login"
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#06152B] border border-[#16E0FF]/35 hover:border-[#35E7FF] text-[#F4FAFF] hover:bg-[#0D2442] transition-all text-left group shadow-[0_0_15px_rgba(22,224,255,0.1)]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#16E0FF]/15 text-[#35E7FF] flex items-center justify-center border border-[#16E0FF]/40">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F4FAFF] block">Instant Demo Mode</span>
                <span className="text-[11px] text-[#91A4BD]">Explore Alex Chen (CS Junior) with live data</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#16E0FF] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3.5">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
              {error}
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
                    placeholder="e.g. Maya Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#91A4BD] mb-1">College / University</label>
                <div className="relative">
                  <School className="w-4 h-4 text-[#657A95] absolute left-3 top-2.5" />
                  <input
                    id="input-auth-college"
                    type="text"
                    placeholder="e.g. UC Berkeley or SJSU"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95]"
                  />
                </div>
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
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            className="w-full mt-3 py-3 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(22,224,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{mode === 'signup' ? 'Create Account & Continue' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#657A95]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#35E29A]" />
            <span>Encrypted student session • SkillBridge AI</span>
          </div>
        </form>
      </div>
    </div>
  );
};
