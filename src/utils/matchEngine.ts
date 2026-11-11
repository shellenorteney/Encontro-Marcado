import { UserProfile, MatchPair } from '../types/profile';

/**
 * Calculates match compatibility between two profiles.
 * Rules:
 * 1. Gender: Man x Woman strictly (never man x man or woman x woman)
 * 2. Reciprocal age bounds
 * 3. Indispensable interests must be satisfied on both sides
 * 4. Mission requirement check: If either marked "must_have_served", the other must have served!
 * 5. Tie-breaker bonus: Situational question matches ("O que você faria se...")
 * 6. Note: Ala and Estaca are informational and do NOT need to match!
 */
export function calculateMatch(userA: UserProfile, userB: UserProfile): MatchPair | null {
  // 1. Strict Gender Rule: Man and Woman only
  if (userA.gender === userB.gender) {
    return null;
  }

  // 2. Reciprocal age check
  const aFitsB = userA.age >= userB.preferences.minAge && userA.age <= userB.preferences.maxAge;
  const bFitsA = userB.age >= userA.preferences.minAge && userB.age <= userA.preferences.maxAge;

  if (!aFitsB || !bFitsA) {
    return null;
  }

  // 3. Mission Requirement check
  if (userA.preferences.missionRequirement === 'must_have_served' && !userB.mission.served) {
    return null;
  }
  if (userB.preferences.missionRequirement === 'must_have_served' && !userA.mission.served) {
    return null;
  }

  // 4. Indispensable criteria check
  const bSatisfiesA = userA.preferences.indispensable.every((req) =>
    userB.interests.includes(req)
  );

  const aSatisfiesB = userB.preferences.indispensable.every((req) =>
    userA.interests.includes(req)
  );

  if (!bSatisfiesA || !aSatisfiesB) {
    return null;
  }

  // 5. Common interests
  const commonInterests = userA.interests.filter((item) =>
    userB.interests.includes(item)
  );

  // 6. Situational questions match ("O que você faria se...") as tie-breaker
  let situationsSharedCount = 0;
  if (userA.situations && userB.situations) {
    if (userA.situations.arrivalAtParty === userB.situations.arrivalAtParty) situationsSharedCount++;
    if (userA.situations.rainySaturday === userB.situations.rainySaturday) situationsSharedCount++;
    if (userA.situations.surpriseTrip === userB.situations.surpriseTrip) situationsSharedCount++;
  }

  // Calculate score percentage
  const interestBonus = Math.min(20, commonInterests.length * 5);
  const situationBonus = situationsSharedCount * 5; // up to 15%
  const score = Math.min(99, 65 + interestBonus + situationBonus);

  // Only compatibility strictly above 70% qualifies as a match.
  if (score <= 70) {
    return null;
  }

  // Personality description
  let personalityMatch = 'Personalidades com ótima sintonia';
  if (userA.personality === userB.personality) {
    personalityMatch = `Ambos são ${userA.personality}s (sintonia de ritmo!)`;
  } else if (
    (userA.personality === 'introvertido' && userB.personality === 'extrovertido') ||
    (userA.personality === 'extrovertido' && userB.personality === 'introvertido')
  ) {
    personalityMatch = 'Equilíbrio perfeito de energias (introvertido + extrovertido)';
  } else {
    personalityMatch = 'Combinação harmoniosa de estilos';
  }

  const matchedIndispensable = [
    ...new Set([...userA.preferences.indispensable, ...userB.preferences.indispensable])
  ];

  return {
    id: `match-${userA.id}-${userB.id}`,
    userA,
    userB,
    score,
    commonInterests,
    matchedIndispensable,
    personalityMatch,
    situationsSharedCount,
    userAAccepted: false,
    userBAccepted: false,
    status: 'pending'
  };
}

/**
 * Finds all matches for a given user among a list of profiles
 */
export function findMatchesForUser(targetUser: UserProfile, allProfiles: UserProfile[]): MatchPair[] {
  const matches: MatchPair[] = [];

  for (const other of allProfiles) {
    if (other.id === targetUser.id) continue;
    const match = calculateMatch(targetUser, other);
    if (match) {
      matches.push(match);
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Builds the wa.me link with encoded invitation message
 */
export function buildWhatsAppLink(
  recipient: UserProfile,
  candidate: UserProfile,
  appUrl: string = new URL('.', window.location.href).href
): string {
  let cleanNumber = recipient.whatsapp.replace(/\D/g, '');
  if (cleanNumber.length <= 11) {
    cleanNumber = `55${cleanNumber}`;
  }

  const missionText = candidate.mission?.served && candidate.mission.location
    ? `\n🌍 Serviu missão: ${candidate.mission.location}`
    : (candidate.mission?.served ? '\n🌍 Serviu missão de tempo integral' : '');

  const message = `Olá, ${recipient.name}! Este é um convite de teste do Encontro Marcado (Aulão e Baile Caxingui + SP Norte).\n\nNo teste local, encontramos compatibilidade com um perfil da ${candidate.ward} (${candidate.stake})${missionText}.\n\nAcesse a versão de teste: ${appUrl}\n\nOs cadastros e matches ficam somente no navegador usado no teste. O link não compartilha perfis nem registra aceite mútuo.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
