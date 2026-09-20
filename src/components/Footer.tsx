import React from 'react';
import appLogo from '../assets/images/app_logo.jpg';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUp,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('landing');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="relative bg-[#020817] text-[#91A4BD] pt-16 pb-12 border-t border-[rgba(75,180,220,0.22)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#16E0FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00B8D9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[rgba(75,180,220,0.18)]">
          {/* Brand Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] shrink-0 bg-[#06152B]">
                <img
                  src={appLogo}
                  alt="AI Ideas & Skills Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-[#F4FAFF] text-xl tracking-tight">
                SkillBridge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16E0FF] to-[#35E7FF]">AI</span>
              </span>
            </div>

            <p className="text-sm text-[#91A4BD] max-w-sm leading-relaxed">
              AI-powered skill intelligence for the next generation of careers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] hover:text-[#35E7FF] flex items-center justify-center transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] hover:text-[#35E7FF] flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] hover:text-[#35E7FF] flex items-center justify-center transition-all"
                aria-label="X/Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@skillbridge.ai"
                className="w-9 h-9 rounded-xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] hover:text-[#35E7FF] flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* System pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[#35E7FF]">
                <Cpu className="w-3 h-3 text-[#16E0FF]" />
                Gemini Intelligence
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[#35E29A]">
                <ShieldCheck className="w-3 h-3 text-[#35E29A]" />
                Enterprise Secure
              </span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4FAFF] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('skill-bridge-path')}
                  className="hover:text-[#16E0FF] transition-colors text-left"
                >
                  Learning Paths
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('recommendation-preview')}
                  className="hover:text-[#16E0FF] transition-colors text-left"
                >
                  AI Recommendations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#16E0FF] transition-colors text-left flex items-center gap-1 text-[#35E7FF]"
                >
                  <span>Open Student Workspace</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4FAFF] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-[#16E0FF] transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('skills-value')}
                  className="hover:text-[#16E0FF] transition-colors text-left"
                >
                  Career Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('ai-skill-pattern')}
                  className="hover:text-[#16E0FF] transition-colors text-left"
                >
                  Skill Library & Graph
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4FAFF] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="cursor-pointer hover:text-[#16E0FF] transition-colors">
                  About
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#16E0FF] transition-colors">
                  Contact
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#16E0FF] transition-colors">
                  Privacy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#16E0FF] transition-colors">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#657A95]">
          <p>© 2026 SkillBridge AI. Built for the future of learning and work.</p>

          <div className="flex items-center gap-4">
            <span className="text-[#91A4BD] font-medium">Empowering Student Potential</span>
            <span className="text-[rgba(75,180,220,0.3)]">•</span>
            {/* Back to top button with glowing cyan border */}
            <button
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1B33] hover:bg-[#0D2442] text-[#35E7FF] border border-[rgba(22,224,255,0.35)] hover:border-[#35E7FF] hover:shadow-[0_0_15px_rgba(22,224,255,0.4)] transition-all text-xs font-medium"
              title="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
