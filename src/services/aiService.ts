import { SkillAnalysisResult, RoadmapStep, InterviewQuestion, InterviewEvaluation } from '../types';
import { DEMO_ANALYSIS_RESULT, DEMO_ROADMAP_STEPS, DEMO_INTERVIEW_QUESTIONS } from '../data/mockData';

export async function analyzeResumeWithAI(
  resumeText: string,
  targetCareer: string
): Promise<SkillAnalysisResult> {
  try {
    const response = await fetch('/api/ai/analyze-skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, targetCareer }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AI analysis API call failed, using client fallback:', error);
    // Return structured demo analysis tailored to career if offline
    return {
      ...DEMO_ANALYSIS_RESULT,
      targetCareer,
      analyzedAt: new Date().toISOString(),
    };
  }
}

export async function generateRoadmapWithAI(
  targetCareer: string,
  currentSkills: any[],
  skillGaps: any[]
): Promise<RoadmapStep[]> {
  try {
    const response = await fetch('/api/ai/generate-roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetCareer, currentSkills, skillGaps }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.steps || DEMO_ROADMAP_STEPS;
  } catch (error) {
    console.warn('AI roadmap generation API call failed, using fallback:', error);
    return DEMO_ROADMAP_STEPS;
  }
}

export async function getInterviewQuestionsWithAI(
  targetCareer: string,
  currentSkills: any[],
  skillGaps: any[]
): Promise<InterviewQuestion[]> {
  try {
    const response = await fetch('/api/ai/interview-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetCareer, currentSkills, skillGaps }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.questions || DEMO_INTERVIEW_QUESTIONS;
  } catch (error) {
    console.warn('AI interview questions API call failed, using fallback:', error);
    return DEMO_INTERVIEW_QUESTIONS;
  }
}

export const generateInterviewQuestionsWithAI = getInterviewQuestionsWithAI;

export async function evaluateInterviewAnswerWithAI(params: {
  questionId?: string;
  question: string;
  questionType?: string;
  targetSkill?: string;
  studentAnswer: string;
  targetCareer: string;
}): Promise<InterviewEvaluation> {
  try {
    const response = await fetch('/api/ai/evaluate-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AI interview evaluation API call failed, using fallback:', error);
    return {
      questionId: params.questionId || 'q-custom',
      studentAnswer: params.studentAnswer,
      score: 82,
      strengths: [
        'Demonstrated clear understanding of the core concept and technical principles.',
        'Communicated systematically with logical flow.',
      ],
      areasForImprovement: [
        'Include concrete performance metrics or quantified results from your previous projects.',
        'Elaborate slightly more on error handling or edge cases.',
      ],
      explanation: 'Great answer! You have strong command of the topic. With slight elaboration on edge cases, this is ready for tier-1 tech interviews.',
      keyPointsCovered: ['Core principles', 'Execution flow', 'Trade-offs'],
      suggestedAnswer: 'A high-impact response directly names the architecture pattern, explains the performance or maintainability benefits, and describes handling failure modes.',
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export async function evaluateAnswerWithAI(
  question: string,
  studentAnswer: string,
  targetCareer: string,
  category: string = 'Technical'
): Promise<InterviewEvaluation> {
  return evaluateInterviewAnswerWithAI({
    question,
    studentAnswer,
    targetCareer,
    questionType: category,
  });
}

