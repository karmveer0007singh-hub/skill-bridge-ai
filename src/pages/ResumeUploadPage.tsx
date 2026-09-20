import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Code2,
  BrainCircuit,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { uploadResume, formatFileSize } from '../services/resumeService';
import { analyzeResumeWithAI, generateRoadmapWithAI } from '../services/aiService';
import { updateUserAnalysis } from '../services/authService';
import { POPULAR_CAREERS, SAMPLE_RESUMES } from '../data/mockData';
import { StudentProfile } from '../types';

interface ResumeUploadPageProps {
  user: StudentProfile | null;
  onAnalysisComplete: () => void;
  preselectedCareer?: string;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  user,
  onAnalysisComplete,
  preselectedCareer,
}) => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>(user?.resumeRawText || '');
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>(user?.resumeFileName || '');
  const [fileSize, setFileSize] = useState<string>(user?.resumeFileSize || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [autoAnalyzeOnUpload, setAutoAnalyzeOnUpload] = useState(true);

  // Career Selection - default to a valid career so button is never blocked
  const [selectedCareer, setSelectedCareer] = useState<string>(
    preselectedCareer || user?.targetCareer || 'Full Stack Developer'
  );
  const [customCareer, setCustomCareer] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // AI Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTargetCareer = isCustomMode && customCareer.trim() ? customCareer.trim() : selectedCareer;

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const runAnalysisCore = async (
    textToAnalyze: string,
    pdfBase64ToAnalyze?: string,
    careerToUse?: string,
    fName?: string,
    fSize?: string
  ) => {
    const career = careerToUse || activeTargetCareer || 'Full Stack Developer';
    if (!textToAnalyze && !pdfBase64ToAnalyze) {
      setErrorMessage('Please upload a resume file or paste your experience before running analysis.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      setAnalysisStep('Parsing resume structure and credentials...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalysisStep(`Evaluating verified skills against ${career} benchmarks...`);
      const analysisResult = await analyzeResumeWithAI(textToAnalyze, career, pdfBase64ToAnalyze);

      setAnalysisStep('Generating step-by-step personalized learning roadmap...');
      const roadmapSteps = await generateRoadmapWithAI(
        career,
        analysisResult.currentSkills,
        analysisResult.skillGaps
      );

      setAnalysisStep('Finalizing your career readiness score & gap matrix...');
      await new Promise((r) => setTimeout(r, 300));

      // Save to user state
      updateUserAnalysis(analysisResult, roadmapSteps, {
        fileName: fName || fileName || 'Student_Resume.pdf',
        fileSize: fSize || fileSize || '120 KB',
        rawText: textToAnalyze,
      });

      setIsAnalyzing(false);
      onAnalysisComplete();
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'Analysis encountered an error. Please try again.');
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 25;
        });
      }, 120);

      const result = await uploadResume(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setSelectedFile(file);
      setFileName(result.fileName);
      setFileSize(result.fileSize);
      setExtractedText(result.rawText);
      setPdfBase64(result.pdfBase64);
      setIsUploading(false);

      // If autoAnalyze is enabled, immediately compute career readiness!
      if (autoAnalyzeOnUpload) {
        const career = activeTargetCareer || 'Full Stack Developer';
        await runAnalysisCore(result.rawText, result.pdfBase64, career, result.fileName, result.fileSize);
      }
    } catch (err: any) {
      setIsUploading(false);
      setErrorMessage(err.message || 'Failed to parse resume file.');
    }
  };

  const handleRemoveResume = () => {
    setSelectedFile(null);
    setFileName('');
    setFileSize('');
    setExtractedText('');
    setPdfBase64(undefined);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleResume = async (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId) || SAMPLE_RESUMES[0];
    setFileName(`${sample.role.replace(/\s+/g, '_')}_Resume.pdf`);
    setFileSize('145 KB');
    setExtractedText(sample.text);
    setPdfBase64(undefined);
    setSelectedCareer(sample.role);
    setIsCustomMode(false);
    setErrorMessage(null);

    // Run analysis immediately on sample resume
    await runAnalysisCore(sample.text, undefined, sample.role, `${sample.role.replace(/\s+/g, '_')}_Resume.pdf`, '145 KB');
  };

  const handleRunAIAnalysis = async () => {
    await runAnalysisCore(extractedText, pdfBase64, activeTargetCareer, fileName, fileSize);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#16E0FF] text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#16E0FF]" />
          <span>Telemetry Step 1 of 3: Profile & Career Vector</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4FAFF] font-display">
          Upload Resume & Select Target Career
        </h1>
        <p className="text-sm text-[#91A4BD] mt-1">
          Provide your resume so our AI can extract your verified skills and calculate your career readiness score.
        </p>
      </div>

      {isAnalyzing && (
        <div className="mb-6 p-4 rounded-2xl bg-[#06152B] border-2 border-[#16E0FF] shadow-[0_0_30px_rgba(22,224,255,0.25)] flex items-center gap-4 animate-in fade-in">
          <div className="w-10 h-10 rounded-xl bg-[#0D2442] border border-[#16E0FF] flex items-center justify-center shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-[#16E0FF] border-t-transparent animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#F4FAFF] font-display flex items-center gap-2">
                <span>Calculating Career Readiness Score...</span>
                <span className="text-xs text-[#35E7FF] font-mono font-normal">({activeTargetCareer})</span>
              </h4>
              <span className="text-xs font-mono text-[#16E0FF] font-bold animate-pulse">Processing</span>
            </div>
            <p className="text-xs text-[#91A4BD] mt-0.5 font-mono">{analysisStep}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold">Action Required</p>
            <p className="text-xs mt-0.5 text-rose-200">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resume Upload & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Box Card */}
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#F4FAFF] font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#16E0FF]" />
                Upload Student Resume
              </h2>
              {fileName && (
                <button
                  id="btn-replace-resume"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#35E7FF] hover:text-[#F4FAFF] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replace File
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              id="file-upload-input"
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Quick Sample Resume Loader */}
            <div className="mb-4 p-3 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono text-[#91A4BD] flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#16E0FF]" />
                  Instant Test: Load Sample Student Resume & Calculate Readiness:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSampleResume(sample.id)}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#0A1B33] hover:bg-[#0D2442] text-[#35E7FF] hover:text-[#F4FAFF] border border-[rgba(75,180,220,0.25)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ⚡ {sample.role}
                  </button>
                ))}
              </div>
            </div>

            {!extractedText ? (
              /* Drag and Drop Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#16E0FF] bg-[#06152B] scale-[1.01]'
                    : 'border-[rgba(75,180,220,0.3)] hover:border-[#16E0FF] bg-[#06152B]/60 hover:bg-[#0A1B33]'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0D2442] border border-[#16E0FF]/40 text-[#16E0FF] flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(22,224,255,0.25)]">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[#F4FAFF] font-display">
                  Drop your resume here, or <span className="text-[#35E7FF] underline">browse files</span>
                </h3>
                <p className="text-xs text-[#91A4BD] mt-1 font-mono">
                  Supports PDF or TXT documents (Max size: 10 MB)
                </p>

                {isUploading && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-[#91A4BD] font-mono mb-1">
                      <span>Extracting text...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#06152B] rounded-full h-2 overflow-hidden border border-[rgba(75,180,220,0.2)]">
                      <div
                        className="bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Uploaded Resume Success & Details */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.25)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D2442] border border-[#16E0FF]/40 text-[#16E0FF] flex items-center justify-center shadow-[0_0_10px_rgba(22,224,255,0.2)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F4FAFF] truncate max-w-[200px] sm:max-w-xs">
                        {fileName}
                      </h4>
                      <p className="text-[11px] text-[#91A4BD] flex items-center gap-2 font-mono">
                        <span>{fileSize}</span>
                        <span>•</span>
                        <span className="text-[#35E29A] font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Ready for AI Analysis
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-remove-resume"
                    onClick={handleRemoveResume}
                    className="p-2 text-[#91A4BD] hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                    title="Remove uploaded resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Extracted Text Preview Accordion */}
                <div>
                  <label className="block text-xs font-bold text-[#91A4BD] mb-1.5 flex items-center justify-between">
                    <span>Parsed Resume Content</span>
                    <span className="text-[10px] text-[#657A95] font-mono">
                      {extractedText.length} characters parsed
                    </span>
                  </label>
                  <textarea
                    id="resume-extracted-text-area"
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows={6}
                    className="w-full p-3.5 text-xs bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-2xl font-mono text-[#F4FAFF] focus:outline-hidden focus:border-[#16E0FF]"
                    placeholder="Parsed resume text appears here..."
                  />
                  <p className="text-[11px] text-[#91A4BD] mt-1">
                    Tip: You can edit or paste additional coursework or projects directly into the text box above.
                  </p>
                </div>

                {/* Immediate Career Readiness Action Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#16E0FF]/15 to-[#35E7FF]/10 border border-[#16E0FF]/40 space-y-3 shadow-[0_0_20px_rgba(22,224,255,0.15)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#16E0FF] uppercase tracking-wide">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Ready to Calculate Career Readiness</span>
                      </div>
                      <p className="text-xs text-[#F4FAFF] mt-0.5">
                        Target Career:{' '}
                        <span className="font-bold text-[#35E7FF] font-mono">
                          {activeTargetCareer}
                        </span>
                      </p>
                    </div>

                    <button
                      id="btn-calculate-readiness-instant"
                      onClick={handleRunAIAnalysis}
                      disabled={isAnalyzing}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(22,224,255,0.4)] cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 fill-[#020817]" />
                      <span>Calculate Readiness Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[rgba(75,180,220,0.2)] text-[11px] text-[#91A4BD]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoAnalyzeOnUpload}
                        onChange={(e) => setAutoAnalyzeOnUpload(e.target.checked)}
                        className="rounded border-[rgba(75,180,220,0.3)] text-[#16E0FF] focus:ring-0"
                      />
                      <span>Automatically calculate readiness whenever a new file is dropped</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Career Selection & AI Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Career Card */}
          <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <h2 className="text-base font-bold text-[#F4FAFF] font-display flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-[#16E0FF]" />
              Choose Target Career
            </h2>
            <p className="text-xs text-[#91A4BD] mb-4">
              Select the role you are preparing for so AI can identify missing industry requirements.
            </p>

            {/* Popular Career Grid */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {POPULAR_CAREERS.map((career) => {
                const isSelected = !isCustomMode && selectedCareer === career.title;
                return (
                  <button
                    key={career.id}
                    id={`btn-career-${career.id}`}
                    onClick={() => {
                      setSelectedCareer(career.title);
                      setIsCustomMode(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#16E0FF] bg-[#0D2442] ring-1 ring-[#16E0FF]/50 shadow-[0_0_15px_rgba(22,224,255,0.2)]'
                        : 'border-[rgba(75,180,220,0.2)] hover:border-[rgba(75,180,220,0.4)] bg-[#06152B]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F4FAFF]">{career.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A1B33] text-[#35E7FF] border border-[rgba(75,180,220,0.3)]">
                          {career.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#91A4BD] mt-0.5 line-clamp-1 font-mono">
                        {career.popularSkills.slice(0, 4).join(', ')}
                      </p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? 'border-[#16E0FF] bg-[#16E0FF] text-[#020817]'
                          : 'border-[#657A95]'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#020817]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Career Input */}
            <div className="mt-4 pt-4 border-t border-[rgba(75,180,220,0.2)]">
              <label className="block text-xs font-mono font-bold text-[#91A4BD] mb-1.5">
                Or Specify a Custom Role:
              </label>
              <div className="flex gap-2">
                <input
                  id="input-custom-career"
                  type="text"
                  placeholder="e.g. Quantitative Developer or iOS Engineer"
                  value={customCareer}
                  onChange={(e) => {
                    setCustomCareer(e.target.value);
                    if (e.target.value.trim()) {
                      setIsCustomMode(true);
                    }
                  }}
                  onFocus={() => {
                    if (customCareer.trim()) setIsCustomMode(true);
                  }}
                  className={`flex-1 px-3.5 py-2 text-xs bg-[#06152B] border rounded-xl focus:outline-hidden focus:border-[#16E0FF] text-[#F4FAFF] placeholder:text-[#657A95] ${
                    isCustomMode ? 'border-[#16E0FF] bg-[#0D2442]' : 'border-[rgba(75,180,220,0.25)]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* AI Trigger Summary Card */}
          <div className="glass-card-elevated rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[rgba(75,180,220,0.35)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#16E0FF]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-[#35E7FF] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4 text-[#16E0FF]" />
              <span>Ready for Skill Gap Benchmarking</span>
            </div>

            <h3 className="text-lg font-bold font-display text-[#F4FAFF]">
              Target Role:{' '}
              <span className="text-[#16E0FF] font-mono">{activeTargetCareer || 'Select a career'}</span>
            </h3>
            <p className="text-xs text-[#91A4BD] mt-1 leading-relaxed">
              Gemini 3.7 Flash will analyze your verified skills, map missing requirements, calculate readiness score, and generate your step-by-step roadmap.
            </p>

            {/* Running AI State Loader */}
            {isAnalyzing ? (
              <div className="mt-6 p-4 rounded-2xl bg-[#06152B] border border-[#16E0FF]/40 text-center animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-[#16E0FF] border-t-transparent animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-[#F4FAFF]">{analysisStep}</p>
                <p className="text-[11px] text-[#35E7FF] mt-0.5 font-mono">
                  Benchmarking against current hiring standards...
                </p>
              </div>
            ) : (
              <button
                id="btn-run-ai-analysis"
                onClick={handleRunAIAnalysis}
                disabled={!extractedText || !activeTargetCareer || isAnalyzing}
                className={`w-full mt-6 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(22,224,255,0.35)] transition-all cursor-pointer ${
                  extractedText && activeTargetCareer
                    ? 'bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817]'
                    : 'bg-[#06152B] text-[#657A95] border border-[rgba(75,180,220,0.2)] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {!extractedText
                  ? 'Upload Resume to Benchmark'
                  : !activeTargetCareer
                  ? 'Choose Target Career Above'
                  : `Calculate Career Readiness (${activeTargetCareer})`}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#657A95]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#35E29A]" />
              <span>Grounded analysis • Zero mock or simulated data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
