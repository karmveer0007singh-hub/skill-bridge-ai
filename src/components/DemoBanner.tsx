import React from 'react';
import { Sparkles, RefreshCw, UploadCloud, LogOut, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../types';

interface DemoBannerProps {
  user: StudentProfile | null;
  onUploadCustom: () => void;
  onResetDemo: () => void;
  onExitDemo: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  user,
  onUploadCustom,
  onResetDemo,
  onExitDemo,
}) => {
  if (!user?.isDemo) return null;

  return (
    <div
      id="demo-mode-indicator-bar"
      className="bg-[#06152B] border-b border-[rgba(22,224,255,0.25)] text-[#F4FAFF] px-4 py-2 text-xs shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 bg-[#16E0FF]/15 border border-[#16E0FF]/40 text-[#35E7FF] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider text-[10px] shadow-[0_0_10px_rgba(22,224,255,0.25)]">
            <Sparkles className="w-3 h-3 text-[#35E7FF] animate-pulse" />
            Active Demo Mode
          </span>
          <span className="text-[#91A4BD]">
            Simulated Student: <strong className="text-[#F4FAFF] font-semibold">{user.name}</strong> (Targeting:{' '}
            <span className="text-[#35E7FF] font-mono">{user.targetCareer}</span>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-demo-upload-custom"
            onClick={onUploadCustom}
            className="flex items-center gap-1.5 bg-[#16E0FF] hover:bg-[#35E7FF] text-[#020817] font-bold px-3 py-1 rounded-lg transition-all text-xs shadow-[0_0_12px_rgba(22,224,255,0.35)]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Analyze Your Resume
          </button>
          <button
            id="btn-demo-reset"
            onClick={onResetDemo}
            title="Reload baseline demo profile"
            className="flex items-center gap-1 bg-[#0A1B33] hover:bg-[#0D2442] border border-[rgba(75,180,220,0.3)] text-[#91A4BD] hover:text-[#F4FAFF] px-2.5 py-1 rounded-lg transition-colors text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
          <button
            id="btn-demo-exit"
            onClick={onExitDemo}
            className="text-[#657A95] hover:text-[#F4FAFF] text-xs px-2 py-1 transition-colors"
          >
            Exit Demo
          </button>
        </div>
      </div>
    </div>
  );
};
