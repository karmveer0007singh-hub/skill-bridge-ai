import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Layers,
  Milestone,
  Award,
  Target,
  Rocket,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  BookOpen,
  Code2,
  Briefcase,
  Users,
  Compass,
  Star,
  Activity,
  BarChart3,
  Network,
  Search,
  Filter,
} from 'lucide-react';

// Assets
import heroImage from '../assets/images/hero_ai_student_1789146262476.jpg';
import networkImage from '../assets/images/ai_skill_network_1789146277554.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
  onSelectCareer: (careerTitle: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onTryDemo,
  onSelectCareer,
}) => {
  // Assessment interactive state
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'technical' | 'soft'>('all');
  const [interactiveSkillBoost, setInteractiveSkillBoost] = useState<number>(0);

  // Skill Bridge target journey state
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  // Opportunities category filter
  const [opportunityFilter, setOpportunityFilter] = useState('All');

  // Testimonials active index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const careerJourneys = [
    {
      title: 'Frontend AI Product Engineer',
      salary: '$95K - $130K',
      demand: 'Very High (+34% YoY)',
      currentSkills: ['JavaScript (ES6+)', 'Communication', 'UI Design (Figma)'],
      skillGaps: ['React & Next.js', 'System Architecture', 'AI Prompt & API Orchestration'],
      learningPath: [
        { title: 'React 19 & State Mastery', weeks: '3 Weeks' },
        { title: 'Fullstack AI Project Sandbox', weeks: '4 Weeks' },
        { title: 'Distributed Systems & Latency', weeks: '2 Weeks' },
      ],
      insight: 'Your high communication and UI fidelity give you a 2.4x hiring edge in AI product teams.',
    },
    {
      title: 'Full-Stack Cloud Developer',
      salary: '$90K - $125K',
      demand: 'High (+28% YoY)',
      currentSkills: ['HTML/CSS & React', 'Git & CI Basics', 'Problem Solving'],
      skillGaps: ['Node.js & Express REST', 'PostgreSQL & Cloud SQL', 'Containerization (Docker)'],
      learningPath: [
        { title: 'Backend API Engineering', weeks: '3 Weeks' },
        { title: 'Relational DB Schemas', weeks: '3 Weeks' },
        { title: 'Cloud Deployments & Docker', weeks: '2 Weeks' },
      ],
      insight: 'Adding PostgreSQL and REST microservices closes 78% of your full-stack readiness gap.',
    },
    {
      title: 'AI & Data Intelligence Engineer',
      salary: '$105K - $145K',
      demand: 'Extremely High (+46% YoY)',
      currentSkills: ['Python Fundamentals', 'Basic Statistics', 'Analytical Thinking'],
      skillGaps: ['Data Pipelines (Pandas/SQL)', 'Vector Embeddings & RAG', 'Model Fine-tuning'],
      learningPath: [
        { title: 'Advanced Python & Data Wrangling', weeks: '3 Weeks' },
        { title: 'Vector DBs & Semantic Search', weeks: '3 Weeks' },
        { title: 'Real-Time Inference Serving', weeks: '4 Weeks' },
      ],
      insight: 'Transitioning from data analysis to LLM orchestration yields the highest placement velocity.',
    },
  ];

  const currentJourney = careerJourneys[selectedRoleIndex];

  // Base readiness 82% plus user interactive boost
  const dynamicReadiness = Math.min(98, 82 + interactiveSkillBoost);

  const opportunities = [
    {
      id: 1,
      category: 'Internships',
      title: 'Frontend AI Engineering Intern',
      company: 'CognitiveScale Labs',
      location: 'San Francisco, CA (Hybrid)',
      match: 96,
      skills: ['React', 'TypeScript', 'Tailwind', 'REST APIs'],
      stipend: '$45 / hr',
    },
    {
      id: 2,
      category: 'Jobs',
      title: 'Junior Fullstack Engineer',
      company: 'Aether Cloud Systems',
      location: 'Remote (US/Canada)',
      match: 91,
      skills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
      stipend: '$92,000 / yr',
    },
    {
      id: 3,
      category: 'Hackathons',
      title: 'Global AI Agent Hackathon 2026',
      company: 'Developer DAO & Google',
      location: 'Virtual • $50K Prize Pool',
      match: 94,
      skills: ['Gemini API', 'React', 'Agentic Workflows'],
      stipend: 'Hackathon Demo',
    },
    {
      id: 4,
      category: 'Projects',
      title: 'Open Source AI Resume Evaluator',
      company: 'SkillBridge Community',
      location: 'GitHub Collaboration',
      match: 88,
      skills: ['TypeScript', 'PDF Parsing', 'Tailwind CSS'],
      stipend: 'Portfolio Certified',
    },
    {
      id: 5,
      category: 'Mentorship',
      title: '1-on-1 Silicon Valley Staff Mentor',
      company: 'TechLeaders Alliance',
      location: 'Bi-Weekly Zoom Sessions',
      match: 95,
      skills: ['System Design', 'Interview Prep', 'Career Strategy'],
      stipend: 'Free for Students',
    },
    {
      id: 6,
      category: 'Freelance',
      title: 'Interactive Dashboard Builder',
      company: 'Novus HealthTech',
      location: 'Remote Contract (4 Weeks)',
      match: 89,
      skills: ['React Components', 'Recharts', 'TypeScript'],
      stipend: '$3,200 Fixed',
    },
  ];

  const filteredOpportunities =
    opportunityFilter === 'All'
      ? opportunities
      : opportunities.filter((op) => op.category === opportunityFilter);

  const testimonials = [
    {
      name: 'Aarav Mehta',
      role: 'Computer Science Sophomore, Berkeley',
      quote:
        'SkillBridge helped me understand which skills actually mattered for the role I wanted. Instead of randomly taking courses, I finally had a targeted path.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      outcome: 'Secured AI Frontend Internship',
    },
    {
      name: 'Elena Rostova',
      role: 'Data Science Junior, University of Michigan',
      quote:
        'The skill gap matrix revealed that 3 small missing libraries were holding my resume back from automated ATS screenings. Fixed them and landed 4 interviews.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      outcome: 'Placed at Cloud Systems Inc.',
    },
    {
      name: 'Marcus Chen',
      role: 'Self-Taught & Bootcamp Grad',
      quote:
        'The step-by-step roadmap turns overwhelming career transitions into manageable weekly milestones. The AI Mock Interview gave me real confidence.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      outcome: 'Full-Stack Engineer at Series B Startup',
    },
  ];

  return (
    <div className="relative bg-[#020817] text-[#F4FAFF] overflow-hidden selection:bg-[#16E0FF] selection:text-[#020817]">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[35rem] bg-radial from-[#16E0FF]/15 via-[#00B8D9]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[40rem] -left-40 w-[45rem] h-[45rem] bg-radial from-[#4C8DFF]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[90rem] -right-40 w-[50rem] h-[50rem] bg-radial from-[#16E0FF]/10 to-transparent blur-3xl pointer-events-none" />

      {/* ======================================================== */}
      {/* 4. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Side (Col 1-7) */}
            <div className="lg:col-span-7 space-y-7 z-10 text-left">
              {/* Glowing Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#06152B] border border-[rgba(22,224,255,0.35)] shadow-[0_0_15px_rgba(22,224,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#16E0FF] shadow-[0_0_8px_#16E0FF] animate-ping" />
                <span className="text-xs font-mono font-bold tracking-wide text-[#35E7FF] uppercase">
                  AI-Powered Career & Skill Intelligence
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight font-display leading-[1.08] text-[#F4FAFF]">
                Bridge the gap between your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16E0FF] via-[#35E7FF] to-[#00B8D9] text-glow-cyan">
                  skills
                </span>{' '}
                and your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16E0FF] via-[#4C8DFF] to-[#35E7FF]">
                  future.
                </span>
              </h1>

              {/* Concise Value Proposition */}
              <p className="text-base sm:text-lg text-[#91A4BD] max-w-2xl leading-relaxed font-normal">
                SkillBridge AI analyzes your skills, identifies your gaps, and creates a personalized path to the opportunities you are ready for next.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-btn-discover-skills"
                  onClick={onGetStarted}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] font-bold text-sm shadow-[0_0_25px_rgba(22,224,255,0.4)] hover:shadow-[0_0_35px_rgba(53,231,255,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Discover My Skills</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-btn-explore"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-xl bg-[#0A1B33]/80 hover:bg-[#0D2442] text-[#F4FAFF] border border-[rgba(75,180,220,0.35)] hover:border-[#16E0FF] text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <span>Explore SkillBridge</span>
                  <ChevronRight className="w-4 h-4 text-[#16E0FF]" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[rgba(75,180,220,0.18)]">
                <div className="flex items-center gap-2 text-xs text-[#91A4BD]">
                  <div className="w-6 h-6 rounded-lg bg-[#16E0FF]/10 border border-[#16E0FF]/30 flex items-center justify-center text-[#16E0FF] shrink-0">
                    <BrainCircuit className="w-3.5 h-3.5" />
                  </div>
                  <span>AI-powered recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#91A4BD]">
                  <div className="w-6 h-6 rounded-lg bg-[#00B8D9]/10 border border-[#00B8D9]/30 flex items-center justify-center text-[#00B8D9] shrink-0">
                    <Milestone className="w-3.5 h-3.5" />
                  </div>
                  <span>Personalized learning paths</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#91A4BD]">
                  <div className="w-6 h-6 rounded-lg bg-[#35E29A]/10 border border-[#35E29A]/30 flex items-center justify-center text-[#35E29A] shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span>Career-ready insights</span>
                </div>
              </div>
            </div>

            {/* Right Side (Col 8-12): Layered Futuristic Visual Composition */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              {/* Technological Circular Glow Halo */}
              <div className="absolute -inset-4 sm:-inset-8 rounded-full border border-[#16E0FF]/25 animate-pulse-slow pointer-events-none" />
              <div className="absolute -inset-10 sm:-inset-16 rounded-full border border-[#00B8D9]/15 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden glass-card p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[rgba(75,180,220,0.35)]">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-[#06152B]">
                  <img
                    src={heroImage}
                    alt="SkillBridge AI Student interacting with futuristic career intelligence holographic interface"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Cyan Rim & Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#020817]/60" />
                </div>

                {/* Floating Glass Card 1: Skill Match 94% (Top Left) */}
                <div className="absolute -top-3 -left-3 sm:top-4 sm:-left-6 glass-card-elevated rounded-2xl p-3 border border-[#16E0FF]/40 shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#16E0FF]/15 border border-[#16E0FF]/50 flex items-center justify-center text-[#35E7FF]">
                    <Target className="w-5 h-5 text-[#16E0FF]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#91A4BD]">Skill Match</div>
                    <div className="text-lg font-extrabold font-display text-[#35E7FF]">94%</div>
                  </div>
                </div>

                {/* Floating Glass Card 2: Career Readiness 87% (Top Right) */}
                <div className="absolute top-2 -right-3 sm:top-6 sm:-right-6 glass-card-elevated rounded-2xl p-3 border border-[#35E29A]/40 shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float-delayed flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#35E29A]/15 border border-[#35E29A]/50 flex items-center justify-center text-[#35E29A]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#91A4BD]">Career Readiness</div>
                    <div className="text-lg font-extrabold font-display text-[#35E29A]">87%</div>
                  </div>
                </div>

                {/* Floating Glass Card 3: Skills Identified 18 (Bottom Left) */}
                <div className="absolute -bottom-3 -left-2 sm:bottom-4 sm:-left-4 glass-card-elevated rounded-2xl p-3 border border-[#4C8DFF]/40 shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4C8DFF]/15 border border-[#4C8DFF]/50 flex items-center justify-center text-[#4C8DFF]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#91A4BD]">Skills Identified</div>
                    <div className="text-base font-extrabold font-display text-[#F4FAFF]">18 Verified</div>
                  </div>
                </div>

                {/* Floating Glass Card 4: AI Skill Analysis (Bottom Right) */}
                <div className="absolute -bottom-6 -right-2 sm:bottom-2 sm:-right-4 glass-card-elevated rounded-2xl p-4 border border-[rgba(75,180,220,0.4)] shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-56 sm:w-64 animate-float-delayed hidden sm:block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#F4FAFF] flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-[#16E0FF]" />
                      AI Skill Analysis
                    </span>
                    <span className="text-[10px] font-mono text-[#35E7FF] bg-[#16E0FF]/15 px-1.5 py-0.5 rounded-sm">
                      Live
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <div className="flex justify-between text-[#91A4BD] mb-0.5">
                        <span>JavaScript</span>
                        <span className="text-[#F4FAFF] font-mono">88%</span>
                      </div>
                      <div className="w-full bg-[#06152B] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#16E0FF] h-full rounded-full w-[88%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#91A4BD] mb-0.5">
                        <span>Communication</span>
                        <span className="text-[#F4FAFF] font-mono">92%</span>
                      </div>
                      <div className="w-full bg-[#06152B] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#35E7FF] h-full rounded-full w-[92%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#91A4BD] mb-0.5">
                        <span>Problem Solving</span>
                        <span className="text-[#F4FAFF] font-mono">95%</span>
                      </div>
                      <div className="w-full bg-[#06152B] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#35E29A] h-full rounded-full w-[95%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. PRIMARY PRODUCT VALUE SECTION                         */}
      {/* ======================================================== */}
      <section id="skills-value" className="relative py-20 border-t border-[rgba(75,180,220,0.15)] bg-[#020817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#06152B] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] text-xs font-mono font-semibold">
              <Network className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
              Your skills are more connected than you think.
            </h2>
            <p className="text-base text-[#91A4BD] leading-relaxed">
              SkillBridge AI turns fragmented experience, education, interests, and goals into a clear map of where you are now—and where you can go next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 — Discover */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#16E0FF]/10 border border-[#16E0FF]/30 flex items-center justify-center text-[#16E0FF] mb-5 group-hover:shadow-[0_0_15px_rgba(22,224,255,0.3)] transition-all">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono font-bold text-[#16E0FF] uppercase tracking-wider mb-1">
                Phase 01
              </div>
              <h3 className="text-lg font-bold text-[#F4FAFF] mb-2 font-display group-hover:text-[#35E7FF] transition-colors">
                Discover Your Skills
              </h3>
              <p className="text-xs text-[#91A4BD] leading-relaxed">
                Identify technical, professional, and transferable skills from your projects, coursework, and practical experience.
              </p>
            </div>

            {/* Card 2 — Analyze */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#00B8D9]/10 border border-[#00B8D9]/30 flex items-center justify-center text-[#00B8D9] mb-5 group-hover:shadow-[0_0_15px_rgba(0,184,217,0.3)] transition-all">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono font-bold text-[#00B8D9] uppercase tracking-wider mb-1">
                Phase 02
              </div>
              <h3 className="text-lg font-bold text-[#F4FAFF] mb-2 font-display group-hover:text-[#00B8D9] transition-colors">
                Understand Your Gaps
              </h3>
              <p className="text-xs text-[#91A4BD] leading-relaxed">
                See which skills are holding you back from your target opportunities with benchmarked industry criteria.
              </p>
            </div>

            {/* Card 3 — Bridge */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/30 flex items-center justify-center text-[#4C8DFF] mb-5 group-hover:shadow-[0_0_15px_rgba(76,141,255,0.3)] transition-all">
                <Milestone className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono font-bold text-[#4C8DFF] uppercase tracking-wider mb-1">
                Phase 03
              </div>
              <h3 className="text-lg font-bold text-[#F4FAFF] mb-2 font-display group-hover:text-[#4C8DFF] transition-colors">
                Build Your Path
              </h3>
              <p className="text-xs text-[#91A4BD] leading-relaxed">
                Get a personalized learning roadmap designed around your specific career targets, timeline, and strengths.
              </p>
            </div>

            {/* Card 4 — Advance */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#35E29A]/10 border border-[#35E29A]/30 flex items-center justify-center text-[#35E29A] mb-5 group-hover:shadow-[0_0_15px_rgba(53,226,154,0.3)] transition-all">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono font-bold text-[#35E29A] uppercase tracking-wider mb-1">
                Phase 04
              </div>
              <h3 className="text-lg font-bold text-[#F4FAFF] mb-2 font-display group-hover:text-[#35E29A] transition-colors">
                Find Your Opportunities
              </h3>
              <p className="text-xs text-[#91A4BD] leading-relaxed">
                Connect your evolving skill profile with relevant roles, projects, internships, and verified learning opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. AI SKILL ASSESSMENT DASHBOARD SECTION                 */}
      {/* ======================================================== */}
      <section id="ai-assessment" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Glass Panel */}
          <div className="glass-card-elevated rounded-3xl p-6 sm:p-10 lg:p-12 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Side: Score & Core Metrics */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16E0FF]/10 border border-[#16E0FF]/30 text-[#16E0FF] text-xs font-mono font-semibold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>AI SKILL ASSESSMENT</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                  Know exactly where you stand.
                </h2>

                <p className="text-sm text-[#91A4BD] leading-relaxed">
                  SkillBridge AI evaluates your verified abilities across codebases, projects, and academic background to produce an actionable, objective readiness index.
                </p>

                {/* Radial / Circular Score Block */}
                <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.25)]">
                  {/* Circular SVG Gauge */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#0A1B33"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="url(#cyanGradient)"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * dynamicReadiness) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                      <defs>
                        <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#16E0FF" />
                          <stop offset="100%" stopColor="#35E7FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold font-display text-[#35E7FF]">
                        {dynamicReadiness}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold text-[#F4FAFF] uppercase tracking-wider">
                      Career Readiness
                    </div>
                    <div className="text-xs text-[#35E29A] font-medium mt-0.5">
                      +14% above national average
                    </div>
                    <p className="text-[11px] text-[#657A95] mt-1">
                      Ready for junior & mid entry-level interviews.
                    </p>
                  </div>
                </div>

                {/* Supporting Statistics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-center">
                    <div className="text-xl font-bold font-display text-[#16E0FF]">16</div>
                    <div className="text-[10px] text-[#91A4BD] uppercase font-mono mt-0.5">Detected</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-center">
                    <div className="text-xl font-bold font-display text-[#35E29A]">5</div>
                    <div className="text-[10px] text-[#91A4BD] uppercase font-mono mt-0.5">Strengths</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-center">
                    <div className="text-xl font-bold font-display text-amber-400">4</div>
                    <div className="text-[10px] text-[#91A4BD] uppercase font-mono mt-0.5">Growth Areas</div>
                  </div>
                </div>

                {/* Interactive Simulator Slider */}
                <div className="p-4 rounded-2xl bg-[#0A1B33]/80 border border-[rgba(75,180,220,0.25)] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#F4FAFF]">Simulate Milestone Completion</span>
                    <span className="text-[#35E7FF] font-mono font-bold">+{interactiveSkillBoost}% Boost</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={interactiveSkillBoost}
                    onChange={(e) => setInteractiveSkillBoost(Number(e.target.value))}
                    className="w-full accent-[#16E0FF] bg-[#06152B] cursor-pointer h-1.5 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#657A95] font-mono">
                    <span>Baseline (82%)</span>
                    <span>Fully Ready (98%)</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Skill Analysis Dashboard */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(75,180,220,0.2)]">
                  <span className="text-xs font-mono font-bold text-[#F4FAFF] uppercase tracking-wider">
                    Competency Breakdown
                  </span>
                  <div className="flex gap-1.5">
                    {(['all', 'technical', 'soft'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveSkillCategory(cat)}
                        className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg capitalize transition-colors ${
                          activeSkillCategory === cat
                            ? 'bg-[#16E0FF] text-[#020817]'
                            : 'text-[#91A4BD] hover:text-[#F4FAFF] bg-[#0A1B33]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Bars */}
                <div className="space-y-4 pt-2">
                  {/* Problem Solving */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">Problem Solving</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35E29A]/15 text-[#35E29A] font-bold">
                          Strong
                        </span>
                        <span className="text-xs font-mono font-bold text-[#35E7FF]">92%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#16E0FF] to-[#35E29A] h-full rounded-full w-[92%]" />
                    </div>
                  </div>

                  {/* AI Literacy */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">AI & Prompt Engineering</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35E29A]/15 text-[#35E29A] font-bold">
                          Strong
                        </span>
                        <span className="text-xs font-mono font-bold text-[#35E7FF]">88%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] h-full rounded-full w-[88%]" />
                    </div>
                  </div>

                  {/* Communication */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">Communication</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35E29A]/15 text-[#35E29A] font-bold">
                          Strong
                        </span>
                        <span className="text-xs font-mono font-bold text-[#35E7FF]">84%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#16E0FF] to-[#35E29A] h-full rounded-full w-[84%]" />
                    </div>
                  </div>

                  {/* JavaScript */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">JavaScript & TypeScript</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16E0FF]/15 text-[#35E7FF] font-bold">
                          Developing
                        </span>
                        <span className="text-xs font-mono font-bold text-[#35E7FF]">78%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#16E0FF] to-[#4C8DFF] h-full rounded-full w-[78%]" />
                    </div>
                  </div>

                  {/* Data Analysis */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">Data Analysis & SQL</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16E0FF]/15 text-[#35E7FF] font-bold">
                          Developing
                        </span>
                        <span className="text-xs font-mono font-bold text-[#35E7FF]">71%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#16E0FF] to-[#00B8D9] h-full rounded-full w-[71%]" />
                    </div>
                  </div>

                  {/* Leadership */}
                  <div className="p-3.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#F4FAFF]">Technical Leadership</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold">
                          Priority
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">64%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full w-[64%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. PERSONALIZED SKILL BRIDGE SECTION                     */}
      {/* ======================================================== */}
      <section id="skill-bridge-path" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] bg-[#020817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#06152B] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] text-xs font-mono font-semibold">
              <Milestone className="w-3.5 h-3.5" />
              <span>DYNAMIC CAREER MAPPING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
              From where you are to where you want to be.
            </h2>
            <p className="text-base text-[#91A4BD] leading-relaxed">
              Select a target role to visualize how SkillBridge AI creates a structured bridge connecting your current capabilities to high-paying opportunities.
            </p>

            {/* Target Role Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {careerJourneys.map((journey, idx) => (
                <button
                  key={journey.title}
                  onClick={() => setSelectedRoleIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleIndex === idx
                      ? 'bg-[#16E0FF] text-[#020817] shadow-[0_0_15px_rgba(22,224,255,0.4)] font-bold'
                      : 'bg-[#0A1B33] text-[#91A4BD] hover:text-[#F4FAFF] border border-[rgba(75,180,220,0.2)]'
                  }`}
                >
                  {journey.title}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Journey / Map: Horizontal on Desktop, Vertical on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
            {/* Step 1: Current Skills */}
            <div className="glass-card rounded-2xl p-6 border-t-2 border-t-[#16E0FF] relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#16E0FF]">Step 01</span>
                  <div className="w-7 h-7 rounded-lg bg-[#16E0FF]/15 text-[#16E0FF] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] mb-3 font-display">Your Current Skills</h3>
                <div className="space-y-2">
                  {currentJourney.currentSkills.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-2 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-xs text-[#35E7FF] font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16E0FF]" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-[#657A95] font-mono mt-4 pt-3 border-t border-[rgba(75,180,220,0.15)]">
                Verified from resume parsing
              </div>
            </div>

            {/* Step 2: Skill Gaps */}
            <div className="glass-card rounded-2xl p-6 border-t-2 border-t-amber-400 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400">Step 02</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] mb-3 font-display">Identified Skill Gaps</h3>
                <div className="space-y-2">
                  {currentJourney.skillGaps.map((gap) => (
                    <div
                      key={gap}
                      className="px-3 py-2 rounded-xl bg-[#06152B] border border-amber-500/20 text-xs text-amber-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-[#657A95] font-mono mt-4 pt-3 border-t border-[rgba(75,180,220,0.15)]">
                High leverage screening criteria
              </div>
            </div>

            {/* Step 3: Learning Path */}
            <div className="glass-card rounded-2xl p-6 border-t-2 border-t-[#00B8D9] relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#00B8D9]">Step 03</span>
                  <div className="w-7 h-7 rounded-lg bg-[#00B8D9]/15 text-[#00B8D9] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] mb-3 font-display">Personalized Roadmap</h3>
                <div className="space-y-2">
                  {currentJourney.learningPath.map((path) => (
                    <div
                      key={path.title}
                      className="p-2.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-xs"
                    >
                      <div className="text-[#F4FAFF] font-semibold truncate">{path.title}</div>
                      <div className="text-[10px] text-[#16E0FF] font-mono">{path.weeks}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-[#657A95] font-mono mt-4 pt-3 border-t border-[rgba(75,180,220,0.15)]">
                Includes portfolio sandbox projects
              </div>
            </div>

            {/* Step 4: Career Goal Target */}
            <div className="glass-card-elevated rounded-2xl p-6 border-t-2 border-t-[#35E29A] relative flex flex-col justify-between bg-gradient-to-b from-[#0A1B33] to-[#06152B]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#35E29A]">Target Reached</span>
                  <div className="w-7 h-7 rounded-lg bg-[#35E29A]/15 text-[#35E29A] flex items-center justify-center">
                    <Rocket className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#35E29A] mb-1 font-display">
                  {currentJourney.title}
                </h3>
                <div className="text-sm font-extrabold text-[#F4FAFF] font-mono mt-2">
                  {currentJourney.salary}
                </div>
                <div className="text-xs text-[#35E7FF] font-medium mt-1">
                  Demand: {currentJourney.demand}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#020817] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#91A4BD] leading-relaxed">
                <span className="text-[#16E0FF] font-bold block mb-1">AI Recommendation:</span>
                {currentJourney.insight}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. AI RECOMMENDATIONS SECTION                            */}
      {/* ======================================================== */}
      <section id="ai-recommendations" className="relative py-20 border-t border-[rgba(75,180,220,0.15)] bg-[#06152B]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1B33] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] text-xs font-mono font-semibold mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>DYNAMIC FEED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                Recommendations built around you.
              </h2>
            </div>
            <p className="text-xs text-[#91A4BD] max-w-md">
              Real-time opportunity, curriculum, and project cards ranked dynamically based on your identified capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Opportunity Card */}
            <div className="glass-card rounded-2xl p-6 border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#16E0FF]/15 text-[#35E7FF] font-bold">
                    Opportunity
                  </span>
                  <span className="text-xs font-bold font-mono text-[#35E29A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    94% Match
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F4FAFF] font-display group-hover:text-[#35E7FF] transition-colors">
                  Frontend Developer Intern
                </h3>
                <p className="text-xs text-[#91A4BD] mt-1 mb-4">
                  CognitiveScale AI Labs • San Francisco / Remote
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#91A4BD]">
                    React
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#91A4BD]">
                    TypeScript
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#91A4BD]">
                    REST APIs
                  </span>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl bg-[#0A1B33] hover:bg-[#16E0FF] hover:text-[#020817] text-[#35E7FF] border border-[rgba(22,224,255,0.3)] hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Opportunity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Learning Card */}
            <div className="glass-card rounded-2xl p-6 border border-[rgba(75,180,220,0.25)] hover:border-[#00B8D9] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#00B8D9]/15 text-[#00B8D9] font-bold">
                    Learning Path
                  </span>
                  <span className="text-xs font-bold font-mono text-[#16E0FF]">In Progress</span>
                </div>
                <h3 className="text-lg font-bold text-[#F4FAFF] font-display group-hover:text-[#00B8D9] transition-colors">
                  Master React in 21 Days
                </h3>
                <p className="text-xs text-[#91A4BD] mt-1 mb-4">
                  Interactive curriculum with real portfolio build tests
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#91A4BD]">Milestone 4 of 9</span>
                    <span className="text-[#35E7FF] font-bold">42%</span>
                  </div>
                  <div className="w-full bg-[#06152B] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00B8D9] h-full rounded-full w-[42%]" />
                  </div>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl bg-[#0A1B33] hover:bg-[#00B8D9] hover:text-[#020817] text-[#00B8D9] border border-[rgba(0,184,217,0.3)] hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Project Card */}
            <div className="glass-card rounded-2xl p-6 border border-[rgba(75,180,220,0.25)] hover:border-[#35E29A] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#35E29A]/15 text-[#35E29A] font-bold">
                    Portfolio Project
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-300">Intermediate</span>
                </div>
                <h3 className="text-lg font-bold text-[#F4FAFF] font-display group-hover:text-[#35E29A] transition-colors">
                  Build an AI Resume Analyzer
                </h3>
                <p className="text-xs text-[#91A4BD] mt-1 mb-4">
                  Full-stack TypeScript app with Gemini API integration
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#35E29A]">
                    AI LLMs
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#35E29A]">
                    React
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[11px] text-[#35E29A]">
                    Express API
                  </span>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl bg-[#0A1B33] hover:bg-[#35E29A] hover:text-[#020817] text-[#35E29A] border border-[rgba(53,226,154,0.3)] hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. HOW IT WORKS SECTION                                 */}
      {/* ======================================================== */}
      <section id="how-it-works" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] bg-[#020817] tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-elevated rounded-3xl p-8 sm:p-12 border border-[rgba(75,180,220,0.25)] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wider">
                5-STEP INTELLIGENCE FLOW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                How SkillBridge AI works
              </h2>
              <p className="text-sm text-[#91A4BD]">
                A seamless process taking you from initial resume parsing to certified career readiness.
              </p>
            </div>

            {/* 5-Step Process: Horizontal on Desktop, Vertical on Mobile */}
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Connecting glowing line for desktop */}
              <div className="hidden md:block absolute top-7 left-10 right-10 h-[2px] bg-gradient-to-r from-[#16E0FF] via-[#00B8D9] to-[#35E29A] opacity-40 -z-0" />

              {/* Step 1 */}
              <div className="relative z-10 text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#06152B] border border-[#16E0FF]/60 group-hover:border-[#16E0FF] text-[#16E0FF] flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_15px_rgba(22,224,255,0.3)] transition-all">
                  01
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display">Profile</h3>
                <p className="text-xs text-[#91A4BD] leading-relaxed">
                  Tell us about your experience, education, interests, and career goals.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#06152B] border border-[#00B8D9]/60 group-hover:border-[#00B8D9] text-[#00B8D9] flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_15px_rgba(0,184,217,0.3)] transition-all">
                  02
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display">Assess</h3>
                <p className="text-xs text-[#91A4BD] leading-relaxed">
                  AI analyzes your existing coursework and projects for verified skills.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#06152B] border border-[#4C8DFF]/60 group-hover:border-[#4C8DFF] text-[#4C8DFF] flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_15px_rgba(76,141,255,0.3)] transition-all">
                  03
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display">Identify</h3>
                <p className="text-xs text-[#91A4BD] leading-relaxed">
                  SkillBridge benchmarks against industry criteria to find missing gaps.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#06152B] border border-[#35E7FF]/60 group-hover:border-[#35E7FF] text-[#35E7FF] flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_15px_rgba(53,231,255,0.3)] transition-all">
                  04
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display">Bridge</h3>
                <p className="text-xs text-[#91A4BD] leading-relaxed">
                  AI synthesizes a personalized learning and project sandbox roadmap.
                </p>
              </div>

              {/* Step 5 */}
              <div className="relative z-10 text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#06152B] border border-[#35E29A]/60 group-hover:border-[#35E29A] text-[#35E29A] flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_15px_rgba(53,226,154,0.3)] transition-all">
                  05
                </div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display">Advance</h3>
                <p className="text-xs text-[#91A4BD] leading-relaxed">
                  Track progress, run mock interviews, and apply directly to matched roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. CAREER OPPORTUNITIES SECTION                         */}
      {/* ======================================================== */}
      <section id="opportunities" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] bg-[#020817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06152B] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] text-xs font-mono font-semibold mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                <span>ECOSYSTEM CONNECTIONS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                Turn skills into real opportunities.
              </h2>
            </div>

            {/* Filter categories */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Internships', 'Jobs', 'Hackathons', 'Projects', 'Mentorship'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setOpportunityFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    opportunityFilter === cat
                      ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_12px_rgba(22,224,255,0.3)]'
                      : 'bg-[#0A1B33] text-[#91A4BD] hover:text-[#F4FAFF] border border-[rgba(75,180,220,0.2)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((op) => (
              <div
                key={op.id}
                className="glass-card rounded-2xl p-6 border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A1B33] text-[#16E0FF] border border-[rgba(75,180,220,0.2)]">
                      {op.category}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-[#35E7FF] bg-[#16E0FF]/15 px-2.5 py-0.5 rounded-full border border-[#16E0FF]/30">
                      {op.match}% Match
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F4FAFF] font-display group-hover:text-[#35E7FF] transition-colors">
                    {op.title}
                  </h3>
                  <div className="text-xs text-[#91A4BD] mt-0.5">{op.company}</div>
                  <div className="text-[11px] text-[#657A95] font-mono mt-0.5 mb-4">{op.location}</div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {op.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-[#06152B] border border-[rgba(75,180,220,0.15)] text-[11px] text-[#91A4BD]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(75,180,220,0.15)]">
                  <span className="text-xs font-mono text-[#35E29A] font-semibold">{op.stipend}</span>
                  <button
                    onClick={onGetStarted}
                    className="p-2 rounded-xl bg-[#0A1B33] hover:bg-[#16E0FF] text-[#16E0FF] hover:text-[#020817] transition-all"
                    aria-label="View Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12. SUCCESS / IMPACT STATISTICS                          */}
      {/* ======================================================== */}
      <section className="relative py-20 border-t border-[rgba(75,180,220,0.15)] bg-[#06152B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card-elevated rounded-2xl p-6 text-center border border-[rgba(75,180,220,0.25)] hover:border-[#16E0FF] transition-all">
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] text-glow-cyan mb-2">
                25K+
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#F4FAFF] font-semibold">
                Skills Assessed
              </div>
              <div className="text-[11px] text-[#657A95] mt-1">Validated across 12 disciplines</div>
            </div>

            <div className="glass-card-elevated rounded-2xl p-6 text-center border border-[rgba(75,180,220,0.25)] hover:border-[#00B8D9] transition-all">
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-[#16E0FF] mb-2">
                8.5K+
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#F4FAFF] font-semibold">
                Learning Paths Created
              </div>
              <div className="text-[11px] text-[#657A95] mt-1">Personalized milestones completed</div>
            </div>

            <div className="glass-card-elevated rounded-2xl p-6 text-center border border-[rgba(75,180,220,0.25)] hover:border-[#35E29A] transition-all">
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-[#35E29A] to-[#16E0FF] mb-2">
                92%
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#F4FAFF] font-semibold">
                Recommendation Relevance
              </div>
              <div className="text-[11px] text-[#657A95] mt-1">Ranked by hiring recruiters</div>
            </div>

            <div className="glass-card-elevated rounded-2xl p-6 text-center border border-[rgba(75,180,220,0.25)] hover:border-amber-400 transition-all">
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#16E0FF] mb-2">
                4.8/5
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#F4FAFF] font-semibold">
                User Satisfaction
              </div>
              <div className="text-[11px] text-[#657A95] mt-1">From 4,200+ student reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 13. TESTIMONIAL / SUCCESS STORY SECTION                  */}
      {/* ======================================================== */}
      <section id="success-stories" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] bg-[#020817] tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06152B] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] text-xs font-mono font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#16E0FF]" />
              <span>STUDENT OUTCOMES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
              People don't need more information. They need direction.
            </h2>
            <p className="text-sm text-[#91A4BD]">
              Real student stories from campus to tech industry placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className={`glass-card rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  activeTestimonial === idx
                    ? 'border-[#16E0FF] shadow-[0_0_25px_rgba(22,224,255,0.2)] -translate-y-1'
                    : 'border-[rgba(75,180,220,0.2)]'
                }`}
                onClick={() => setActiveTestimonial(idx)}
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#F4FAFF] leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(75,180,220,0.18)] flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#16E0FF]/40 shrink-0"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#F4FAFF] font-display">{t.name}</div>
                    <div className="text-[11px] text-[#91A4BD]">{t.role}</div>
                    <div className="text-[10px] font-mono text-[#35E29A] font-semibold mt-0.5">
                      ✓ {t.outcome}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 14. AI INSIGHT / FEATURE HIGHLIGHT (Skill Graph)         */}
      {/* ======================================================== */}
      <section id="ai-skill-pattern" className="relative py-24 border-t border-[rgba(75,180,220,0.15)] bg-[#020817] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-elevated rounded-3xl p-8 sm:p-12 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Background AI Network Art */}
            <div className="absolute inset-0 opacity-25">
              <img
                src={networkImage}
                alt="AI Skill Network Graph"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/80 to-transparent" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16E0FF]/15 border border-[#16E0FF]/35 text-[#35E7FF] text-xs font-mono font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-[#16E0FF]" />
                  <span>GRAPH INTELLIGENCE</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                  Your career has a pattern. Let AI find it.
                </h2>

                <p className="text-sm text-[#91A4BD] leading-relaxed">
                  Traditional keyword searches miss latent talent. SkillBridge AI constructs a multi-dimensional semantic graph connecting disparate coursework, projects, and soft skills directly into market-demanded roles.
                </p>

                {/* Floating AI Insight Card */}
                <div className="p-4 rounded-2xl bg-[#06152B]/90 backdrop-blur-md border border-[#16E0FF]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#35E7FF]" />
                    <span className="text-xs font-mono font-bold text-[#35E7FF] uppercase">AI Insight</span>
                  </div>
                  <p className="text-xs text-[#F4FAFF] leading-relaxed">
                    "Your combination of frontend development + communication makes you a strong candidate for AI product roles."
                  </p>
                </div>
              </div>

              {/* Interactive Visual Graph Nodes */}
              <div className="lg:col-span-6 relative flex items-center justify-center p-4">
                <div className="relative w-full max-w-md h-72 rounded-2xl bg-[#06152B]/70 border border-[rgba(75,180,220,0.3)] p-4 flex flex-wrap items-center justify-center gap-3">
                  {[
                    { label: 'React', level: 'High Match', color: 'border-[#16E0FF] text-[#16E0FF]' },
                    { label: 'Python', level: 'Growing', color: 'border-[#4C8DFF] text-[#4C8DFF]' },
                    { label: 'Communication', level: 'Key Asset', color: 'border-[#35E29A] text-[#35E29A]' },
                    { label: 'AI LLMs', level: 'High Demand', color: 'border-[#35E7FF] text-[#35E7FF]' },
                    { label: 'Data & SQL', level: 'Foundational', color: 'border-[#00B8D9] text-[#00B8D9]' },
                    { label: 'Leadership', level: 'Differentiator', color: 'border-amber-400 text-amber-300' },
                    { label: 'UI / UX', level: 'High Fidelity', color: 'border-[#16E0FF] text-[#16E0FF]' },
                    { label: 'Cloud Architecture', level: 'Recommended', color: 'border-[#4C8DFF] text-[#4C8DFF]' },
                  ].map((node) => (
                    <div
                      key={node.label}
                      className={`px-3 py-2 rounded-xl bg-[#0A1B33]/80 border ${node.color} text-xs font-semibold shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{node.label}</span>
                    </div>
                  ))}
                  <div className="w-full text-center text-[10px] font-mono text-[#657A95] mt-2">
                    Interconnected Vector Nodes • 98.4% Semantic Clustering
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 15. FINAL CONVERSION CTA SECTION                         */}
      {/* ======================================================== */}
      <section className="relative py-24 border-t border-[rgba(75,180,220,0.18)] bg-gradient-to-b from-[#020817] via-[#06152B] to-[#020817] text-center overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[25rem] bg-[#16E0FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A1B33] border border-[#16E0FF]/40 text-[#35E7FF] text-xs font-mono font-bold shadow-[0_0_15px_rgba(22,224,255,0.25)]">
            <Rocket className="w-3.5 h-3.5 text-[#16E0FF]" />
            <span>START YOUR CAREER READINESS JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#F4FAFF] tracking-tight leading-tight">
            Your next opportunity starts with understanding your skills.
          </h2>

          <p className="text-base sm:text-lg text-[#91A4BD] max-w-2xl mx-auto leading-relaxed">
            Discover your strengths, close your gaps, and build a path toward the future you want.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-btn-start-journey"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] font-extrabold text-sm shadow-[0_0_30px_rgba(22,224,255,0.45)] hover:shadow-[0_0_45px_rgba(53,231,255,0.65)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start My Skill Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="cta-btn-explore-platform"
              onClick={onTryDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0A1B33] hover:bg-[#0D2442] text-[#F4FAFF] border border-[rgba(75,180,220,0.35)] hover:border-[#16E0FF] text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <Sparkles className="w-4 h-4 text-[#16E0FF]" />
              <span>Explore Platform (Demo Mode)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
