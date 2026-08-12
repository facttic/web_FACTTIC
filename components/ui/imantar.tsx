"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * La pieza se acerca al cursor cuando pasa cerca.
 *
 * Es el gesto que vuelve "vivo" a un botón: antes de llegar, el botón ya salió
 * a buscarte. El desplazamiento es corto —el botón nunca se despega de su
 * lugar— para que el clic no se vuelva un juego de puntería.
 *
 * El área sensible es el envoltorio, no el botón: por eso el gesto empieza
 * antes de que el cursor lo toque.
 */
export function Imantar({
  children,
  fuerza = 0.3,
  className,
}: {
  children: ReactNode;
  /** Qué proporción del recorrido del cursor sigue la pieza. */
  fuerza?: number;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  const seguir = (e: React.MouseEvent<HTMLDivElement>) => {
    const nodo = caja.current;
    if (!nodo) return;
    const r = nodo.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    nodo.style.setProperty("--dx", `${(x * fuerza).toFixed(1)}px`);
    nodo.style.setProperty("--dy", `${(y * fuerza).toFixed(1)}px`);
  };

  const soltar = () => {
    const nodo = caja.current;
    if (!nodo) return;
    nodo.style.setProperty("--dx", "0px");
    nodo.style.setProperty("--dy", "0px");
  };

  return (
    // El padding es el campo magnético: define desde dónde empieza a atraer.
    <div className={cn("inline-block p-6", className)} onMouseMove={seguir}>
      <div
        ref={caja}
        onMouseLeave={soltar}
        // Al soltar vuelve con rebote; mientras sigue al cursor, la transición
        // es corta para que no se sienta pesado.
        className="ease-plop inline-block transition-transform duration-500 motion-reduce:transform-none"
        style={{ transform: "translate(var(--dx, 0), var(--dy, 0))" }}
      >
        {children}
      </div>
    </div>
  );
}
