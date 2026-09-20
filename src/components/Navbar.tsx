import React, { useState, useEffect } from 'react';
import appLogo from '../assets/images/app_logo.jpg';
import {
  Sparkles,
  Layers,
  BrainCircuit,
  LogOut,
  User,
  Menu,
  X,
  ArrowRight,
  Sliders,
  ChevronDown,
  LayoutDashboard,
  UploadCloud,
  Milestone,
  Database,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  user: StudentProfile | null;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenSupabase?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenSupabase,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [appToolsOpen, setAppToolsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy if on landing page
      if (activeTab === 'landing') {
        const sections = ['how-it-works', 'skills-value', 'skill-bridge-path', 'ai-skill-pattern'];
        const scrollPosition = window.scrollY + 120;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              return;
            }
          }
        }
        if (window.scrollY < 300) {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navLinks = [
    { label: 'Home', sectionId: 'home' },
    { label: 'How It Works', sectionId: 'how-it-works' },
    { label: 'Skills & Gaps', sectionId: 'skills-value' },
    { label: 'Learning Paths', sectionId: 'skill-bridge-path' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 h-18 sm:h-20 ${
        isScrolled
          ? 'bg-[#020817]/90 backdrop-blur-xl border-b border-[rgba(75,180,220,0.25)] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-[#020817]/70 backdrop-blur-md border-b border-[rgba(75,180,220,0.15)]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: AI Ideas & Skills Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            {/* AI Ideas & Skills Circular Medallion */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] group-hover:border-amber-300 transition-all shrink-0 bg-[#06152B]">
              <img
                src={appLogo}
                alt="AI Ideas & Skills Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="font-display font-extrabold text-[#F4FAFF] text-lg sm:text-xl tracking-tight flex items-center gap-1.5">
                SkillBridge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] text-glow-cyan">AI</span>
              </span>
              <span className="text-[10px] text-[#91A4BD] font-mono tracking-wider uppercase block leading-none">
                Skill Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === 'landing' && activeSection === link.sectionId;
            return (
              <button
                key={link.sectionId}
                id={`nav-link-${link.sectionId}`}
                onClick={() => scrollToSection(link.sectionId)}
                className={`relative px-3.5 py-2 text-xs font-medium tracking-wide transition-all rounded-lg ${
                  isActive
                    ? 'text-[#35E7FF] font-semibold'
                    : 'text-[#91A4BD] hover:text-[#F4FAFF] hover:bg-[#0A1B33]/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] shadow-[0_0_8px_#16E0FF] rounded-full" />
                )}
              </button>
            );
          })}

          {/* Interactive App Workspace Quick Switcher */}
          <div className="relative ml-2 pl-3 border-l border-[rgba(75,180,220,0.2)]">
            <button
              onClick={() => setAppToolsOpen(!appToolsOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#91A4BD] hover:text-[#16E0FF] hover:bg-[#0A1B33]/80 border border-transparent hover:border-[rgba(75,180,220,0.3)] transition-all"
              title="Switch to Interactive App Tools"
            >
              <Sliders className="w-3.5 h-3.5 text-[#16E0FF]" />
              <span>Workspace</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {appToolsOpen && (
              <div
                className="absolute left-0 mt-2 w-52 rounded-2xl glass-card-elevated p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setAppToolsOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#657A95]">
                  Student Modules
                </div>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setAppToolsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeTab === 'dashboard' ? 'bg-[#16E0FF]/15 text-[#35E7FF] font-semibold' : 'text-[#F4FAFF] hover:bg-[#0A1B33]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>Student Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('upload');
                    setAppToolsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeTab === 'upload' ? 'bg-[#16E0FF]/15 text-[#35E7FF] font-semibold' : 'text-[#F4FAFF] hover:bg-[#0A1B33]'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>Resume & Career Gap</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('skill-gaps');
                    setAppToolsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeTab === 'skill-gaps' ? 'bg-[#16E0FF]/15 text-[#35E7FF] font-semibold' : 'text-[#F4FAFF] hover:bg-[#0A1B33]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>Skill Gap Matrix</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('roadmap');
                    setAppToolsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeTab === 'roadmap' ? 'bg-[#16E0FF]/15 text-[#35E7FF] font-semibold' : 'text-[#F4FAFF] hover:bg-[#0A1B33]'
                  }`}
                >
                  <Milestone className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>Learning Roadmap</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('interview');
                    setAppToolsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeTab === 'interview' ? 'bg-[#16E0FF]/15 text-[#35E7FF] font-semibold' : 'text-[#F4FAFF] hover:bg-[#0A1B33]'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>AI Mock Interview</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Supabase Cloud Status Indicator */}
          <button
            id="nav-btn-supabase-status"
            onClick={onOpenSupabase}
            title="Supabase Database & Cloud Connection"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.12)]"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline font-semibold text-[11px]">Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {!user ? (
            <>
              {/* Secondary Sign In */}
              <button
                id="nav-btn-login"
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-[#91A4BD] hover:text-[#F4FAFF] hover:bg-[#0A1B33] border border-transparent hover:border-[rgba(75,180,220,0.25)] rounded-xl transition-all"
              >
                Sign In
              </button>

              {/* Primary Get Started CTA */}
              <button
                id="nav-btn-get-started"
                onClick={() => onOpenAuth('signup')}
                className="relative group px-4 py-2 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(22,224,255,0.35)] hover:shadow-[0_0_28px_rgba(53,231,255,0.55)] transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-[rgba(75,180,220,0.3)] hover:border-[#16E0FF] bg-[#0A1B33]/80 hover:bg-[#0D2442] transition-all shadow-[0_0_15px_rgba(22,224,255,0.1)]"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-[#16E0FF]/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#16E0FF]/20 text-[#35E7FF] flex items-center justify-center font-bold text-xs border border-[#16E0FF]/30">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <span className="text-xs font-bold text-[#F4FAFF] block leading-tight truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#35E7FF] font-mono block leading-none truncate max-w-[100px]">
                    {user.targetCareer}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {profileDropdownOpen && (
                <div
                  id="user-profile-dropdown"
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-card-elevated border border-[rgba(75,180,220,0.4)] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[rgba(75,180,220,0.15)]">
                    <p className="text-xs font-bold text-[#F4FAFF]">{user.name}</p>
                    <p className="text-[10px] text-[#91A4BD] truncate font-mono">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#91A4BD] hover:text-[#F4FAFF] hover:bg-[#0A1B33] rounded-xl"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#16E0FF]" />
                      <span>Student Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('upload');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#91A4BD] hover:text-[#F4FAFF] hover:bg-[#0A1B33] rounded-xl"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#16E0FF]" />
                      <span>Resume Analysis</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenSupabase?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#91A4BD] hover:text-[#F4FAFF] hover:bg-[#0A1B33] rounded-xl"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supabase Sync & DB</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-[rgba(75,180,220,0.15)]">
                    <button
                      id="btn-user-logout"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          {!user && (
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-3 py-1.5 text-xs font-bold text-[#020817] bg-[#16E0FF] rounded-lg shadow-sm"
            >
              Get Started
            </button>
          )}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#91A4BD] hover:text-[#F4FAFF] rounded-lg hover:bg-[#0A1B33]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[rgba(75,180,220,0.25)] bg-[#020817]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#657A95] px-3 pb-1">
            Navigation
          </div>
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => scrollToSection(link.sectionId)}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#91A4BD] hover:text-[#35E7FF] hover:bg-[#0A1B33]"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[rgba(75,180,220,0.2)]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#657A95] px-3 pb-1">
              Interactive Tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="px-3 py-2 text-xs text-left text-[#F4FAFF] bg-[#0A1B33] rounded-xl border border-[rgba(75,180,220,0.2)]"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('upload');
                }}
                className="px-3 py-2 text-xs text-left text-[#F4FAFF] bg-[#0A1B33] rounded-xl border border-[rgba(75,180,220,0.2)]"
              >
                Resume Analysis
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('roadmap');
                }}
                className="px-3 py-2 text-xs text-left text-[#F4FAFF] bg-[#0A1B33] rounded-xl border border-[rgba(75,180,220,0.2)]"
              >
                Roadmap
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('interview');
                }}
                className="px-3 py-2 text-xs text-left text-[#F4FAFF] bg-[#0A1B33] rounded-xl border border-[rgba(75,180,220,0.2)]"
              >
                AI Interview
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupabase?.();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase Database</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected</span>
              </div>
            </button>

            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#F4FAFF] bg-[#0A1B33] border border-[rgba(75,180,220,0.3)] rounded-xl"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-rose-400 bg-rose-950/40 rounded-xl"
              >
                Sign Out ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
