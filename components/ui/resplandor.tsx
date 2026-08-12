"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Resplandor que sigue al cursor dentro de una tarjeta.
 *
 * Es el "Magic Card" de Magic UI (MIT) reescrito: la versión original mantiene
 * la posición en estado de React y redibuja el componente en cada movimiento
 * del mouse. Acá la posición viaja por dos variables CSS que se escriben
 * directo sobre el nodo, así que el navegador repinta solo el degradado y
 * React no se entera. Cada tarjeta trae su color, que es el de su vertical.
 *
 * A diferencia del revelado al scroll, este efecto no depende de que la persona
 * pase por un punto exacto: responde apenas mueve el mouse.
 */
export function Resplandor({
  children,
  color = "var(--color-lila)",
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
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
      className={cn("group/luz relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/luz:opacity-100 motion-reduce:hidden"
        style={{
          background: `radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, ${color} 22%, transparent), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
