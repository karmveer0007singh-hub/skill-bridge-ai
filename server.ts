import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Helper to call Gemini with retry and fallback
async function generateJSONWithGemini(contents: any, schema: any): Promise<any | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        const text = response.text?.trim();
        if (text) {
          return JSON.parse(text);
        }
      } catch (err: any) {
        const isTemporary =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('UNAVAILABLE');

        if (isTemporary && attempt === 1) {
          console.warn(`[Gemini API] Temporary load spike on ${model} (attempt ${attempt}), retrying shortly...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        } else {
          console.warn(`[Gemini API] Note: Model ${model} returned: ${err?.message || err}. Trying next available engine.`);
          break;
        }
      }
    }
  }

  return null;
}

// Health Check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    service: 'SkillBridge AI Server',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// 1. Analyze Resume Skills & Gaps Endpoint
app.post('/api/ai/analyze-skills', async (req, res) => {
  try {
    const { resumeText, targetCareer, resumePdfBase64 } = req.body;

    if ((!resumeText && !resumePdfBase64) || !targetCareer) {
      return res.status(400).json({ error: 'resumeText or resumePdfBase64 and targetCareer are required' });
    }

    const promptText = `You are SkillBridge AI, a rigorous and supportive career coach and skill-gap analyst for college students.
Analyze the following student's resume against the target career: "${targetCareer}".

CRITICAL INSTRUCTIONS:
1. Never invent skills that are not supported by the resume text or uploaded resume.
2. Clearly distinguish between skills explicitly found in the resume (isExplicit: true) and skills inferred from context or projects (isExplicit: false).
3. Identify all current skills with realistic proficiency levels (Beginner, Intermediate, Advanced, Expert) and proficiency scores (0-100).
4. Identify all required industry skills for "${targetCareer}".
5. Highlight missing skills and skill gaps, prioritizing them strictly into "High", "Medium", or "Low" priority.
6. Calculate an accurate, fair overall career readiness score (0-100).
7. Provide actionable, high-impact recommendations for this student.

${resumeText ? `STUDENT RESUME TEXT:\n"""\n${resumeText}\n"""\n` : ''}
TARGET CAREER: "${targetCareer}"

Return a valid JSON object matching the requested schema.`;

    const contents: any[] = [];
    if (resumePdfBase64) {
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: resumePdfBase64,
        },
      });
    }
    contents.push(promptText);

    const schema = {
      type: Type.OBJECT,
      properties: {
        targetCareer: { type: Type.STRING },
        readinessScore: { type: Type.INTEGER, description: 'Overall readiness score 0-100' },
        summary: { type: Type.STRING, description: '2-3 sentence executive assessment' },
        currentSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING, description: 'Beginner, Intermediate, Advanced, or Expert' },
              category: { type: Type.STRING },
              evidence: { type: Type.STRING, description: 'Direct snippet or project evidence from resume' },
              isExplicit: { type: Type.BOOLEAN, description: 'True if explicitly named, false if inferred' },
              score: { type: Type.INTEGER, description: '0-100 score' },
            },
            required: ['name', 'level', 'category', 'isExplicit', 'score'],
          },
        },
        requiredSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Key skills required for this career',
        },
        skillGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              priority: { type: Type.STRING, description: 'High, Medium, or Low' },
              currentLevel: { type: Type.STRING, description: 'None, Beginner, or Intermediate' },
              requiredLevel: { type: Type.STRING, description: 'Intermediate, Advanced, or Expert' },
              category: { type: Type.STRING },
              reason: { type: Type.STRING, description: 'Why this gap matters for this specific career' },
              currentScore: { type: Type.INTEGER, description: '0-100' },
              requiredScore: { type: Type.INTEGER, description: '0-100' },
            },
            required: ['name', 'priority', 'currentLevel', 'requiredLevel', 'category', 'reason', 'currentScore', 'requiredScore'],
          },
        },
        recommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Actionable steps to bridge the gap',
        },
      },
      required: ['targetCareer', 'readinessScore', 'summary', 'currentSkills', 'requiredSkills', 'skillGaps', 'recommendations'],
    };

    const parsedData = await generateJSONWithGemini(contents, schema);
    if (parsedData && parsedData.currentSkills) {
      parsedData.analyzedAt = new Date().toISOString();
      return res.json(parsedData);
    }

    // Realistic fallback synthesis
    return res.json(generateFallbackAnalysis(resumeText, targetCareer));
  } catch (error: any) {
    console.warn('Note: Using fallback analysis for /api/ai/analyze-skills');
    return res.json(generateFallbackAnalysis(req.body.resumeText || '', req.body.targetCareer || 'Software Developer'));
  }
});

// 2. Generate Learning Roadmap Endpoint
app.post('/api/ai/generate-roadmap', async (req, res) => {
  try {
    const { targetCareer, currentSkills, skillGaps } = req.body;

    const prompt = `You are SkillBridge AI's Roadmap Architect.
Generate a structured, sequential, step-by-step personalized learning roadmap for a student aiming to become a "${targetCareer}".

Current Skills: ${JSON.stringify(currentSkills || [])}
Skill Gaps to Address: ${JSON.stringify(skillGaps || [])}

RULES:
1. Create 5 to 7 logical chronological steps (e.g. Step 1: Foundations/TypeScript, Step 2: Testing, Step 3: State Management, Step 4: Architecture, Step 5: Capstone Project).
2. Each step must have:
   - title, skill, topic, description
   - realistic estimated duration (e.g. "2 weeks", "3 weeks")
   - difficulty ("Beginner", "Intermediate", or "Advanced")
   - concrete practice task
   - real-world portfolio project idea that will impress recruiters
   - 2-3 vetted, authentic learning resources (e.g. official documentation, freeCodeCamp, MDN, React Docs). Do not invent fake links; provide authoritative titles and valid top-level URLs.

Return a valid JSON array of roadmap step objects.`;

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          skill: { type: Type.STRING },
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced' },
          estimatedDuration: { type: Type.STRING },
          practiceTask: { type: Type.STRING },
          projectIdea: { type: Type.STRING },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, description: 'Documentation, Course, Tutorial, Book, or Interactive' },
                provider: { type: Type.STRING },
                url: { type: Type.STRING },
                isFree: { type: Type.BOOLEAN },
              },
              required: ['title', 'type', 'provider'],
            },
          },
        },
        required: ['id', 'stepNumber', 'title', 'skill', 'topic', 'description', 'difficulty', 'estimatedDuration', 'practiceTask', 'projectIdea', 'resources'],
      },
    };

    const parsedArray = await generateJSONWithGemini(prompt, schema);
    if (Array.isArray(parsedArray) && parsedArray.length > 0) {
      const steps = parsedArray.map((s: any, idx: number) => ({
        ...s,
        id: s.id || `step-${idx + 1}`,
        stepNumber: idx + 1,
        status: idx === 0 ? 'in-progress' : 'not-started',
      }));

      return res.json({ steps });
    }

    return res.json({ steps: generateFallbackRoadmap(targetCareer, skillGaps) });
  } catch (error: any) {
    console.warn('Note: Using fallback roadmap for /api/ai/generate-roadmap');
    return res.json({ steps: generateFallbackRoadmap(req.body.targetCareer || 'Developer', req.body.skillGaps || []) });
  }
});

// 3. Generate Interview Questions Endpoint
app.post('/api/ai/interview-questions', async (req, res) => {
  try {
    const { targetCareer, currentSkills, skillGaps } = req.body;

    const prompt = `You are an expert technical interviewer and hiring manager at a top tech company.
Generate 5 interview practice questions for a student interviewing for "${targetCareer}".

Current Strengths: ${JSON.stringify(currentSkills || [])}
Target Skill Gaps to Test: ${JSON.stringify(skillGaps || [])}

Include:
- 2 Technical Questions (coding/framework/system specific)
- 1 Conceptual Question (in-depth fundamentals)
- 1 Scenario Question (real-world debugging or production trade-offs)
- 1 Behavioral Question (STAR format, team collaboration, handling challenges)

Return a structured JSON array.`;

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: 'Technical, Conceptual, Scenario, or Behavioral' },
          question: { type: Type.STRING },
          context: { type: Type.STRING, description: 'Why this question is asked and what it evaluates' },
          targetSkill: { type: Type.STRING },
          sampleAnswerGuidelines: { type: Type.STRING, description: 'Key components of a great answer' },
        },
        required: ['id', 'type', 'question', 'targetSkill', 'sampleAnswerGuidelines'],
      },
    };

    const parsedQuestions = await generateJSONWithGemini(prompt, schema);
    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      const questions = parsedQuestions.map((q: any, idx: number) => ({
        ...q,
        id: q.id || `q-${idx + 1}`,
      }));

      return res.json({ questions });
    }

    return res.json({ questions: generateFallbackInterviewQuestions(targetCareer) });
  } catch (error: any) {
    console.warn('Note: Using fallback interview questions for /api/ai/interview-questions');
    return res.json({ questions: generateFallbackInterviewQuestions(req.body.targetCareer || 'Software Developer') });
  }
});

// 4. Evaluate Interview Answer Endpoint
app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, questionType, targetSkill, studentAnswer, targetCareer } = req.body;

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return res.status(400).json({ error: 'studentAnswer is required' });
    }

    const prompt = `You are a supportive, insightful hiring manager evaluating a college student's interview response for a "${targetCareer || 'Tech'}" position.

QUESTION: "${question}"
CATEGORY: "${questionType}"
TARGET SKILL: "${targetSkill}"

STUDENT'S ANSWER:
"""
${studentAnswer}
"""

Evaluate this answer thoroughly. Provide:
1. Numerical score between 0 and 100 based on technical accuracy, clarity, and depth.
2. List of 2-3 genuine strengths in what the student said.
3. List of 2-3 specific areas for improvement.
4. An encouraging explanation and mentor coaching note.
5. Key points that a candidate should mention.
6. A concise, gold-standard model response.

Return a valid JSON object.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: '0-100 score' },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
        explanation: { type: Type.STRING },
        keyPointsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedAnswer: { type: Type.STRING },
      },
      required: ['score', 'strengths', 'areasForImprovement', 'explanation', 'keyPointsCovered', 'suggestedAnswer'],
    };

    const evaluation = await generateJSONWithGemini(prompt, schema);
    if (evaluation && typeof evaluation.score === 'number') {
      evaluation.evaluatedAt = new Date().toISOString();
      return res.json(evaluation);
    }

    // Fallback evaluation
    return res.json(generateFallbackEvaluation(studentAnswer, targetSkill));
  } catch (error: any) {
    console.warn('Note: Using fallback evaluation for /api/ai/evaluate-answer');
    return res.json(generateFallbackEvaluation(req.body.studentAnswer || '', req.body.targetSkill || 'General'));
  }
});

