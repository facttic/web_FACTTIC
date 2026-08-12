import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Lista que en pantallas chicas se desplaza de costado y en grandes pasa a
 * grilla. Es el patrón de la Home para proyectos, beneficios y métricas, y se
 * repite en Proyectos y Nuestra Red.
 *
 * Dos detalles que no son evidentes y conviene no perder:
 *
 *  - Los márgenes negativos dejan que las tarjetas lleguen hasta el borde de la
 *    pantalla al desplazarse, en vez de cortarse en el margen del contenedor.
 *  - `scroll-pl` es lo que le devuelve el margen a la primera: sin eso, el
 *    `snap` alinea la tarjeta con el borde del área de scroll y se come el
 *    padding, dejándola pegada al canto.
 *  - En grilla suelta el `overflow`. Un `overflow-x: auto` obliga al eje
 *    vertical a recortar también —no se puede tener un eje visible y el otro
 *    no—, y eso le comía el borde de arriba a las tarjetas cuando se inclinan
 *    hacia el cursor. En mobile hace falta para el desplazamiento lateral; en
 *    desktop no, porque ahí ya no hay scroll.
 */
export function Carrusel({
  children,
  grilla,
  gap = "gap-6",
  desdeAncho = "md",
  className,
}: {
  children: ReactNode;
  /** Clases de grilla para desktop, por ejemplo `grid-cols-3`. */
  grilla: string;
  gap?: string;
  /** A partir de qué ancho deja de desplazarse y pasa a grilla. */
  desdeAncho?: "sm" | "md";
  className?: string;
}) {
  const enGrilla =
    desdeAncho === "sm"
      ? "sm:mx-0 sm:grid sm:overflow-visible sm:px-0"
      : "md:mx-0 md:grid md:overflow-visible md:px-0";

  return (
    <div
      className={cn(
        "scroll-limpio -mx-6 flex snap-x snap-mandatory scroll-pl-6 overflow-x-auto px-6",
        gap,
        enGrilla,
        grilla,
        className,
      )}
    >
      {children}
    </div>
  );
}
