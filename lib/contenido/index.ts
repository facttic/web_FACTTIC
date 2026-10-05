import type { Idioma } from "@/lib/idioma";
import * as es from "./es";
import * as en from "./en";

/**
 * El copy fijo del sitio, en los dos idiomas.
 *
 * Lo que sale de la API se traduce en `lib/dominio/adaptadores.ts`; esto es lo
 * otro: los títulos, las bajadas y los textos que no se cargan desde ningún
 * lado. Cada diccionario tiene exactamente la misma forma —`en.ts` se declara
 * contra el tipo de `es.ts`—, así que si falta una clave no compila.
 */

export type Contenido = typeof es;

const DICCIONARIOS: Record<Idioma, Contenido> = { es, en };

export function contenido(idioma: Idioma): Contenido {
  return DICCIONARIOS[idioma];
}
