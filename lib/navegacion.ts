/**
 * Estructura de navegación del sitio.
 *
 * El menú principal es el de las maquetas, que difiere del mapa del sitio
 * (`Propuesta B.2.pdf`): ese quedó desactualizado y usa nombres viejos como
 * "Para empresas" y "Para cooperativas".
 *
 * Novedades no está en el menú principal: aparece solo en el pie, bajo
 * "Sobre FACTTIC", tal como en el diseño.
 *
 * Las etiquetas están en los dos idiomas y las rutas no: son las mismas, y el
 * prefijo `/en` lo pone `Enlace` al dibujar cada vínculo.
 */

import type { Idioma } from "@/lib/idioma";

export interface Enlace {
  etiqueta: string;
  href: string;
}

const MENU_ES: Enlace[] = [
  { etiqueta: "Nuestros servicios", href: "/nuestros-servicios" },
  { etiqueta: "Sumá tu coop", href: "/suma-tu-coop" },
  { etiqueta: "Proyectos", href: "/proyectos" },
  { etiqueta: "Nuestra Red", href: "/nuestra-red" },
  { etiqueta: "Sobre FACTTIC", href: "/sobre-facttic" },
  { etiqueta: "Contacto", href: "/contacto" },
];

export interface ColumnaPie {
  titulo: string;
  href: string;
  enlaces: Enlace[];
}

const COLUMNAS_PIE_ES: ColumnaPie[] = [
  {
    titulo: "Nuestros servicios",
    href: "/nuestros-servicios",
    enlaces: [
      { etiqueta: "Soluciones", href: "/nuestros-servicios#soluciones" },
      /* El anclaje sigue siendo `#verticales`: es el que circula en los
         enlaces ya compartidos, y lo que cambió es la etiqueta. */
      { etiqueta: "Sectores", href: "/nuestros-servicios#verticales" },
      { etiqueta: "Cómo trabajamos", href: "/nuestros-servicios#metodologias" },
      { etiqueta: "Por qué FACTTIC", href: "/nuestros-servicios#por-que" },
    ],
  },
  {
    titulo: "Sumá tu coop",
    href: "/suma-tu-coop",
    enlaces: [
      { etiqueta: "Qué es FACTTIC", href: "/suma-tu-coop#que-es" },
      { etiqueta: "Oportunidades", href: "/suma-tu-coop#oportunidades" },
      { etiqueta: "Compromisos y derechos", href: "/suma-tu-coop#compromisos" },
      { etiqueta: "Camino cooperativo", href: "/suma-tu-coop#camino" },
    ],
  },
  {
    titulo: "Proyectos",
    href: "/proyectos",
    enlaces: [
      { etiqueta: "Proyectos destacados", href: "/proyectos" },
      { etiqueta: "Trabajar con FACTTIC", href: "/contacto" },
    ],
  },
  {
    titulo: "Nuestra red",
    href: "/nuestra-red",
    enlaces: [{ etiqueta: "Mapa federal", href: "/nuestra-red#mapa" }],
  },
  {
    titulo: "Sobre FACTTIC",
    href: "/sobre-facttic",
    enlaces: [
      { etiqueta: "Qué es FACTTIC", href: "/sobre-facttic#que-es" },
      { etiqueta: "Modelo cooperativo", href: "/sobre-facttic#modelo" },
      { etiqueta: "Autoridades", href: "/sobre-facttic#autoridades" },
      { etiqueta: "Novedades", href: "/novedades" },
    ],
  },
];

export const REDES: Enlace[] = [
  { etiqueta: "LinkedIn", href: "https://www.linkedin.com/company/facttic" },
  { etiqueta: "Instagram", href: "https://www.instagram.com/facttic.ar" },
  { etiqueta: "YouTube", href: "https://www.youtube.com/@facttic" },
];

const MENU_EN: Enlace[] = [
  { etiqueta: "Our services", href: "/nuestros-servicios" },
  { etiqueta: "Join with your co-op", href: "/suma-tu-coop" },
  { etiqueta: "Projects", href: "/proyectos" },
  { etiqueta: "Our Network", href: "/nuestra-red" },
  { etiqueta: "About Facttic", href: "/sobre-facttic" },
  { etiqueta: "Contact", href: "/contacto" },
];

const COLUMNAS_PIE_EN: ColumnaPie[] = [
  {
    titulo: "Our services",
    href: "/nuestros-servicios",
    enlaces: [
      { etiqueta: "Solutions", href: "/nuestros-servicios#soluciones" },
      { etiqueta: "Sectors", href: "/nuestros-servicios#verticales" },
      { etiqueta: "How we work", href: "/nuestros-servicios#metodologias" },
      { etiqueta: "Why FACTTIC", href: "/nuestros-servicios#por-que" },
    ],
  },
  {
    titulo: "Join with your co-op",
    href: "/suma-tu-coop",
    enlaces: [
      { etiqueta: "What FACTTIC is", href: "/suma-tu-coop#que-es" },
      { etiqueta: "Opportunities", href: "/suma-tu-coop#oportunidades" },
      { etiqueta: "Commitments and rights", href: "/suma-tu-coop#compromisos" },
      { etiqueta: "The cooperative path", href: "/suma-tu-coop#camino" },
    ],
  },
  {
    titulo: "Projects",
    href: "/proyectos",
    enlaces: [
      { etiqueta: "Featured projects", href: "/proyectos" },
      { etiqueta: "Work with FACTTIC", href: "/contacto" },
    ],
  },
  {
    titulo: "Our network",
    href: "/nuestra-red",
    enlaces: [{ etiqueta: "Federal map", href: "/nuestra-red#mapa" }],
  },
  {
    titulo: "About Facttic",
    href: "/sobre-facttic",
    enlaces: [
      { etiqueta: "What FACTTIC is", href: "/sobre-facttic#que-es" },
      { etiqueta: "Cooperative model", href: "/sobre-facttic#modelo" },
      { etiqueta: "Authorities", href: "/sobre-facttic#autoridades" },
      { etiqueta: "News", href: "/novedades" },
    ],
  },
];

export function menu(idioma: Idioma): Enlace[] {
  return idioma === "en" ? MENU_EN : MENU_ES;
}

export function columnasPie(idioma: Idioma): ColumnaPie[] {
  return idioma === "en" ? COLUMNAS_PIE_EN : COLUMNAS_PIE_ES;
}
