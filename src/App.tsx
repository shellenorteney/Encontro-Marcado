/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, MatchPair } from './types/profile';
import { INITIAL_SEED_PROFILES } from './data/seedData';
import { findMatchesForUser, calculateMatch } from './utils/matchEngine';
import { StartScreen } from './components/StartScreen';
import { RegistrationWizard } from './components/RegistrationWizard';
import { SuccessAndMatchView } from './components/SuccessAndMatchView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';

const STORAGE_KEY = 'conexao_sud_profiles';
const MATCHES_STORAGE_KEY = 'conexao_sud_matches';

export default function App() {
  const [view, setView] = useState<'start' | 'wizard' | 'success' | 'admin'>('start');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Load profiles from localStorage or seed
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            mission: p.mission || { served: true, location: 'Brasil' },
            personality: p.personality || 'ambivertido',
            situations: p.situations || {
              arrivalAtParty: 'ajudar',
              rainySaturday: 'pizza',
              surpriseTrip: 'historica',
            },
            preferences: {
              ...p.preferences,
              missionRequirement: p.preferences?.missionRequirement || 'any',
            },
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load profiles from storage', e);
    }
    return INITIAL_SEED_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userMatches, setUserMatches] = useState<MatchPair[]>([]);
  const [allMatches, setAllMatches] = useState<MatchPair[]>([]);

  // Recalculate all matches whenever profiles change
  useEffect(() => {
    const computedMatches: MatchPair[] = [];
    const seenPairs = new Set<string>();

    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const uA = profiles[i];
        const uB = profiles[j];
        const pairKey = [uA.id, uB.id].sort().join('-');

        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          const match = calculateMatch(uA, uB);
          if (match) {
            computedMatches.push(match);
          }
        }
      }
    }

    setAllMatches(computedMatches);

    // Save profiles to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles', e);
    }
  }, [profiles]);

  const handleStartRegistration = () => {
    setView('wizard');
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setView('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setView('start');
  };

  const handleCompleteRegistration = (newProfile: UserProfile) => {
    const updatedProfiles = [newProfile, ...profiles];
    setProfiles(updatedProfiles);
    setCurrentUser(newProfile);

    // Calculate matches specifically for this new user
    const matches = findMatchesForUser(newProfile, updatedProfiles);
    setUserMatches(matches);

    setView('success');
  };

  const handleResetSeed = () => {
    setProfiles(INITIAL_SEED_PROFILES);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MATCHES_STORAGE_KEY);
  };

  const handleUpdateMatchAcceptance = (matchId: string, userAAccepted: boolean, userBAccepted: boolean) => {
    setAllMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              userAAccepted,
              userBAccepted,
              status: userAAccepted && userBAccepted ? 'mutual_match' : 'accepted_by_one',
            }
          : m
      )
    );

    setUserMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              userAAccepted,
              userBAccepted,
              status: userAAccepted && userBAccepted ? 'mutual_match' : 'accepted_by_one',
            }
          : m
      )
    );
  };

  return (
    <div className="min-h-screen bg-paper text-[#242220] font-sans selection:bg-[#D92B27] selection:text-white antialiased">
      {view === 'start' && (
        <StartScreen
          onStart={handleStartRegistration}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {view === 'wizard' && (
        <RegistrationWizard
          onCancel={() => setView('start')}
          onComplete={handleCompleteRegistration}
        />
      )}

      {view === 'success' && currentUser && (
        <SuccessAndMatchView
          currentUser={currentUser}
          foundMatches={userMatches}
          onBackToHome={() => setView('start')}
          onUpdateMatchAcceptance={handleUpdateMatchAcceptance}
        />
      )}

      {view === 'admin' && isAdminLoggedIn && (
        <AdminDashboard
          profiles={profiles}
          matches={allMatches}
          onBack={() => setView('start')}
          onLogout={handleLogout}
          onResetSeed={handleResetSeed}
          onUpdateMatchPair={handleUpdateMatchAcceptance}
        />
      )}

      {/* Organizer Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
