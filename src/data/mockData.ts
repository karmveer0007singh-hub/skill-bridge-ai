import { CareerOption, StudentProfile, SkillAnalysisResult, RoadmapStep, InterviewQuestion } from '../types';

export const POPULAR_CAREERS: CareerOption[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Web Development',
    description: 'Build interactive, performant user interfaces and web applications using modern web standards.',
    iconName: 'Layout',
    popularSkills: ['React', 'TypeScript', 'JavaScript', 'CSS/Tailwind', 'HTML5', 'Next.js', 'Testing/Jest'],
    averageReadinessBenchmark: 82,
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    category: 'Core Engineering',
    description: 'Design, develop, and maintain general software systems and robust algorithmic applications.',
    iconName: 'Code2',
    popularSkills: ['Data Structures & Algorithms', 'Python/Java', 'Git', 'System Design', 'OOP', 'SQL', 'Unit Testing'],
    averageReadinessBenchmark: 80,
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Server Engineering',
    description: 'Architect scalable APIs, microservices, databases, authentication, and server infrastructure.',
    iconName: 'Server',
    popularSkills: ['Node.js', 'PostgreSQL', 'REST/GraphQL APIs', 'Docker', 'Redis', 'Auth & Security', 'Python/Go'],
    averageReadinessBenchmark: 85,
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    category: 'Web & Systems',
    description: 'Deliver end-to-end applications bridging rich frontend UIs and resilient backend architectures.',
    iconName: 'Layers',
    popularSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'Cloud Deployment', 'REST APIs'],
    averageReadinessBenchmark: 84,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Analytics & Insights',
    description: 'Transform complex datasets into actionable business intelligence, dashboards, and growth insights.',
    iconName: 'BarChart3',
    popularSkills: ['SQL', 'Python (Pandas)', 'Tableau / PowerBI', 'Excel Modeling', 'Statistical Analysis', 'Data Cleaning'],
    averageReadinessBenchmark: 78,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'AI & Data Science',
    description: 'Develop predictive models, machine learning pipelines, statistical inferences, and big data models.',
    iconName: 'BrainCircuit',
    popularSkills: ['Python', 'Scikit-learn', 'SQL', 'Deep Learning', 'Pandas/NumPy', 'Probability & Stats', 'Data Viz'],
    averageReadinessBenchmark: 86,
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description: 'Train, fine-tune, optimize, and deploy state-of-the-art machine learning and generative AI models to production.',
    iconName: 'Sparkles',
    popularSkills: ['PyTorch / TensorFlow', 'LLM Fine-Tuning & RAG', 'Python', 'MLOps & CI/CD', 'Vector DBs', 'Model Evaluation'],
    averageReadinessBenchmark: 88,
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Operations',
    description: 'Protect enterprise infrastructure, analyze vulnerabilities, monitor threats, and enforce security policies.',
    iconName: 'ShieldAlert',
    popularSkills: ['Network Security', 'SIEM & SOC Tools', 'Vulnerability Assessment', 'Linux & Scripting', 'Cryptography', 'Ethical Hacking'],
    averageReadinessBenchmark: 83,
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Product Design',
    description: 'Craft intuitive user journeys, wireframes, high-fidelity prototypes, and design systems for web and mobile.',
    iconName: 'Palette',
    popularSkills: ['Figma', 'User Research', 'Design Systems', 'Wireframing & Prototyping', 'Usability Testing', 'Interaction Design'],
    averageReadinessBenchmark: 79,
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description: 'Architect, automate, and manage resilient cloud infrastructure, CI/CD pipelines, and container clusters.',
    iconName: 'Cloud',
    popularSkills: ['AWS / GCP / Azure', 'Docker & Kubernetes', 'Terraform (IaC)', 'CI/CD Pipelines', 'Linux Administration', 'Monitoring & Grafana'],
    averageReadinessBenchmark: 85,
  },
];

