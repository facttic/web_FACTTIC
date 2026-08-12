"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Fondo de puntos que se ilumina alrededor del cursor.
 *
 * Es el "Interactive Grid Pattern" de Magic UI (MIT) resuelto de otra forma: la
 * versión original dibuja una celda por cada punto y les cambia la clase con
 * estado de React —cientos de nodos y un render por movimiento del mouse—. Acá
 * la grilla es un solo `background-image` repetido y la luz, una máscara
 * radial que sigue al cursor por variable CSS. Un nodo, cero renders.
 */
export function GrillaViva({
  children,
  className,
  paso = 32,
  color = "var(--color-lila)",
}: {
  /** Lo que va por encima de la grilla. */
  children?: ReactNode;
  className?: string;
  /** Separación entre puntos, en píxeles. */
  paso?: number;
  color?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  const seguir = (e: React.MouseEvent<HTMLDivElement>) => {
    const nodo = caja.current;
    if (!nodo) return;
    const r = nodo.getBoundingClientRect();
    nodo.style.setProperty("--x", `${e.clientX - r.left}px`);
    nodo.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={caja}
      onMouseMove={seguir}
      className={cn("group/grilla relative isolate overflow-hidden", className)}
    >
      {/* La grilla apagada, siempre presente. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-borde) 1px, transparent 0)`,
          backgroundSize: `${paso}px ${paso}px`,
        }}
      />
      {/* La misma grilla encendida, recortada a un círculo alrededor del mouse. */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/grilla:opacity-100 motion-reduce:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
          backgroundSize: `${paso}px ${paso}px`,
          maskImage: `radial-gradient(160px circle at var(--x, -100px) var(--y, -100px), black 20%, transparent 75%)`,
        }}
      />
      {children ? <div className="relative">{children}</div> : null}
    </div>
  );
}