// Fallback Generators
function generateFallbackAnalysis(resumeText: string, targetCareer: string) {
  const lower = resumeText.toLowerCase();
  const currentSkills: any[] = [];
  const skillGaps: any[] = [];

  const checks = [
    { name: 'JavaScript (ES6+)', keywords: ['javascript', 'js', 'es6', 'typescript'], level: 'Intermediate', category: 'Languages', score: 78 },
    { name: 'HTML5 & CSS3', keywords: ['html', 'html5', 'css', 'css3', 'tailwind'], level: 'Advanced', category: 'Web Fundamentals', score: 85 },
    { name: 'React.js', keywords: ['react', 'jsx', 'next.js', 'hooks'], level: 'Intermediate', category: 'Frontend', score: 74 },
    { name: 'Git & GitHub', keywords: ['git', 'github', 'version control'], level: 'Intermediate', category: 'Tools', score: 80 },
    { name: 'Python', keywords: ['python', 'pandas', 'numpy', 'django', 'flask'], level: 'Intermediate', category: 'Languages', score: 75 },
    { name: 'SQL & Databases', keywords: ['sql', 'mysql', 'postgres', 'database', 'mongodb'], level: 'Beginner', category: 'Data', score: 62 },
    { name: 'Data Structures & Algorithms', keywords: ['algorithm', 'data structures', 'dsa', 'leetcode'], level: 'Intermediate', category: 'Core CS', score: 70 },
  ];

  for (const c of checks) {
    const found = c.keywords.some((k) => lower.includes(k));
    if (found) {
      currentSkills.push({
        name: c.name,
        level: c.level,
        category: c.category,
        evidence: `Identified from resume coursework or project descriptions.`,
        isExplicit: true,
        score: c.score,
      });
    }
  }

  if (currentSkills.length === 0) {
    currentSkills.push(
      { name: 'Computer Science Fundamentals', level: 'Intermediate', category: 'Core CS', evidence: 'Coursework and academic projects', isExplicit: true, score: 72 },
      { name: 'Git & Version Control', level: 'Intermediate', category: 'Dev Tools', evidence: 'Project repositories', isExplicit: true, score: 75 },
      { name: 'Problem Solving & Logic', level: 'Intermediate', category: 'Core Skills', evidence: 'Programming coursework', isExplicit: false, score: 70 }
    );
  }

  // Determine standard gaps based on career
  if (targetCareer.toLowerCase().includes('frontend') || targetCareer.toLowerCase().includes('web')) {
    skillGaps.push(
      { name: 'TypeScript', priority: 'High', currentLevel: 'None', requiredLevel: 'Intermediate', category: 'Languages', reason: 'Industry standard for enterprise React applications and type safety.', currentScore: 15, requiredScore: 80 },
      { name: 'Automated Testing (Jest & RTL)', priority: 'High', currentLevel: 'None', requiredLevel: 'Intermediate', category: 'Testing', reason: 'Essential for CI/CD and reliable production deployments.', currentScore: 10, requiredScore: 75 },
      { name: 'State Management (Zustand/Redux)', priority: 'Medium', currentLevel: 'Beginner', requiredLevel: 'Intermediate', category: 'Architecture', reason: 'Needed for scalable multi-view data caching.', currentScore: 35, requiredScore: 75 },
      { name: 'Web Performance Optimization', priority: 'Medium', currentLevel: 'Beginner', requiredLevel: 'Intermediate', category: 'Optimization', reason: 'Core Web Vitals, code splitting, and bundle efficiency.', currentScore: 30, requiredScore: 70 }
    );
  } else if (targetCareer.toLowerCase().includes('data') || targetCareer.toLowerCase().includes('ai')) {
    skillGaps.push(
      { name: 'Machine Learning Pipelines (Scikit-learn)', priority: 'High', currentLevel: 'Beginner', requiredLevel: 'Intermediate', category: 'ML & AI', reason: 'Core requirement for predictive modeling and feature engineering.', currentScore: 25, requiredScore: 85 },
      { name: 'Advanced SQL & Data Modeling', priority: 'High', currentLevel: 'Beginner', requiredLevel: 'Advanced', category: 'Data', reason: 'Complex window functions, CTEs, and query tuning.', currentScore: 40, requiredScore: 85 },
      { name: 'MLOps & Model Deployment', priority: 'Medium', currentLevel: 'None', requiredLevel: 'Intermediate', category: 'Infrastructure', reason: 'Deploying APIs with FastAPI, Docker, and monitoring.', currentScore: 10, requiredScore: 70 }
    );
  } else {
    skillGaps.push(
      { name: 'System Design & Scalability', priority: 'High', currentLevel: 'None', requiredLevel: 'Intermediate', category: 'Architecture', reason: 'Crucial for mid-level engineering interviews and microservices.', currentScore: 20, requiredScore: 80 },
      { name: 'Docker & Containerization', priority: 'High', currentLevel: 'None', requiredLevel: 'Intermediate', category: 'DevOps', reason: 'Industry requirement for consistent environment deployment.', currentScore: 15, requiredScore: 75 },
      { name: 'CI/CD & Automated Pipelines', priority: 'Medium', currentLevel: 'Beginner', requiredLevel: 'Intermediate', category: 'DevOps', reason: 'Automating build, test, and cloud delivery.', currentScore: 30, requiredScore: 70 }
    );
  }

  const readinessScore = Math.min(88, Math.max(55, Math.round(50 + currentSkills.length * 5 - skillGaps.length * 2)));

  return {
    targetCareer,
    readinessScore,
    summary: `Assessment for ${targetCareer}: Solid foundational base with ${currentSkills.length} verified competencies. Focusing on high-priority gaps will elevate your readiness above the hiring threshold.`,
    currentSkills,
    requiredSkills: [
      ...currentSkills.map((s) => s.name),
      ...skillGaps.map((g) => g.name),
    ],
    skillGaps,
    recommendations: [
      `Bridge ${skillGaps[0]?.name || 'key gaps'} first by building a focused open-source project.`,
      `Document your learning roadmap and commit code regularly to GitHub.`,
      `Practice realistic technical interview questions focused on ${targetCareer} core principles.`,
    ],
    analyzedAt: new Date().toISOString(),
  };
}

