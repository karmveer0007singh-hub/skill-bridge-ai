import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Milestone,
  BrainCircuit,
  Filter,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { SkillGauge } from '../components/SkillGauge';
import { SkillChart } from '../components/SkillChart';
import { StudentProfile, PriorityLevel } from '../types';

interface SkillGapPageProps {
  user: StudentProfile | null;
  onNavigateRoadmap: () => void;
  onNavigateInterview: () => void;
  onReupload: () => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  user,
  onNavigateRoadmap,
  onNavigateInterview,
  onReupload,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const analysis = user?.analysis;
  const currentSkills = analysis?.currentSkills || [];
  const skillGaps = analysis?.skillGaps || [];
  const requiredSkills = analysis?.requiredSkills || [];
  const readinessScore = user?.readinessScore || analysis?.readinessScore || 70;
  const targetCareer = user?.targetCareer || analysis?.targetCareer || 'Frontend Developer';

  // Priority filtering
  const highGaps = skillGaps.filter((g) => g.priority === 'High');
  const mediumGaps = skillGaps.filter((g) => g.priority === 'Medium');
  const lowGaps = skillGaps.filter((g) => g.priority === 'Low');

  const filteredGaps =
    filterPriority === 'all'
      ? skillGaps
      : skillGaps.filter((g) => (g.priority || '').toLowerCase() === filterPriority.toLowerCase());

