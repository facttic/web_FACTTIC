import 'server-only'

import { unstable_cache } from 'next/cache'

/**
 * Envoltorio de cacheo para las lecturas de la API.
 *
 * Se cachea acá y no en el `fetch` porque la cache key de Next incluye los
 * headers, y el `Authorization` cambia cada vez que se renueva el token: cachear
 * abajo haría que cada renovación tirara todo el contenido. Con `unstable_cache`
 * la clave es explícita y depende solo del recurso y sus parámetros.
 */

/** Cuánto vive cada cosa. Los catálogos cambian poco; el contenido, seguido. */
export const TTL = {
  /** Sectores, servicios, tecnologías: se tocan de vez en cuando. */
  catalogo: 3600,
  /** Proyectos, novedades y cooperativas: contenido editorial. */
  contenido: 300,
} as const

export function cached<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  keyParts: string[],
  options: { revalidate: number; tags: string[] }
) {
  return unstable_cache(fn, keyParts, {
    revalidate: options.revalidate,
    tags: options.tags,
  })
}