export const SAMPLE_RESUMES = [
  {
    id: 'cs-junior-web',
    title: 'Sample CS Junior (Frontend Web Developer)',
    role: 'Frontend Developer',
    description: 'Has solid HTML, CSS, JavaScript, React basics and coursework, looking to break into Frontend Engineering.',
    text: `Candidate Resume
San Jose State University - B.S. in Computer Science (Expected May 2026)
Coursework: Data Structures & Algorithms, Object-Oriented Programming, Web Systems, Database Concepts, Software Engineering Principles.

TECHNICAL SKILLS:
Languages: JavaScript (ES6+), HTML5, CSS3, Java, Python (Basics), C++
Frameworks & Libraries: React.js, Tailwind CSS, Bootstrap, Node.js (Introductory)
Developer Tools: Git, GitHub, VS Code, Webpack, Figma (Basics), npm/yarn
Databases: MySQL (Basic queries)

PROJECTS:
1. CampusEventFinder (React, Tailwind, LocalStorage)
- Created a single-page responsive web app for college students to discover club events on campus.
- Utilized React functional components, useState/useEffect hooks, and Tailwind CSS for mobile-first styling.
- Integrated browser LocalStorage to allow students to bookmark favorite events.

2. Interactive Quiz Web App (Vanilla JavaScript, HTML5, CSS3)
- Built a timed interactive quiz game featuring dynamic score tracking and custom feedback.
- Used DOM manipulation and event listeners to render quiz questions dynamically from a JSON array.

EXPERIENCE:
Computer Science Peer Tutor | Tutoring Center (Sept 2024 - Present)
- Mentored over 40 undergraduate students in introductory Java and JavaScript fundamentals.
- Assisted students in debugging recursion, array manipulation, and DOM rendering issues.`
  },
  {
    id: 'aspiring-data-scientist',
    title: 'Maya Patel (Statistics Major - Data Aspirant)',
    role: 'Data Scientist',
    description: 'Strong foundation in Python, Statistics, and SQL; needs hands-on Machine Learning, Scikit-learn, and MLOps.',
    text: `Maya Patel
UC Berkeley - B.A. in Statistics & Data Science (Expected Dec 2025)
Email: maya.patel@berkeley.edu | Kaggle: kaggle.com/mayapatel

EDUCATION:
UC Berkeley, B.A. in Statistics & Data Science (GPA: 3.8)
Relevant Coursework: Linear Algebra, Probability Theory, Applied Regression, Computational Statistics, Database Management.

TECHNICAL SKILLS:
Languages: Python, R, SQL (PostgreSQL), Bash
Libraries & Tools: Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebooks, Excel, Git
Concepts: Exploratory Data Analysis (EDA), Hypothesis Testing, Linear & Logistic Regression, Data Cleaning

PROJECTS:
1. Airbnb Rental Price Predictor (Python, Pandas, Statsmodels)
- Analyzed 50,000+ listings in San Francisco; conducted data wrangling, missing value imputation, and feature engineering.
- Built a multivariable regression model explaining 71% of price variance with diagnostic residual plots.

2. Student Mental Health Survey Analysis (R, ggplot2)
- Cleaned and surveyed cross-sectional data across 1,200 respondents; performed ANOVA and Chi-Square tests to derive insights.`
  },
  {
    id: 'cybersecurity-student',
    title: 'Jordan Lee (Information Systems - Security Track)',
    role: 'Cybersecurity Analyst',
    description: 'Good grasp of networking, Linux, and basic Wireshark; missing SIEM tools, penetration testing, and incident response.',
    text: `Jordan Lee
University of Texas at Dallas - B.S. in Information Technology & Cybersecurity (Expected May 2026)
Email: jordan.lee@utdallas.edu | LinkedIn: linkedin.com/in/jordanlee-cyber

TECHNICAL SKILLS:
Security Concepts: Network Protocols (TCP/IP, DNS, DHCP), Firewalls, Linux Administration, Access Control (IAM)
Tools: Wireshark, Nmap, Kali Linux, VirtualBox, Bash Scripting, Burp Suite (Community)
Certifications: CompTIA Security+ (In Progress, scheduled Nov 2025)

PROJECTS & LABS:
1. Home Lab Network Intrusion Detection
- Configured a virtualized pfSense firewall and monitored anomalous network traffic using Wireshark and Nmap scans.
- Documented malicious packet signatures and firewall block rules.

2. Password Hash Cracking Benchmark
- Evaluated performance of MD5 vs SHA-256 password hash cracking in Kali Linux using Hashcat on isolated test datasets.`
  }
];

