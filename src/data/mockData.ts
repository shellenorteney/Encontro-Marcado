import { Profile, CommunityEvent, RadarSpot, QuizQuestion, Match, ChatMessage } from '../types/connection';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'Valentina Rossi',
    age: 28,
    pronouns: 'Ela/Dela',
    headline: 'Designer Visual & Ceramista nas horas vagas',
    occupation: 'Lead Designer em Estúdio Criativo',
    city: 'São Paulo',
    neighborhood: 'Pinheiros',
    distanceKm: 2.4,
    mode: 'romance',
    avatarUrl: '/src/assets/images/profile_avatar_valentina_1794227567446.jpg',
    bio: 'Apaixonada por cafés bem tirados, livrarias com cheiro de páginas antigas e conversas sem pressa numa tarde de domingo. Se você curte trocar ideias sobre arte, arquitetura ou discutir o final de filmes complexos, já temos metade do caminho andado.',
    passions: ['Cerâmica', 'Cafés Especiais', 'Cinema Europeu', 'Design Editorial', 'Jazz'],
    verified: true,
    communicationStyle: 'Gosta de áudios expressivos e conversas profundas',
    lookingFor: 'Alguém com humor inteligente, presença real e vontade de construir memórias autênticas',
    values: ['Criatividade', 'Sinceridade', 'Curiosidade'],
    answers: [
      {
        prompt: 'Um domingo ideal começa com...',
        answer: 'Passar um café na prensa francesa ouvindo Caetano ou Bossa Nova, ir na feirinha de orgânicos e passar a tarde sem olhar a tela do celular.'
      },
      {
        prompt: 'Não consigo viver sem...',
        answer: 'Meu caderno de rascunhos, fatias de pão de fermentação natural e a sensação de terminar um projeto que me emociona.'
      },
      {
        prompt: 'O que mais valorizo numa conexão...',
        answer: 'A habilidade de rir de si mesmo e a coragem de ser vulnerável quando a conversa fica boa de verdade.'
      }
    ],
    voicePrompt: {
      title: 'Minha teoria sobre o amor moderno',
      durationSec: 18,
      transcript: 'Acho que a maior conexão hoje não é o algoritmo perfeito, é quando duas pessoas decidem estar de verdade no mesmo momento.'
    },
    spotifyTrack: {
      title: 'Baby',
      artist: 'Gal Costa & Caetano Veloso'
    },
    quizTraits: {
      energy: 'ambivert',
      weekend: 'culture',
      communication: 'deep_chats',
      growth: 'creativity'
    },
    baseAffinity: 94
  },
  {
    id: 'p2',
    name: 'Lucas Mendes',
    age: 30,
    pronouns: 'Ele/Dele',
    headline: 'Arquiteto de Soluções & Maratonista Amador',
    occupation: 'Engenheiro de Software & Triatleta',
    city: 'São Paulo',
    neighborhood: 'Vila Madalena',
    distanceKm: 3.8,
    mode: 'friendship',
    avatarUrl: '/src/assets/images/profile_avatar_lucas_1794227566430.jpg',
    bio: 'Treinando para a próxima meia-maratona e sempre em busca de novos amigos para corridas matinais no parque ou para desbravar feiras gastronômicas. Acredito que amizade boa é aquela onde a gente se desafia a ser melhor sem perder a leveza.',
    passions: ['Corrida no Ibirapuera', 'Trilhas & Natureza', 'Podcasts de História', 'Gastronomia', 'Cerveja Artesanal'],
    verified: true,
    communicationStyle: 'Direto, pontual e sempre animado para encontros presenciais',
    lookingFor: 'Parceiros de corrida, hiking nos fins de semana e bons papos pós-treino',
    values: ['Disciplina', 'Lealdade', 'Espírito Esportivo'],
    answers: [
      {
        prompt: 'Se você me desafiar para...',
        answer: 'Uma corrida de 10km às 6h da manhã seguida da melhor coxinha do bairro, eu topo na hora.'
      },
      {
        prompt: 'Minha melhor história de viagem...',
        answer: 'Me perdi de bicicleta pelas colinas da Patagônia e acabei jantando com um grupo de pescadores locais.'
      }
    ],
    voicePrompt: {
      title: 'Por que prefiro correr em grupo',
      durationSec: 14,
      transcript: 'Correr sozinho é meditativo, mas com amigos o último quilômetro parece que nem cansa.'
    },
    spotifyTrack: {
      title: 'The Less I Know The Better',
      artist: 'Tame Impala'
    },
    quizTraits: {
      energy: 'extrovert',
      weekend: 'outdoors',
      communication: 'in_person',
      growth: 'wellness'
    },
    baseAffinity: 88
  },
  {
    id: 'p3',
    name: 'Camila Duarte',
    age: 32,
    pronouns: 'Ela/Dela',
    headline: 'Fundadora da NuvemTech & Entusiasta de Impacto Social',
    occupation: 'CEO & Co-fundadora na NuvemTech',
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    distanceKm: 4.1,
    mode: 'networking',
    avatarUrl: '/src/assets/images/profile_avatar_camila_1794227568435.jpg',
    bio: 'Construindo o futuro da computação em nuvem com foco em sustentabilidade e inclusão tecnológica. Busco conectar com outros founders, líderes de produto, pesquisadores e investidores que acreditam em negócios que geram valor real para as pessoas.',
    passions: ['Startups B2B', 'Inteligência Artificial', 'Green Tech', 'Leitura Filosófica', 'Mentorias'],
    verified: true,
    communicationStyle: 'Ágil no alinhamento de ideias, aberta para cafés executivos objetivos',
    lookingFor: 'Co-founders, parceiros estratégicos e trocas genuínas sobre escala e cultura de inovação',
    values: ['Integridade', 'Inovação com Propósito', 'Colaboração'],
    answers: [
      {
        prompt: 'O maior aprendizado na minha carreira...',
        answer: 'Ter clareza sobre o problema real que estamos resolvendo antes de se apaixonar pela solução.'
      },
      {
        prompt: 'Podemos colaborar se você...',
        answer: 'Trabalha com dados, arquitetura em nuvem ou quer acelerar soluções para descarbonização industrial.'
      }
    ],
    voicePrompt: {
      title: 'O que busco numa parceria de negócios',
      durationSec: 20,
      transcript: 'Mais do que habilidades técnicas complementares, o que sustenta uma empresa é o alinhamento de valores quando as coisas ficam difíceis.'
    },
    spotifyTrack: {
      title: 'Clair de Lune',
      artist: 'Claude Debussy'
    },
    quizTraits: {
      energy: 'ambivert',
      weekend: 'relaxed',
      communication: 'deep_chats',
      growth: 'career'
    },
    baseAffinity: 92
  },
  {
    id: 'p4',
    name: 'Gabriel Siqueira',
    age: 27,
    pronouns: 'Ele/Dele',
    headline: 'Fotógrafo Documental & Sommelier de Chás',
    occupation: 'Fotógrafo Independente',
    city: 'São Paulo',
    neighborhood: 'Santa Cecília',
    distanceKm: 1.8,
    mode: 'romance',
    avatarUrl: '/src/assets/images/hero_connections_1794227565077.jpg',
    bio: 'Vagando pela cidade com minha câmera analógica procurando pequenos instantes de poesia no cotidiano. Adoro cozinhar massas do zero para quem eu gosto, garimpar vinis raros no centro e viajar sem roteiro fechado.',
    passions: ['Fotografia 35mm', 'Culinária Italiana', 'Sebos & Livros', 'Chás Artesanais', 'Indie Folk'],
    verified: true,
    communicationStyle: 'Atento aos detalhes, prefere mensagens pensadas a conversas rasas',
    lookingFor: 'Um romance com companheirismo, sensibilidade e cumplicidade tranquila',
    values: ['Sensibilidade', 'Paciência', 'Autenticidade'],
    answers: [
      {
        prompt: 'Minha forma favorita de demonstrar carinho...',
        answer: 'Preparar um jantar surpresa ouvindo uma playlist feita especialmente para o momento.'
      },
      {
        prompt: 'Uma coisa que pouca gente sabe sobre mim...',
        answer: 'Sei reconhecer de olhos fechados o ano de gravação de quase qualquer clássico de jazz dos anos 50.'
      }
    ],
    quizTraits: {
      energy: 'introvert',
      weekend: 'culture',
      communication: 'deep_chats',
      growth: 'creativity'
    },
    baseAffinity: 86
  },
  {
    id: 'p5',
    name: 'Beatriz Almeida',
    age: 26,
    pronouns: 'Ela/Dela',
    headline: 'Bióloga & Entusiasta de Escalada em Rocha',
    occupation: 'Pesquisadora em Botânica Urbana',
    city: 'São Paulo',
    neighborhood: 'Perdizes',
    distanceKm: 5.2,
    mode: 'friendship',
    avatarUrl: '/src/assets/images/meetup_community_1794227566590.jpg',
    bio: 'Passeio a semana cercada de plantas no laboratório e os fins de semana nas paredes de escalada da Pedra Grande ou da Serra da Cantareira. Quero reunir um grupo legal para noites de jogos de tabuleiro, piqueniques botânicos e acampamentos.',
    passions: ['Escalada Boulder', 'Plantas & Botânica', 'Boardgames Modernos', 'Camping', 'Biologia'],
    verified: true,
    communicationStyle: 'Espontânea, cheia de energia e adora mandar figurinhas engraçadas',
    lookingFor: 'Amigos parceiros para aventuras ao ar livre e risadas fáceis',
    values: ['Conexão com a Natureza', 'Espontaneidade', 'Diversão'],
    answers: [
      {
        prompt: 'O jogo de tabuleiro perfeito...',
        answer: 'Everdell, Terraforming Mars ou qualquer um que termine em discussões apaixonadas sobre estratégias improváveis.'
      }
    ],
    quizTraits: {
      energy: 'extrovert',
      weekend: 'outdoors',
      communication: 'daily_memes',
      growth: 'experiences'
    },
    baseAffinity: 90
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'ev-1',
    title: 'Noite de Vinhos & Jogos de Tabuleiro',
    category: 'Jogos & Encontros',
    date: 'Sexta-feira, 14 Nov',
    time: '19:30 - 23:00',
    location: 'Quintal Botânico Café',
    neighborhood: 'Pinheiros, SP',
    description: 'Uma noite aconchegante ao ar livre sob luzes quentes. Venha para jogar clássicos e lançamentos modernos (Catan, Azul, Ticket to Ride) enquanto degusta vinhos naturais e conhece novas amizades sem pressão.',
    attendeesCount: 16,
    userJoined: true,
    coverImage: '/src/assets/images/meetup_community_1794227566590.jpg',
    tags: ['Amizade', 'Jogos', 'Vinho Natural', 'Descontraído']
  },
  {
    id: 'ev-2',
    title: 'Café & Conexões Tech: O Futuro da IA e Startups',
    category: 'Café & Ideias',
    date: 'Sábado, 15 Nov',
    time: '10:00 - 12:30',
    location: 'Espaço Prosa & Inovação',
    neighborhood: 'Vila Madalena, SP',
    description: 'Mesa redonda informal entre fundadores, engenheiros e designers. Um café da manhã saboroso acompanhado de trocas reais sobre construção de produtos, captação e parcerias.',
    attendeesCount: 22,
    userJoined: false,
    coverImage: '/src/assets/images/hero_connections_1794227565077.jpg',
    tags: ['Networking', 'Tecnologia', 'Founders', 'Café Especial']
  },
  {
    id: 'ev-3',
    title: 'Corrida Matinal & Açaí Coletivo no Parque',
    category: 'Esportes & Outdoor',
    date: 'Domingo, 16 Nov',
    time: '07:30 - 09:30',
    location: 'Portão 7 do Parque Ibirapuera',
    neighborhood: 'Moema / Ibirapuera, SP',
    description: 'Circuito leve de 5km a 8km com ritmo adaptado para todos os níveis, seguido de bate-papo descontraído com açaí e água de coco na sombra das árvores.',
    attendeesCount: 28,
    userJoined: false,
    coverImage: '/src/assets/images/profile_avatar_lucas_1794227566430.jpg',
    tags: ['Esportes', 'Corrida', 'Saúde', 'Novos Amigos']
  }
];

