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
    // Mobile la acorta: en la maqueta entra en cuatro renglones de mono.
    /*
      Los cortes de línea son los del board: sin ellos el ancho de la columna
      dejaría "Una red federal de cooperativas" en el primer renglón y el
      bloque perdería la forma escalonada del diseño.
    */
    bajadaMobile:
      "Una red federal\nde cooperativas tecnológicas\nque diseña, desarrolla\ne implementa soluciones\ndigitales.",
    cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
  },

  sectores: {
    rotulo: "Industrias",
    titulo: "Sectores\ncon los que trabajamos",
    // El corte cae en otro lado en cada maqueta.
    tituloMobile: "Sectores con\nlos que trabajamos",
    // El botón lo sumó diseño el 10/8, con una anotación de Desarrollo en el
    // archivo: "Nuevo, va a sección 'nuestros servicios'". El texto todavía
    // está en discusión —hay una anotación de Contenido al lado—.
    cta: { texto: "Conocé nuestros servicios", href: "/nuestros-servicios" },
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
        // La maqueta mobile lo escribe entero; la de desktop lo abrevia.
        tituloMobile: "Armamos el equipo intercooperativo",
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
      titulo: "¿Tenés un proyecto en mente?",
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
    tituloMobile: "¿Qué oportunidades ofrece FACTTIC?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
    items: [
      {
        titulo: "Continuidad de trabajo",
        animacion: "beneficio-continuidad",
        descripcion:
          "Accedés a una red que redistribuye oportunidades y sostiene la actividad en el tiempo. Escalá equipos y postulate a proyectos grandes sin tener que cubrir todos los perfiles.",
        acento: "rojo" as Acento,
      },
      {
        titulo: "Colaboración real, no competencia",
        animacion: "beneficio-colaboracion",
        descripcion:
          "Colaborás con otras cooperativas, compartís conocimiento y armás equipos. Priman lógicas de articulación basadas en la necesidad, el aprendizaje y la equidad, por fuera de las reglas estrictas del mercado.",
        acento: "azul" as Acento,
      },
      {
        titulo: "Autonomía con respaldo colectivo",
        animacion: "beneficio-autonomia",
        descripcion:
          "Mantenés tu independencia como cooperativa, pero con capacidad de red. Cada cooperativa define sus reglas, sabiendo que se apoya en un grupo más grande para mitigar crisis y alcanzar metas que sola no podría.",
        acento: "verde" as Acento,
      },
      {
        titulo: "Trabajo con impacto y propósito",
        animacion: "beneficio-trabajo",
        descripcion:
          "Participás en una red que construye tecnología más justa. Ponemos en el centro a las personas y basamos las decisiones en la sostenibilidad, buscando una sociedad más inclusiva y equitativa.",
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
      // En mobile la banda pregunta otra cosa y manda al formulario.
      tituloMobile: "¿Sos parte de\nuna cooperativa?",
      ctaMobile: { texto: "Trabajá con Facttic", href: "/contacto" },
    },
  },
} as const;

/**
 * Nuestros servicios.
 *
 * Los servicios y los sectores salen de la API; acá va lo fijo de la pantalla.
 * Igual que en la Home, hay copy que cambia entre las dos maquetas: el rótulo
 * de la sección de sectores dice "Sectores" en desktop —decía "Verticales"
 * hasta que contenido lo cambió— e "Industrias" en mobile.
 */
