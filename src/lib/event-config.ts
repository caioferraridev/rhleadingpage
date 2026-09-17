export const eventConfig = {
  name: "Academia RH",
  tagline: "Desenvolvimento e capacitação para profissionais e empresas",
  description:
    "A Academia RH é um espaço de desenvolvimento e capacitação que transforma conhecimento em prática, ajudando profissionais e empresas a desenvolverem uma gestão de pessoas mais preparada, estratégica e humana.",

  // First edition focus — this is NOT a generic RH course
  editionFocus:
    "Nesta primeira edição, o treinamento será dedicado a Recrutamento e Seleção, trazendo uma abordagem prática para quem deseja aprender, aprimorar ou entender melhor os processos de contratação e escolha de profissionais.",
  editionTitle: "Recrutamento e Seleção na Prática",

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

  // Benefits — 1st edition: Recrutamento e Seleção
  benefits: [
    {
      title: "Conhecimento prático em R&S",
      description: "Aprenda na prática como aplicar as melhores técnicas de recrutamento e seleção no dia a dia.",
    },
    {
      title: "Processos seletivos eficazes",
      description: "Saiba como estruturar e conduzir processos seletivos que atraem e identificam os melhores talentos.",
    },
    {
      title: "Técnicas de entrevista e avaliação",
      description: "Domine ferramentas e abordagens para avaliar candidatos com precisão e reduzir erros de contratação.",
    },
    {
      title: "Visão do mercado de trabalho",
      description: "Compreenda como o recrutamento se conecta com as necessidades reais das organizações e do mercado.",
    },
    {
      title: "Networking presencial",
      description: "Conecte-se com outros profissionais e especialistas da área de RH e gestão de pessoas.",
    },
    {
      title: "Coffee Break incluso",
      description: "Aproveite o coffee break para networking e troca de experiências com outros participantes.",
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
