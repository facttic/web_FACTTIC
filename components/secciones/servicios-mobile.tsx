"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de tarjetas
 * apiladas. La abierta se despliega con su descripción y el nombre abajo como
 * rótulo; las demás quedan asomando debajo, una encima de otra, y al tocarlas
 * pasan a ser la abierta.
 *
 * Es un acordeón, pero no el de `ui/acordeon`: ese muestra los títulos de todos
 * los ítems y acá las cerradas no muestran nada, solo su borde superior. Por
 * eso se resuelve aparte y no forzando aquel componente.
 */

/** Alto de la tarjeta abierta y cuánto asoma cada cerrada, medidos en la maqueta. */
const ALTO_ABIERTA = "h-[278px]";
const ALTO_CERRADA = "h-[30px]";

export function ServiciosMobile({
  servicios,
  className,
}: {
  servicios: Servicio[];
  className?: string;
}) {
  const [abierto, setAbierto] = useState(0);
  const baseId = useId();

  if (!servicios.length) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      {servicios.map((servicio, i) => {
        const estaAbierto = i === abierto;
        const panelId = `${baseId}-${servicio.id}`;
        const descripcion =
          servicio.descripcion ??
          servicio.subservicios.map((sub) => sub.nombre).join(" · ");

        return (
          <button
            key={servicio.id}
            type="button"
            aria-expanded={estaAbierto}
            aria-controls={panelId}
            onClick={() => setAbierto(i)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-[21px] text-left",
              "transition-[height,background-color] duration-300",
              FOCO,
              estaAbierto
                ? `${ALTO_ABIERTA} bg-superficie-alta`
                : `${ALTO_CERRADA} border border-borde-pleno`,
              // Las cerradas se montan sobre la anterior, como cartas en un mazo.
              i > 0 && "-mt-px",
            )}
          >
            {/*
              El nombre del servicio nunca se dibuja en la solapa: la abierta lo
              muestra abajo como rótulo y las cerradas, en la maqueta, no
              muestran nada más que su borde. Igual va en el DOM para que un
              lector de pantalla sepa qué se está por abrir.
            */}
            <span className="sr-only">{servicio.nombre}</span>

            <span
              id={panelId}
              hidden={!estaAbierto}
              className="flex h-full flex-col justify-between p-6"
            >
              <span className="text-h4 text-balance">{descripcion}</span>
              <span className="text-eyebrow text-blanco/50">
                {servicio.nombre}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
