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
