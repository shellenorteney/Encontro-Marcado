export type Gender = 'homem' | 'mulher';
export type PersonalityType = 'introvertido' | 'ambivertido' | 'extrovertido';
export type MissionPreference = 'must_have_served' | 'any';

export interface MissionInfo {
  served: boolean;
  location?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  ward: string; // Ala
  stake: string; // Estaca
  whatsapp: string; // DDD + Número
  instagram?: string; // @ do Instagram (compartilhado apenas no match mútuo)
  photoUrl?: string; // Opcional (da galeria, tirada na hora ou sem foto)
  aboutMePhrase?: string; // Frase sobre mim
  occupation?: string; // O que trabalha ou estuda
  mission: MissionInfo; // Serviu missão (Sim/Não e Onde)
  personality: PersonalityType; // Introvertido, Ambivertido, Extrovertido
  situations: {
    arrivalAtParty: string; // O que faria se chegasse a uma atividade sem conhecer ninguém
    rainySaturday: string; // O que faria se os planos do sábado fossem cancelados por chuva
    surpriseTrip: string; // Para onde iria numa viagem surpresa de fim de semana
  };
  interests: string[]; // O que gosta de fazer (dançar, cantar, etc.)
  preferences: {
    minAge: number;
    maxAge: number;
    missionRequirement: MissionPreference; // 'must_have_served' | 'any'
    indispensable: string[]; // O que é indispensável em alguém
    niceToHave: string[]; // É legal, mas tudo bem se não tiver
  };
  consentGiven: boolean;
  createdAt: string;
}

export interface MatchPair {
  id: string;
  userA: UserProfile;
  userB: UserProfile;
  score: number;
  commonInterests: string[];
  matchedIndispensable: string[];
  personalityMatch: string;
  situationsSharedCount: number;
  userAAccepted: boolean;
  userBAccepted: boolean;
  status: 'pending' | 'accepted_by_one' | 'mutual_match';
}
