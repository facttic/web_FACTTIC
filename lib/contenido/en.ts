import type { Acento } from "@/components/ui/acento";

/**
 * Copy in English.
 *
 * Mirrors `es.ts` key by key: the shape is checked in `index.ts`, so a missing
 * key doesn't compile. The reasons behind each line break, the mobile variants
 * and where every text comes from are documented there and not repeated here.
 *
 * The routes stay the same in both languages: `Enlace` adds the `/en` prefix.
 */

export const HOME = {
  hero: {
    titulo: "Build\nyour project\nwith co-ops",
    tituloMobile: "Build\nyour technology\nproject\nwith co-ops",
    bajada:
      "A federal network of Argentine technology, innovation and knowledge co-ops that designs, develops and implements digital solutions.",
    bajadaMobile:
      "A federal network\nof Argentine co-ops\nthat designs, develops\nand implements digital\nsolutions.",
    cta: { texto: "Work with FACTTIC", href: "/contacto" },
  },

  sectores: {
    rotulo: "Industries",
    titulo: "Sectors\nwe work with",
    tituloMobile: "Sectors we\nwork with",
    cta: { texto: "See our services", href: "/nuestros-servicios" },
  },

  servicios: {
    rotulo: "Services",
    titulo: "We solve with technology and innovation",
    tituloMobile: "Technology solutions for your organization",
  },

  metodologia: {
    rotulo: "Method",
    titulo: "We build inter-co-op teams",
    cta: { texto: "Learn more", href: "/nuestros-servicios#metodologias" },
    pasos: [
      {
        titulo: "You tell us what you need",
        descripcion: "We look at your project, its goals and requirements.",
      },
      {
        titulo: "We build the inter-co-op team",
        tituloMobile: "We build the inter-cooperative team",
        descripcion: "We pick the co-ops and the profiles that fit best.",
      },
      {
        titulo: "We develop the solution",
        descripcion: "We work together to carry your project through.",
      },
    ],
  },

  proyectos: {
    rotulo: "Projects",
    titulo: "Our featured projects",
    cta: { texto: "See all", href: "/proyectos" },
    cierre: {
      titulo: "Got a project in mind?",
      cta: { texto: "Work with FACTTIC", href: "/contacto" },
    },
  },

  lema: {
    rotulo: "About FACTTIC",
    texto: "Our code is to cooperate",
    bajada:
      "At FACTTIC cooperativism multiplies: we are co-ops that cooperate with each other.",
    cta: { texto: "See more", href: "/sobre-facttic" },
  },

  beneficios: {
    rotulo: "Benefits",
    titulo: "What does the Federation have to offer?",
    tituloMobile: "What does FACTTIC have to offer?",
    cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
    items: [
      {
        titulo: "Steady work",
        animacion: "beneficio-continuidad",
        descripcion:
          "You join a network that spreads opportunities around and keeps the work going over time. Scale teams up and bid for large projects without having to cover every profile yourself.",
        acento: "rojo" as Acento,
      },
      {
        titulo: "Real collaboration, not competition",
        animacion: "beneficio-colaboracion",
        descripcion:
          "You work with other co-ops, share knowledge and build teams together. What prevails is coordination based on need, learning and fairness, outside the strict rules of the market.",
        acento: "azul" as Acento,
      },
      {
        titulo: "Independence with collective backing",
        animacion: "beneficio-autonomia",
        descripcion:
          "You keep your independence as a co-op, with the reach of a network behind you. Each co-op sets its own rules, knowing it leans on a larger group to weather crises and reach goals it could not reach alone.",
        acento: "verde" as Acento,
      },
      {
        titulo: "Work with purpose and impact",
        animacion: "beneficio-trabajo",
        descripcion:
          "You take part in a network building fairer technology. We put people at the centre and base our decisions on sustainability, working towards a more inclusive and equitable society.",
        acento: "naranja" as Acento,
      },
    ],
  },

  red: {
    rotulo: "Our network",
    titulo: "A federal network of co-ops",
    cta: { texto: "Explore the network", href: "/nuestra-red" },
    cierre: {
      titulo: "Want to be part of the network?",
      cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
      tituloMobile: "Are you part of\na co-op?",
      ctaMobile: { texto: "Work with Facttic", href: "/contacto" },
    },
  },
} as const;

export const PIE = {
  /* El nombre completo: el wordmark dice FACT[TIC] y nada más. */
  nombre:
    "Argentine Federation of Technology, Innovation and Knowledge Worker Co-operatives",
  licencia: {
    antes: "This site is",
    enlace: "free software",
    entre: "under",
  },
  intercoop: "Inter-co-op work between",
} as const;

