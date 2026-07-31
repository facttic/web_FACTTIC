"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { CardServicioSiguiente } from "@/components/tarjetas/servicios";
import { EncabezadoSeccion } from "@/components/ui/seccion";
import { acentoPorIndice } from "@/components/ui/acento";
import { acentoDeServicio, nombreCortoDeServicio } from "@/lib/animaciones";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Bloque "Solucionamos con tecnología e innovación".
 *
 * En el prototipo no es un juego de solapas común: además de la lista con la
 * solapa activa subrayada, hay flechas que recorren los servicios, y se
 * muestran dos tarjetas: la del servicio activo, pintada y con su descripción,
 * y la del siguiente, apagada y solo con el título. Al avanzar, la segunda pasa
 * a ser la primera.
 *
 * El encabezado se arma acá adentro y no en la página porque las flechas van
 * junto al título de sección —así están en el SVG— y necesitan el estado de
 * este componente.
 *
 * Las solapas usan el nombre corto y las tarjetas el completo, como en el
 * diseño.
 */
export function Servicios({
  servicios,
  rotulo,
  titulo,
  className,
}: {
  servicios: Servicio[];
  rotulo?: string;
  titulo: React.ReactNode;
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();

  if (!servicios.length) return null;

  const servicioActivo = servicios[activo];
  const siguiente = servicios[(activo + 1) % servicios.length];

  return (
    <div className={className}>
      <EncabezadoSeccion
        rotulo={rotulo}
        titulo={titulo}
        accion={
          <div className="hidden items-center gap-2 md:flex">
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
        }
      />

      <div
        role="tablist"
        aria-label="Servicios"
        className="scroll-limpio -mx-6 flex gap-10 overflow-x-auto px-6 md:mx-0 md:gap-16 md:px-0"
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
              "text-h3 relative cursor-pointer whitespace-nowrap pb-4 transition-colors",
              FOCO,
              i === activo
                ? "text-blanco"
                : "text-blanco/40 hover:text-blanco/70",
            )}
          >
            {nombreCortoDeServicio(servicio.nombre)}
            {i === activo ? (
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-blanco" />
            ) : null}
          </button>
        ))}
      </div>

      {/*
        Línea punteada que corre por debajo de las solapas. Va en Gris oscuro
        sólido, no en blanco translúcido: así están las tres líneas punteadas
        del SVG (stroke #3C3C3C, dash 3 3).
      */}
      <div className="border-t border-dashed border-gris-oscuro" />

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${servicioActivo.id}`}
        className="mt-8 grid gap-6 md:grid-cols-2"
      >
        {[servicioActivo, siguiente].map((servicio, i) => (
          <CardServicioSiguiente
            key={`${servicio.id}-${i}`}
            titulo={servicio.nombre}
            acento={
              acentoDeServicio(servicio.nombre) ??
              acentoPorIndice(servicios.indexOf(servicio))
            }
            descripcion={
              servicio.descripcion ??
              servicio.subservicios.map((sub) => sub.nombre).join(" · ")
            }
            onClick={() =>
              setActivo(i === 0 ? activo : (activo + 1) % servicios.length)
            }
          />
        ))}
      </div>
    </div>
  );
}
