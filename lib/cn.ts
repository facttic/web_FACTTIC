import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Los estilos tipográficos del design system se llaman `text-h1`, `text-p1`,
 * etc. Sin declararlos, tailwind-merge los confunde con clases de color: cree
 * que compiten con `text-blanco` y descarta el que va primero. Así el botón
 * sólido quedaba con texto blanco sobre fondo blanco, y el menú perdía su
 * tipografía.
 *
 * Cada estilo nuevo del sistema tiene que sumarse a esta lista.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "p1",
            "p1-bold",
            "p2",
            "p2-bold",
            "p3",
            "p3-bold",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

/** Une clases resolviendo los conflictos de Tailwind (la última gana). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
