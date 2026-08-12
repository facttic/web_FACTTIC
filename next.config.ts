import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /*
     * Transiciones entre páginas: la portada de un proyecto se transforma en la
     * de su detalle en vez de cortar. La regla `@view-transition` vive en
     * `globals.css` y los nombres compartidos, en las tarjetas.
     */
    viewTransition: true,
  },
};

export default nextConfig;
