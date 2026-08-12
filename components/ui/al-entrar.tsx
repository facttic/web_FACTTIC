import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Revelado al entrar en pantalla, sin una línea de JavaScript.
 *
 * Envuelve un bloque y le aplica la utilidad `revelar-al-entrar`, que ata la
 * animación al recorrido del elemento por la pantalla con `animation-timeline:
 * view()`. Como es CSS puro, corre en el compositor y no manda nada al bundle:
 * a diferencia de `RevelarAlScroll`, que hace lo mismo con un
 * `IntersectionObserver`, este componente se renderiza en el servidor.
 *
 * `indice` escalona a los hermanos de una grilla: la segunda tarjeta entra 90ms
 * después de la primera. Cuando `sibling-index()` llegue a todos los
 * navegadores esto se calcula solo y la prop se puede borrar.
 *
 * Dónde usar cuál: este para bloques que ya están en el HTML servido —tarjetas,
 * encabezados, grillas—, y `RevelarAlScroll` para lo que necesite saber en
 * JavaScript que entró en pantalla, como el hero.
 */
export function AlEntrar({
  children,
  indice = 0,
  className,
}: {
  children: ReactNode;
  indice?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("revelar-al-entrar", className)}
      style={{ "--i": indice } as CSSProperties}
    >
      {children}
    </div>
  );
}