export const DEFAULT_ANALYSIS_RESULT: SkillAnalysisResult = {
  targetCareer: 'Frontend Developer',
  readinessScore: 72,
  summary: 'Candidate shows strong foundations in core web fundamentals (HTML5, CSS3, modern JavaScript) and practical React components. To reach top-tier Frontend Engineer benchmarks, focus on mastering TypeScript, automated testing (Jest/RTL), and modern state management.',
  currentSkills: [
    {
      name: 'HTML5 & Semantic Markup',
      level: 'Advanced',
      category: 'Web Fundamentals',
      evidence: 'Built multiple responsive applications and semantic structures in CampusEventFinder project.',
      isExplicit: true,
      score: 88,
    },
    {
      name: 'CSS3 & Tailwind CSS',
      level: 'Intermediate',
      category: 'Styling & UI',
      evidence: 'Used Tailwind CSS and responsive design patterns in CampusEventFinder and Quiz apps.',
      isExplicit: true,
      score: 78,
    },
    {
      name: 'JavaScript (ES6+)',
      level: 'Intermediate',
      category: 'Programming Languages',
      evidence: 'Utilized arrow functions, destructuring, promises, array methods, and DOM manipulation; peer tutor for JS.',
      isExplicit: true,
      score: 80,
    },
    {
      name: 'React.js Fundamentals',
      level: 'Intermediate',
      category: 'Frontend Frameworks',
      evidence: 'Demonstrated useState, useEffect, functional components, and props in CampusEventFinder.',
      isExplicit: true,
      score: 72,
    },
    {
      name: 'Git & Version Control',
      level: 'Intermediate',
      category: 'Dev Tools',
      evidence: 'Maintained repositories on GitHub with regular commits and branching.',
      isExplicit: true,
      score: 75,
    },
    {
      name: 'Responsive Web Design',
      level: 'Intermediate',
      category: 'UI/UX Engineering',
      evidence: 'Engineered mobile-first layouts and flexbox/grid containers.',
      isExplicit: true,
      score: 76,
    },
    {
      name: 'DOM Manipulation & Events',
      level: 'Advanced',
      category: 'Web Fundamentals',
      evidence: 'Created dynamic quiz game with extensive event listener management.',
      isExplicit: true,
      score: 84,
    },
    {
      name: 'Component Architecture',
      level: 'Intermediate',
      category: 'Frontend Architecture',
      evidence: 'Inferred from structured modular React code in event finder project.',
      isExplicit: false,
      score: 70,
    },
  ],
  requiredSkills: [
    'HTML5 & Semantic Markup',
    'CSS3 & Tailwind CSS',
    'JavaScript (ES6+)',
    'React.js Ecosystem',
    'TypeScript',
    'State Management (Zustand/Redux)',
    'Frontend Testing (Jest & React Testing Library)',
    'Web Performance & Optimization',
    'Next.js & SSR Concepts',
    'Git & CI/CD Basics',
  ],
  skillGaps: [
    {
      name: 'TypeScript',
      priority: 'High',
      currentLevel: 'None',
      requiredLevel: 'Intermediate',
      category: 'Languages',
      reason: 'Over 85% of modern frontend engineering roles require TypeScript for type-safe React applications and API contracts.',
      currentScore: 15,
      requiredScore: 80,
    },
    {
      name: 'Frontend Testing (Jest & RTL)',
      priority: 'High',
      currentLevel: 'None',
      requiredLevel: 'Intermediate',
      category: 'Quality Assurance',
      reason: 'No automated unit or component testing evidence was found on the resume; crucial for production frontend roles.',
      currentScore: 10,
      requiredScore: 75,
    },
    {
      name: 'Advanced State Management',
      priority: 'Medium',
      currentLevel: 'Beginner',
      requiredLevel: 'Intermediate',
      category: 'Frontend Frameworks',
      reason: 'Resume demonstrates basic useState and LocalStorage; global state libraries (Zustand, Redux Toolkit, or TanStack Query) are expected.',
      currentScore: 35,
      requiredScore: 75,
    },
    {
      name: 'Web Performance & Core Web Vitals',
      priority: 'Medium',
      currentLevel: 'Beginner',
      requiredLevel: 'Intermediate',
      category: 'Optimization',
      reason: 'Understanding bundle optimization, lazy loading, image optimization, and lighthouse metrics is critical for junior-to-mid career progression.',
      currentScore: 30,
      requiredScore: 70,
    },
    {
      name: 'Next.js & Server Components',
      priority: 'Low',
      currentLevel: 'None',
      requiredLevel: 'Beginner',
      category: 'Modern Frameworks',
      reason: 'Industry standard for modern production React applications with SSR, SSG, and API route handling.',
      currentScore: 10,
      requiredScore: 65,
    },
  ],
  recommendations: [
    'Migrate a previous JavaScript React project to TypeScript to immediately showcase type safety on GitHub.',
    'Write at least 5 component unit tests using React Testing Library to demonstrate testing proficiency.',
    'Build a full-featured CRUD dashboard integrating TanStack Query and Zustand for async state handling.',
    'Highlight performance optimizations (code splitting, memoization) in resume bullet points with measurable outcomes.',
  ],
  analyzedAt: new Date().toISOString(),
};

