import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InterviewPage } from './pages/InterviewPage';

import {
  getCurrentUser,
  subscribeToAuth,
  enableDemoMode,
  logout,
  setCurrentUser,
} from './services/authService';
import { StudentProfile } from './types';
import { DEMO_STUDENT_PROFILE } from './data/mockData';

export function App() {
  const [user, setUser] = useState<StudentProfile | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [preselectedCareer, setPreselectedCareer] = useState<string>('Frontend Developer');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  // Keep auth state in sync
  useEffect(() => {
    const unsub = subscribeToAuth((updatedUser) => {
      setUser(updatedUser);
    });
    return unsub;
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleTryDemo = () => {
    const demo = enableDemoMode();
    setUser(demo);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveTab('landing');
  };

  const handleSelectCareerFromLanding = (career: string) => {
    setPreselectedCareer(career);
    if (!user) {
      enableDemoMode();
    }
    setActiveTab('upload');
  };

  const handleNavigate = (tab: string) => {
    // If tab requires auth and user is not logged in, launch demo automatically or open auth modal
    if (['dashboard', 'skill-gaps', 'roadmap', 'interview'].includes(tab) && !user) {
      enableDemoMode();
      setActiveTab(tab);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020817] text-[#F4FAFF] font-sans selection:bg-[#16E0FF] selection:text-[#020817]">
      {/* Demo Banner */}
      <DemoBanner
        user={user}
        onUploadCustom={() => {
          setActiveTab('upload');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetDemo={() => {
          enableDemoMode();
        }}
        onExitDemo={() => {
          logout();
          setActiveTab('landing');
        }}
      />

      {/* Main Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onTryDemo={handleTryDemo}
      />

      {/* Main Application Router / View Switcher */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              if (user) {
                setActiveTab('dashboard');
              } else {
                handleOpenAuth('signup');
              }
            }}
            onTryDemo={handleTryDemo}
            onSelectCareer={handleSelectCareerFromLanding}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            user={user}
            onNavigate={handleNavigate}
            onSelectCareerChange={() => {
              setActiveTab('upload');
            }}
          />
        )}

        {activeTab === 'upload' && (
          <ResumeUploadPage
            user={user}
            preselectedCareer={preselectedCareer}
            onAnalysisComplete={() => {
              setActiveTab('skill-gaps');
            }}
          />
        )}

        {activeTab === 'skill-gaps' && (
          <SkillGapPage
            user={user}
            onNavigateRoadmap={() => setActiveTab('roadmap')}
            onNavigateInterview={() => setActiveTab('interview')}
            onReupload={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapPage
            user={user}
            onNavigateInterview={() => setActiveTab('interview')}
            onReanalyze={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPage
            user={user}
            onNavigateRoadmap={() => setActiveTab('roadmap')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} onTryDemo={handleTryDemo} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}

export default App;
