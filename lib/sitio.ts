/**
 * El dominio donde vive el sitio de verdad.
 *
 * Está escrito acá y no en una variable de entorno a propósito: es el que
 * decide qué dirección es la buena, y de eso depende que el día de la mudanza
 * al dominio real no haya nada que acordarse de cambiar. Lo usan la canónica,
 * `hreflang`, el sitemap, las tarjetas al compartir, `robots.txt` y la regla
 * que deja fuera del índice a todo lo que no sea este dominio.
 *
 * Vive en un archivo propio, sin un solo import, porque lo lee también
 * `next.config.ts`: esa config la carga Node antes de que exista el alias `@/`,
 * así que cualquier cosa que arrastre `lib/seo.ts` —que importa `lib/idioma`—
 * reventaría al arrancar.
 */
export const DOMINIO = "facttic.org.ar";
