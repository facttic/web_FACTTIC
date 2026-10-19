import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { sitioUrl } from "@/lib/seo";
import { DOMINIO } from "@/lib/sitio";

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
 *
 * **Y fuera del índice todo el sitio cuando no se pide por el dominio real.**
 * Mientras el sitio nuevo vive en staging está abierto a cualquiera, y lo que
 * los buscadores y las IA aprendan de FACTTIC hasta la mudanza quedaría anotado
 * bajo `dev.facttic.org.ar`: el día que se encienda el dominio real habría dos
 * copias compitiendo, con la señal acumulada en la que se apaga.
 *
 * Lee el `host` del pedido en vez de una variable de entorno, así que se apaga
 * solo: agregar el dominio en Vercel alcanza para que el mismo deploy empiece a
 * invitar a los rastreadores. El día de la mudanza no hay nada que tocar.
 *
 * Quien hace el trabajo es el `X-Robots-Tag` de `next.config.ts`, no esto.
 *
 * **En staging el rastreo se deja abierto a propósito**, aunque lo intuitivo
 * sea poner `Disallow: /`. Las dos cosas se pelean: `Disallow` dice "no entres"
 * y `noindex` dice "no lo publiques", y para leer lo segundo hay que haber
 * entrado. Un sitio bloqueado por `robots.txt` cuyas direcciones alguien
 * enlazó desde afuera termina en el índice igual, como entrada sin texto, y
 * como nadie puede volver a entrar a leer el `noindex`, **no sale más**.
 * Dejándolos pasar, leen la cabecera y lo sacan —o no lo meten nunca—.
 *
 * Lo único que no se le ofrece a staging es el sitemap: invitar a recorrer
 * entero algo que no queremos publicado no tiene sentido.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  /* El puerto no cuenta: en local el host viene con él. */
  const sinPuerto = host.split(":")[0].replace(/^www\./, "");

  const reglas = {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/admin/", "/api/", "/componentes", "/laboratorio"],
  };

  if (sinPuerto !== DOMINIO) return { rules: reglas };

  return { rules: reglas, sitemap: `${sitioUrl()}/sitemap.xml`, host: sitioUrl() };
}
