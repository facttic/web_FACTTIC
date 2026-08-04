import type { Acento } from "@/components/ui/acento";

/**
 * Animaciones entregadas por diseño (carpeta de Drive "Entrega 5").
 *
 * Los sectores vienen de la API con su nombre, así que la animación se resuelve
 * por nombre igual que el color del chip. Cuando el backend cargue el campo
 * `lottieFileName` —que el modelo de Sector ya tiene— esto pasa a salir de ahí y
 * este mapa se puede borrar.
 */

/**
 * Color de cada servicio, tomado del board de Componentes: cada uno tiene el
 * suyo y no depende de la posición en la lista. Los que no estén acá caen al
 * ciclo general de acentos.
 */
const ACENTO_POR_SERVICIO: Record<string, Acento> = {
  desarrollo: "azul",
  "desarrollo de software": "azul",
  "diseño y comunicación": "celeste",
  "diseño y comunicación digital": "celeste",
  "datos e inteligencia artificial": "naranja",
  "ia y datos": "naranja",
  "capacitación y consultoría": "lila",
  infraestructura: "verde",
  "ingeniería e infraestructura": "verde",
};

export function acentoDeServicio(nombre: string): Acento | null {
  return ACENTO_POR_SERVICIO[nombre.trim().toLowerCase()] ?? null;
}

/**
 * Nombre corto para las solapas.
 *
 * El diseño usa uno abreviado en las solapas ("Diseño", "Ingeniería e infra") y
 * el completo en la tarjeta. La API solo guarda el completo, así que la
 * abreviatura vive acá hasta que el backend sume el campo —está pedido como
 * ítem 23 de PENDIENTES—. Sin coincidencia se usa el nombre tal cual.
 */
const NOMBRE_CORTO_SERVICIO: Record<string, string> = {
  desarrollo: "Desarrollo",
  "desarrollo de software": "Desarrollo",
  "diseño y comunicación": "Diseño",
  "diseño y comunicación digital": "Diseño",
  "datos e inteligencia artificial": "IA y Datos",
  "ia y datos": "IA y Datos",
  "capacitación y consultoría": "Capacitación",
  infraestructura: "Ingeniería e infra",
  "ingeniería e infraestructura": "Ingeniería e infra",
};

export function nombreCortoDeServicio(nombre: string): string {
  const limpio = nombre.trim();
  return NOMBRE_CORTO_SERVICIO[limpio.toLowerCase()] ?? limpio;
}

/**
 * Color de cada vertical. Lo fija una anotación del archivo: "el color para
 * organizaciones el amarillo (E5F280), el naranja para Finanzas (FF522A) y
 * Celeste (57C3C8)" —este último, el que queda, es el de Agro—.
 *
 * Tiñe las tarjetas de propuesta de valor de su pantalla.
 */
const ACENTO_POR_SECTOR: Record<string, Acento> = {
  organizaciones: "amarillo",
  finanzas: "naranja",
  financiero: "naranja",
  agro: "celeste",
};

export function acentoDeSector(nombre: string): Acento {
  return ACENTO_POR_SECTOR[nombre.trim().toLowerCase()] ?? "lila";
}

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
