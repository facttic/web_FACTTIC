"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

/**
 * Haces de luz: las dos piezas con las que se dibuja la red.
 *
 * Están tomadas de Magic UI —"Border Beam" y "Animated Beam", ambas MIT— y
 * reescritas con los tokens del proyecto: los colores salen de la paleta y el
 * trazo respeta los bordes del sistema, así que no se leen como un injerto.
 *
 * La versión original de las dos mueve el haz desde JavaScript, con Motion.
 * Acá no hace falta: el recorrido del borde es una animación CSS sobre
 * `offset-distance`, y el del cable es un `<animate>` del propio SVG. Las dos
 * las compone el navegador sin pasar por el hilo principal, y ninguna suma un
 * byte al bundle.
 */

/**
 * Un punto de luz que recorre el borde de una caja.
 *
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
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      {/*
        `offset-path: rect(…)` hace que el punto siga el contorno de la caja sin
        importar su tamaño: no hay que medir nada ni rehacer el recorrido cuando
        cambia el ancho.
      */}
      <span
        className="recorre-el-borde absolute size-16 rounded-full blur-[6px] motion-reduce:hidden"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: `${duracion}s`,
        }}
      />
    </div>
  );
}

/** Punto de la red: lo que el haz une. */
export type PuntoDeRed = RefObject<HTMLElement | null>;

/**
 * Un haz que viaja de un elemento a otro, curvándose.
 *
 * Recibe los dos extremos por referencia y se redibuja cuando la caja cambia de
 * tamaño, así que sirve igual en desktop y en mobile sin medidas a mano.
 */
export function HazEntre({
  contenedor,
  desde,
  hasta,
  curvatura = 60,
  duracion = 3.5,
  retraso = 0,
  color = "var(--color-lila)",
  invertido = false,
}: {
  contenedor: PuntoDeRed;
  desde: PuntoDeRed;
  hasta: PuntoDeRed;
  /** Cuánto se arquea el trazo. En negativo, hacia abajo. */
  curvatura?: number;
  duracion?: number;
  retraso?: number;
  color?: string;
  invertido?: boolean;
}) {
  const id = useId();
  const [caja, setCaja] = useState({ ancho: 0, alto: 0 });
  const [trazo, setTrazo] = useState("");
  const guardado = useRef("");

  useEffect(() => {
    const marco = contenedor.current;
    const a = desde.current;
    const b = hasta.current;
    if (!marco || !a || !b) return;

    const medir = () => {
      const m = marco.getBoundingClientRect();
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();

      const x1 = ra.left - m.left + ra.width / 2;
      const y1 = ra.top - m.top + ra.height / 2;
      const x2 = rb.left - m.left + rb.width / 2;
      const y2 = rb.top - m.top + rb.height / 2;

      const d = `M ${x1},${y1} Q ${(x1 + x2) / 2},${(y1 + y2) / 2 - curvatura} ${x2},${y2}`;
      // Sin esta comparación, cada medición dispara un render aunque nada haya
      // cambiado: el observador se llama también al pintar.
      if (d !== guardado.current) {
        guardado.current = d;
        setTrazo(d);
        setCaja({ ancho: m.width, alto: m.height });
      }
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(marco);
    return () => observador.disconnect();
  }, [contenedor, desde, hasta, curvatura]);

  if (!trazo) return null;

  return (
    <svg
      aria-hidden
      fill="none"
      width={caja.ancho}
      height={caja.alto}
      viewBox={`0 0 ${caja.ancho} ${caja.alto}`}
      className="pointer-events-none absolute top-0 left-0"
    >
      {/* El cable apagado: siempre visible, para que la red se lea aunque no
          haya movimiento. */}
      <path
        d={trazo}
        stroke="var(--color-borde)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <path
        d={trazo}
        stroke={`url(#${id})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        className="motion-reduce:hidden"
      />
      <defs>
        {/*
          El gradiente se recorre de punta a punta con un `animate` del propio
          SVG: es una animación declarativa que el navegador compone solo, sin
          un frame loop en JavaScript.
        */}
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0" />
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
          <animate
            attributeName={invertido ? "x2" : "x1"}
            values={
              invertido
                ? `${caja.ancho};${-caja.ancho * 0.3}`
                : `${-caja.ancho * 0.3};${caja.ancho}`
            }
            dur={`${duracion}s`}
            begin={`${retraso}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName={invertido ? "x1" : "x2"}
            values={
              invertido ? `${caja.ancho * 1.3};0` : `0;${caja.ancho * 1.3}`
            }
            dur={`${duracion}s`}
            begin={`${retraso}s`}
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
}