export const SERVICIOS_PAGINA = {
  hero: {
    titulo: "Solucionamos\ncon tecnología",
    bajada:
      "Aportamos soluciones tecnológicas y de conocimiento que acompañan el desarrollo del cooperativismo, la producción y la industria.",
  },

  sectores: {
    rotulo: "Sectores",
    rotuloMobile: "Industrias",
    titulo: "Sectores con\nlos que trabajamos",
    // El corte cae en otro lado en cada maqueta.
    tituloMobile: "Sectores\ncon los que trabajamos",
    descripcion:
      "Cada rubro tiene sus propias reglas.\nDesarrollamos soluciones que se adaptan a ellas.",
  },

  soluciones: {
    rotulo: "Servicios",
    titulo: "Nuestras soluciones",
  },

  metodologia: {
    // Decía "Metodologías" —y "Metodología" en el board mobile de las
    // verticales— hasta que contenido lo cambió por "Formas de trabajo".
    rotulo: "Formas de trabajo",
    rotuloMobile: "Formas de trabajo",
    titulo: "¿Cómo trabajamos?",
    /*
     * En desktop son tres bloques de color con el nombre y nada más; en mobile
     * se vuelven un carrusel y ahí sí aparece la descripción. Las tres
     * descripciones las escribió FACTTIC.
     */
    items: [
      {
        titulo: "Proyectos\na medida",
        acento: "lila" as Acento,
        descripcion:
          "Trabajamos en todo el proceso, desde la idea hasta la entrega final. Planificamos con tu organización los requerimientos, los objetivos, construimos una solución y la ponemos en funcionamiento.",
      },
      {
        titulo: "Managed\nServices",
        acento: "verde" as Acento,
        descripcion:
          "Asumimos la gestión de proyectos específicos junto a un Product Owner de la organización. Podemos ser tu aliado, listos para colaborar con tu organización o empresa en un espíritu de cooperación mutua.",
      },
      {
        titulo: "Staff\nAugmentation",
        acento: "naranja" as Acento,
        descripcion:
          "Nos integramos a tu equipo, sumando experiencia y agilidad. Sumamos capacidades técnicas específicas que complementan las de tu organización, mientras impulsamos una transferencia de conocimiento constante.",
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
     * las otras dos las escribió FACTTIC.
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
          "Nuestra estructura cooperativa nos permite escalar y ajustar equipos garantizando agilidad y capacidad de adaptación en cada proyecto.",
      },
      {
        titulo: "Cada proyecto es nuestro",
        acento: "amarillo" as Acento,
        descripcion:
          "Somos dueñas y dueños de nuestras cooperativas y eso se nota: no ejecutamos tareas, nos involucramos.",
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

/**
 * Verticales (Organizaciones, Agro, Financiero).
 *
 * Las tres comparten plantilla: diseño confirmó que se reúsa. El nombre, la
 * ilustración y los proyectos salen de la API; acá va lo que la API no tiene.
 *
 * La descripción larga vive por ahora en el código porque el modelo de Sector
 * tiene un solo campo de texto y ese lo ocupa la frase corta que usa el hover
 * de las tarjetas en la Home. Está pedido como ítem 26.
 */
export const VERTICALES = {
  /*
   * El bloque que cierra la pantalla, con las otras dos verticales. El texto
   * es el mismo que acompaña a los sectores en Nuestros servicios: en el
   * archivo se repite tal cual.
   */
  otras: {
    titulo: "Descubrí otros sectores\ncon los que trabajamos",
    descripcion:
      "Cada rubro tiene sus propias reglas.\nDesarrollamos soluciones que se adaptan a ellas.",
  },

  descripciones: {
    organizaciones:
      "Trabajamos con organizaciones sociales, cooperativas y organismos de derechos humanos que usan la tecnología como herramienta de transformación. Desarrollamos soluciones digitales que amplían su alcance, mejoran sus procesos y fortalecen su presencia.",
    /*
     * Agro es la única que viene en dos párrafos: se separan con una línea en
     * blanco y el hero los reparte. Ver `parrafos()` más abajo.
     */
    agro: "Somos una red de cooperativas especializadas en soluciones tecnológicas para el agro. Desarrollamos desde hace más de 15 años proyectos innovadores con IoT, Big Data y Computer Vision, enfocados en optimizar procesos administrativos, productivos, logísticos y de gestión. Trabajamos de manera colaborativa, ofreciendo soluciones a medida que generan impacto real en el sector.\n\nConocemos en profundidad las prácticas del sector agro en Argentina y entendemos sus desafíos. Sabemos cómo optimizarlas mediante tecnología, integrando herramientas para aumentar la productividad, reducir costos y garantizar una gestión más transparente y sostenible.",
    financiero:
      "Tenemos amplia experiencia en el rubro banking y fintech. Ofrecemos soluciones que facilitan el acceso a servicios financieros, mejorando la operatoria diaria y asegurando el cumplimiento normativo.",
  } as Record<string, string>,

  propuesta: {
    rotulo: "Propuesta de valor",
    // Sin bajada: la lleva la sección homónima de Nuestros servicios, pero en
    // la vertical el prototipo va directo del título a las tarjetas.
    titulo: "¿Por qué elegirnos?",
    /*
     * Cuatro motivos por vertical, escritos por FACTTIC: el módulo se repite
     * pero el texto no, a diferencia de "¿Cómo trabajamos?", que sí es el mismo
     * en las tres y vive en `SERVICIOS_PAGINA.metodologia`.
     *
     * El salto en el título lo pone el copy y lo respeta `whitespace-pre-line`
     * en la tarjeta; donde no hay `\n`, el título se acomoda solo.
     *
     * Una vertical sin entrada acá no muestra la sección, que es preferible a
     * mostrarle a un sector nuevo los motivos de otro.
     */
    items: {
      organizaciones: [
        {
          titulo: "Trabajamos\ncon compromiso",
          descripcion:
            "Compartimos una perspectiva política sobre el rol de la tecnología y el conocimiento en la sociedad. No es solo un servicio: es una convicción.",
        },
        {
          titulo: "Somos parte",
          descripcion:
            "Nos organizamos colectivamente, por eso sabemos lo que implica trabajar con organizaciones que comparten esa lógica.",
        },
        {
          titulo: "Intercooperamos",
          descripcion:
            "Contamos con especialistas en distintas ramas de la tecnología, la innovación y el conocimiento. Eso nos permite encarar proyectos complejos desde múltiples frentes.",
        },
        {
          titulo: "Nos\nconocemos",
          descripcion:
            "Tenemos amplia trayectoria trabajando con organizaciones sociales y populares, tanto nacionales como internacionales.",
        },
      ],
      agro: [
        {
          titulo: "Somos\nun montón",
          descripcion:
            "Somos más de 500 trabajadores tecnológicos con alta experiencia en desarrollo e innovación, lo que permite escalar los proyectos.",
        },
        {
          titulo: "Manejamos amplias tecnologías",
          descripcion:
            "Contamos con equipos que trabajan con las más variadas herramientas tecnológicas, lo que permite contar con un gran paquete de opciones para la solución de los desafíos.",
        },
        {
          titulo: "Trabajamos\nen equipo",
          descripcion:
            "Estamos familiarizados con el trabajo integrado, podemos construir metas en equipo con mucha facilidad y conjuntamente con el cliente para llegar al objetivo deseado.",
        },
        {
          titulo: "Conocemos\nel campo",
          descripcion:
            "Tenemos mucha experiencia en resolución de problemas para el agro, conocemos las necesidades que tiene el sector y entendemos los desafíos que enfrenta.",
        },
      ],
      financiero: [
        {
          titulo: "Trayectoria sectorial comprobada",
          descripcion:
            "Más de 20 años acompañando a bancos, fintechs y billeteras digitales en Latinoamérica, con proyectos activos en Argentina, Canadá y la región.",
        },
        {
          titulo: "Especialización técnica en banking",
          descripcion:
            "Dominamos el stack completo del sector: core bancario, open banking, IaC, CRM, scoring, cobranzas y cumplimiento normativo con el BCRA.",
        },
        {
          titulo: "Compromiso cooperativo como ventaja competitiva",
          descripcion:
            "Nuestros profesionales son socios de sus empresas. Eso asegura continuidad, responsabilidad y un vínculo de largo plazo con cada cliente.",
        },
        {
          titulo: "Escalabilidad sin fricción",
          descripcion:
            "Podemos ampliar o reducir equipos en días. Como cluster de cooperativas, combinamos perfiles frontend, backend, infraestructura, QA y analistas funcionales.",
        },
      ],
    } as Record<string, readonly { titulo: string; descripcion: string }[]>,
  },

  stack: { titulo: "Stack tecnológico" },
  /* En la vertical la metodología es un desplegable con el título al costado,
     no los tres bloques de color de Nuestros servicios. El corte de renglón es
     el de la maqueta; el título decía "Metodologías de trabajo". */
  metodologia: { titulo: "Formas\nde trabajo" },
  proyectos: { titulo: "Proyectos destacados" },

  cierre: {
    titulo: "¿Tenés un proyecto?",
    cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
  },
} as const;

/**
 * Proyectos: la grilla con filtros y el detalle.
 *
 * Los proyectos, los filtros y sus opciones salen de la API; acá va el texto
 * fijo de las dos pantallas.
 */
export const PROYECTOS_PAGINA = {
  hero: {
    titulo: "Nuestro\ntrabajo intercoop",
    bajada:
      "Ayudamos a empresas y organizaciones a potenciar sus proyectos con tecnología y conocimiento cooperativo.",
  },
  filtros: {
    sector: "Sectores",
    sectorOtros: "Otros",
    servicio: "Servicios",
    tecnologia: "Tecnologías",
    cooperativa: "Por cooperativa",
    abrir: "Filtrar",
    limpiar: "Limpiar filtros",
  },
  verMas: "Ver más",
  vacio: {
    titulo: "No encontramos proyectos con esos filtros",
    sugerencia: "Probá con menos filtros o mirá todos los proyectos.",
  },
  ultimos: { titulo: "Últimos proyectos" },
  detalle: {
    resena: "¿De qué se trató este proyecto?",
    stack: "Stack tecnológico",
    cooperativas: "Cooperativas",
    relacionados: "Proyectos relacionados",
    secciones: {
      desafio: "Desafío",
      solucion: "Solución",
      resultado: "Resultado",
    },
  },
  cierre: {
    titulo: "¿Tenés un proyecto?",
    cta: { texto: "Trabajá con FACTTIC", href: "/contacto" },
  },
} as const;

/**
 * Sumá tu coop.
 *
 * Es la única pantalla sin datos de la API: todo el contenido es fijo y está
 * tomado de las maquetas. Las oportunidades reutilizan los beneficios de la
 * Home, que son los mismos cuatro, aunque acá en otro orden.
 */
export const SUMA_TU_COOP = {
  hero: {
    titulo: "Todo es\nmejor cooperando",
    bajada:
      "Somos cooperativas de tecnología y de conocimiento formada por profesionales que desarrollan soluciones con impacto real. Creemos que la tecnología es más poderosa cuando se construye colectivamente, con solidaridad y responsabilidad.",
  },

  sumate: {
    rotulo: "Ventajas",
    titulo: "¿Qué es FACTTIC?",
    texto:
      "Una federación es un espacio colectivo formado por cooperativas que deciden unirse para compartir saberes, crecer y potenciarse. En nuestro caso, somos cooperativas de desarrollo, comunicación, gestión, ingeniería, capacitaciones, entre otras áreas que hace más de 10 años elegimos construir juntas. Porque creemos que el trabajo cooperativo es el camino.",
    cta: { texto: "Conocer más", href: "/sobre-facttic" },
  },

  oportunidades: {
    rotulo: "Ventajas",
    titulo: "¿Qué oportunidades\nofrece la Federación?",
    // El orden de esta pantalla, que no es el de la Home.
    orden: [
      "Colaboración real, no competencia",
      "Autonomía con respaldo colectivo",
      "Continuidad de trabajo",
      "Trabajo con impacto y propósito",
    ],
  },

  compromisos: {
    rotulo: "Obligaciones",
    titulo: "Ser parte implica compromisos y derechos",
    bajada: "Formar parte de FACTTIC implica:",
    /*
     * Son seis y no los cuatro de la maqueta, que repetía dos textos por falta
     * de copy. Por eso la grilla va de a tres: seis en filas de cuatro dejan
     * una segunda fila coja.
     */
    items: [
      "Ser una cooperativa",
      "Estar al día con\nla documentación",
      // Los tres largos van sin salto: forzarlo les suma una línea y no entran.
      "Designar una persona que represente tu coope ante FACTTIC",
      "Abonar la cuota de sostenimiento (no excluyente)",
      "Respetar nuestro\ncódigo de conducta",
      "Participar en espacios colectivos de trabajo y plenarios de definiciones internas",
    ],
  },

  codigo: {
    titulo: "¡Tenemos código\nde conducta!",
    texto:
      "Todas las reuniones de FACTTIC se rigen por un código de conducta que garantiza la participación segura e igualitaria de quienes las integran.",
    // La URL exacta del código quedó pedida; mientras tanto va al sitio actual.
    cta: { texto: "Ver Código", href: "https://facttic.org.ar" },
  },

  camino: {
    titulo: "Elegí tu camino al cooperativismo",
    /*
     * Al pasar el mouse cada tarjeta se vuelve gris y muestra su explicación
     * con el enlace. Semillero y el Club de Formación son plataformas propias
     * de FACTTIC y viven fuera del sitio: se abren en otra pestaña. La del
     * medio sí va al formulario.
     */
    items: [
      {
        pregunta: "¿Querés sumarte\na una coope?",
        descripcion:
          "Semillero es la plataforma de FACTTIC que conecta a personas interesadas en el trabajo cooperativo con cooperativas que están buscando nuevos socios y socias. Podés encontrar oportunidades en tecnología, diseño, desarrollo, marketing, gestión y administración.",
        enlace: {
          texto: "Ir a Semillero",
          href: "https://semillero.coop.ar/home",
        },
        acento: "lila" as Acento,
      },
      {
        pregunta: "¿Querés armar\ntu propia cooperativa?",
        descripcion:
          "Acompañamos a proyectos cooperativos de tecnología, innovación y conocimiento en sus primeros pasos. Compartimos nuestra experiencia y herramientas para ayudar a que se sumen al mundo cooperativo.",
        enlace: { texto: "Contactanos", href: "/contacto" },
        acento: "celeste" as Acento,
        // La maqueta mobile la hace de vidrio sobre la estrella naranja; la
        // de desktop la pinta de celeste.
        vidrioEnMobile: true,
      },
      {
        pregunta: "¿Querés formarte\nen cooperativismo?",
        descripcion:
          "El Club de Formación Cooperativa es una plataforma educativa de FACTTIC donde podés realizar cursos sobre cooperativismo y tecnología.",
        enlace: {
          texto: "Ir al club",
          href: "https://clubcooperativo.com.ar/",
        },
        acento: "naranja" as Acento,
      },
    ],
  },

  cierre: {
    titulo: "Cada cooperativa que se suma, nos hace más fuertes.",
    cta: { texto: "Sumate a FACTTIC", href: "/contacto" },
  },
} as const;

/**
 * 404. Las dos maquetas difieren: desktop alinea a la izquierda y termina en
 * el pie; mobile centra todo y suma una tarjeta de cierre.
 */
export const ERROR_404 = {
  titulo: "Esta conexión no existe",
  texto:
    "Parece que la conexión que buscás quedó fuera de la red. Pero todavía hay mucho por explorar.",
  cta: { texto: "Volver al inicio", href: "/" },
  cierre: {
    titulo: "¿Sos parte de\nuna cooperativa?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

/**
 * Contacto.
 *
 * Las dos maquetas cambian la forma del formulario: desktop pone la etiqueta
 * arriba de cada campo con recuadro, mobile los deja sin etiqueta y sobre una
 * línea punteada, con los motivos en columna.
 */
export const CONTACTO = {
  hero: {
    titulo: "¿En qué\nte podemos ayudar?",
    bajada:
      "Ya sea que tenés un proyecto, querés sumarte a la red o simplemente querés saber más, estamos acá.",
  },
  formulario: {
    titulo: "Envíanos un mensaje",
    nombre: { etiqueta: "Nombre completo", ejemplo: "Ej: Paula Calgaro" },
    email: { etiqueta: "Correo electrónico", ejemplo: "paula@facttic.coop" },
    mensaje: { etiqueta: "Tu mensaje", ejemplo: "Dejanos tu mensaje..." },
    motivo: {
      etiqueta: "Seleccionar motivo",
      /*
       * Las maquetas decían "formar" y diferían entre sí en "coope" y
       * "cooperativa"; el documento de contenido cerró las dos cosas.
       */
      opciones: [
        "Necesito sus servicios",
        "Quiero sumar mi coope",
        "Quiero armar una coope",
        "Otro",
      ],
    },
    enviar: "Enviar mensaje",
    enviando: "Enviando…",
    errores: {
      nombre: "Escribí tu nombre",
      email: "Escribí un correo válido",
      mensaje: "Contanos brevemente en qué podemos ayudarte",
    },
    exito: {
      titulo: "Recibimos tu mensaje",
      texto: "Te vamos a responder a la brevedad. ¡Gracias por escribirnos!",
    },
    falla: {
      titulo: "No pudimos enviar tu mensaje",
      // Sin dirección de correo: no hay ninguna publicada en las maquetas ni
      // en el sitio actual, y no se inventa una.
      texto:
        "Probá de nuevo en un rato. Si sigue fallando, escribinos por redes.",
    },
  },
} as const;

/**
 * Sobre Facttic.
 *
 * Es la pantalla más larga del sitio y la que más mezcla texto fijo con datos
 * de la API: las autoridades, las cooperativas de la red y las organizaciones
 * salen del backend; los textos institucionales van acá.
 */
export const SOBRE_FACTTIC = {
  hero: {
    titulo: "Nuestro código\nes cooperar",
    bajada:
      "Nuestro objetivo es que las cooperativas de trabajo tecnológico y de conocimiento tengan un espacio para intercambiar información, conocimiento y construir soluciones de forma colectiva.",
  },

  quienes: {
    rotulo: "Quiénes somos",
    titulo: "El cooperativismo se multiplica",
    parrafos: [
      "Somos cooperativas de profesionales comprometidos en desarrollar soluciones tecnológicas y de conocimiento que mejoran la calidad de vida de las personas. Estamos agrupadas en la Federación Argentina de Cooperativas de Trabajo, Tecnología, Innovación y Conocimiento (FACTTIC).",
      "En nuestro modelo cooperativo no hay jefes ni empleados. Cada persona que trabaja es asociada: es parte, toma decisiones y se beneficia del trabajo colectivo.",
      "Eso no significa que hacemos todo entre todos, hay roles, responsabilidades y estructuras. La diferencia está en que ponemos a las personas en el centro. Somos quienes definimos cómo trabajamos, cómo nos organizamos y qué hacemos con lo que generamos.",
      "En FACTTIC, este modelo se multiplica: somos cooperativas que cooperan entre sí. Compartimos proyectos, recursos, conocimiento y perspectiva política sobre el rol de la tecnología y el conocimiento en la sociedad.",
    ],
    /*
     * Las dos tarjetas se apilan al desplazar, como las de servicios: lo pide
     * la anotación del archivo, que remite al mismo efecto.
     */
    tarjetas: [
      {
        pregunta: "¿Querés sumarte\na una coope?",
        descripcion:
          "Semillero es la plataforma de FACTTIC que conecta a personas interesadas en el trabajo cooperativo con cooperativas que están buscando nuevos socios y socias. Podés encontrar oportunidades en tecnología, diseño, desarrollo, marketing, gestión y administración.",
        enlace: {
          texto: "Ir a Semillero",
          href: "https://semillero.coop.ar/home",
        },
        acento: "lila" as Acento,
      },
      {
        pregunta: "¿Querés formarte\nen cooperativismo\ny tecnología?",
        descripcion:
          "El Club de Formación Cooperativa es una plataforma educativa de FACTTIC donde podés realizar cursos sobre cooperativismo y tecnología.",
        enlace: {
          texto: "Ir al club",
          href: "https://clubcooperativo.com.ar/",
        },
        acento: "celeste" as Acento,
        // En mobile la maqueta la deja lisa y oscura —acá no hay animación
        // detrás—; en desktop la pinta de celeste.
        oscuraEnMobile: true,
      },
    ],
  },

  foto: {
    // Plenario de FACTTIC, la original en alta que entregó la federación.
    src: "/marca/plenario.jpg",
    alt: "Plenario de FACTTIC: las cooperativas de la Federación reunidas",
  },

  modelo: {
    rotulo: "Modelo cooperativo",
    titulo: "Una forma distinta\nde trabajar",
    parrafos: [
      "Creemos que el trabajo tecnológico puede organizarse de otra manera. Desde nuestras cooperativas, construimos todos los días relaciones de trabajo basadas en la igualdad y la cooperación. Y soñamos con que esa lógica se expanda: a más sectores y a más proyectos.",
      "Creemos que las cooperativas son una alternativa real y efectiva para construir una economía más humana y solidaria.",
    ],
  },

  espacios: { titulo: "Somos parte\nde otros espacios\ncooperativos" },

  organizacion: {
    rotulo: "Organización",
    titulo: "¿Cómo nos organizamos?",
    parrafos: [
      "FACTTIC se organiza de forma democrática: las decisiones más importantes las toma la Asamblea, donde participan todas las cooperativas que integramos la Federación.",
      "Para llevar adelante esas decisiones, contamos con dos órganos: el Consejo de administración que representa institucionalmente a nuestra Federación y se encarga de lo legal y administrativo. La sindicatura se encarga de que el Consejo cumpla con lo que decidimos colectivamente, sus integrantes son elegidos por la Asamblea.",
    ],
    organos: {
      consejo: "Consejo de administración",
      sindicatura: "Sindicatura",
    },
  },

  red: {
    rotulo: "Nuestra red",
    titulo: "Cooperativas\nque integran\nla Federación",
  },

  cierre: {
    titulo: "¿Sos parte de\nuna cooperativa?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

/**
 * Novedades (Comunicados en el archivo de diseño).
 *
 * Los tres tipos salen de la API —comunicado, noticia y actividad— y acá van
 * sus etiquetas. La maqueta rotula una tarjeta como "NOVEDADES", que no es
 * ninguno de los tres; se usan los del backend.
 */
export const NOVEDADES = {
  hero: {
    // El corte de renglón es el del resto de los heros: dos líneas.
    titulo: "Lo que pasa\nnos importa",
    bajada:
      "Conocé nuestros posicionamientos ante la coyuntura y las novedades de Federación.",
  },
  solapas: {
    todos: "Todos",
    comunicado: "Comunicados",
    noticia: "Noticias",
    actividad: "Actividades",
  },
  verMas: "Ver más",
  vacio: {
    titulo: "Todavía no hay novedades",
    sugerencia: "Cuando publiquemos algo, vas a encontrarlo acá.",
  },
  /* El bloque que cierra el detalle. */
  relacionadas: {
    rotulo: "Recomendaciones",
    titulo: "También te puede interesar",
    cta: { texto: "Ver todo", href: "/novedades" },
  },
  cierre: {
    titulo: "¿Sos parte de\nuna cooperativa?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
  },
} as const;

/**
 * Nuestra Red: el mapa federal.
 *
 * Los datos —cooperativas, provincias, asociadxs, industrias y servicios—
 * salen de la API y del cálculo de provincia por coordenada. Acá va el texto.
 */
export const NUESTRA_RED = {
  hero: {
    titulo:
      "Somos\nuna red federal\nde cooperativas\nde tecnología,\ninnovación y\nconocimiento",
    // El board mobile lo corta en dos renglones: el mapa entra justo abajo.
    tituloMobile: "Somos\nuna red federal",
  },
  panel: {
    rotulo: "Provincia seleccionada",
    cooperativas: (n: number) =>
      `${n} ${n === 1 ? "cooperativa" : "cooperativas"}`,
    asociados: (n: number) => `${n} ${n === 1 ? "asociadx" : "asociadxs"}`,
    industrias: "Industrias especializadas",
    servicios: "Servicios especializados",
    sinDatos: "Todavía no cargamos el detalle de esta provincia.",
  },
  tarjeta: { sitio: "Ir al sitio" },
  vacio: {
    titulo: "Elegí una provincia",
    sugerencia: "Tocá el mapa para ver las cooperativas de cada provincia.",
  },
  cierre: {
    titulo: "Cada cooperativa que se suma, nos hace más fuertes.",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
  },
} as const;
