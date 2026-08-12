"use client";

import { cn } from "@/lib/cn";

/**
 * Un punto de luz recorriendo el borde de una caja.
 *
 * Está tomado del "Border Beam" de Magic UI (MIT) y reescrito con los tokens
 * del proyecto. La versión original mueve el haz desde JavaScript, con Motion;
 * acá el recorrido es una animación CSS sobre `offset-distance`, que el
 * navegador compone sin pasar por el hilo principal y no suma un byte al
 * bundle.
 */

/**
 * Va sobre las bandas de conversión: el borde punteado ya es del sistema y esto
 * lo recorre sin cambiarlo. El elemento que lo contenga tiene que ser
 * `relative` y llevar su propio radio.
 */
export function HazDeBorde({
  duracion = 9,
  color = "var(--color-lila)",
  className,
}: {
  /** Segundos que tarda en dar una vuelta completa. */
  duracion?: number;
  color?: string;
  className?: string;
}) {
  return (
    /*
      Dos marcos, y los dos hacen falta. El de afuera es 40px más grande que el
      panel y recorta ahí: así el resplandor se derrama hacia afuera del borde
      —que es la mitad del efecto— sin agrandar la página ni obligar a poner un
      `overflow` global, que en Firefox le rompe el `backdrop-filter` a las
      tarjetas de vidrio. El de adentro vuelve al tamaño exacto del panel, que
      es el contorno que el punto tiene que recorrer.
    */
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -inset-6 overflow-hidden rounded-[1.5rem]",
        className,
      )}
    >
      <div className="absolute inset-6 rounded-xl">
        {/*
          `offset-path: rect(…)` hace que el punto siga el contorno de la caja
          sin importar su tamaño: no hay que medir nada ni rehacer el recorrido
          cuando cambia el ancho.
        */}
        <span
          className="recorre-el-borde absolute size-28 rounded-full blur-[14px] motion-reduce:hidden"
          style={{
            background: `radial-gradient(circle, ${color} 0%, color-mix(in srgb, ${color} 35%, transparent) 45%, transparent 72%)`,
            animationDuration: `${duracion}s`,
          }}
        />
      </div>
    </div>
  );
}