export const SERVICIOS_PAGINA = {
  hero: {
    titulo: "We solve\nwith technology",
    bajada:
      "We bring technology and knowledge solutions that support the growth of cooperativism, production and industry.",
  },

  sectores: {
    rotulo: "Sectors",
    rotuloMobile: "Industries",
    titulo: "Sectors we\nwork with",
    tituloMobile: "Sectors\nwe work with",
    descripcion:
      "Every industry has its own rules.\nWe build solutions that adapt to them.",
  },

  soluciones: {
    rotulo: "Services",
    titulo: "Our solutions",
  },

  metodologia: {
    rotulo: "Ways of working",
    rotuloMobile: "Ways of working",
    titulo: "How do we work?",
    items: [
      {
        titulo: "Custom\nprojects",
        acento: "lila" as Acento,
        descripcion:
          "We work across the whole process, from the idea to the final delivery. We plan the requirements and the goals with your organization, build a solution and put it to work.",
      },
      {
        titulo: "Managed\nServices",
        acento: "verde" as Acento,
        descripcion:
          "We take over the management of specific projects alongside a Product Owner from your organization. We can be your ally, ready to work with your organization or company in a spirit of mutual cooperation.",
      },
      {
        titulo: "Staff\nAugmentation",
        acento: "naranja" as Acento,
        descripcion:
          "We join your team, adding experience and speed. We bring specific technical skills that complement your organization's, while keeping knowledge flowing both ways.",
      },
    ],
    cierre: {
      titulo:
        "Which model fits your organization or company best? Let's talk and we'll help you figure it out.",
      cta: { texto: "Write to us", href: "/contacto" },
      ctaMobile: { texto: "Work with Facttic", href: "/contacto" },
    },
  },

  porQue: {
    rotulo: "Value proposition",
    titulo: "Why choose us?",
    descripcion: "Technology is our tool.\nCooperation is what sets us apart.",
    items: [
      {
        titulo: "Every ICT specialty in one place",
        acento: "naranja" as Acento,
        descripcion:
          "We build teams with people specialized in different areas, ideal for complex, wide-reaching projects.",
      },
      {
        titulo: "Teams that stay",
        acento: "azul" as Acento,
        descripcion:
          "We work with stable teams, which lets us guarantee continuity, keep knowledge in house and understand each client's needs in depth.",
      },
      {
        titulo: "Agility and room to adapt",
        acento: "celeste" as Acento,
        descripcion:
          "Our cooperative structure lets us scale and adjust teams, keeping every project agile and open to change.",
      },
      {
        titulo: "Every project is ours",
        acento: "amarillo" as Acento,
        descripcion:
          "We own our co-ops and it shows: we don't just carry out tasks, we get involved.",
      },
    ],
  },

  aliados: {
    rotulo: "Allies",
    titulo: "They choose cooperative solutions",
  },

  cierre: {
    titulo: "Got a project?",
    cta: { texto: "Work with FACTTIC", href: "/contacto" },
  },
} as const;

