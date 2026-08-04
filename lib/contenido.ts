import type { Acento } from "@/components/ui/acento";

/**
 * Textos que no vienen de la API.
 *
 * Están todos acá y no incrustados en las páginas por dos razones: son los que
 * el equipo de FACTTIC va a querer retocar sin tocar componentes, y son los que
 * habrá que traducir cuando se sume el inglés.
 *
 * Los copys están tomados de las maquetas de Figma.
 */

export const HOME = {
  hero: {
    // El diseño quiebra el título en líneas exactas, y en mobile suma una:
    // ahí el hero ocupa toda la pantalla y el título entra en cuatro renglones.
    titulo: "Desarrollá\ntu proyecto\ncon cooperativas",
    tituloMobile: "Desarrollá\ntu proyecto\ntecnológico\ncon cooperativas",
    bajada:
      "Una red federal de cooperativas de tecnología, innovación y conocimiento que diseña, desarrolla e implementa soluciones digitales",
    cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
  },

  sectores: {
    rotulo: "Industrias",
    titulo: "Sectores\ncon los que trabajamos",
  },

  servicios: {
    rotulo: "Servicios",
    titulo: "Solucionamos con tecnología e innovación",
    // En mobile el bloque cambia de título, no solo de forma. Sin saltos: en
    // pantallas chicas los títulos los reparte el balance del navegador.
    tituloMobile: "Soluciones tecnológicas para tu organización",
  },

  metodologia: {
    rotulo: "Metodología",
    titulo: "Armamos equipos intercoop",
    cta: { texto: "Conocer más", href: "/nuestros-servicios#metodologias" },
    pasos: [
      {
        titulo: "Nos contás tu necesidad",
        descripcion: "Analizamos tu proyecto, objetivos y requerimientos.",
      },
      {
        titulo: "Armamos el equipo intercoop",
        descripcion: "Seleccionamos las cooperativas y perfiles más adecuados.",
      },
      {
        titulo: "Desarrollamos la solución",
        descripcion:
          "Trabajamos de forma coordinada para llevar tu proyecto adelante.",
      },
    ],
  },

  proyectos: {
    rotulo: "Proyectos",
    titulo: "Nuestros proyectos destacados",
    cta: { texto: "Ver todos", href: "/proyectos" },
    cierre: {
      titulo: "¿Tenés algún proyecto en mente?",
      cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
    },
  },

  /*
    El lema aparece de dos formas según el ancho: en desktop cruza la pantalla
    como marquesina y en mobile es una sección propia, con la animación arriba y
    una bajada. Por eso lleva más que el texto suelto.
  */
  lema: {
    rotulo: "Sobre FACTTIC",
    texto: "Nuestro código es cooperar",
    bajada:
      "En FACTTIC el cooperativismo se multiplica: somos cooperativas que cooperan entre sí.",
    cta: { texto: "Ver más", href: "/sobre-facttic" },
  },

  beneficios: {
    rotulo: "Beneficios",
    titulo: "¿Qué oportunidades ofrece la Federación?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
    items: [
      {
        titulo: "Continuidad de trabajo",
        animacion: "beneficio-continuidad",
        descripcion:
          "Accedés a una red que redistribuye oportunidades y sostiene la actividad en el tiempo",
        acento: "rojo" as Acento,
      },
      {
        titulo: "Colaboración real, no competencia",
        animacion: "beneficio-colaboracion",
        descripcion:
          "Colaborás con otras cooperativas, compartís conocimiento y armás equipos",
        acento: "azul" as Acento,
      },
      {
        titulo: "Autonomía con respaldo colectivo",
        animacion: "beneficio-autonomia",
        descripcion:
          "Mantenés tu independencia como cooperativa, pero con capacidad de red",
        acento: "verde" as Acento,
      },
      {
        titulo: "Trabajo con impacto y propósito",
        animacion: "beneficio-trabajo",
        descripcion:
          "Formás parte de proyectos que mejoran la calidad de vida de las personas",
        acento: "naranja" as Acento,
      },
    ],
  },

  red: {
    rotulo: "Nuestra red",
    titulo: "Una red federal de cooperativas",
    cta: { texto: "Conocer la red", href: "/nuestra-red" },
    cierre: {
      titulo: "¿Querés ser parte de la red?",
      cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
    },
  },
} as const;

