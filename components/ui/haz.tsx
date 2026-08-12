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
      El recorte es solo horizontal y con margen. `overflow-x: clip` es la única
      forma de contener un eje dejando el otro libre —con `hidden` el navegador
      fuerza los dos—, y los 5rem de `overflow-clip-margin` le dan al resplandor
      lugar de sobra para derramarse fuera del borde antes de cortarse. Arriba y
      abajo no se recorta nada.

      Así no hace falta ningún `overflow` global: uno en el body o en el main
      cambia el contexto contra el que se resuelven los `backdrop-filter`, y en
      Firefox eso le devuelve el rectángulo opaco a las tarjetas de vidrio.
    */
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[overflow-clip-margin:5rem] [overflow-x:clip]",
        className,
      )}
    >
      {/*
        `offset-path: rect(…)` hace que el punto siga el contorno de la caja sin
        importar su tamaño: no hay que medir nada ni rehacer el recorrido cuando
        cambia el ancho.
      */}
      <span
        className="recorre-el-borde absolute size-28 rounded-full blur-[14px] motion-reduce:hidden"
        style={{
          background: `radial-gradient(circle, ${color} 0%, color-mix(in srgb, ${color} 35%, transparent) 45%, transparent 72%)`,
          animationDuration: `${duracion}s`,
        }}
      />
    </div>
  );
}
