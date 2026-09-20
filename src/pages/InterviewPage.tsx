import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Mic,
  MicOff,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  Zap,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { generateInterviewQuestionsWithAI, evaluateAnswerWithAI } from '../services/aiService';
import { recordInterviewResult } from '../services/authService';
import { StudentProfile, InterviewQuestion, InterviewEvaluation } from '../types';

interface InterviewPageProps {
  user: StudentProfile | null;
  onNavigateRoadmap: () => void;
}

export const InterviewPage: React.FC<InterviewPageProps> = ({
  user,
  onNavigateRoadmap,
}) => {
  const targetCareer = user?.targetCareer || '';
  const currentSkills = user?.analysis?.currentSkills || [];
  const skillGaps = user?.analysis?.skillGaps || [];

  // State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewEvaluation | null>(null);
  const [pastEvaluations, setPastEvaluations] = useState<InterviewEvaluation[]>(
    user?.interviewHistory || []
  );

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [targetCareer]);

  const loadQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const qList = await generateInterviewQuestionsWithAI(
        targetCareer,
        currentSkills,
        skillGaps
      );
      const normalized = (qList || []).map((q: any, idx: number) => ({
        id: q.id || `q-${idx + 1}`,
        type: (q.type || q.category || 'Technical') as any,
        category: q.category || q.type || 'Technical',
        targetSkill: q.targetSkill || q.skill || 'Core Competency',
        skill: q.skill || q.targetSkill || 'Core Competency',
        difficulty: q.difficulty || 'Intermediate',
        question: q.question || 'Explain your experience and approach with this technology.',
        context: q.context || 'Tests practical problem solving, terminology accuracy, and technical depth.',
        sampleAnswerGuidelines: q.sampleAnswerGuidelines || 'Structure response with concrete examples and trade-offs.',
      }));
      setQuestions(normalized);
      setActiveQuestionIdx(0);
      setCurrentEvaluation(null);
      setStudentAnswer('');
    } catch (e) {
      console.warn('Failed to load questions:', e);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Mic recording simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const filteredQuestions =
    selectedCategory === 'all'
      ? questions
      : questions.filter(
          (q) => (q.type || q.category || '').toLowerCase() === selectedCategory.toLowerCase()
        );

  const activeQ = filteredQuestions[activeQuestionIdx] || filteredQuestions[0] || questions[0];

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Simulate speech to text transcription for convenience if empty
      if (!studentAnswer.trim() && activeQ) {
        if ((activeQ.type || activeQ.category) === 'Technical') {
          setStudentAnswer(
            `In my previous project, we solved this by breaking state down into localized hooks and memoizing heavy subcomponents. We also leveraged TypeScript strict typing to ensure null-safety and avoided unnecessary re-renders.`
          );
        } else {
          setStudentAnswer(
            `I prioritize this by first clarifying the business constraints with stakeholders, identifying trade-offs in architecture, and breaking down the delivery into incremental testable milestones.`
          );
        }
      }
    }
  };

  const handleEvaluate = async () => {
    if (!activeQ || !studentAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const result = await evaluateAnswerWithAI(
        activeQ.question,
        studentAnswer,
        targetCareer,
        activeQ.type || activeQ.category || 'Technical'
      );

      setCurrentEvaluation(result);
      setPastEvaluations((prev) => [result, ...prev]);
      recordInterviewResult(result);
    } catch (e) {
      console.warn('Evaluation failed:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 glass-card-elevated rounded-3xl p-6 border border-[rgba(75,180,220,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div>
          <div className="flex items-center gap-2 text-[#16E0FF] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Mock Technical Interview Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4FAFF] font-display">
            Practice for <span className="text-[#16E0FF]">{targetCareer || 'Target Career'}</span> Roles
          </h1>
          <p className="text-xs sm:text-sm text-[#91A4BD] mt-1 max-w-2xl leading-relaxed">
            Answer real-world technical and behavioral questions tailored directly to your verified skills and skill gaps. Receive immediate AI mentor feedback and model responses.
          </p>
        </div>

        <button
          id="btn-refresh-questions"
          onClick={loadQuestions}
          disabled={isGeneratingQuestions}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#06152B] hover:bg-[#0D2442] border border-[rgba(75,180,220,0.3)] text-[#F4FAFF] text-xs font-mono font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.4)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16E0FF] ${isGeneratingQuestions ? 'animate-spin' : ''}`} />
          Generate New Questions
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-[#06152B] p-1 rounded-xl border border-[rgba(75,180,220,0.25)] text-xs font-mono mb-6 w-fit">
        {['all', 'Technical', 'Conceptual', 'Scenario', 'Behavioral'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveQuestionIdx(0);
              setCurrentEvaluation(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            {cat === 'all' ? `All (${questions.length})` : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Question & Answer on Left (7 cols), Evaluation / History on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Question & Input Form */}
        <div className="lg:col-span-7 space-y-6">
          {activeQ ? (
            <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-4">
              {/* Question Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#16E0FF]/15 text-[#35E7FF] border border-[#16E0FF]/30">
                    {activeQ.type || activeQ.category || 'Technical'}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      activeQ.difficulty === 'Easy' || activeQ.difficulty === 'Beginner'
                        ? 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30'
                        : activeQ.difficulty === 'Medium' || activeQ.difficulty === 'Intermediate'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {activeQ.difficulty || 'Intermediate'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#657A95] font-mono">
                  <span>
                    Question {Math.min(activeQuestionIdx + 1, Math.max(filteredQuestions.length, 1))} of {filteredQuestions.length || 1}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.25)]">
                <h2 className="text-base font-bold text-[#F4FAFF] font-display leading-snug">
                  "{activeQ.question}"
                </h2>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#91A4BD] font-mono">
                  <span>Target Competency:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#0A1B33] text-[#16E0FF] border border-[rgba(75,180,220,0.3)]">
                    {activeQ.targetSkill || activeQ.skill || targetCareer}
                  </span>
                </div>
              </div>

              {/* Student Response Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-[#91A4BD]">Your Technical Answer</label>
                  {/* Voice Simulator Toggle */}
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        : 'bg-[#06152B] hover:bg-[#0D2442] border border-[rgba(75,180,220,0.2)] text-[#91A4BD]'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#16E0FF]" />}
                    {isRecording ? `Recording (${recordingSeconds}s)...` : 'Simulate Voice Input'}
                  </button>
                </div>

                <textarea
                  id="textarea-interview-answer"
                  rows={6}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Type your response as you would speak it in a technical interview..."
                  className="w-full p-3.5 text-xs bg-[#06152B] border border-[rgba(75,180,220,0.25)] rounded-2xl text-[#F4FAFF] placeholder:text-[#657A95] focus:outline-hidden focus:border-[#16E0FF] font-sans leading-relaxed"
                />
              </div>

              {/* Actions & Fast Sample Fillers for Hackathon Evaluators */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 font-mono">
                  <button
                    onClick={() => {
                      setStudentAnswer(
                        `To optimize rendering in React, we use React.memo on pure presentational components, memoize costly calculation results using useMemo, and stabilize callback references using useCallback. We also inspect the React DevTools Profiler to catch unnecessary parent renders.`
                      );
                    }}
                    className="text-[11px] text-[#16E0FF] hover:underline cursor-pointer"
                  >
                    Sample Good Answer
                  </button>
                  <span className="text-[#657A95]">•</span>
                  <button
                    onClick={() => {
                      setStudentAnswer(`I just use useMemo everywhere whenever a component is slow.`);
                    }}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Sample Partial Answer
                  </button>
                </div>

                <button
                  id="btn-submit-interview-answer"
                  onClick={handleEvaluate}
                  disabled={!studentAnswer.trim() || isEvaluating}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(22,224,255,0.3)] transition-all cursor-pointer ${
                    studentAnswer.trim() && !isEvaluating
                      ? 'bg-gradient-to-r from-[#16E0FF] to-[#35E7FF] hover:from-[#35E7FF] hover:to-[#00B8D9] text-[#020817]'
                      : 'bg-[#06152B] text-[#657A95] border border-[rgba(75,180,220,0.2)] cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEvaluating ? 'Evaluating Answer...' : 'Submit to AI Mentor'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation across questions */}
              <div className="pt-3 border-t border-[rgba(75,180,220,0.18)] flex items-center justify-between font-mono text-xs">
                <button
                  onClick={() => {
                    setActiveQuestionIdx((prev) => Math.max(0, prev - 1));
                    setCurrentEvaluation(null);
                    setStudentAnswer('');
                  }}
                  disabled={activeQuestionIdx === 0}
                  className="text-[#91A4BD] hover:text-[#F4FAFF] disabled:opacity-40 cursor-pointer"
                >
                  ← Previous Question
                </button>
                <button
                  onClick={() => {
                    setActiveQuestionIdx((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
                    setCurrentEvaluation(null);
                    setStudentAnswer('');
                  }}
                  disabled={activeQuestionIdx >= filteredQuestions.length - 1}
                  className="font-bold text-[#16E0FF] hover:text-[#35E7FF] disabled:opacity-40 cursor-pointer"
                >
                  Next Question →
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-[rgba(75,180,220,0.25)] p-8 text-center text-[#91A4BD] text-xs font-mono">
              Loading interview questions...
            </div>
          )}
        </div>

        {/* Right Column: AI Evaluation Result & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Evaluation Card */}
          {currentEvaluation ? (
            <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.35)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(75,180,220,0.2)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#0D2442] border border-[#16E0FF]/40 text-[#16E0FF] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F4FAFF] font-display">
                    AI Mentor Feedback
                  </h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${
                    currentEvaluation.score >= 80
                      ? 'bg-[#35E29A]/15 text-[#35E29A] border-[#35E29A]/30'
                      : currentEvaluation.score >= 60
                      ? 'bg-[#16E0FF]/15 text-[#35E7FF] border-[#16E0FF]/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {currentEvaluation.score}% Score
                </span>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-mono font-bold text-[#35E29A] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#35E29A]" />
                  Key Strengths
                </h4>
                <ul className="space-y-1">
                  {currentEvaluation.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-[#91A4BD] bg-[#06152B] p-2 rounded-xl border border-[rgba(75,180,220,0.15)]">
                      • {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {currentEvaluation.areasForImprovement?.map((imp, i) => (
                    <li key={i} className="text-xs text-[#91A4BD] bg-[#06152B] p-2 rounded-xl border border-[rgba(75,180,220,0.15)]">
                      • {imp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constructive explanation */}
              <div className="text-xs text-[#91A4BD] bg-[#06152B] p-3 rounded-2xl border border-[rgba(75,180,220,0.2)] leading-relaxed">
                <p className="font-bold text-[#F4FAFF] mb-1">Recruiter Evaluation:</p>
                {currentEvaluation.explanation}
              </div>

              {/* Ideal Model Answer */}
              {currentEvaluation.suggestedAnswer && (
                <div className="text-xs bg-[#0A1B33] p-3.5 rounded-2xl border border-[#16E0FF]/30 leading-relaxed">
                  <p className="font-bold text-[#16E0FF] mb-1 font-mono text-xs">Ideal Model Answer:</p>
                  <p className="text-[11px] font-mono text-[#F4FAFF] leading-relaxed">{currentEvaluation.suggestedAnswer}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card-elevated rounded-3xl p-6 border border-[rgba(75,180,220,0.28)] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 text-[#35E7FF] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#16E0FF]" />
                <span>Live Feedback Telemetry</span>
              </div>
              <h3 className="text-base font-bold font-display text-[#F4FAFF]">
                Submit an answer to receive detailed rubric feedback.
              </h3>
              <p className="text-xs text-[#91A4BD] mt-2 leading-relaxed">
                The AI analyzes technical depth, clarity, terminology accuracy, and alignment with {targetCareer} expectations.
              </p>
            </div>
          )}

          {/* Past Evaluations List */}
          {pastEvaluations.length > 0 && (
            <div className="glass-card-elevated rounded-3xl border border-[rgba(75,180,220,0.28)] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-mono font-bold text-[#91A4BD] uppercase tracking-wider mb-3">
                Recent Practice History ({pastEvaluations.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {pastEvaluations.map((evalItem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl bg-[#06152B] border border-[rgba(75,180,220,0.2)] flex items-center justify-between text-xs"
                  >
                    <div className="truncate max-w-[200px]">
                      <span className="font-bold text-[#F4FAFF] block truncate">
                        {evalItem.question}
                      </span>
                      <span className="text-[10px] text-[#657A95] font-mono">Score: {evalItem.score}%</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        evalItem.score >= 80
                          ? 'bg-[#35E29A]/20 text-[#35E29A]'
                          : evalItem.score >= 60
                          ? 'bg-[#16E0FF]/20 text-[#35E7FF]'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {evalItem.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