/**
 * Nuestros servicios.
 *
 * Los servicios y los sectores salen de la API; acá va lo fijo de la pantalla.
 * Igual que en la Home, hay copy que cambia entre las dos maquetas: el rótulo
 * de la sección de sectores dice "Verticales" en desktop e "Industrias" en
 * mobile.
 */
export const SERVICIOS_PAGINA = {
  hero: {
    titulo: "Solucionamos\ncon tecnología",
    bajada:
      "Aportamos soluciones tecnológicas y de conocimiento que acompañan el desarrollo del cooperativismo, la producción y la industria.",
  },

  sectores: {
    rotulo: "Verticales",
    rotuloMobile: "Industrias",
    titulo: "Sectores con\nlos que trabajamos",
    descripcion:
      "Cada rubro tiene sus propias reglas.\nDesarrollamos soluciones que se adaptan a ellas.",
  },

  soluciones: {
    rotulo: "Servicios",
    titulo: "Nuestras soluciones",
  },

  metodologia: {
    rotulo: "Metodologías",
    titulo: "¿Cómo trabajamos?",
    /*
     * En desktop son tres bloques de color con el nombre y nada más; en mobile
     * se vuelven un carrusel y ahí sí aparece la descripción. El diseño solo
     * escribió la de "Proyectos a medida"; las otras dos están redactadas acá
     * siguiendo ese tono y hay que validarlas con FACTTIC.
     */
    items: [
      {
        titulo: "Proyectos\na medida",
        acento: "lila" as Acento,
        descripcion:
          "Nos encargamos de todo el proceso, desde la idea hasta la entrega final. Trabajamos junto a tu organización para entender sus necesidades, definir objetivos y construir una solución con identidad propia.",
      },
      {
        titulo: "Managed\nServices",
        acento: "verde" as Acento,
        descripcion:
          "Nos hacemos cargo de la operación en el tiempo. Tu equipo se enfoca en lo suyo y nosotros sostenemos la infraestructura, las actualizaciones y el soporte del día a día.",
      },
      {
        titulo: "Staff\nAugmentation",
        acento: "naranja" as Acento,
        descripcion:
          "Sumamos perfiles de nuestras cooperativas a tu equipo. Trabajan con tus procesos y tus tiempos, con la experiencia y el respaldo de toda la red detrás.",
      },
    ],
    cierre: {
      titulo:
        "¿Cuál es el modelo ideal para tu organización o empresa? Hablemos y te asesoramos.",
      cta: { texto: "Escribinos", href: "/contacto" },
      // En mobile la maqueta usa el mismo texto que el resto de los CTA.
      ctaMobile: { texto: "Trabajá con Facttic", href: "/contacto" },
    },
  },

  porQue: {
    rotulo: "Propuesta de valor",
    titulo: "¿Por qué elegirnos?",
    descripcion:
      "La tecnología es nuestra herramienta.\nLa cooperación, nuestro diferencial.",
    /*
     * Cada tarjeta se pinta con su color al pasar el mouse y muestra la
     * explicación. Las dos primeras descripciones están tomadas del prototipo;
     * las otras dos las redactamos siguiendo ese tono y hay que validarlas.
     */
    items: [
      {
        titulo: "Todas las especialidades TIC en un solo lugar",
        acento: "naranja" as Acento,
        descripcion:
          "Armamos equipos con personas especializadas en diferentes áreas, ideales para abordar proyectos complejos y de gran alcance.",
      },
      {
        titulo: "Equipos sin rotación",
        acento: "azul" as Acento,
        descripcion:
          "Trabajamos con equipos estables, lo que nos permite asegurar continuidad, preservar el conocimiento y profundizar la comprensión de las necesidades de cada cliente.",
      },
      {
        titulo: "Agilidad y capacidad de adaptación",
        acento: "celeste" as Acento,
        descripcion:
          "Somos organizaciones chicas conectadas entre sí: armamos el equipo que cada proyecto necesita y lo ajustamos cuando el proyecto cambia.",
      },
      {
        titulo: "Cada proyecto es nuestro",
        acento: "amarillo" as Acento,
        descripcion:
          "Trabajamos sobre lo propio, no sobre el encargo de un tercero. Quien desarrolla es parte de la cooperativa que se hace cargo del resultado.",
      },
    ],
  },

  aliados: {
    rotulo: "Aliados",
    titulo: "Eligen soluciones cooperativas",
  },

  cierre: {
    titulo: "¿Tenés un proyecto?",
    cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
  },
} as const;
