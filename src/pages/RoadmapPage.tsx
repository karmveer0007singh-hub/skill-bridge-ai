import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  ExternalLink,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, RoadmapStep, TaskStatus } from '../types';
import { updateRoadmapTaskStatus } from '../services/authService';

interface RoadmapPageProps {
  user: StudentProfile | null;
  onNavigateInterview: () => void;
  onReanalyze: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  user,
  onNavigateInterview,
  onReanalyze,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedStepId, setExpandedStepId] = useState<string | null>('step-1');

  const roadmap: RoadmapStep[] = user?.roadmap || [];
  const targetCareer = user?.targetCareer || 'Frontend Developer';

  // Stats
  const totalSteps = roadmap.length;
  const completedSteps = roadmap.filter((s) => s.status === 'completed').length;
  const inProgressSteps = roadmap.filter((s) => s.status === 'in-progress').length;
  const notStartedSteps = roadmap.filter((s) => s.status === 'not-started').length;
  const completionPercentage =
    totalSteps > 0 ? Math.round(((completedSteps + inProgressSteps * 0.3) / totalSteps) * 100) : 0;

  const filteredSteps =
    filterStatus === 'all'
      ? roadmap
      : roadmap.filter((s) => s.status === filterStatus);

  const handleStatusChange = (stepId: string, newStatus: TaskStatus) => {
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16E0FF', '#35E7FF', '#35E29A', '#00B8D9'],
        });
      } catch (e) {
        // Safe confetti fallback
      }
    }
    updateRoadmapTaskStatus(stepId, newStatus);
  };

  const handleExportMarkdown = () => {
    const mdContent = `# SkillBridge AI Personalized Learning Roadmap
## Target Career: ${targetCareer}
Generated for: ${user?.name || 'Student'}
Overall Progress: ${completionPercentage}% (${completedSteps}/${totalSteps} Completed)

${roadmap
  .map(
    (step) => `### Step ${step.stepNumber}: ${step.title}
- **Skill**: ${step.skill}
- **Topic**: ${step.topic}
- **Status**: ${step.status.toUpperCase()}
- **Estimated Duration**: ${step.estimatedDuration} | **Difficulty**: ${step.difficulty}
- **Description**: ${step.description}
- **Practice Task**: ${step.practiceTask}
- **Portfolio Project**: ${step.projectIdea}
- **Key Resources**:
${step.resources.map((r) => `  - [${r.provider}] ${r.title} (${r.type}) ${r.url ? `- ${r.url}` : ''}`).join('\n')}
`
  )
  .join('\n---\n\n')}`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_${targetCareer.replace(/\s+/g, '_')}_Roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 glass-card-elevated rounded-3xl p-6 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div>
          <div className="flex items-center gap-2 text-[#16E0FF] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Milestone className="w-3.5 h-3.5" />
            <span>AI Curriculum & Action Vector</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4FAFF] font-display">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#91A4BD] mt-1 max-w-2xl leading-relaxed">
            A step-by-step milestone curriculum built by Gemini to take you from your current verified skills to hiring readiness as a{' '}
            <strong className="text-[#35E7FF] font-mono">{targetCareer}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-export-roadmap"
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#06152B] hover:bg-[#0D2442] border border-[rgba(75,180,220,0.3)] text-[#F4FAFF] text-xs font-bold rounded-xl transition-all cursor-pointer font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            Export Plan
          </button>
          <button
            id="btn-roadmap-to-interview"
            onClick={onNavigateInterview}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(22,224,255,0.35)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Mock Interview
          </button>
        </div>
      </div>

      {/* Progress Metric Tracker Card */}
      <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider">
              Roadmap Progression
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#F4FAFF] font-display">
                {completionPercentage}%
              </span>
              <span className="text-xs text-[#91A4BD] font-mono">
                ({completedSteps} of {totalSteps} milestones finished)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-[#35E29A]/15 border border-[#35E29A]/30 text-[#35E29A] font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#35E29A]" />
              Completed: {completedSteps}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#16E0FF]/15 border border-[#16E0FF]/30 text-[#35E7FF] font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#16E0FF]" />
              In Progress: {inProgressSteps}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] text-[#91A4BD] font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#657A95]" />
              Remaining: {notStartedSteps}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#06152B] rounded-full h-2.5 overflow-hidden border border-[rgba(75,180,220,0.2)]">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[#16E0FF] via-[#35E7FF] to-[#35E29A] transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-[rgba(75,180,220,0.2)]">
        <div className="flex items-center gap-1 bg-[#06152B] p-1 rounded-xl border border-[rgba(75,180,220,0.25)] text-xs font-mono">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            All ({totalSteps})
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterStatus === 'in-progress'
                ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            In Progress ({inProgressSteps})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-[#35E29A] text-[#020817] font-bold shadow-[0_0_10px_rgba(53,226,154,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            Completed ({completedSteps})
          </button>
          <button
            onClick={() => setFilterStatus('not-started')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterStatus === 'not-started'
                ? 'bg-[#0D2442] text-[#F4FAFF] font-bold'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            Not Started ({notStartedSteps})
          </button>
        </div>

        <span className="text-xs text-[#91A4BD] font-mono hidden sm:inline">
          Click any milestone to expand curriculum and exercises
        </span>
      </div>

      {/* Roadmap Steps List */}
      <div className="space-y-4">
        {filteredSteps.map((step) => {
          const isExpanded = expandedStepId === step.id;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          let statusBadge = 'bg-[#06152B] text-[#91A4BD] border-[rgba(75,180,220,0.25)]';
          if (isCompleted) statusBadge = 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30';
          if (isInProgress) statusBadge = 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/40';

          return (
            <div
              key={step.id}
              id={`roadmap-step-card-${step.id}`}
              className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'border-[#35E29A]/40 bg-[#061A22]/60'
                  : isInProgress
                  ? 'border-[#16E0FF] bg-[#0A1E38] shadow-[0_0_20px_rgba(22,224,255,0.15)]'
                  : 'border-[rgba(75,180,220,0.2)] hover:border-[rgba(75,180,220,0.35)]'
              }`}
            >
              {/* Step Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                  className="flex items-start sm:items-center gap-3.5 cursor-pointer flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl font-display font-extrabold flex items-center justify-center text-sm shrink-0 border ${
                      isCompleted
                        ? 'bg-[#35E29A] text-[#020817] border-[#35E29A]'
                        : isInProgress
                        ? 'bg-[#16E0FF] text-[#020817] border-[#16E0FF] shadow-[0_0_12px_rgba(22,224,255,0.4)]'
                        : 'bg-[#06152B] text-[#91A4BD] border-[rgba(75,180,220,0.25)]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${step.stepNumber}`}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16E0FF] bg-[#16E0FF]/15 px-2 py-0.5 rounded border border-[#16E0FF]/30">
                        {step.skill}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          step.difficulty === 'Beginner'
                            ? 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30'
                            : step.difficulty === 'Intermediate'
                            ? 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {step.difficulty}
                      </span>
                      <span className="text-xs text-[#91A4BD] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#657A95]" />
                        {step.estimatedDuration}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F4FAFF] font-display mt-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#91A4BD] line-clamp-1">{step.topic}</p>
                  </div>
                </div>

                {/* Status Switcher & Toggle */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(75,180,220,0.18)]">
                  <select
                    id={`select-status-${step.id}`}
                    value={step.status}
                    onChange={(e) => handleStatusChange(step.id, e.target.value as TaskStatus)}
                    className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border focus:outline-hidden transition-colors cursor-pointer ${statusBadge}`}
                  >
                    <option value="not-started" className="bg-[#0A1B33] text-[#F4FAFF]">Not Started</option>
                    <option value="in-progress" className="bg-[#0A1B33] text-[#35E7FF]">In Progress</option>
                    <option value="completed" className="bg-[#0A1B33] text-[#35E29A]">✓ Completed</option>
                  </select>

                  <button
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className="p-1.5 text-[#91A4BD] hover:text-[#F4FAFF] rounded-lg hover:bg-[#06152B] transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Step Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[rgba(75,180,220,0.2)] bg-[#06152B]/60 space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-[#91A4BD] leading-relaxed">{step.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Practice Task */}
                    <div className="p-3.5 rounded-2xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)]">
                      <span className="text-[11px] font-mono font-bold text-[#16E0FF] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Code2 className="w-3.5 h-3.5" />
                        Practical Hands-on Task
                      </span>
                      <p className="text-xs text-[#91A4BD] leading-relaxed">{step.practiceTask}</p>
                    </div>

                    {/* Portfolio Project Idea */}
                    <div className="p-3.5 rounded-2xl bg-[#0A1B33] border border-[rgba(75,180,220,0.25)]">
                      <span className="text-[11px] font-mono font-bold text-[#35E7FF] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Award className="w-3.5 h-3.5" />
                        Portfolio Project Idea
                      </span>
                      <p className="text-xs text-[#91A4BD] leading-relaxed">{step.projectIdea}</p>
                    </div>
                  </div>

                  {/* Curated Resources */}
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#16E0FF]" />
                      Authentic Learning Resources
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {step.resources.map((resource, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#0A1B33] border border-[rgba(75,180,220,0.2)] flex items-start justify-between gap-2"
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#657A95] block uppercase">
                              {resource.provider} • {resource.type}
                            </span>
                            <span className="text-xs font-semibold text-[#F4FAFF] line-clamp-1">
                              {resource.title}
                            </span>
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#16E0FF] hover:text-[#35E7FF] p-1 hover:bg-[#06152B] rounded-lg transition-colors"
                              title="Open resource"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSteps.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl border border-[rgba(75,180,220,0.25)] p-6 text-[#91A4BD] text-xs font-mono">
            No milestones found matching the filter "{filterStatus}".
          </div>
        )}
      </div>
    </div>
  );
};
