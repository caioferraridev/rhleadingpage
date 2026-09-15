export const eventConfig = {
  name: "Academia RH",
  tagline: "Desenvolvimento e capacitação para profissionais e empresas",
  description:
    "Academia RH é um espaço de desenvolvimento e capacitação para profissionais e empresas que desejam aprender, praticar e transformar a gestão de pessoas.",

  // Event Details
  date: "2026-10-17",
  startTime: "08:00",
  endTime: "13:00",
  location: "Universidade Anhembi Morumbi — Bauru",
  address: "Rua Vereador Joaquim da Silva Martha, 14-55\nVila Santa Tereza — Bauru/SP",
  coffeeBreak: true,

  // Pricing & Capacity
  price: 22990, // R$ 229,90 em centavos
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

  // Benefits
  benefits: [
    {
      title: "Conhecimento prático",
      description: "Aprenda na prática como aplicar os principais conceitos e ferramentas de RH no dia a dia.",
    },
    {
      title: "Gestão de Pessoas",
      description: "Desenvolva habilidades essenciais para gerir pessoas com estratégia e humanização.",
    },
    {
      title: "Recrutamento e Seleção",
      description: "Entenda como funciona o recrutamento do ponto de vista de quem contrata e seleciona.",
    },
    {
      title: "Desenvolvimento de Pessoas",
      description: "Conheça práticas para desenvolver talentos e reter profissionais nas organizações.",
    },
    {
      title: "Networking presencial",
      description: "Conecte-se com outros profissionais e especialistas da área de RH.",
    },
    {
      title: "Coffee Break incluso",
      description: "Aproveite o coffee break para networking e troca de experiências com outros participantes.",
    },
  ],

  // Who is it for
  targetAudience: [
    "Profissionais de RH que querem se atualizar",
    "Quer iniciar uma carreira na área de RH",
    "Gestores que lidam com pessoas e querem se capacitar",
    "Estudantes de Administração, Psicologia ou áreas afins",
    "Empreendedores que querem melhorar a gestão de pessoas",
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
