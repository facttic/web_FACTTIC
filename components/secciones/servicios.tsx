"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import {
  CardServicio,
  CardServicioSiguiente,
} from "@/components/tarjetas/servicios";
import { acentoPorIndice } from "@/components/ui/acento";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Bloque "Solucionamos con tecnología e innovación".
 *
 * En el prototipo no es un juego de solapas común: además de la lista con la
 * solapa activa subrayada, hay flechas arriba a la derecha que recorren los
 * servicios, y se muestran dos tarjetas: la del servicio activo, pintada y con
 * su descripción, y la del siguiente, apagada y solo con el título. Al avanzar,
 * la segunda pasa a ser la primera.
 *
 * Las solapas del diseño usan nombres cortos ("Diseño", "Ingeniería e infra")
 * mientras que las tarjetas usan el nombre completo. La API solo tiene el
 * completo, así que por ahora se usa ese en los dos lugares.
 */
export function Servicios({
  servicios,
  className,
}: {
  servicios: Servicio[];
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();

  if (!servicios.length) return null;

  const servicioActivo = servicios[activo];
  const siguiente = servicios[(activo + 1) % servicios.length];

  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-6">
        <div
          role="tablist"
          aria-label="Servicios"
          className="scroll-limpio -mx-6 flex flex-1 gap-8 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          {servicios.map((servicio, i) => (
            <button
              key={servicio.id}
              role="tab"
              type="button"
              id={`${baseId}-tab-${servicio.id}`}
              aria-selected={i === activo}
              aria-controls={`${baseId}-panel`}
              onClick={() => setActivo(i)}
              className={cn(
                "text-h4 relative cursor-pointer whitespace-nowrap pb-4 transition-colors",
                FOCO,
                i === activo
                  ? "text-blanco"
                  : "text-blanco/40 hover:text-blanco/70",
              )}
            >
              {servicio.nombre}
              {i === activo ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blanco" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 pb-2 md:flex">
          <BotonFlecha
            direccion="anterior"
            onClick={() =>
              setActivo((i) => (i - 1 + servicios.length) % servicios.length)
            }
          />
          <BotonFlecha
            direccion="siguiente"
            onClick={() => setActivo((i) => (i + 1) % servicios.length)}
          />
        </div>
      </div>

      {/* Línea punteada que corre por debajo de las solapas. */}
      <div className="border-t border-dashed border-borde" />

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${servicioActivo.id}`}
        className="mt-8 grid gap-6 md:grid-cols-2"
      >
        <CardServicio
          titulo={servicioActivo.nombre}
          acento={acentoPorIndice(activo)}
          descripcion={
            servicioActivo.descripcion ??
            servicioActivo.subservicios.map((s) => s.nombre).join(" · ")
          }
        />
        {servicios.length > 1 ? (
          <CardServicioSiguiente
            titulo={siguiente.nombre}
            acento={acentoPorIndice((activo + 1) % servicios.length)}
            descripcion={
              siguiente.descripcion ??
              siguiente.subservicios.map((s) => s.nombre).join(" · ")
            }
            onClick={() => setActivo((i) => (i + 1) % servicios.length)}
          />
        ) : null}
      </div>
    </div>
  );
}
