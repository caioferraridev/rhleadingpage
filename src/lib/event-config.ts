export const eventConfig = {
  name: "Academia RH",
  tagline: "Desenvolvimento e capacitação para profissionais e empresas",
  description:
    "A Academia RH é um espaço de desenvolvimento e capacitação que transforma conhecimento em prática. E, para marcar esse início, traz para você a primeira edição do treinamento “Recrutamento e Seleção na Prática” — uma oportunidade para quem quer aprender, se aprimorar ou começar a atuar na área de Recrutamento e Seleção, com conteúdo prático e baseado em experiências reais de mais de 20 anos de atuação em RH.",

  // First experience launched by the Academia RH brand
  editionTitle: "Recrutamento e Seleção na Prática",

  // Structured data (JSON-LD) — campos opcionais do schema de Event
  schema: {
    description:
      "Treinamento presencial de Recrutamento e Seleção na prática, com Talita Maia, para profissionais de RH, estudantes, gestores, líderes, empresários e profissionais que participam de processos de contratação. O encontro aborda definição do perfil da vaga, técnicas de entrevista, avaliação de candidatos, ferramentas e cases práticos.",
    image: "/images/og-image.svg",
    // Início de validade da oferta/preço (não é a data do evento)
    validFrom: "2026-09-17T00:00:00-03:00",
  },

  // Event Details
  date: "2026-10-17",
  startTime: "08:00",
  endTime: "13:00",
  location: "Universidade Anhembi Morumbi — Bauru",
  address: "Rua Vereador Joaquim da Silva Martha, 14-55\nVila Santa Tereza — Bauru/SP",
  coffeeBreak: true,

  // Pricing & Capacity
  price: 28900, // R$ 289,00 em centavos
  capacity: 50,

  // WhatsApp
  whatsappNumber: "5514991276801",
  whatsappMessage: "Olá! Gostaria de saber mais informações sobre a Academia RH.",
  whatsappGroupLink: "https://chat.whatsapp.com/JNmg9TsZiTuJLDTX2iaSxF?s=cl&p=i&mlu=4&ilr=4",

  // Speaker
  speaker: {
    name: "Talita Maia",
    role: "Administradora · Especialista em Gestão de Pessoas",
    bioIntro:
      "Sou profissional de Recursos Humanos, Administradora e Especialista em Gestão de Pessoas, com mais de 20 anos de experiência na área. Ao longo da minha trajetória, atuei em diferentes segmentos e nos principais subsistemas de RH, desenvolvendo experiência em Recrutamento e Seleção, Desenvolvimento de Pessoas, Liderança e Gestão Estratégica de Pessoas.",
    bioQuote:
      "Acredito que o RH tem o poder de transformar profissionais, empresas e resultados. Por isso, através da Academia RH, compartilho conhecimento e experiência de forma prática, contribuindo para a formação de profissionais mais preparados e para uma gestão de pessoas mais estratégica e humana.",
    highlights: [
      "Mais de 20 anos de experiência em RH",
      "Administradora e Especialista em Gestão de Pessoas",
      "Atuação em recrutamento, desenvolvimento de pessoas, liderança e gestão estratégica",
    ],
    imageUrl: "/images/palestrante.jpeg",
  },

  // Benefits — what the participant takes away from this experience
  benefits: [
    {
      title: "Conhecimento Prático",
      description: "Aprendizado conectado à realidade do mercado.",
    },
    {
      title: "Networking",
      description: "Oportunidade de conhecer e trocar experiências com outros profissionais.",
    },
    {
      title: "Novos Insights",
      description: "Ideias e perspectivas para aplicar na sua atuação profissional.",
    },
    {
      title: "Desenvolvimento Profissional",
      description: "Mais preparo e segurança para os desafios da carreira.",
    },
    {
      title: "Certificado de Participação",
      description: "Registro da sua participação em uma experiência de capacitação profissional.",
    },
    {
      title: "Coffee Break",
      description: "Um momento para fazer uma pausa, conversar e trocar experiências durante o encontro.",
    },
  ],

  // Who is it for
  targetAudience: [
    "Você trabalha com RH e quer aprimorar seus conhecimentos em Recrutamento e Seleção?",
    "Está começando na área de Recursos Humanos e quer aprender, na prática, como funciona um processo seletivo?",
    "Você é gestor, líder ou empreendedor e participa da contratação de pessoas na sua empresa?",
    "Não trabalha diretamente com RH ou gestão, mas quer aprender a lidar melhor com pessoas e entender mais sobre processos de contratação?",
    "Quer desenvolver uma visão mais prática sobre como identificar, avaliar e selecionar profissionais?",
    "Estudantes de Administração, Psicologia ou áreas afins que buscam se preparar para o mercado de trabalho?",
  ],

  // Urgency messages
  getUrgencyMessage: (spotsLeft: number) => {
    if (spotsLeft <= 0) return "Vagas esgotadas";
    if (spotsLeft <= 10) return "Últimas vagas disponíveis!";
    if (spotsLeft <= 20) return "Vagas limitadas";
    return "Vagas limitadas a 50 participantes";
  },
} as const;
