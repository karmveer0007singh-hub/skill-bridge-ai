import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InterviewPage } from './pages/InterviewPage';

import {
  getCurrentUser,
  subscribeToAuth,
  logout,
  setCurrentUser,
} from './services/authService';
import { subscribeToSupabaseAuth, fetchProfileFromSupabase } from './services/supabaseClient';
import { StudentProfile } from './types';

export function App() {
  const [user, setUser] = useState<StudentProfile | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [preselectedCareer, setPreselectedCareer] = useState<string>('');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Keep auth state in sync
  useEffect(() => {
    const unsub = subscribeToAuth((updatedUser) => {
      setUser(updatedUser);
    });

    const unsubSupabase = subscribeToSupabaseAuth(async (_event, session) => {
      if (session?.user && !getCurrentUser()) {
        const email = session.user.email;
        if (email) {
          const profile = await fetchProfileFromSupabase(email);
          if (profile) {
            setCurrentUser(profile);
          }
        }
      }
    });

    return () => {
      unsub();
      if (unsubSupabase) unsubSupabase();
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveTab('landing');
  };

  const handleSelectCareerFromLanding = (career: string) => {
    setPreselectedCareer(career);
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    if (['dashboard', 'skill-gaps', 'roadmap', 'interview'].includes(tab) && !user) {
      handleOpenAuth('login');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020817] text-[#F4FAFF] font-sans selection:bg-[#16E0FF] selection:text-[#020817]">
      {/* Main Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSupabase={() => setSupabaseModalOpen(true)}
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
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setActiveTab('dashboard');
        }}
      />

      {/* Supabase Cloud Connection Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default App;