export const VERTICALES = {
  otras: {
    titulo: "Discover other sectors\nwe work with",
    descripcion:
      "Every industry has its own rules.\nWe build solutions that adapt to them.",
  },

  descripciones: {
    organizaciones:
      "We work with social organizations, co-ops and human rights bodies that use technology as a tool for change. We develop digital solutions that widen their reach, improve their processes and strengthen their presence.",
    agro: "We are a network of co-ops specialized in technology solutions for agriculture. For more than 15 years we have been developing innovative projects with IoT, Big Data and Computer Vision, aimed at improving administrative, production, logistics and management processes. We work collaboratively, offering tailored solutions with real impact on the sector.\n\nWe know the practices of Argentine agriculture inside out and we understand its challenges. We know how to improve them through technology, bringing in tools that raise productivity, cut costs and make management more transparent and sustainable.",
    financiero:
      "We have broad experience in banking and fintech. We offer solutions that make financial services easier to reach, improve day-to-day operations and keep you compliant.",
  } as Record<string, string>,

  propuesta: {
    rotulo: "Value proposition",
    titulo: "Why choose us?",
    items: {
      organizaciones: [
        {
          titulo: "We work\nwith commitment",
          descripcion:
            "We share a political view of the role technology and knowledge play in society. It is not just a service: it is a conviction.",
        },
        {
          titulo: "We are part of it",
          descripcion:
            "We organize collectively, so we know what it takes to work with organizations that share that logic.",
        },
        {
          titulo: "We inter-cooperate",
          descripcion:
            "We have specialists across different branches of technology, innovation and knowledge. That lets us take on complex projects from several angles at once.",
        },
        {
          titulo: "We know\neach other",
          descripcion:
            "We have a long track record working with social and grassroots organizations, both in Argentina and abroad.",
        },
      ],
      agro: [
        {
          titulo: "There are\nmany of us",
          descripcion:
            "We are more than 500 technology workers with deep experience in development and innovation, which makes projects easy to scale.",
        },
        {
          titulo: "We handle a wide range of technologies",
          descripcion:
            "Our teams work with the most varied technology tools, which means a large set of options for solving each challenge.",
        },
        {
          titulo: "We work\nas a team",
          descripcion:
            "We are used to working as one: we set goals together, and together with the client, to reach the outcome they are after.",
        },
        {
          titulo: "We know\nthe field",
          descripcion:
            "We have solved many problems for agriculture, we know what the sector needs and we understand the challenges it faces.",
        },
      ],
      financiero: [
        {
          titulo: "A proven track record in the sector",
          descripcion:
            "More than 20 years working with banks, fintechs and digital wallets across Latin America, with active projects in Argentina, Canada and the region.",
        },
        {
          titulo: "Technical depth in banking",
          descripcion:
            "We cover the sector's full stack: core banking, open banking, IaC, CRM, scoring, collections and compliance with Argentina's central bank.",
        },
        {
          titulo: "Cooperative commitment as an advantage",
          descripcion:
            "Our professionals are owners of their companies. That brings continuity, accountability and a long-term relationship with every client.",
        },
        {
          titulo: "Scaling without friction",
          descripcion:
            "We can grow or shrink teams within days. As a cluster of co-ops, we combine frontend, backend, infrastructure, QA and functional analyst profiles.",
        },
      ],
    } as Record<string, readonly { titulo: string; descripcion: string }[]>,
  },

  stack: { titulo: "Tech stack" },
  metodologia: { titulo: "Ways\nof working" },
  proyectos: { titulo: "Featured projects" },

  cierre: {
    titulo: "Got a project?",
    cta: { texto: "Work with FACTTIC", href: "/contacto" },
  },
} as const;

export const PROYECTOS_PAGINA = {
  hero: {
    titulo: "Our\ninter-co-op work",
    bajada:
      "We help companies and organizations grow their projects with cooperative technology and knowledge.",
  },
  filtros: {
    sector: "Sectors",
    sectorOtros: "Other",
    servicio: "Services",
    tecnologia: "Technologies",
    cooperativa: "Co-ops",
    todos: {
      sector: "All sectors",
      servicio: "All services",
      tecnologia: "All technologies",
      cooperativa: "All co-ops",
    },
    abrir: "Filter",
    limpiar: "Clear filters",
  },
  ficha: {
    rotulo: "Projects by",
    sitio: "Visit their site",
    mas: "Read more",
    menos: "Read less",
  },
  verMas: "See more",
  vacio: {
    titulo: "No projects match those filters",
    sugerencia: "Try fewer filters, or look at every project.",
  },
  ultimos: { titulo: "Latest projects" },
  detalle: {
    resena: "What was this project about?",
    stack: "Tech stack",
    cooperativas: "Co-ops",
    relacionados: "Related projects",
    secciones: {
      desafio: "Challenge",
      solucion: "Solution",
      resultado: "Outcome",
    },
  },
  cierre: {
    titulo: "Got a project?",
    cta: { texto: "Work with FACTTIC", href: "/contacto" },
  },
} as const;

