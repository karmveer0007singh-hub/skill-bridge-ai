import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Milestone,
  Layers,
  BrainCircuit,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Award,
} from 'lucide-react';
import { SkillGauge } from '../components/SkillGauge';
import { SkillChart } from '../components/SkillChart';
import { StudentProfile } from '../types';
import { getRecentActivities } from '../services/authService';

interface DashboardPageProps {
  user: StudentProfile | null;
  onNavigate: (tab: string) => void;
  onSelectCareerChange: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  onSelectCareerChange,
}) => {
  const analysis = user?.analysis;
  const roadmap = user?.roadmap || [];
  const currentSkills = analysis?.currentSkills || [];
  const skillGaps = analysis?.skillGaps || [];
  const readinessScore = user?.readinessScore || analysis?.readinessScore || 70;
  const targetCareer = user?.targetCareer || 'Frontend Developer';
  const activities = getRecentActivities();

  // Calculate Roadmap Progress
  const totalRoadmapSteps = roadmap.length;
  const completedRoadmapSteps = roadmap.filter((s) => s.status === 'completed').length;
  const inProgressRoadmapSteps = roadmap.filter((s) => s.status === 'in-progress').length;
  const roadmapCompletion =
    totalRoadmapSteps > 0
      ? Math.round(((completedRoadmapSteps + inProgressRoadmapSteps * 0.3) / totalRoadmapSteps) * 100)
      : 0;

  // Next recommended task
  const nextStep =
    roadmap.find((s) => s.status === 'in-progress') ||
    roadmap.find((s) => s.status === 'not-started') ||
    roadmap[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Student Welcome Banner */}
      <div className="glass-card-elevated rounded-3xl p-6 sm:p-8 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-8 relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#16E0FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.name || 'Student'}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16E0FF]/40 shadow-md shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#0D2442] border-2 border-[#16E0FF] text-[#16E0FF] flex items-center justify-center font-display font-extrabold text-2xl shrink-0 shadow-[0_0_15px_rgba(22,224,255,0.3)]">
                {user?.name?.charAt(0) || 'S'}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#16E0FF]/15 border border-[#16E0FF]/30 text-[#35E7FF] text-xs font-mono font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 text-[#16E0FF]" />
                  {user?.college || 'University CS Undergrad'}
                </span>
                {user?.isDemo && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold">
                    <Sparkles className="w-3 h-3" />
                    Demo Mode Active
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F4FAFF] tracking-tight">
                Welcome back, {user?.name || 'Student Candidate'}!
              </h1>

              <p className="text-xs sm:text-sm text-[#91A4BD] mt-1 flex items-center gap-2">
                <span>Target Track:</span>
                <strong className="text-[#16E0FF] font-mono">
                  {targetCareer}
                </strong>
                <button
                  onClick={onSelectCareerChange}
                  className="text-xs text-[#35E7FF] hover:text-[#F4FAFF] underline font-semibold ml-1 cursor-pointer"
                >
                  Change Role
                </button>
              </p>
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-btn-continue-roadmap"
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(22,224,255,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Milestone className="w-4 h-4" />
              Continue Roadmap
            </button>
            <button
              id="dash-btn-start-interview"
              onClick={() => onNavigate('interview')}
              className="px-4 py-2.5 bg-[#0D2442] hover:bg-[#123158] text-[#F4FAFF] font-bold text-xs rounded-xl border border-[rgba(75,180,220,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.4)]"
            >
              <BrainCircuit className="w-4 h-4 text-[#35E7FF]" />
              AI Mock Interview
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Readiness Gauge */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider block">
              Career Readiness
            </span>
            <span className="text-3xl font-extrabold text-[#F4FAFF] font-display block mt-1">
              {readinessScore}%
            </span>
            <span className="text-[11px] text-[#35E29A] font-semibold flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              {readinessScore >= 80 ? 'Hiring Ready' : 'Competitive Candidate'}
            </span>
          </div>
          <SkillGauge score={readinessScore} size="sm" />
        </div>

        {/* Metric 2: Verified Skills */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">
              Verified Skills
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#35E29A]/15 text-[#35E29A] flex items-center justify-center border border-[#35E29A]/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[#F4FAFF] font-display">
              {currentSkills.length}
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">Skills extracted from resume</p>
          </div>
          <button
            onClick={() => onNavigate('skill-gaps')}
            className="text-xs font-bold text-[#35E7FF] hover:text-[#F4FAFF] flex items-center gap-1 mt-2 cursor-pointer"
          >
            View verified skills <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Critical Gaps */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">
              Skill Gaps
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-amber-400 font-display">
              {skillGaps.length}
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">
              {skillGaps.filter((g) => g.priority === 'High').length} High priority items
            </p>
          </div>
          <button
            onClick={() => onNavigate('skill-gaps')}
            className="text-xs font-bold text-[#35E7FF] hover:text-[#F4FAFF] flex items-center gap-1 mt-2 cursor-pointer"
          >
            Explore gap matrix <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Roadmap Completion */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">
              Roadmap Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#16E0FF]/15 text-[#16E0FF] flex items-center justify-center border border-[#16E0FF]/30">
              <Milestone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[#16E0FF] font-display">
              {roadmapCompletion}%
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">
              {completedRoadmapSteps} of {totalRoadmapSteps} milestones done
            </p>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-bold text-[#35E7FF] hover:text-[#F4FAFF] flex items-center gap-1 mt-2 cursor-pointer"
          >
            Update progress <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Chart & Next Action on Left (8 Cols), Activity & Shortcuts on Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Chart & Next Milestone */}
        <div className="lg:col-span-8 space-y-6">
          {/* Skill Visualization Matrix */}
          <SkillChart
            currentSkills={currentSkills}
            skillGaps={skillGaps}
            targetCareer={targetCareer}
          />

          {/* Next Recommended Milestone Action Card */}
          {nextStep && (
            <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Recommended Next Learning Step
                </span>
                <span className="text-xs font-mono text-[#657A95]">
                  Estimated {nextStep.estimatedDuration}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F4FAFF] font-display">
                Step {nextStep.stepNumber}: {nextStep.title} ({nextStep.skill})
              </h3>
              <p className="text-xs text-[#91A4BD] mt-1 leading-relaxed">{nextStep.description}</p>

              <div className="mt-4 p-3.5 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] flex items-start gap-3">
                <Award className="w-4 h-4 text-[#16E0FF] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#F4FAFF] block">Hands-on Challenge</span>
                  <span className="text-xs text-[#91A4BD]">{nextStep.practiceTask}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[rgba(75,180,220,0.18)]">
                <span className="text-xs text-[#91A4BD]">
                  Status: <strong className="text-[#35E7FF] capitalize font-mono">{nextStep.status}</strong>
                </span>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="flex items-center gap-1 text-xs font-bold text-[#16E0FF] hover:text-[#35E7FF] cursor-pointer"
                >
                  Go to full roadmap <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Shortcuts & Recent Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider mb-3">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('upload')}
                className="w-full p-3 rounded-2xl border border-[rgba(75,180,220,0.2)] hover:border-[#16E0FF] hover:bg-[#0D2442] text-left transition-all flex items-center justify-between text-xs font-bold text-[#F4FAFF] group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#16E0FF]" />
                  Re-Analyze / Upload Resume
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#657A95] group-hover:text-[#16E0FF] transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('skill-gaps')}
                className="w-full p-3 rounded-2xl border border-[rgba(75,180,220,0.2)] hover:border-[#16E0FF] hover:bg-[#0D2442] text-left transition-all flex items-center justify-between text-xs font-bold text-[#F4FAFF] group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Prioritized Skill Gaps
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#657A95] group-hover:text-[#16E0FF] transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full p-3 rounded-2xl border border-[rgba(75,180,220,0.2)] hover:border-[#16E0FF] hover:bg-[#0D2442] text-left transition-all flex items-center justify-between text-xs font-bold text-[#F4FAFF] group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-[#35E29A]" />
                  Learning Roadmap
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#657A95] group-hover:text-[#16E0FF] transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('interview')}
                className="w-full p-3 rounded-2xl border border-[rgba(75,180,220,0.2)] hover:border-[#16E0FF] hover:bg-[#0D2442] text-left transition-all flex items-center justify-between text-xs font-bold text-[#F4FAFF] group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#35E7FF]" />
                  AI Mock Interview
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#657A95] group-hover:text-[#16E0FF] transition-colors" />
              </button>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.25)] text-[#16E0FF] flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'task_completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#35E29A]" />
                    ) : act.type === 'interview_completed' ? (
                      <BrainCircuit className="w-3.5 h-3.5 text-[#35E7FF]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#16E0FF]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F4FAFF]">{act.title}</h4>
                    <p className="text-[#91A4BD] text-[11px] leading-tight mt-0.5">{act.description}</p>
                    <span className="text-[10px] text-[#657A95] font-mono mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