export const RADAR_SPOTS: RadarSpot[] = [
  {
    id: 'spot-1',
    name: 'Café & Prosa Artesanal',
    type: 'Café & Livros',
    neighborhood: 'Pinheiros',
    distance: '0.8 km',
    activePeopleCount: 14,
    popularModes: ['romance', 'friendship', 'networking'],
    address: 'Rua dos Pinheiros, 482',
    highlight: 'Ponto preferido para primeiros encontros tranquilos e papos sobre literatura'
  },
  {
    id: 'spot-2',
    name: 'Deck do Parque Ibirapuera',
    type: 'Parque & Natureza',
    neighborhood: 'Vila Mariana',
    distance: '2.1 km',
    activePeopleCount: 31,
    popularModes: ['friendship', 'romance'],
    address: 'Av. Pedro Álvares Cabral, s/n',
    highlight: 'Local ideal para caminhadas, passear com pets e piqueniques despretensiosos'
  },
  {
    id: 'spot-3',
    name: 'Espaço Co-Work & Criação',
    type: 'Coworking & Hub',
    neighborhood: 'Itaim Bibi',
    distance: '3.5 km',
    activePeopleCount: 19,
    popularModes: ['networking'],
    address: 'Rua Funchal, 200',
    highlight: 'Ponto de encontro de founders de startups e profissionais de tecnologia'
  },
  {
    id: 'spot-4',
    name: 'Armazém Cultural & Jazz',
    type: 'Bar & Cultura',
    neighborhood: 'Vila Madalena',
    distance: '1.4 km',
    activePeopleCount: 25,
    popularModes: ['romance', 'friendship'],
    address: 'Rua Aspicuelta, 178',
    highlight: 'Música ao vivo, iluminação intimista e drinks autorais'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    title: 'Como você recarrega sua melhor energia social?',
    description: 'Entender seu ritmo ajuda a encontrar pessoas com sintonia de presença.',
    options: [
      {
        id: 'q1-a',
        label: 'Em momentos calmos a dois ou sozinho com boa música',
        sublabel: 'Conversas íntimas e profundas em lugares tranquilos',
        traitKey: 'energy',
        traitValue: 'introvert'
      },
      {
        id: 'q1-b',
        label: 'No meio da galera, eventos e novos círculos de amigos',
        sublabel: 'Adoro ambientes cheios de estímulos e novidades',
        traitKey: 'energy',
        traitValue: 'extrovert'
      },
      {
        id: 'q1-c',
        label: 'Equilíbrio flexível conforme o momento da semana',
        sublabel: 'Dias de agito e dias de recolhimento confortável',
        traitKey: 'energy',
        traitValue: 'ambivert'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Qual é o seu roteiro favorito para um sábado livre?',
    description: 'Os melhores matches compartilham o prazer pelo mesmo tipo de programa.',
    options: [
      {
        id: 'q2-a',
        label: 'Ar livre, esportes, praia ou trilhas na natureza',
        sublabel: 'Movimento, sol e aventura',
        traitKey: 'weekend',
        traitValue: 'outdoors'
      },
      {
        id: 'q2-b',
        label: 'Exposições, cinemas de rua, livrarias e cafés charmosos',
        sublabel: 'Curiosidade cultural e conversas ricas',
        traitKey: 'weekend',
        traitValue: 'culture'
      },
      {
        id: 'q2-c',
        label: 'Cozinhar em casa, filmes, séries e descanso tranquilo',
        sublabel: 'Conforto total e aconchego',
        traitKey: 'weekend',
        traitValue: 'relaxed'
      },
      {
        id: 'q2-d',
        label: 'Bares com música ao vivo, feiras gastronômicas e noites animadas',
        sublabel: 'Celebrar a vida e conhecer gente nova',
        traitKey: 'weekend',
        traitValue: 'nightlife'
      }
    ]
  },
  {
    id: 'q3',
    title: 'Qual é seu estilo favorito de comunicação inicial?',
    description: 'Evita desencontros de expectativas desde o primeiro "olá".',
    options: [
      {
        id: 'q3-a',
        label: 'Conversas que vão direto para assuntos reais e instigantes',
        sublabel: 'Menos papo sobre o tempo, mais sobre o que move a pessoa',
        traitKey: 'communication',
        traitValue: 'deep_chats'
      },
      {
        id: 'q3-b',
        label: 'Combinar um café rápido ou caminhada logo no começo',
        sublabel: 'Nada substitui o olho no olho e a química presencial',
        traitKey: 'communication',
        traitValue: 'in_person'
      },
      {
        id: 'q3-c',
        label: 'Troca leve de memes, fotos do dia e humor descontraído',
        sublabel: 'Leveza constante antes de marcar algo',
        traitKey: 'communication',
        traitValue: 'daily_memes'
      }
    ]
  },
  {
    id: 'q4',
    title: 'Em qual pilar de crescimento você está mais focado agora?',
    description: 'Sincronia de fase de vida gera conexões muito mais duradouras.',
    options: [
      {
        id: 'q4-a',
        label: 'Criatividade, arte e expressão pessoal autêntica',
        sublabel: 'Projetos autorais, sensibilidade e novas linguagens',
        traitKey: 'growth',
        traitValue: 'creativity'
      },
      {
        id: 'q4-b',
        label: 'Carreira, empreendedorismo e novos negócios',
        sublabel: 'Construção de patrimônio, impacto e inovação',
        traitKey: 'growth',
        traitValue: 'career'
      },
      {
        id: 'q4-c',
        label: 'Bem-estar, saúde física, equilíbrio mental e esportes',
        sublabel: 'Cuidar do corpo, da mente e da rotina saudável',
        traitKey: 'growth',
        traitValue: 'wellness'
      },
      {
        id: 'q4-d',
        label: 'Viver experiências marcantes e colecionar boas memórias',
        sublabel: 'Viagens, amizades e momentos inesquecíveis',
        traitKey: 'growth',
        traitValue: 'experiences'
      }
    ]
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    profile: INITIAL_PROFILES[0], // Valentina
    matchedAt: 'Há 2 horas',
    lastMessage: 'Adorei a sua resposta sobre cafés especiais! Conhece aquele novo em Pinheiros?',
    lastMessageTime: '14:22',
    unreadCount: 1,
    mode: 'romance'
  },
  {
    id: 'm2',
    profile: INITIAL_PROFILES[2], // Camila
    matchedAt: 'Ontem',
    lastMessage: 'Sensacional a proposta. Vamos tomar um café e conversar sobre aquela arquitetura?',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    mode: 'networking'
  }
];

export const INITIAL_CONVERSATION: Record<string, ChatMessage[]> = {
  m1: [
    {
      id: 'msg-1',
      senderId: 'p1',
      text: 'Oi! Vi que você também curte cafés na prensa francesa e design! Que surpresa boa te encontrar por aqui.',
      timestamp: '14:15'
    },
    {
      id: 'msg-2',
      senderId: 'me',
      text: 'Olá Valentina! Prazer enorme. Seu perfil me chamou muito a atenção, especialmente a sua paixão por cerâmica.',
      timestamp: '14:18'
    },
    {
      id: 'msg-3',
      senderId: 'p1',
      text: 'Adorei a sua resposta sobre cafés especiais! Conhece aquele novo em Pinheiros?',
      timestamp: '14:22'
    }
  ],
  m2: [
    {
      id: 'msg-201',
      senderId: 'me',
      text: 'Oi Camila! Acompanho seu trabalho com a NuvemTech. Muito bacana ver founders inovando aqui.',
      timestamp: '11:00'
    },
    {
      id: 'msg-202',
      senderId: 'p3',
      text: 'Sensacional a proposta. Vamos tomar um café e conversar sobre aquela arquitetura?',
      timestamp: '11:45'
    }
  ]
};

export const ICEBREAKER_SUGGESTIONS = [
  'Qual foi a última coisa que você aprendeu e que explodiu a sua cabeça?',
  'Se tivéssemos 2 horas livres hoje, qual café ou cantinho você me levaria para conhecer?',
  'Qual é a trilha sonora oficial da sua semana agora?',
  'Qual projeto ou sonho pessoal está te tirando o sono de empolgação?'
];