export const SUMA_TU_COOP = {
  hero: {
    titulo: "Everything is\nbetter cooperating",
    bajada:
      "We are technology and knowledge co-ops made up of professionals who build solutions with real impact. We believe technology is more powerful when it is built collectively, with solidarity and responsibility.",
  },

  sumate: {
    rotulo: "Advantages",
    titulo: "What is FACTTIC?",
    texto:
      "A federation is a collective space formed by co-ops that decide to come together to share what they know, grow and strengthen each other. In our case, we are co-ops working in development, communication, management, engineering and training, among other areas, that more than 10 years ago chose to build together. Because we believe cooperative work is the way.",
    cta: { texto: "Learn more", href: "/sobre-facttic" },
  },

  oportunidades: {
    rotulo: "Advantages",
    titulo: "What does the Federation\nhave to offer?",
    orden: [
      "Real collaboration, not competition",
      "Independence with collective backing",
      "Steady work",
      "Work with purpose and impact",
    ],
  },

  compromisos: {
    rotulo: "Obligations",
    titulo: "Being part means commitments and rights",
    bajada: "Being part of FACTTIC means:",
    items: [
      "Being a co-op",
      "Keeping your paperwork\nup to date",
      "Naming someone to represent your co-op at FACTTIC",
      "Paying the membership fee (not a dealbreaker)",
      "Respecting our\ncode of conduct",
      "Taking part in collective working spaces and in the plenaries where we decide",
    ],
  },

  codigo: {
    titulo: "We have a code\nof conduct!",
    texto:
      "Every FACTTIC meeting is governed by a code of conduct that guarantees safe, equal participation for everyone taking part.",
    cta: { texto: "Read the code", href: "https://facttic.org.ar" },
  },

  camino: {
    titulo: "Choose your way into cooperativism",
    items: [
      {
        pregunta: "Want to join\na co-op?",
        descripcion:
          "Semillero is FACTTIC's platform connecting people interested in cooperative work with co-ops looking for new members. You can find openings in technology, design, development, marketing, management and administration.",
        enlace: {
          texto: "Go to Semillero",
          href: "https://semillero.coop.ar/home",
        },
        acento: "lila" as Acento,
      },
      {
        pregunta: "Want to start\nyour own co-op?",
        descripcion:
          "We walk alongside technology, innovation and knowledge co-ops taking their first steps. We share our experience and our tools to help them find their place in the cooperative world.",
        enlace: { texto: "Get in touch", href: "/contacto" },
        acento: "celeste" as Acento,
        vidrioEnMobile: true,
      },
      {
        pregunta: "Want to learn\nabout cooperativism?",
        descripcion:
          "The Cooperative Training Club is FACTTIC's learning platform, where you can take courses on cooperativism and technology.",
        enlace: {
          texto: "Go to the club",
          href: "https://clubcooperativo.com.ar/",
        },
        acento: "naranja" as Acento,
      },
    ],
  },

  cierre: {
    titulo: "Every co-op that joins makes us stronger.",
    cta: { texto: "Join FACTTIC", href: "/contacto" },
  },
} as const;

