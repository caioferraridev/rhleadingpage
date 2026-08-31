export const eventConfig = {
  name: "Academia RH",
  tagline: "Palestra presencial de RH e recrutamento para iniciantes",
  description:
    "Uma oportunidade única de aprender na prática como funciona o mundo do RH e recrutamento, com uma profissional experiente da área.",

  // Event Details
  date: "2026-10-03",
  startTime: "09:00",
  endTime: "12:00",
  location: "Bauru/SP",
  address: "Endereço do evento a ser definido - Bauru/SP",

  // Pricing & Capacity
  price: 22990, // R$ 229,90 em centavos
  capacity: 50,

  // Speaker
  speaker: {
    name: "[NOME DA PALESTRANTE]",
    role: "[Cargo / Especialidade]",
    bio: "[Biografia da palestrante - completa e profissional. Descreva a trajetória, experiência e diferenciais.]",
    highlights: [
      "[Experiência profissional relevante]",
      "[Certificação ou formação]",
      "[Destaque de carreira]",
    ],
    imageUrl: "/images/speaker.svg",
  },

  // Benefits
  benefits: [
    {
      title: "Recrutamento na prática",
      description: "Entenda como funciona o recrutamento do ponto de vista de quem contrata.",
    },
    {
      title: "Primeiros passos na área",
      description: "Aprenda os primeiros passos para entrar e se destacar na área de RH.",
    },
    {
      title: "Práticas do mercado",
      description: "Conheça práticas e ferramentas utilizadas por profissionais de RH no dia a dia.",
    },
    {
      title: "Processos seletivos",
      description: "Desenvolva uma visão profissional sobre como funcionam os processos seletivos.",
    },
    {
      title: "Networking presencial",
      description: "Conecte-se com outros profissionais e profissionais em formação da área de RH.",
    },
    {
      title: "Conteúdo exclusivo",
      description: "Receba materiais e referências para continuar seu desenvolvimento após a palestra.",
    },
  ],

  // Who is it for
  targetAudience: [
    "Está começando na área de RH",
    "Quer trabalhar com recrutamento",
    "Está buscando uma nova oportunidade profissional",
    "Quer entender melhor os processos seletivos",
    "Quer desenvolver conhecimentos práticos",
    "Quer fazer networking presencial com profissionais da área",
  ],

  // Urgency messages
  getUrgencyMessage: (spotsLeft: number) => {
    if (spotsLeft <= 0) return "Vagas esgotadas";
    if (spotsLeft <= 10) return "Últimas vagas disponíveis!";
    if (spotsLeft <= 20) return "Vagas limitadas";
    return "Vagas limitadas a 50 participantes";
  },
} as const;
