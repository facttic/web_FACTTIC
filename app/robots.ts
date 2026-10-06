import type { MetadataRoute } from "next";
import { sitioUrl } from "@/lib/seo";

/**
 * `robots.txt`.
 *
 * No existía, y como el proxy no toma las rutas con extensión, `/robots.txt`
 * caía en `app/[idioma]` con el idioma valiendo "robots.txt": el contenido
 * reventaba y la respuesta era un 500. Lo mismo pasaba con `/sitemap.xml`.
 *
 * Lo que queda fuera del índice es lo que no es el sitio: el panel, las rutas
 * internas de la API y las dos pantallas de trabajo —el catálogo de componentes
 * y el laboratorio—, que además ya van con `noindex` en su metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/", "/componentes", "/laboratorio"],
    },
    sitemap: `${sitioUrl()}/sitemap.xml`,
    host: sitioUrl(),
  };
}