export const ERROR_404 = {
  titulo: "This connection doesn't exist",
  texto:
    "Looks like the connection you were after dropped off the network. There is still plenty to explore.",
  cta: { texto: "Back to home", href: "/" },
  cierre: {
    titulo: "Are you part of\na co-op?",
    cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

export const CONTACTO = {
  hero: {
    titulo: "How can\nwe help you?",
    bajada:
      "Whether you have a project, want to join the network or simply want to know more, we're here.",
  },
  formulario: {
    titulo: "Send us a message",
    nombre: { etiqueta: "Full name", ejemplo: "E.g. Ada Lovelace" },
    email: { etiqueta: "Email address", ejemplo: "ada.lovelace@gmail.com" },
    mensaje: { etiqueta: "Your message", ejemplo: "Leave us your message..." },
    motivo: {
      etiqueta: "Select a reason",
      opciones: [
        "I need your services",
        "I want to bring my co-op in",
        "I want to start a co-op",
        "Other",
      ],
    },
    enviar: "Send message",
    enviando: "Sending…",
    errores: {
      nombre: "Write your name",
      email: "Write a valid email address",
      mensaje: "Tell us briefly how we can help",
    },
    exito: {
      titulo: "We got your message",
      texto: "We'll get back to you shortly. Thanks for writing!",
    },
    falla: {
      titulo: "We couldn't send your message",
      texto:
        "Try again in a while. If it keeps failing, reach us on social media.",
    },
  },
} as const;

export const SOBRE_FACTTIC = {
  hero: {
    titulo: "Our code\nis to cooperate",
    bajada:
      "Our goal is for technology and knowledge worker co-ops to have a space to exchange information and knowledge, and to build solutions collectively.",
  },

  quienes: {
    rotulo: "Who we are",
    titulo: "Cooperativism multiplies",
    parrafos: [
      "We are co-ops of professionals committed to developing technology and knowledge solutions that improve people's lives. We are grouped in the Argentine Federation of Technology, Innovation and Knowledge Worker Co-operatives (FACTTIC).",
      "In our cooperative model there are no bosses and no employees. Everyone who works is a member: they are part of it, they take decisions and they share in what the collective work produces.",
      "That doesn't mean everyone does everything together; there are roles, responsibilities and structures. The difference is that we put people at the centre. We are the ones who decide how we work, how we organize and what we do with what we create.",
      "At FACTTIC this model multiplies: we are co-ops that cooperate with each other. We share projects, resources, knowledge and a political view of the role technology and knowledge play in society.",
    ],
    tarjetas: [
      {
        pregunta: "Want to join\na co-op?",
        descripcion:
          "Semillero is FACTTIC's platform connecting people interested in cooperative work with co-ops looking for new members. You can find openings in technology, design, development, marketing, management and administration.",
        enlace: {
          texto: "Go to Semillero",
          href: "https://semillero.coop.ar/home",
        },
        acento: "lila" as Acento,
      },
      {
        pregunta: "Want to learn\nabout cooperativism\nand technology?",
        descripcion:
          "The Cooperative Training Club is FACTTIC's learning platform, where you can take courses on cooperativism and technology.",
        enlace: {
          texto: "Go to the club",
          href: "https://clubcooperativo.com.ar/",
        },
        acento: "celeste" as Acento,
        oscuraEnMobile: true,
      },
    ],
  },

  foto: {
    src: "/marca/plenario.jpg",
    alt: "FACTTIC plenary: the Federation's co-ops together",
  },

  modelo: {
    rotulo: "Cooperative model",
    titulo: "A different way\nof working",
    parrafos: [
      "We believe technology work can be organized differently. In our co-ops we build working relationships based on equality and cooperation every day. And we dream of that logic spreading: to more sectors and more projects.",
      "We believe co-ops are a real, workable alternative for building a more human economy, grounded in solidarity.",
    ],
  },

  espacios: { titulo: "We are part\nof other cooperative\nspaces" },

  organizacion: {
    rotulo: "Organization",
    titulo: "How do we organize?",
    parrafos: [
      "FACTTIC organizes democratically: the most important decisions are taken by the Assembly, where every co-op in the Federation takes part.",
      "To carry those decisions through we have two bodies: the Board, which represents the Federation institutionally and handles legal and administrative matters, and the Audit Committee, which makes sure the Board follows what we decided collectively. Its members are elected by the Assembly.",
    ],
    organos: {
      consejo: "Board",
      sindicatura: "Audit Committee",
    },
  },

  red: {
    rotulo: "Our network",
    titulo: "Co-ops\nthat make up\nthe Federation",
  },

  cierre: {
    titulo: "Are you part of\na co-op?",
    cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

export const NOVEDADES = {
  hero: {
    titulo: "What happens\nmatters to us",
    bajada:
      "Read where we stand on what's going on, and the news from the Federation.",
  },
  solapas: {
    todos: "All",
    comunicado: "Statements",
    noticia: "News",
    actividad: "Events",
  },
  verMas: "See more",
  vacio: {
    titulo: "No news yet",
    sugerencia: "When we publish something, you'll find it here.",
  },
  relacionadas: {
    rotulo: "Recommended",
    titulo: "You may also like",
    cta: { texto: "See all", href: "/novedades" },
  },
  cierre: {
    titulo: "Are you part of\na co-op?",
    cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

export const NUESTRA_RED = {
  seo: {
    titulo: "Our Network",
    descripcion:
      "FACTTIC co-operatives across Argentina: where they are, how many they are and what they do.",
  },
  hero: {
    titulo:
      "We are\na federal network\nof Argentine technology,\ninnovation and\nknowledge\nco-ops",
    tituloMobile: "We are\na federal network\nof Argentine co-ops",
  },
  panel: {
    rotulo: "Selected province",
    cooperativas: (n: number) => `${n} ${n === 1 ? "co-op" : "co-ops"}`,
    asociados: (n: number) => `${n} ${n === 1 ? "member" : "members"}`,
    industrias: "Specialized industries",
    servicios: "Specialized services",
    verTodo: "See all",
    verMenos: "See less",
    sinDatos: "We haven't added the detail for this province yet.",
  },
  tarjeta: {
    sitio: "Visit site",
    proyectos: "See their projects",
    abrir: "View profile",
    cerrar: "Close",
    mas: (n: number) => `+${n} more`,
  },
  vacio: {
    titulo: "Pick a province",
    sugerencia: "Tap the map to see the co-ops in each province.",
  },
  cierre: {
    titulo: "Every co-op that joins makes us stronger.",
    cta: { texto: "Join FACTTIC", href: "/suma-tu-coop" },
  },
} as const;
