/**
 * Los dos idiomas del sitio.
 *
 * El español es el idioma en el que se carga el contenido y el que va sin
 * prefijo en las URLs; el inglés vive bajo `/en`. Lo que no esté traducido se
 * muestra en español, campo por campo: es preferible una ficha con una línea
 * en el otro idioma a un hueco.
 */

export const IDIOMAS = ["es", "en"] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = "es";

export function esIdioma(valor: string | undefined): valor is Idioma {
  return IDIOMAS.includes(valor as Idioma);
}

/** El otro idioma, para el selector del encabezado. */
export function otroIdioma(idioma: Idioma): Idioma {
  return idioma === "es" ? "en" : "es";
}

/**
 * La URL de una pantalla en un idioma. El español no lleva prefijo, así que
 * las direcciones que ya circulan siguen funcionando igual.
 */
export function rutaEn(idioma: Idioma, ruta: string): string {
  const limpia = ruta.replace(/^\/(en)(?=\/|$)/, "") || "/";
  if (idioma === IDIOMA_POR_DEFECTO) return limpia;
  return limpia === "/" ? "/en" : `/en${limpia}`;
}