  // Helper to generate visual ASCII/block progress bar
  const renderVisualBlocks = (percentage: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const filled = '█'.repeat(Math.max(0, filledBlocks));
    const empty = '░'.repeat(Math.max(0, totalBlocks - filledBlocks));
    return (
      <span className="font-mono text-xs tracking-tighter">
        <span className="text-[#16E0FF] font-bold">{filled}</span>
        <span className="text-[#657A95]">{empty}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 glass-card-elevated rounded-3xl p-6 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div>
          <div className="flex items-center gap-2 text-[#16E0FF] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Target Career Gap Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4FAFF] font-display">
            Skill Gap Analysis for <span className="text-[#16E0FF]">{targetCareer}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#91A4BD] mt-1 max-w-2xl leading-relaxed">
            {analysis?.summary ||
              'Comparing your verified resume credentials against current industry hiring requirements.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-gap-to-roadmap"
            onClick={onNavigateRoadmap}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(22,224,255,0.35)] transition-all cursor-pointer"
          >
            <Milestone className="w-4 h-4" />
            View Learning Roadmap
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-gap-to-interview"
            onClick={onNavigateInterview}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#06152B] hover:bg-[#0D2442] border border-[rgba(75,180,220,0.3)] text-[#F4FAFF] text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4 text-[#16E0FF]" />
            Practice Interview
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Readiness Gauge Card */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex items-center justify-center">
          <SkillGauge
            score={readinessScore}
            size="md"
            label="Career Readiness Score"
            sublabel={readinessScore >= 80 ? 'Hiring Ready' : readinessScore >= 65 ? 'Competitive' : 'Needs Practice'}
          />
        </div>

        {/* Current Skills Count */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">Verified Skills</span>
            <div className="w-8 h-8 rounded-xl bg-[#35E29A]/15 text-[#35E29A] flex items-center justify-center border border-[#35E29A]/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F4FAFF] font-display">
              {currentSkills.length}
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">Found on your resume</p>
          </div>
          <div className="mt-3 pt-3 border-t border-[rgba(75,180,220,0.2)] flex items-center justify-between text-xs text-[#91A4BD] font-mono">
            <span>Explicit: {currentSkills.filter((s) => s.isExplicit).length}</span>
            <span>Inferred: {currentSkills.filter((s) => !s.isExplicit).length}</span>
          </div>
        </div>

        {/* High Priority Gaps Count */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">High Priority Gaps</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-400 font-display">
              {highGaps.length}
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">Critical missing skills</p>
          </div>
          <div className="mt-3 pt-3 border-t border-[rgba(75,180,220,0.2)] flex items-center justify-between text-xs text-[#91A4BD] font-mono">
            <span>Medium: {mediumGaps.length}</span>
            <span>Low: {lowGaps.length}</span>
          </div>
        </div>

        {/* Career Target Benchmark */}
        <div className="glass-card p-5 rounded-2xl border border-[rgba(75,180,220,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">Target Threshold</span>
            <div className="w-8 h-8 rounded-xl bg-[#16E0FF]/15 text-[#16E0FF] flex items-center justify-center border border-[#16E0FF]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#16E0FF] font-display">
              85%
            </span>
            <p className="text-xs text-[#91A4BD] mt-0.5">Hiring benchmark score</p>
          </div>
          <div className="mt-3 pt-3 border-t border-[rgba(75,180,220,0.2)] text-xs text-[#91A4BD] font-mono">
            <span>Gap to threshold: {Math.max(0, 85 - readinessScore)}%</span>
          </div>
        </div>
      </div>

      {/* Visualization Chart */}
      <div className="mb-8">
        <SkillChart
          currentSkills={currentSkills}
          skillGaps={skillGaps}
          targetCareer={targetCareer}
        />
      </div>

      {/* Main Content Grid: Skill Gaps on Left, Current Skills on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Missing Skills & Prioritized Gaps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[rgba(75,180,220,0.2)]">
              <div>
                <h3 className="text-base font-bold text-[#F4FAFF] font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Identified Skill Gaps ({skillGaps.length})
                </h3>
                <p className="text-xs text-[#91A4BD] mt-0.5">
                  Missing competencies categorized by recruiter importance
                </p>
              </div>

              {/* Priority Filters */}
              <div className="flex items-center gap-1 bg-[#06152B] p-1 rounded-xl border border-[rgba(75,180,220,0.25)] text-xs">
                <button
                  onClick={() => setFilterPriority('all')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    filterPriority === 'all'
                      ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                      : 'text-[#91A4BD] hover:text-[#F4FAFF]'
                  }`}
                >
                  All ({skillGaps.length})
                </button>
                <button
                  onClick={() => setFilterPriority('high')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    filterPriority === 'high'
                      ? 'bg-rose-500 text-white font-bold shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                      : 'text-[#91A4BD] hover:text-[#F4FAFF]'
                  }`}
                >
                  High ({highGaps.length})
                </button>
                <button
                  onClick={() => setFilterPriority('medium')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    filterPriority === 'medium'
                      ? 'bg-amber-500 text-[#020817] font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'text-[#91A4BD] hover:text-[#F4FAFF]'
                  }`}
                >
                  Med ({mediumGaps.length})
                </button>
                <button
                  onClick={() => setFilterPriority('low')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    filterPriority === 'low'
                      ? 'bg-[#35E7FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(53,231,255,0.4)]'
                      : 'text-[#91A4BD] hover:text-[#F4FAFF]'
                  }`}
                >
                  Low ({lowGaps.length})
                </button>
              </div>
            </div>

            {/* Gaps List Cards */}
            <div className="space-y-3.5">
              {filteredGaps.map((gap, idx) => {
                const priorityBadge =
                  gap.priority === 'High'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : gap.priority === 'Medium'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/30';

                return (
                  <div
                    key={gap.name}
                    id={`skill-gap-card-${idx}`}
                    className="p-4 rounded-2xl border border-[rgba(75,180,220,0.2)] hover:border-[rgba(75,180,220,0.4)] bg-[#06152B] transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#F4FAFF] font-display">{gap.name}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${priorityBadge}`}>
                            {gap.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono text-[#91A4BD] px-1.5 py-0.5 rounded bg-[#0A1B33] border border-[rgba(75,180,220,0.25)]">
                            {gap.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#91A4BD] mt-1 leading-relaxed">{gap.reason}</p>
                      </div>
                    </div>

                    {/* Progress Comparison Meter */}
                    <div className="pt-2 border-t border-[rgba(75,180,220,0.18)]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#91A4BD] text-[11px] font-mono">
                          Current: <strong className="text-[#F4FAFF]">{gap.currentLevel}</strong> ({gap.currentScore}%)
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          {renderVisualBlocks(gap.currentScore)}
                          <span className="text-[11px] font-bold text-[#35E7FF]">
                            Target: {gap.requiredLevel} ({gap.requiredScore}%)
                          </span>
                        </div>
                      </div>

                      {/* Continuous Progress Bar */}
                      <div className="w-full bg-[#0A1B33] rounded-full h-1.5 overflow-hidden border border-[rgba(75,180,220,0.15)]">
                        <div
                          className={`h-1.5 rounded-full ${
                            gap.priority === 'High' ? 'bg-rose-500' : gap.priority === 'Medium' ? 'bg-amber-400' : 'bg-[#16E0FF]'
                          }`}
                          style={{ width: `${gap.currentScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredGaps.length === 0 && (
                <div className="text-center py-8 text-[#91A4BD] text-xs font-mono">
                  No skill gaps match the selected priority filter.
                </div>
              )}
            </div>
          </div>

          {/* AI Strategic Recommendations Card */}
          <div className="glass-card-elevated rounded-3xl p-6 border border-[rgba(75,180,220,0.28)] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-[#F4FAFF] font-display flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#16E0FF]" />
              Strategic Recommendations for {targetCareer}
            </h3>
            <ul className="space-y-2.5">
              {analysis?.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#91A4BD]">
                  <div className="w-4 h-4 rounded-full bg-[#16E0FF] text-[#020817] flex items-center justify-center shrink-0 text-[10px] font-bold font-mono mt-0.5">
                    {i + 1}
                  </div>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Verified Current Skills & Evidence (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(75,180,220,0.2)]">
              <h3 className="text-base font-bold text-[#F4FAFF] font-display flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#35E29A]" />
                Verified Current Skills ({currentSkills.length})
              </h3>
              <button
                onClick={onReupload}
                className="text-xs text-[#35E7FF] hover:text-[#F4FAFF] font-semibold cursor-pointer"
              >
                Update Resume
              </button>
            </div>

            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {currentSkills.map((skill, idx) => (
                <div
                  key={skill.name}
                  id={`current-skill-card-${idx}`}
                  className="p-3.5 rounded-2xl border border-[rgba(75,180,220,0.2)] bg-[#06152B] hover:bg-[#0D2442] transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F4FAFF]">{skill.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        skill.level === 'Advanced' || skill.level === 'Expert'
                          ? 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30'
                          : 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/30'
                      }`}
                    >
                      {skill.level} ({skill.score}%)
                    </span>
                  </div>

                  {/* Visual block bar */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-[#657A95] font-mono">{skill.category}</span>
                    {renderVisualBlocks(skill.score)}
                  </div>

                  {/* Evidence tag */}
                  {skill.evidence && (
                    <p className="text-[11px] text-[#91A4BD] bg-[#0A1B33] p-2 rounded-xl border border-[rgba(75,180,220,0.2)] leading-tight">
                      <strong className="text-[#F4FAFF]">Evidence:</strong> {skill.evidence}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-[10px] text-[#657A95] font-mono">
                    <ShieldCheck className="w-3 h-3 text-[#16E0FF]" />
                    <span>{skill.isExplicit ? 'Explicit in Resume' : 'Inferred from Context'}</span>
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
