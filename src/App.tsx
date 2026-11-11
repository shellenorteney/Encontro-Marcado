/** @license SPDX-License-Identifier: Apache-2.0 */
import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from './types/profile';
import { StartScreen } from './components/StartScreen';
import { RegistrationWizard } from './components/RegistrationWizard';
import { SuccessAndMatchView } from './components/SuccessAndMatchView';
import { registerProfile, getMyProfile, getMyMatches, acceptMatch, readSession, saveSession, clearSession, ApiError, type SharedMatch } from './services/participants';

export default function App() {
  const [view, setView] = useState<'start' | 'wizard' | 'success'>('start');
  const [token, setToken] = useState<string | null>(readSession);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<SharedMatch[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(true);

  const refreshMatches = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const result = await getMyMatches(token);
      setMatches(result.matches);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível atualizar seus matches.');
    } finally { setRefreshing(false); }
  }, [token]);

  const restoreProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await getMyProfile(token);
      setCurrentUser(result.profile);
      setView('success');
      setError(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearSession();
        setToken(null);
        setCurrentUser(null);
        setView('start');
      }
      setError(e instanceof Error ? e.message : 'Não foi possível recuperar seu perfil.');
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { void restoreProfile(); }, [restoreProfile]);
  useEffect(() => {
    if (!token || view !== 'success') return;
    void refreshMatches();
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refreshMatches();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [token, view, refreshMatches]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);

  const handleCompleteRegistration = async (profile: UserProfile) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await registerProfile(profile);
      setSessionSaved(saveSession(result.token));
      setToken(result.token);
      setCurrentUser(result.profile);
      setMatches([]);
      setView('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar o cadastro. Tente novamente.');
    } finally { setSubmitting(false); }
  };

  const handleAccept = async (matchId: string) => {
    if (!token || pendingMatch) return;
    setPendingMatch(matchId);
    try {
      const result = await acceptMatch(token, matchId);
      setMatches(result.matches);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível registrar seu aceite.');
    } finally { setPendingMatch(null); }
  };

  return (
    <div className="min-h-screen bg-paper text-[#242220] font-sans selection:bg-[#D92B27] selection:text-white antialiased">
      {loading ? (
        <main className="min-h-screen flex items-center justify-center p-6" role="status">Carregando seu perfil…</main>
      ) : <>
        {view === 'start' && <>
          {error && <div role="alert" className="max-w-md mx-auto p-4 text-red-800">{error}</div>}
          <StartScreen hasProfile={Boolean(token)} onStart={() => {
            setError(null);
            if (currentUser) setView('success');
            else if (token) void restoreProfile();
            else setView('wizard');
          }} />
        </>}
        {view === 'wizard' && <RegistrationWizard
          onCancel={() => { setError(null); setView('start'); }}
          onComplete={handleCompleteRegistration}
          submitting={submitting}
          serverError={error}
        />}
        {view === 'success' && currentUser && <SuccessAndMatchView
          currentUser={currentUser}
          matches={matches}
          sessionSaved={sessionSaved}
          refreshing={refreshing}
          pendingMatch={pendingMatch}
          error={error}
          onRefresh={() => void refreshMatches()}
          onAccept={(id) => void handleAccept(id)}
          onBackToHome={() => setView('start')}
        />}
      </>}
    </div>
  );
}
