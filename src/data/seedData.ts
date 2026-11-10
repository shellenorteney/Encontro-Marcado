import { UserProfile } from '../types/profile';

export const STANDARD_INTERESTS = [
  'Dançar',
  'Cantar',
  'Tocar Instrumento',
  'Cozinhar',
  'Praticar Esportes',
  'Trilhas & Natureza',
  'Cinema & Séries',
  'Ler Livros',
  'Jogos de Tabuleiro',
  'Fotografia',
  'Viajar',
  'Voluntariado',
  'Pintura & Artes',
  'Conversar num Café'
];

export const SITUATIONAL_QUESTIONS = [
  {
    id: 'arrivalAtParty',
    question: 'Se você chegasse a uma atividade ou conferência onde não conhece quase ninguém, o que você faria?',
    options: [
      { id: 'observar', label: 'Procuraria um cantinho tranquilo para observar até me sentir à vontade' },
      { id: 'ajudar', label: 'Iria direto ajudar na organização ou na mesa de lanche para quebrar o gelo' },
      { id: 'conversar', label: 'Puxaria papo com a primeira pessoa com cara simpática com um sorriso aberto' }
    ]
  },
  {
    id: 'rainySaturday',
    question: 'Se o seu sábado à noite fosse cancelado por uma chuva forte e todos ficassem em casa, você...',
    options: [
      { id: 'pijama', label: 'Comemoraria! Ficaria de pijama maratonando filmes/leitura bem quentinho(a)' },
      { id: 'pizza', label: 'Chamaria alguns amigos mais próximos para pedir pizza e jogar jogos de tabuleiro' },
      { id: 'agito', label: 'Procuraria outro lugar coberto para sair ou inventaria uma programação nova' }
    ]
  },
  {
    id: 'surpriseTrip',
    question: 'Se você ganhasse uma passagem aérea surpresa para o próximo fim de semana, você escolheria...',
    options: [
      { id: 'montanha', label: 'Uma cabana aconchegante nas montanhas para descansar e recarregar energias' },
      { id: 'historica', label: 'Uma cidade histórica com cafés, livrarias, feirinhas e museus' },
      { id: 'praia', label: 'Um destino ensolarado de praia ou aventura com trilhas na natureza' }
    ]
  }
];

export const INITIAL_SEED_PROFILES: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Valentina Silveira',
    gender: 'mulher',
    age: 24,
    ward: 'Ala Tucuruvi',
    stake: 'Estaca São Paulo Norte',
    whatsapp: '11987654321',
    instagram: '@valentina.silveira',
    photoUrl: '/src/assets/images/profile_avatar_valentina_1794227567446.jpg',
    aboutMePhrase: 'Amo artes, conversas que edificam e animada para o aulão e baile!',
    occupation: 'Estudante de Pedagogia & Designer',
    mission: {
      served: true,
      location: 'Brasil Curitiba Sul'
    },
    personality: 'ambivertido',
    situations: {
      arrivalAtParty: 'ajudar',
      rainySaturday: 'pijama',
      surpriseTrip: 'historica'
    },
    interests: ['Dançar', 'Cantar', 'Ler Livros', 'Cozinhar', 'Conversar num Café'],
    preferences: {
      minAge: 22,
      maxAge: 30,
      missionRequirement: 'any',
      indispensable: ['Cozinhar'],
      niceToHave: ['Dançar', 'Ler Livros', 'Viajar']
    },
    consentGiven: true,
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 'usr-2',
    name: 'Lucas Ferreira',
    gender: 'homem',
    age: 26,
    ward: 'Ala Caxingui',
    stake: 'Estaca São Paulo Caxingui',
    whatsapp: '11976543210',
    instagram: '@lucas_ferreira.sp',
    photoUrl: '/src/assets/images/profile_avatar_lucas_1794227566430.jpg',
    aboutMePhrase: 'Sempre animado para uma trilha, praticar esportes e servir.',
    occupation: 'Engenheiro Civil',
    mission: {
      served: true,
      location: 'Brasil Rio de Janeiro'
    },
    personality: 'extrovertido',
    situations: {
      arrivalAtParty: 'conversar',
      rainySaturday: 'pizza',
      surpriseTrip: 'praia'
    },
    interests: ['Praticar Esportes', 'Trilhas & Natureza', 'Cozinhar', 'Tocar Instrumento'],
    preferences: {
      minAge: 21,
      maxAge: 28,
      missionRequirement: 'any',
      indispensable: ['Cozinhar'],
      niceToHave: ['Trilhas & Natureza', 'Praticar Esportes', 'Cantar']
    },
    consentGiven: true,
    createdAt: '2026-11-02T14:30:00Z'
  },
  {
    id: 'usr-3',
    name: 'Camila Duarte',
    gender: 'mulher',
    age: 27,
    ward: 'Ala Santana',
    stake: 'Estaca São Paulo Norte',
    whatsapp: '11965432109',
    instagram: '@camila.duarte.br',
    photoUrl: '/src/assets/images/profile_avatar_camila_1794227568435.jpg',
    aboutMePhrase: 'Buscando alguém com bom humor, metas claras e amor pela família.',
    occupation: 'Empreendedora em Tecnologia',
    mission: {
      served: true,
      location: 'Portugal Lisboa'
    },
    personality: 'ambivertido',
    situations: {
      arrivalAtParty: 'ajudar',
      rainySaturday: 'pizza',
      surpriseTrip: 'historica'
    },
    interests: ['Viajar', 'Cinema & Séries', 'Jogos de Tabuleiro', 'Ler Livros', 'Conversar num Café'],
    preferences: {
      minAge: 24,
      maxAge: 32,
      missionRequirement: 'any',
      indispensable: ['Jogos de Tabuleiro'],
      niceToHave: ['Viajar', 'Cinema & Séries']
    },
    consentGiven: true,
    createdAt: '2026-11-03T09:15:00Z'
  },
  {
    id: 'usr-4',
    name: 'Mateus Albuquerque',
    gender: 'homem',
    age: 28,
    ward: 'Ala Rio Pequeno',
    stake: 'Estaca São Paulo Caxingui',
    whatsapp: '11954321098',
    instagram: '@mateus.albuq',
    photoUrl: '/src/assets/images/hero_connections_1794227565077.jpg',
    aboutMePhrase: 'Músico amador, apaixonado por jogos de tabuleiro e dias com a família.',
    occupation: 'Desenvolvedor de Software',
    mission: {
      served: false
    },
    personality: 'introvertido',
    situations: {
      arrivalAtParty: 'observar',
      rainySaturday: 'pizza',
      surpriseTrip: 'montanha'
    },
    interests: ['Tocar Instrumento', 'Jogos de Tabuleiro', 'Cinema & Séries', 'Cozinhar'],
    preferences: {
      minAge: 23,
      maxAge: 29,
      missionRequirement: 'any',
      indispensable: ['Jogos de Tabuleiro'],
      niceToHave: ['Cozinhar', 'Cinema & Séries']
    },
    consentGiven: true,
    createdAt: '2026-11-04T16:45:00Z'
  }
];
