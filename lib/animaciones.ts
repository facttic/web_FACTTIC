/**
 * Animaciones entregadas por diseño (carpeta de Drive "Entrega 5").
 *
 * Los sectores vienen de la API con su nombre, así que la animación se resuelve
 * por nombre igual que el color del chip. Cuando el backend cargue el campo
 * `lottieFileName` —que el modelo de Sector ya tiene— esto pasa a salir de ahí y
 * este mapa se puede borrar.
 */

/** Animación de cada sector, por nombre. */
const POR_SECTOR: Record<string, string> = {
  finanzas: "sector-financiero",
  financiero: "sector-financiero",
  organizaciones: "sector-organizaciones",
  agro: "sector-agro",
};

export function animacionDeSector(nombre: string): string | null {
  return POR_SECTOR[nombre.trim().toLowerCase()] ?? null;
}

/**
 * Fondos decorativos por página. Falta el de Sumá tu coop, Proyectos y
 * Nuestra Red: la entrega trajo cinco.
 */
export const FONDOS = {
  homeLema: "fondo-home-lema",
  servicios: "fondo-servicios",
  sobreFacttic: "fondo-sobre-facttic",
  contacto: "fondo-contacto",
  error404: "fondo-error404",
} as const;

/**
 * Videos del hero. Se sirven dos cortes distintos, no el mismo escalado: el de
 * mobile es vertical (800x1200) y el de desktop apaisado (1600x700).
 */
export const VIDEO_HERO = {
  desktop: "/video/hero-desktop.mp4",
  mobile: "/video/hero-mobile.mp4",
  poster: "/video/hero-poster.jpg",
} as const;