export const DEFAULT_ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'TypeScript for Modern React',
    skill: 'TypeScript',
    topic: 'Static Typing, Generics, and React Component Typing',
    description: 'Master TypeScript fundamentals and seamlessly type React props, state, custom hooks, and API responses.',
    difficulty: 'Intermediate',
    estimatedDuration: '2 weeks',
    practiceTask: 'Convert an existing Vanilla JS React component (e.g. Card, Modal, or Form) into strict TypeScript with typed interfaces.',
    projectIdea: 'Build a Type-Safe Kanban Task Board with drag-and-drop, strict status enums, and localStorage persistence.',
    resources: [
      {
        title: 'TypeScript Official Handbook',
        type: 'Documentation',
        provider: 'Microsoft',
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        isFree: true,
      },
      {
        title: 'React TypeScript Cheatsheet',
        type: 'Interactive',
        provider: 'React TypeScript Community',
        url: 'https://react-typescript-cheatsheet.netlify.app/',
        isFree: true,
      },
      {
        title: 'Total TypeScript Core Tutorial',
        type: 'Tutorial',
        provider: 'Matt Pocock',
        isFree: true,
      },
    ],
    status: 'in-progress',
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Automated Frontend Testing',
    skill: 'Jest & React Testing Library',
    topic: 'Unit Testing, User Event Simulation, and Mocking APIs',
    description: 'Learn how to write resilient unit and integration tests that simulate actual user behavior rather than implementation details.',
    difficulty: 'Intermediate',
    estimatedDuration: '2 weeks',
    practiceTask: 'Write unit tests for a login form validating email format, loading spinner display, and error message rendering.',
    projectIdea: 'Create a fully test-covered Shopping Cart widget with at least 80% branch code coverage.',
    resources: [
      {
        title: 'React Testing Library Documentation & Guiding Principles',
        type: 'Documentation',
        provider: 'Testing Library Org',
        url: 'https://testing-library.com/docs/react-testing-library/intro/',
        isFree: true,
      },
      {
        title: 'Common Mistakes with React Testing Library',
        type: 'Article',
        provider: 'Kent C. Dodds Blog',
        url: 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
        isFree: true,
      },
    ],
    status: 'not-started',
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Advanced State & Data Fetching',
    skill: 'TanStack Query & Zustand',
    topic: 'Server State Caching, Optimistic UI, and Lightweight Global State',
    description: 'Move beyond prop-drilling with modern lightweight global state management and efficient server-cache synchronization.',
    difficulty: 'Intermediate',
    estimatedDuration: '2 weeks',
    practiceTask: 'Implement TanStack Query to fetch a public REST API (e.g. GitHub Repos or OpenWeather) with automatic refetching and error retry.',
    projectIdea: 'Build an E-Commerce Product Catalog with live search filtering, optimistic cart updates, and persistent Zustand store.',
    resources: [
      {
        title: 'TanStack Query (React Query) Official Docs',
        type: 'Documentation',
        provider: 'TanStack',
        url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
        isFree: true,
      },
      {
        title: 'Zustand State Management Guide',
        type: 'Documentation',
        provider: 'Pmndrs',
        url: 'https://zustand.docs.pmnd.rs/getting-started/introduction',
        isFree: true,
      },
    ],
    status: 'not-started',
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Web Performance & Core Web Vitals',
    skill: 'Performance Optimization',
    topic: 'Code Splitting, Lazy Loading, Image Optimization, and React Memoization',
    description: 'Learn how to inspect Chrome DevTools Performance tabs, measure Largest Contentful Paint (LCP), and eliminate unnecessary re-renders.',
    difficulty: 'Advanced',
    estimatedDuration: '1.5 weeks',
    practiceTask: 'Audit an existing web page using Lighthouse and resolve at least 3 performance flags (e.g. unoptimized images or layout shifts).',
    projectIdea: 'Create a high-speed Image Gallery with virtualized infinite scrolling (react-window) and lazy blur-up placeholders.',
    resources: [
      {
        title: 'Web.dev - Learn Core Web Vitals',
        type: 'Documentation',
        provider: 'Google Chrome Team',
        url: 'https://web.dev/learn/performance',
        isFree: true,
      },
      {
        title: 'React Profiler & Optimization Guide',
        type: 'Tutorial',
        provider: 'React Dev Docs',
        url: 'https://react.dev/reference/react/memo',
        isFree: true,
      },
    ],
    status: 'not-started',
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Modern Full-Stack React with Next.js',
    skill: 'Next.js & App Router',
    topic: 'Server Components, SSR/SSG, Route Handlers, and SEO',
    description: 'Understand the difference between Client and Server Components, fast metadata generation, and production deployment on Vercel/Cloud Run.',
    difficulty: 'Intermediate',
    estimatedDuration: '2.5 weeks',
    practiceTask: 'Build a markdown-powered developer blog using Next.js App Router and dynamic metadata for SEO.',
    projectIdea: 'Build a Developer Bookmark SaaS with authentication, database integration, and public shareable profiles.',
    resources: [
      {
        title: 'Next.js Learn Interactive Course',
        type: 'Interactive',
        provider: 'Vercel',
        url: 'https://nextjs.org/learn',
        isFree: true,
      },
      {
        title: 'React Server Components Architecture Explained',
        type: 'Article',
        provider: 'Dan Abramov',
        isFree: true,
      },
    ],
    status: 'not-started',
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Capstone Portfolio Project & Deployment',
    skill: 'End-to-End System Delivery',
    topic: 'Production Architecture, Accessibility (a11y), CI/CD & Resume Polish',
    description: 'Synthesize all newly acquired skills into a showcase portfolio project that directly addresses hiring manager criteria.',
    difficulty: 'Advanced',
    estimatedDuration: '3 weeks',
    practiceTask: 'Write a comprehensive README with architecture diagrams, setup scripts, test instructions, and live deployment link.',
    projectIdea: 'SkillBridge or Developer Community Portal with real-time features, automated test suite in GitHub Actions, and 95+ Lighthouse score.',
    resources: [
      {
        title: 'A11y Project - Accessibility Checklist',
        type: 'Documentation',
        provider: 'The A11Y Project',
        url: 'https://www.a11yproject.com/checklist/',
        isFree: true,
      },
      {
        title: 'GitHub Actions for Automated CI/CD Testing',
        type: 'Tutorial',
        provider: 'GitHub Documentation',
        url: 'https://docs.github.com/en/actions',
        isFree: true,
      },
    ],
    status: 'not-started',
  },
];

