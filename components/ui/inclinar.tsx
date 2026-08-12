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
    /*
     * La perspectiva vive en el envoltorio y el giro en el hijo. Ninguno de los
     * dos fuerza una capa de GPU en reposo —nada de `translateZ(0)` ni de
     * `will-change` permanente—: con nueve tarjetas en la Home, promoverlas
     * todas desde el arranque multiplicaba los cuadros largos por diez. El
     * navegador crea la capa cuando el giro empieza y la suelta al terminar.
     */
    <div className={cn("[perspective:1000px]", className)}>
      <div
        ref={caja}
        onMouseMove={seguir}
        onMouseLeave={soltar}
        className="transition-transform duration-300 ease-out motion-reduce:transform-none"
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
