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
 * y la luz sigue al cursor sin tener que corregir por el scroll.
 *
 * El halo no es una máscara del tamaño de la pantalla, sino una caja de 440px
 * con la suya, que se mueve con `transform` —o sea en el compositor—. Las dos
 * decisiones son por Firefox: la máscara a pantalla completa y el
 * `background-attachment: fixed` que tenía antes lo obligaban a rasterizar de
 * nuevo en cada scroll, y medía trece cuadros largos contra tres.
 *
 * Escucha el mouse en `window` porque el elemento no recibe eventos —está
 * detrás de todo—, de forma pasiva y escribiendo dos variables CSS una vez por
 * cuadro: no hay render de React por movimiento.
 */
export function GrillaDeFondo({
  paso = 32,
  // Blanco al 40%, el mismo tono de los punteados del sistema: la grilla
  // apagada va al 10%, así que el halo se lee como los mismos puntos
  // encendidos y no como una capa de color encima.
  color = "var(--color-punteado)",
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

  const puntos = (tono: string) =>
    `radial-gradient(circle at 1px 1px, ${tono} 1px, transparent 0)`;

  return (
    <div
      ref={caja}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: puntos("var(--color-borde)"),
          backgroundSize: `${paso}px ${paso}px`,
        }}
      />
      <div
        className="absolute top-0 left-0 size-[440px] will-change-transform motion-reduce:hidden"
        style={{
          backgroundImage: puntos(color),
          backgroundSize: `${paso}px ${paso}px`,
          /*
            El patrón se ancla a la ventana corriendo su origen en sentido
            contrario al de la caja, para que sus puntos caigan justo sobre los
            de la capa apagada. Con `background-attachment: fixed` se lograba lo
            mismo, pero Firefox repintaba las dos capas juntas en cada scroll:
            trece cuadros largos contra tres.
          */
          backgroundPosition:
            "calc(220px - var(--x, 0px)) calc(220px - var(--y, 0px))",
          maskImage:
            "radial-gradient(circle at center, black 12%, transparent 68%)",
          transform:
            "translate3d(var(--x, -600px), var(--y, -600px), 0) translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
