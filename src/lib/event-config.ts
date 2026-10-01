export const eventConfig = {
  name: "Academia RH",
  tagline: "Desenvolvimento e capacitação para profissionais e empresas",
  description:
    "A Academia RH é um espaço de desenvolvimento e capacitação que transforma conhecimento em prática. E, para marcar esse início, traz para você a primeira edição do treinamento “Recrutamento e Seleção na Prática” — uma oportunidade para quem quer aprender, se aprimorar ou começar a atuar na área de Recrutamento e Seleção, com conteúdo prático e baseado em experiências reais de mais de 20 anos de atuação em RH.",

  // First experience launched by the Academia RH brand
  editionTitle: "Recrutamento e Seleção na Prática",

  // Short pitch used above the fold (the long `description` below stays as
  // the fallback metadata text — it is never rendered in the interface).
  heroSubtitle:
    "Treinamento presencial de Recrutamento e Seleção na prática — do perfil da vaga à avaliação de candidatos, com Talita Maia.",

  // Copy da seção "O que é a Academia RH" (resumido para leitura rápida)
  aboutStatement: "Aprender. Praticar. Transformar.",
  aboutText:
    "A Academia RH nasceu de anos de atuação em Recursos Humanos e da vontade de compartilhar o que realmente funciona na prática. A proposta é criar experiências de aprendizagem que aproximam o conhecimento dos desafios do dia a dia — e este treinamento foi pensado para quem quer mais preparo para lidar com pessoas e processos de contratação.",

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
  price: 28900, // R$ 289,00 em centavos — total à vista
  installmentMonths: 12, // "12x" — condição de crédito exibida na landing page
  // Valor da parcela anunciado na landing page, em centavos (R$ 29,41).
  //
  // É APENAS comunicação de oferta: NÃO é o valor enviado ao checkout.
  // O Mercado Pago calcula as condições reais (taxas variam por quantidade de
  // parcelas e forma de pagamento) e o valor cobrado continua sendo
  // events.price. Ver src/lib/pricing.ts e src/app/api/checkout/route.ts.
  //
  // Ao alterar, confira o valor que o Mercado Pago exibe para 12x no checkout.
  installmentPrice: 2941,
  capacity: 50,

  // WhatsApp
  whatsappNumber: "5514991276801",
  whatsappMessage: "Olá! Gostaria de saber mais informações sobre a Academia RH.",
  whatsappGroupLink: "https://chat.whatsapp.com/JNmg9TsZiTuJLDTX2iaSxF?s=cl&p=i&mlu=4&ilr=4",

  // Meta Pixel — ID público de medição de tráfego (não é um segredo)
  metaPixelId: "1098622605963123",

  // Speaker
  speaker: {
    name: "Talita Maia",
    role: "Administradora · Especialista em Gestão de Pessoas",
    bioIntro:
      "Administradora e Especialista em Gestão de Pessoas, com mais de 20 anos de atuação em RH nos principais subsistemas: Recrutamento e Seleção, Desenvolvimento de Pessoas, Liderança e Gestão Estratégica.",
    bioQuote:
      "O RH tem o poder de transformar profissionais, empresas e resultados.",
    highlights: [
      "Mais de 20 anos de experiência em RH",
      "Administradora e Especialista em Gestão de Pessoas",
      "Atuação em recrutamento, desenvolvimento de pessoas, liderança e gestão estratégica",
    ],
    imageUrl: "/images/palestrante.webp",
    imageAlt: "Talita Maia, palestrante do treinamento de Recrutamento e Seleção da Academia RH em Bauru",
  },

  // Benefits — what the participant takes away from this experience
  benefits: [
    {
      title: "Conhecimento prático",
      description: "Aprendizado conectado à realidade do mercado.",
    },
    {
      title: "Networking",
      description: "Convívio com outros profissionais da área.",
    },
    {
      title: "Novos insights",
      description: "Ideias e perspectivas para aplicar na sua atuação.",
    },
    {
      title: "Desenvolvimento profissional",
      description: "Mais preparo e segurança para os desafios da carreira.",
    },
    {
      title: "Certificado de participação",
      description: "Registro da sua participação no treinamento.",
    },
    {
      title: "Coffee break",
      description: "Uma pausa para conversar e trocar experiências.",
    },
  ],

  // Who is it for
  targetAudience: [
    {
      title: "Profissionais de RH",
      description: "Querem aprofundar conhecimentos em Recrutamento e Seleção.",
    },
    {
      title: "Iniciantes na área",
      description: "Querem aprender na prática como funciona um processo seletivo.",
    },
    {
      title: "Gestores, líderes e empreendedores",
      description: "Participam da contratação de pessoas na empresa.",
    },
    {
      title: "Profissionais fora do RH",
      description: "Querem lidar melhor com pessoas e com a contratação.",
    },
    {
      title: "Quem quer selecionar melhor",
      description: "Busca uma visão prática sobre identificar e avaliar talentos.",
    },
    {
      title: "Estudantes de Administração e Psicologia",
      description: "Querem se preparar para o mercado de trabalho.",
    },
  ],
} as const;
