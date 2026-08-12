"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

/**
 * La misma grilla, pero de fondo de una pantalla entera.
 *
 * Va fija al viewport y no estirada por toda la página: así el área que hay
 * que pintar es la de la ventana y no los cuatro mil píxeles que mide la Home,
 * y la luz sigue al cursor sin tener que corregir por el scroll. Escucha el
 * mouse en `window` porque el elemento no recibe eventos —está detrás de
 * todo—, y lo hace de forma pasiva y escribiendo dos variables CSS: no hay
 * render de React por movimiento.
 */
export function GrillaDeFondo({
  paso = 32,
  color = "var(--color-lila)",
  className,
}: {
  paso?: number;
  color?: string;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pedido = 0;
    let x = 0;
    let y = 0;

    const pintar = () => {
      pedido = 0;
      nodo.style.setProperty("--x", `${x}px`);
      nodo.style.setProperty("--y", `${y}px`);
    };

    const seguir = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      // Una escritura por cuadro: sin esto, un mouse rápido dispara cientos.
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };

    window.addEventListener("mousemove", seguir, { passive: true });
    return () => {
      window.removeEventListener("mousemove", seguir);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return (
    <div
      ref={caja}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 hidden md:block",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-borde) 1px, transparent 0)`,
          backgroundSize: `${paso}px ${paso}px`,
        }}
      />
      <div
        className="absolute inset-0 motion-reduce:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
          backgroundSize: `${paso}px ${paso}px`,
          maskImage: `radial-gradient(220px circle at var(--x, -300px) var(--y, -300px), black 15%, transparent 72%)`,
        }}
      />
    </div>
  );
}