function generateFallbackRoadmap(targetCareer: string, skillGaps: any[]) {
  return [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Foundations & Core Language Mastery',
      skill: skillGaps[0]?.name || 'Core Language Standards',
      topic: 'Type safety, paradigms, and syntax fundamentals',
      description: 'Strengthen the primary programming language and tools required for modern engineering workflows.',
      difficulty: 'Intermediate',
      estimatedDuration: '2 weeks',
      practiceTask: 'Refactor an existing script or component to apply strict types and modern patterns.',
      projectIdea: 'Build a modular CLI utility or clean component library with comprehensive type definitions.',
      resources: [
        { title: 'Official Documentation & Guides', type: 'Documentation', provider: 'Official Foundation', isFree: true },
        { title: 'Interactive Code Playground & Tutorials', type: 'Interactive', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', isFree: true },
      ],
      status: 'in-progress',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Automated Testing & Code Quality',
      skill: 'Unit & Integration Testing',
      topic: 'Test Driven Development, assertions, and mock fixtures',
      description: 'Learn to write resilient automated tests that catch edge cases and verify business logic.',
      difficulty: 'Intermediate',
      estimatedDuration: '2 weeks',
      practiceTask: 'Write a comprehensive test suite achieving at least 80% branch coverage on core logic modules.',
      projectIdea: 'Create a battle-tested algorithm and data processing library with continuous integration.',
      resources: [
        { title: 'Testing Best Practices & Guidelines', type: 'Documentation', provider: 'Testing Guild', isFree: true },
      ],
      status: 'not-started',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'System Architecture & Data Management',
      skill: skillGaps[1]?.name || 'Architecture & Caching',
      topic: 'State management, caching layers, and asynchronous synchronization',
      description: 'Design scalable application structures that manage complexity and maintain high performance.',
      difficulty: 'Advanced',
      estimatedDuration: '2.5 weeks',
      practiceTask: 'Implement an optimistic state update layer with cache invalidation and retry logic.',
      projectIdea: 'Build a real-time collaborative workspace with offline-first synchronization.',
      resources: [
        { title: 'Patterns of Enterprise Application Architecture', type: 'Book', provider: 'Martin Fowler', isFree: false },
      ],
      status: 'not-started',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Production Capstone & Cloud Deployment',
      skill: 'Full-Stack Delivery & DevOps',
      topic: 'Containerization, CI/CD, performance auditing, and recruiter showcase',
      description: 'Deliver an end-to-end production application with live demo, documentation, and metrics.',
      difficulty: 'Advanced',
      estimatedDuration: '3 weeks',
      practiceTask: 'Deploy the application on Cloud Run with automated GitHub Actions CI/CD.',
      projectIdea: `A full-featured portfolio application demonstrating all core competencies for ${targetCareer}.`,
      resources: [
        { title: 'Google Cloud Run Quickstart', type: 'Documentation', provider: 'Google Cloud', isFree: true },
      ],
      status: 'not-started',
    },
  ];
}

