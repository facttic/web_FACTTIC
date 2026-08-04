"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { IconoFlecha } from "@/components/ui/iconos";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * "Nuestras soluciones": el acordeón de servicios de la pantalla de Servicios.
 *
 * No usa `ui/acordeon` porque el ítem abierto muestra tres cosas —descripción,
 * lista de subservicios y una flecha que apunta hacia arriba y en lila— y el
 * separador cambia: sólido debajo del abierto y punteado entre los cerrados.
 *
 * Todo el contenido sale de la API: nombre, descripción y subservicios.
 */
export function Soluciones({
  servicios,
  className,
}: {
  servicios: Servicio[];
  className?: string;
}) {
  /*
   * Arranca con el primero desplegado en desktop y con todos cerrados en
   * mobile, que es como lo muestran las dos maquetas. Se resuelve en el cliente
   * porque depende del ancho; hasta que se monta se ve cerrado, que es el
   * estado más discreto de los dos.
   */
  const [abierto, setAbierto] = useState(-1);
  const baseId = useId();

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) setAbierto(0);
  }, []);

  if (!servicios.length) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      {servicios.map((servicio, i) => {
        const estaAbierto = i === abierto;
        const panelId = `${baseId}-${servicio.id}`;
        const subservicios = servicio.subservicios.map((s) => s.nombre);

        return (
          <div
            key={servicio.id}
            className={cn(
              "border-b",
              // Debajo del abierto la línea va entera; entre los cerrados,
              // punteada y más tenue. Así está en la maqueta.
              estaAbierto
                ? "border-solid border-borde"
                : "border-dashed border-gris-oscuro",
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onClick={() => setAbierto(estaAbierto ? -1 : i)}
                className={cn(
                  "text-h4 flex w-full cursor-pointer items-start justify-between gap-6 py-8 text-left",
                  // El primero arranca a la altura del título de la sección:
                  // sin esto queda 32px más abajo que en la maqueta.
                  "first:pt-0",
                  `transition-colors hover:text-blanco/70 ${FOCO}`,
                )}
              >
                {servicio.nombre}
                <IconoFlecha
                  direccion={estaAbierto ? "arriba" : "abajo"}
                  className={cn(
                    "mt-1 shrink-0 transition-colors",
                    estaAbierto ? "text-lila" : "text-blanco/60",
                  )}
                />
              </button>
            </h3>

            <div id={panelId} hidden={!estaAbierto} className="pb-6">
              {servicio.descripcion ? (
                <p className="text-p1 text-blanco/80">{servicio.descripcion}</p>
              ) : null}
              {subservicios.length ? (
                <p className="text-p2 mt-3 text-blanco/50">
                  {subservicios.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