export const DEFAULT_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q-1',
    type: 'Technical',
    targetSkill: 'JavaScript & React',
    question: 'Can you explain the difference between the virtual DOM and the real DOM in React, and how React\'s reconciliation algorithm determines what needs to be re-rendered?',
    context: 'Assesses depth in React rendering mechanics and optimization principles.',
    sampleAnswerGuidelines: 'Should mention JavaScript object representation, diffing heuristics (O(n)), keys for list identity, and batching updates.',
  },
  {
    id: 'q-2',
    type: 'Technical',
    targetSkill: 'TypeScript',
    question: 'How do TypeScript Generics work, and when would you use a Generic Interface or Type over an `any` or `unknown` type in a reusable React component?',
    context: 'Targets candidate identified skill gap in TypeScript.',
    sampleAnswerGuidelines: 'Should explain type safety retention, generic syntax `<T>`, and component prop reuse with typed return values.',
  },
  {
    id: 'q-3',
    type: 'Scenario',
    targetSkill: 'Performance Optimization',
    question: 'Imagine a customer reports that a searchable table with 1,000 items is lagging when they type into the filter input. What steps would you take to diagnose and solve the problem?',
    context: 'Tests real-world frontend debugging and performance troubleshooting.',
    sampleAnswerGuidelines: 'Diagnose with React Profiler/Performance tab. Solutions: Debouncing input, virtualization (react-window), useMemo, useDeferredValue or useTransition.',
  },
  {
    id: 'q-4',
    type: 'Conceptual',
    targetSkill: 'Frontend Testing',
    question: 'Why does React Testing Library recommend querying elements by Role (e.g. `getByRole`) rather than by test ID or class name?',
    context: 'Assesses automated testing mindset and user accessibility empathy.',
    sampleAnswerGuidelines: 'Tests user accessibility tree, enforces proper semantic HTML/ARIA attributes, and prevents fragile tests tied to class names.',
  },
  {
    id: 'q-5',
    type: 'Behavioral',
    targetSkill: 'Communication & Teamwork',
    question: 'Describe a situation during a project or coursework where you encountered a difficult bug right before a deadline. How did you handle the situation and communicate with your team?',
    context: 'Evaluates resilience, structured problem solving, and professional composure.',
    sampleAnswerGuidelines: 'Use STAR method: Situation, Task, Action (systematic isolation, asking for help, prioritizing essential path), Result.',
  },
];
