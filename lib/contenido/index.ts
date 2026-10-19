import type { Acento } from "@/components/ui/acento";
import { IDIOMA_POR_DEFECTO, type Idioma } from "@/lib/idioma";
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

/**
 * El diccionario de un idioma.
 *
 * Cae al español ante una clave que no es un idioma, y eso no es defensivo de
 * más: el proxy deja pasar sin reescribir todo lo que termina en extensión
 * —para no tocar archivos—, así que `/ads.txt` llega a `app/[idioma]` con el
 * idioma valiendo "ads.txt". El layout eso ya lo manda a un 404, pero la
 * pantalla corre igual antes de que el 404 gane y reventaba acá, y entonces la
 * respuesta era un 500.
 *
 * La diferencia importa para los rastreadores: un 404 les dice "no está" y un
 * 500 les dice "el servidor está roto, bajá el ritmo". Piden `/ads.txt`,
 * `/favicon.ico` y `/apple-touch-icon.png` sin preguntar, así que era un 500
 * garantizado en cada visita de un buscador.
 */
export function contenido(idioma: Idioma): Contenido {
  return DICCIONARIOS[idioma] ?? DICCIONARIOS[IDIOMA_POR_DEFECTO];
}
