"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "./boton";

/**
 * Solapas con subrayado, como en "Solucionamos con tecnología e innovación" y en
 * el filtro de Novedades (Todos / Comunicados / Noticias / Actividades).
 *
 * La lista se puede desplazar en mobile: en el diseño las cinco solapas de
 * servicios no entran en 393px.
 */

export interface Solapa {
  id: string;
  etiqueta: string;
  contenido: ReactNode;
}

export function Tabs({
  solapas,
  className,
}: {
  solapas: Solapa[];
  className?: string;
}) {
  const [activa, setActiva] = useState(solapas[0]?.id);
  const baseId = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        className="scroll-limpio -mx-6 flex gap-6 overflow-x-auto border-b border-borde px-6 md:mx-0 md:px-0"
      >
        {solapas.map((solapa) => {
          const esActiva = solapa.id === activa;
          return (
            <button
              key={solapa.id}
              role="tab"
              type="button"
              id={`${baseId}-tab-${solapa.id}`}
              aria-selected={esActiva}
              aria-controls={`${baseId}-panel-${solapa.id}`}
              onClick={() => setActiva(solapa.id)}
              className={cn(
                "text-h4 -mb-px cursor-pointer whitespace-nowrap border-b-2 pb-3 transition-colors",
                FOCO,
                esActiva
                  ? "border-blanco text-blanco"
                  : "border-transparent text-blanco/40 hover:text-blanco/70",
              )}
            >
              {solapa.etiqueta}
            </button>
          );
        })}
      </div>

      {solapas.map((solapa) => (
        <div
          key={solapa.id}
          role="tabpanel"
          id={`${baseId}-panel-${solapa.id}`}
          aria-labelledby={`${baseId}-tab-${solapa.id}`}
          hidden={solapa.id !== activa}
          className="pt-8"
        >
          {solapa.contenido}
        </div>
      ))}
    </div>
  );
}
