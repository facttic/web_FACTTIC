import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Lo que se ve cuando una búsqueda o un filtro no devuelve nada, en la grilla de
 * Proyectos.
 *
 * Usa el borde punteado de la banda de cierre: en el diseño ese trazo marca los
 * bloques que esperan una acción, que es justo lo que pasa acá —hay que aflojar
 * los filtros—. Va en el hueco que dejó la grilla, así que ocupa el ancho y se
 * centra.
 */
export function SinResultados({
  titulo = "No encontramos proyectos con esos filtros",
  children,
  accion,
  className,
}: {
  titulo?: string;
  /** Sugerencia de qué hacer; si no viene, se explica sola con el título. */
  children?: ReactNode;
  accion?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-xl border border-dashed border-borde-pleno px-6 py-16 text-center",
        className,
      )}
    >
      <div>
        <p className="text-h3 text-balance">{titulo}</p>
        {children ? (
          <p className="text-p1 mt-3 text-balance text-blanco/60">{children}</p>
        ) : null}
      </div>
      {accion}
    </div>
  );
}
