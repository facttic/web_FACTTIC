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
  descripciones: {
    organizaciones:
      "Trabajamos con organizaciones sociales, cooperativas y organismos de derechos humanos que usan la tecnología como herramienta de transformación. Desarrollamos soluciones digitales que amplían su alcance, mejoran sus procesos y fortalecen su presencia.",
    agro: "Acompañamos al sector agropecuario con sensores, análisis de datos y visión artificial. Llevamos la tecnología al campo para que las decisiones se tomen con información propia y en el momento en que hace falta.",
    financiero:
      "Desarrollamos soluciones para bancos, mutuales y fintech, donde la seguridad y la trazabilidad no son negociables. Construimos sistemas que sostienen operaciones críticas sin resignar la experiencia de quien los usa.",
  } as Record<string, string>,

  propuesta: {
    rotulo: "Propuesta de valor",
    // Sin bajada: la lleva la sección homónima de Nuestros servicios, pero en
    // la vertical el prototipo va directo del título a las tarjetas.
    titulo: "¿Por qué elegirnos?",
    /*
     * Las cuatro se pintan con el color de la vertical al pasar el mouse. El
     * prototipo solo escribe la primera; las otras tres están redactadas por
     * nosotros y hay que validarlas.
     */
    items: [
      {
        titulo: "Trabajamos\ncon compromiso",
        descripcion:
          "Compartimos una perspectiva política sobre el rol de la tecnología y el conocimiento en la sociedad. No es solo un servicio: es una convicción.",
      },
      {
        titulo: "Somos parte",
        descripcion:
          "Venimos del mismo mundo que nuestras contrapartes: cooperativas, organizaciones y economía social. Entendemos cómo se decide y cómo se sostiene un proyecto colectivo.",
      },
      {
        titulo: "Intercooperamos",
        descripcion:
          "Cuando un proyecto excede a una cooperativa, se arma equipo entre varias. La red permite tomar trabajos que ninguna podría sostener sola.",
      },
      {
        titulo: "Nos\nconocemos",
        descripcion:
          "Trabajamos juntas hace años y nos elegimos por experiencia previa, no por catálogo. Eso acorta los tiempos y evita las fricciones de armar un equipo desde cero.",
      },
    ],
  },

  stack: { titulo: "Stack tecnológico" },
  /* En la vertical la metodología es un desplegable con el título al costado,
     no los tres bloques de color de Nuestros servicios. */
  metodologia: { titulo: "Metodologías\nde trabajo" },
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
      "Somos cooperativas formadas por profesionales de tecnología y comunicación que desarrollan soluciones con impacto real. Creemos que la tecnología es más poderosa cuando se construye colectivamente, con solidaridad y responsabilidad.",
  },

  sumate: {
    rotulo: "Ventajas",
    titulo: "Sumate a FACTTIC",
    texto:
      "Una Federación es un espacio colectivo formado por cooperativas que deciden unirse para compartir saberes, crecer y potenciarse. En nuestro caso, somos cooperativas de desarrollo, comunicación y otras áreas que hace más de 10 años elegimos construir juntas. Porque creemos que el trabajo cooperativo es el camino.",
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
    /*
     * La maqueta muestra cuatro tarjetas pero solo escribe dos textos y los
     * repite: faltan los otros dos.
     */
    items: [
      "Ser una cooperativa\no precooperativa",
      "Participar en\nespacios colectivos",
      "Ser una cooperativa\no precooperativa",
      "Participar en\nespacios colectivos",
    ],
  },

  codigo: {
    titulo: "Tenemos código\nde conducta",
    texto:
      "Todas las reuniones de FACTTIC se rigen por un código de conducta que garantiza la participación segura e igualitaria de quienes las integran.",
    // La URL exacta del código quedó pedida; mientras tanto va al sitio actual.
    cta: { texto: "Ver Código", href: "https://facttic.org.ar" },
  },

  camino: {
    titulo: "Elegí tu camino al cooperativismo",
    /*
     * Al pasar el mouse cada tarjeta se vuelve gris y muestra su explicación
     * con el enlace. Los textos son los de la maqueta —Semillero y el Club de
     * Formación son plataformas propias de FACTTIC—; faltan sus URLs, que hoy
     * van a Contacto.
     */
    items: [
      {
        pregunta: "¿Querés sumarte\na una cooperativa?",
        descripcion:
          "Semillero es la plataforma de FACTTIC que conecta a personas interesadas en el trabajo cooperativo con cooperativas que están buscando nuevos socios y socias.",
        enlace: { texto: "Ir a Semillero", href: "/contacto" },
        acento: "lila" as Acento,
      },
      {
        pregunta: "¿Querés armar\ntu propia cooperativa?",
        descripcion:
          "Acompañamos a proyectos cooperativos en sus primeros pasos de la creación.",
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
        enlace: { texto: "Ir al club", href: "/contacto" },
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
       * Desktop dice "Quiero formar una coope" y mobile "…una cooperativa".
       * Va la corta, que es la que entra en la fila de desktop y la que hace
       * juego con "Quiero sumar mi coope"; queda anotado en PENDIENTES.
       */
      opciones: [
        "Necesito sus servicios",
        "Quiero sumar mi coope",
        "Quiero formar una coope",
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
      "En FACTTIC, este modelo se multiplica: somos cooperativas que cooperan entre sí, compartiendo conocimiento y perspectiva sobre el rol de la tecnología en la sociedad.",
    ],
    /*
     * Las dos tarjetas se apilan al desplazar, como las de servicios: lo pide
     * la anotación del archivo, que remite al mismo efecto.
     */
    tarjetas: [
      { pregunta: "¿Querés sumarte\na una coope?", acento: "lila" as Acento },
      {
        pregunta: "¿Querés formate\nen cooperativismo?",
        acento: "celeste" as Acento,
        vidrioEnMobile: true,
      },
    ],
  },

  foto: {
    // Plenario de FACTTIC. La imagen sale de la maqueta hasta que haya una
    // propia cargada por API.
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
    titulo: "Nuestro\ntrabajo",
    bajada:
      "Ya sea que tenés un proyecto, querés sumarte a la red o simplemente querés saber más, estamos acá.",
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
  cierre: {
    titulo: "¿Sos parte de\nuna cooperativa?",
    cta: { texto: "Sumate a FACTTIC", href: "/suma-tu-coop" },
  },
} as const;
