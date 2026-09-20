import React from 'react';

interface SkillGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
}

export const SkillGauge: React.FC<SkillGaugeProps> = ({
  score,
  size = 'md',
  label = 'Career Readiness',
  sublabel,
}) => {
  const safeScore = Math.min(100, Math.max(0, score || 0));
  
  // Dimensions
  const dim = size === 'sm' ? 100 : size === 'lg' ? 180 : 136;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 10;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = '#657A95';
  let badgeColor = 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  let tier = 'No Resume (0%)';

  if (safeScore === 0) {
    strokeColor = '#334155';
    badgeColor = 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    tier = 'Not Uploaded (0%)';
  } else if (safeScore >= 80) {
    strokeColor = '#35E29A';
    badgeColor = 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30';
    tier = 'Hiring Ready';
  } else if (safeScore >= 65) {
    strokeColor = '#35E7FF';
    badgeColor = 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/30';
    tier = 'Competitive Candidate';
  } else if (safeScore >= 45) {
    strokeColor = '#FBBF24';
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    tier = 'Foundational Gaps';
  } else {
    strokeColor = '#F43F5E';
    badgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    tier = 'Early Stage';
  }

  return (
    <div id={`skill-gauge-${safeScore}`} className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        {/* Background Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            className="text-[#06152B]"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            style={{ stroke: strokeColor }}
            className="transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-display font-extrabold tracking-tight text-[#F4FAFF] ${
              size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
            }`}
          >
            {safeScore}%
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#91A4BD] mt-0.5">
              Score
            </span>
          )}
        </div>
      </div>

      {(label || sublabel) && (
        <div className="mt-2 text-center">
          {label && <p className="text-xs font-semibold text-[#91A4BD]">{label}</p>}
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${badgeColor}`}>
              {sublabel || tier}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
