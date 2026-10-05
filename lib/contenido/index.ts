import type { Acento } from "@/components/ui/acento";
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

/**
 * El diccionario español está escrito con `as const`, así que sus tipos son
 * los textos exactos. Para que el inglés —que dice otra cosa— encaje en la
 * misma forma, se ensanchan los literales a `string`: lo que se compara es la
 * estructura, que es justo lo que no puede faltar.
 *
 * Los acentos quedan afuera del ensanchado: ahí el tipo no es decorativo, es
 * lo que elige el color con el que se pinta cada tarjeta.
 */
type Ensanchar<T> = T extends Acento
  ? Acento
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends (...args: infer A) => infer R
          ? (...args: A) => R
          : T extends readonly (infer U)[]
            ? readonly Ensanchar<U>[]
            : { readonly [K in keyof T]: Ensanchar<T[K]> };

export type Contenido = Ensanchar<typeof es>;

const DICCIONARIOS: Record<Idioma, Contenido> = { es, en };

export function contenido(idioma: Idioma): Contenido {
  return DICCIONARIOS[idioma];
}
