import type { UserProfile } from '../types/profile';

const API_URL = 'https://kcejmkympweqmfdlglaz.supabase.co/functions/v1/encontro-marcado';
const SESSION_KEY = 'encontro_marcado_session_v1';

export interface SharedMatch {
  id: string;
  score: number;
  commonInterests: string[];
  personalityMatch: string;
  situationsSharedCount: number;
  accepted: boolean;
  mutual: boolean;
  partner: Pick<UserProfile, 'age' | 'gender'> & Partial<Pick<UserProfile,
    'name' | 'ward' | 'stake' | 'instagram' | 'whatsapp' | 'photoUrl' | 'aboutMePhrase' | 'occupation'>>;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function readSession(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}

export function saveSession(token: string): boolean {
  try { localStorage.setItem(SESSION_KEY, token); return true; } catch { return false; }
}

export function clearSession(): void {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* This session may exist only in memory. */ }
}

async function request<T>(action: string, token?: string | null, payload: Record<string, unknown> = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(body.error || 'Não foi possível concluir. Tente novamente.', response.status);
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Não foi possível conectar. Confira sua internet e tente novamente.', 0);
  } finally {
    window.clearTimeout(timeout);
  }
}

export const registerProfile = (profile: UserProfile) => request<{ token: string; profile: UserProfile }>('register', null, { profile });
export const getMyProfile = (token: string) => request<{ profile: UserProfile }>('me', token);
export const getMyMatches = (token: string) => request<{ matches: SharedMatch[] }>('matches', token);
export const acceptMatch = (token: string, matchId: string) => request<{ matches: SharedMatch[] }>('accept', token, { matchId });