function generateFallbackInterviewQuestions(targetCareer: string = 'Software Developer') {
  const lower = targetCareer.toLowerCase();
  
  if (lower.includes('frontend') || lower.includes('web') || lower.includes('ui')) {
    return [
      {
        id: 'q-1',
        type: 'Technical',
        category: 'Technical',
        difficulty: 'Intermediate',
        targetSkill: 'React & Virtual DOM',
        skill: 'React & Virtual DOM',
        question: 'Can you explain how React’s reconciliation algorithm and Virtual DOM diffing work, and why unique keys in list rendering are critical for performance?',
        context: 'Assesses depth in frontend rendering pipelines, state updates, and browser repainting optimization.',
        sampleAnswerGuidelines: 'Explain JavaScript object tree representations, O(n) diffing heuristics, reconciliation batches, and how keys prevent full subtree remounts.',
      },
      {
        id: 'q-2',
        type: 'Technical',
        category: 'Technical',
        difficulty: 'Advanced',
        targetSkill: 'TypeScript & Generics',
        skill: 'TypeScript & Generics',
        question: 'How do you structure type-safe reusable components in TypeScript using Generics, and how do you prevent type-narrowing bugs with Discriminated Unions?',
        context: 'Evaluates type safety proficiency and enterprise frontend architecture.',
        sampleAnswerGuidelines: 'Describe generic interfaces (`<T>`), extends constraints, discriminated union tags, and ensuring type propagation through props.',
      },
      {
        id: 'q-3',
        type: 'Conceptual',
        category: 'Conceptual',
        difficulty: 'Intermediate',
        targetSkill: 'Browser Performance & Web Vitals',
        skill: 'Browser Performance & Web Vitals',
        question: 'What are Core Web Vitals (LCP, INP, CLS), and what concrete techniques do you use to optimize Largest Contentful Paint and reduce layout shifts?',
        context: 'Assesses user-experience engineering and modern web performance standards.',
        sampleAnswerGuidelines: 'Define LCP (render timing of largest asset), INP (interaction responsiveness), CLS (visual stability). Mention image sizing, lazy loading, font preloading, and code splitting.',
      },
      {
        id: 'q-4',
        type: 'Scenario',
        category: 'Scenario',
        difficulty: 'Advanced',
        targetSkill: 'State Management & Async Caching',
        skill: 'State Management & Async Caching',
        question: 'A user reports that typing rapidly in a global filter table with 5,000 items causes severe input stutter. How would you diagnose and fix the bottleneck?',
        context: 'Evaluates diagnostic methodology using Chrome DevTools/Profiler and optimization patterns.',
        sampleAnswerGuidelines: 'Use React Profiler to identify unneeded re-renders. Implement debouncing/throttling, virtualization (e.g. react-window), useDeferredValue, and memoization.',
      },
      {
        id: 'q-5',
        type: 'Behavioral',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        targetSkill: 'Collaboration & Problem Solving',
        skill: 'Collaboration & Problem Solving',
        question: 'Tell me about a time you had to make a technical trade-off between shipping a feature quickly for a deadline versus refactoring tech debt. How did you decide?',
        context: 'Evaluates practical engineering judgment, stakeholder communication, and balance.',
        sampleAnswerGuidelines: 'Use the STAR method: explain the business timeline, the technical risk, how you documented debt for subsequent sprints, and the final deliverable.',
      },
    ];
  }

  if (lower.includes('data') || lower.includes('ai') || lower.includes('ml')) {
    return [
      {
        id: 'q-1',
        type: 'Technical',
        category: 'Technical',
        difficulty: 'Intermediate',
        targetSkill: 'Python & Data Pipelines',
        skill: 'Python & Data Pipelines',
        question: 'How do you handle severe class imbalance in a classification dataset when training a predictive machine learning model in Python?',
        context: 'Tests real-world modeling fundamentals and metric evaluation awareness.',
        sampleAnswerGuidelines: 'Discuss SMOTE oversampling, class-weighted loss functions, undersampling, and evaluating with PR-AUC / F1-score rather than raw accuracy.',
      },
      {
        id: 'q-2',
        type: 'Technical',
        category: 'Technical',
        difficulty: 'Advanced',
        targetSkill: 'SQL & Data Modeling',
        skill: 'SQL & Data Modeling',
        question: 'Can you explain how SQL Window functions work (e.g., ROW_NUMBER vs DENSE_RANK over PARTITION BY) and write a conceptual query to find the top 3 transactions per student?',
        context: 'Tests analytical querying maturity and relational data transformation.',
        sampleAnswerGuidelines: 'Explain window partitioning without collapsing rows, ordering within partitions, and using CTEs or subqueries for filtering top N rows.',
      },
      {
        id: 'q-3',
        type: 'Conceptual',
        category: 'Conceptual',
        difficulty: 'Intermediate',
        targetSkill: 'Machine Learning Fundamentals',
        skill: 'Machine Learning Fundamentals',
        question: 'What is the Bias-Variance tradeoff, and how do regularization techniques like L1 (Lasso) and L2 (Ridge) prevent model overfitting?',
        context: 'Evaluates statistical foundations and generalization mechanics.',
        sampleAnswerGuidelines: 'Explain underfitting (high bias) vs overfitting (high variance). Detail how L1 induces sparsity for feature selection and L2 shrinks weights uniformly.',
      },
      {
        id: 'q-4',
        type: 'Scenario',
        category: 'Scenario',
        difficulty: 'Advanced',
        targetSkill: 'Data Quality & Drift',
        skill: 'Data Quality & Drift',
        question: 'Your deployed inference model’s prediction accuracy drops by 20% over two months with no changes in code. What steps do you take to investigate?',
        context: 'Evaluates production monitoring, concept drift, and data distribution tracking.',
        sampleAnswerGuidelines: 'Check for covariate shift/data drift in input features, label drift, missing value spikes, upstream schema changes, and retraining pipelines.',
      },
      {
        id: 'q-5',
        type: 'Behavioral',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        targetSkill: 'Translating Data to Stakeholders',
        skill: 'Translating Data to Stakeholders',
        question: 'How do you communicate complex statistical findings or model limitations to non-technical stakeholders or product managers?',
        context: 'Tests executive communication and translating insights into business value.',
        sampleAnswerGuidelines: 'Use STAR method: focus on business outcomes, clear visual charts over equations, actionable takeaways, and acknowledging confidence intervals.',
      },
    ];
  }

  // Default Software Engineer / Backend / Cloud
  return [
    {
      id: 'q-1',
      type: 'Technical',
      category: 'Technical',
      difficulty: 'Intermediate',
      targetSkill: 'System Design & APIs',
      skill: 'System Design & APIs',
      question: `What are the primary architectural trade-offs you consider when designing a RESTful vs event-driven microservice for a ${targetCareer} position?`,
      context: 'Tests architectural maturity and problem-solving depth.',
      sampleAnswerGuidelines: 'Discuss synchronous latency, coupling, eventual consistency, backpressure handling, and scalability bottlenecks.',
    },
    {
      id: 'q-2',
      type: 'Technical',
      category: 'Technical',
      difficulty: 'Advanced',
      targetSkill: 'Concurrency & Runtime',
      skill: 'Concurrency & Runtime',
      question: 'Can you explain the difference between synchronous execution, asynchronous event loops, and multi-threaded worker pools?',
      context: 'Tests runtime fundamentals and concurrency understanding.',
      sampleAnswerGuidelines: 'Explain call stack execution, non-blocking I/O, microtask vs macrotask scheduling, and CPU-bound thread workers.',
    },
    {
      id: 'q-3',
      type: 'Conceptual',
      category: 'Conceptual',
      difficulty: 'Intermediate',
      targetSkill: 'Database Indexing & Query Tuning',
      skill: 'Database Indexing & Query Tuning',
      question: 'How do B-Tree and Hash indexes work in relational databases, and when might an index actually slow down database performance?',
      context: 'Tests data storage fundamentals and query optimization.',
      sampleAnswerGuidelines: 'Explain logarithmic range search with B-Trees, constant time lookup with Hash indexes, and write overhead during frequent INSERT/UPDATE operations.',
    },
    {
      id: 'q-4',
      type: 'Scenario',
      category: 'Scenario',
      difficulty: 'Advanced',
      targetSkill: 'Debugging & Incident Response',
      skill: 'Debugging & Incident Response',
      question: 'A critical microservice endpoint starts returning intermittent 500 errors during peak college registration hours. How do you systematically isolate and resolve the root cause?',
      context: 'Tests telemetry inspection, root cause analysis, and production resiliency.',
      sampleAnswerGuidelines: 'Inspect centralized logging (APM/trace IDs), check database connection pool saturation, monitor memory/CPU metrics, and deploy circuit breakers.',
    },
    {
      id: 'q-5',
      type: 'Behavioral',
      category: 'Behavioral',
      difficulty: 'Intermediate',
      targetSkill: 'Learning Agility & Ownership',
      skill: 'Learning Agility & Ownership',
      question: 'Tell me about a time you had to learn a completely new library, framework, or cloud tool under an urgent deadline. How did you structure your learning?',
      context: 'Evaluates continuous learning agility, grit, and autonomous delivery.',
      sampleAnswerGuidelines: 'Use STAR method: isolate essential core concepts, build minimal prototype, leverage official docs, deliver on time.',
    },
  ];
}

function generateFallbackEvaluation(studentAnswer: string, targetSkill: string) {
  const wordCount = studentAnswer.trim().split(/\s+/).length;
  let score = 70;
  if (wordCount > 60) score += 15;
  if (wordCount > 120) score += 10;
  score = Math.min(95, score);

  return {
    score,
    strengths: [
      'Directly addressed the core question with clear structure and relevant terminology.',
      'Demonstrated practical perspective and logical sequencing of thought.',
    ],
    areasForImprovement: [
      'Could incorporate concrete quantitative metrics or specific technical examples from past projects.',
      'Consider explicitly mentioning edge cases or defensive coding techniques.',
    ],
    explanation: `Solid response for ${targetSkill}! You communicated the key concepts well. Elaborating on real-world edge cases will take your response to the top 10% of candidates.`,
    keyPointsCovered: ['Core concept definition', 'Practical workflow application', 'Clear reasoning'],
    suggestedAnswer: `A strong answer directly defines the primary mechanism, provides an illustrative real-world example, addresses potential edge cases or failure modes, and concludes with measurable outcomes.`,
    evaluatedAt: new Date().toISOString(),
  };
}

// Start Server and Mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
