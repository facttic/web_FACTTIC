import type { Metadata } from "next";
import { rutaEn, type Idioma } from "@/lib/idioma";

/**
 * Lo que cada pantalla le dice a los buscadores.
 *
 * Está en un solo lugar porque son tres cosas que hay que acertar juntas y que
 * se rompen en silencio: la dirección canónica, las alternas por idioma y las
 * etiquetas para compartir. Nadie las ve en el sitio, así que un error queda
 * dando vueltas meses.
 *
 * El problema que resuelve: la canónica vivía en el layout, con un valor fijo
 * —`/` o `/en`—, y como el layout se mezcla con la metadata de cada página, las
 * ciento treinta páginas que no la declaraban heredaban la de la Home. Para
 * Google eso dice "todas son copias de la portada", que es la peor señal
 * posible. Lo mismo con `languages`: la alterna en inglés de `/proyectos`
 * apuntaba a la Home en inglés.
 *
 * Por eso la canónica se arma **de la ruta de la pantalla** y no de una
 * constante, y por eso el layout ya no declara ninguna: lo que no se nombra
 * acá, no sale.
 */

/** Lo que Google muestra antes de cortar. Pasarse no suma, resta. */
const TOPE_DESCRIPCION = 160;

/** Lo que se ve en la pestaña y en la tarjeta al compartir. */
const SITIO = "FACTTIC";

/**
 * La dirección pública del sitio, absoluta.
 *
 * El `metadataBase` del layout resuelve las rutas relativas de la metadata,
 * pero `robots.txt` y `sitemap.xml` necesitan la URL entera escrita. Sale de la
 * misma variable, con la de Vercel como reserva.
 */
export function sitioUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITIO_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return url.replace(/\/$/, "");
}

/**
 * Deja la descripción en algo que entre entero en el resultado de búsqueda.
 *
 * Corta en la última palabra y no a la mitad, y se come la puntuación que
 * quedaría colgando antes de los puntos suspensivos.
 */
export function recortar(texto: string, tope = TOPE_DESCRIPCION): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= tope) return limpio;

  const corte = limpio.slice(0, tope - 1);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const base =
    ultimoEspacio > tope * 0.6 ? corte.slice(0, ultimoEspacio) : corte;
  return `${base.replace(/[\s.,;:·—-]+$/, "")}…`;
}

export interface DatosSeo {
  idioma: Idioma;
  /**
   * La ruta **en español y sin prefijo**, como se escriben los enlaces en todo
   * el proyecto: `/`, `/proyectos`, `/proyectos/mi-slug`. De acá salen la
   * canónica y las dos alternas, cada una con el nombre que la sección tiene en
   * su idioma.
   */
  ruta: string;
  /** Sin el sufijo del sitio: se lo agrega la plantilla del layout. */
  titulo: string;
  descripcion: string;
  /** La portada de un proyecto o una novedad. Sin esto va la imagen de la casa. */
  imagen?: string | null;
  /** `article` en los detalles, que es lo que esperan las redes. */
  tipo?: "website" | "article";
  /** Las pantallas internas —el catálogo de componentes, el laboratorio—. */
  sinIndexar?: boolean;
}

export function metadatosDe({
  idioma,
  ruta,
  titulo,
  descripcion,
  imagen,
  tipo = "website",
  sinIndexar = false,
}: DatosSeo): Metadata {
  const propia = rutaEn(idioma, ruta);
  const enEspanol = rutaEn("es", ruta);
  const enIngles = rutaEn("en", ruta);
  const bajada = recortar(descripcion);
  /*
   * Varios títulos salen del `hero.titulo` de la pantalla, que lleva los cortes
   * de línea del diseño. En el `<title>` eso entraba como salto literal: la
   * pestaña de Proyectos decía "Nuestro⏎trabajo intercoop".
   */
  const limpio = titulo.replace(/\s+/g, " ").trim();

  return {
    title: limpio,
    description: bajada,
    alternates: {
      canonical: propia,
      languages: {
        es: enEspanol,
        en: enIngles,
        /* A quien llega sin idioma declarado se le da el español, que es el
           idioma del sitio y la dirección sin prefijo. */
        "x-default": enEspanol,
      },
    },
    openGraph: {
      type: tipo,
      url: propia,
      siteName: SITIO,
      locale: idioma === "en" ? "en_US" : "es_AR",
      alternateLocale: idioma === "en" ? "es_AR" : "en_US",
      title: `${limpio} · ${SITIO}`,
      description: bajada,
      ...(imagen ? { images: [{ url: imagen }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${limpio} · ${SITIO}`,
      description: bajada,
      ...(imagen ? { images: [imagen] } : {}),
    },
    ...(sinIndexar ? { robots: { index: false, follow: false } } : {}),
  };
}
