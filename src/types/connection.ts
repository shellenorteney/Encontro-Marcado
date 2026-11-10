export type ConnectionMode = 'all' | 'romance' | 'friendship' | 'networking';

export interface VoicePrompt {
  title: string;
  durationSec: number;
  transcript: string;
}

export interface PromptAnswer {
  prompt: string;
  answer: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  headline: string;
  occupation: string;
  city: string;
  neighborhood: string;
  distanceKm: number;
  mode: 'romance' | 'friendship' | 'networking';
  avatarUrl: string;
  bio: string;
  passions: string[];
  verified: boolean;
  communicationStyle: string;
  lookingFor: string;
  answers: PromptAnswer[];
  voicePrompt?: VoicePrompt;
  spotifyTrack?: {
    title: string;
    artist: string;
  };
  values: string[];
  quizTraits: {
    energy: 'introvert' | 'extrovert' | 'ambivert';
    weekend: 'outdoors' | 'culture' | 'relaxed' | 'nightlife';
    communication: 'deep_chats' | 'daily_memes' | 'in_person' | 'quick_audio';
    growth: 'creativity' | 'career' | 'wellness' | 'experiences';
  };
  baseAffinity: number;
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  mode: 'romance' | 'friendship' | 'networking';
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  text?: string;
  audioSec?: number;
  photoUrl?: string;
  timestamp: string;
  reaction?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Cultura & Arte' | 'Café & Ideias' | 'Esportes & Outdoor' | 'Jogos & Encontros';
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  description: string;
  attendeesCount: number;
  userJoined: boolean;
  coverImage: string;
  tags: string[];
}

export interface RadarSpot {
  id: string;
  name: string;
  type: 'Café & Livros' | 'Parque & Natureza' | 'Coworking & Hub' | 'Bar & Cultura';
  neighborhood: string;
  distance: string;
  activePeopleCount: number;
  popularModes: ('romance' | 'friendship' | 'networking')[];
  address: string;
  highlight: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    label: string;
    sublabel: string;
    traitKey: 'energy' | 'weekend' | 'communication' | 'growth';
    traitValue: string;
  }[];
}
