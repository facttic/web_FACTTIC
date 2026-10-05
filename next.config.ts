import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
