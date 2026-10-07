import type { NextConfig } from "next";

const enDesarrollo = process.env.NODE_ENV === "development";

/**
 * Las cabeceras de seguridad. No había ninguna: Vercel pone el HSTS y nada más.
 *
 * La política de contenido se puede apretar porque el sitio **no carga nada de
 * afuera**: ni scripts, ni hojas de estilo, ni tipografías —`next/font` las
 * sirve desde acá—, ni imágenes. Lo único externo son enlaces, que no son
 * recursos. Verificado sobre el HTML que publica producción.
 *
 * Quedan dos `unsafe-inline` y no es por descuido:
 *
 *  - **script**: Next arranca la hidratación con scripts en línea. Sacarlo pide
 *    un nonce por pedido, que obliga a renderizar todo dinámicamente y tira
 *    abajo el cacheado estático. No vale la pena mientras no haya HTML de
 *    terceros en la página: React escapa todo lo que dibuja.
 *  - **style**: medio sitio posiciona con `style=`, que es la forma de pasarle
 *    un número calculado al CSS.
 *
 * `unsafe-eval` va solo en desarrollo, que es donde lo necesita el recargado en
 * caliente.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${enDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  /* `data:` para la trama de puntos del fondo y `blob:` para lo que dibuja
     Lottie; las fotos salen del proxy propio, que es `self`.

     OpenStreetMap es la excepción y es del backoffice: el mapa con el que cada
     cooperativa marca dónde está trae sus tiles de ahí. Sin esto el mapa queda
     negro, con el punto y la atribución flotando sobre nada, que es lo que
     pasó al cerrar la política. Leaflet sí viene del paquete, así que no hace
     falta abrir ni script ni estilo. */
  "img-src 'self' data: blob: https://tile.openstreetmap.org",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  /* Nadie puede meter el sitio en un marco: es lo que corta el clickjacking. */
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  /* Sin esto, una inyección podría cambiar la base de todas las rutas
     relativas, o mandar el formulario de contacto a otro servidor. */
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const CABECERAS = [
  { key: "Content-Security-Policy", value: CSP },
  /* El navegador no adivina el tipo de un archivo: si la API manda un .png que
     en realidad es HTML, no lo ejecuta. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Lo mismo que `frame-ancestors`, para los navegadores viejos. */
  { key: "X-Frame-Options", value: "DENY" },
  /* A otro dominio se le cuenta de dónde viene la visita, no qué estaba
     mirando: una URL de proyecto o un filtro no tienen por qué viajar. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* El sitio no usa ninguna de las tres; se apagan para que tampoco las use
     nada que llegue a colarse. */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:ruta*", headers: CABECERAS }];
  },

  experimental: {
    serverActions: {
      /*
       * Las Server Actions aceptan 1MB de cuerpo por defecto, y por ahí viajan
       * las imágenes del backoffice: una foto de teléfono pasa ese tope sola,
       * así que la carga fallaba con "A server error occurred" sin llegar a
       * nuestro código —el cuerpo se rechaza antes— y, como depende del peso de
       * cada foto, fallaba a veces sí y a veces no.
       *
       * El tope incluye lo que agrega el multipart: separadores y encabezados
       * de cada parte, unos 10-20KB. 20MB deja subir varias fotos juntas y
       * queda lejos del límite de la plataforma.
       */
      bodySizeLimit: "20mb",
    },
    /*
     * Transiciones entre páginas: la portada de un proyecto se transforma en la
     * de su detalle en vez de cortar. La regla `@view-transition` vive en
     * `globals.css` y los nombres compartidos, en las tarjetas.
     */
    viewTransition: true,
  },
};

export default nextConfig;
