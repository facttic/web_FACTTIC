"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * La pieza se inclina hacia donde está el cursor.
 *
 * Da volumen sin 3D de verdad: son dos rotaciones en perspectiva, o sea
 * `transform`, que corre en el compositor. La inclinación es corta —seis grados
 * como mucho— porque de ahí para arriba el texto se deforma y se vuelve difícil
 * de leer.
 *
 * Los ángulos viajan por variables CSS escritas directo sobre el nodo, así que
 * mover el mouse no dispara ningún render de React.
 */
export function Inclinar({
  children,
  grados = 6,
  className,
}: {
  children: ReactNode;
  /** Inclinación máxima en los bordes. */
  grados?: number;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  const seguir = (e: React.MouseEvent<HTMLDivElement>) => {
    const nodo = caja.current;
    if (!nodo) return;
    const r = nodo.getBoundingClientRect();
    // De -1 a 1 desde el centro de la pieza.
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    nodo.style.setProperty("--rx", `${(-y * grados * 2).toFixed(2)}deg`);
    nodo.style.setProperty("--ry", `${(x * grados * 2).toFixed(2)}deg`);
  };

  const soltar = () => {
    const nodo = caja.current;
    if (!nodo) return;
    nodo.style.setProperty("--rx", "0deg");
    nodo.style.setProperty("--ry", "0deg");
  };

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <div
        ref={caja}
        onMouseMove={seguir}
        onMouseLeave={soltar}
        className="transition-transform duration-300 ease-out motion-reduce:transform-none"
        style={{
          transform:
            "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
