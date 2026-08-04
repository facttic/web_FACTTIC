"use client";

import { cn } from "@/lib/cn";
import { Mazo } from "@/components/ui/mazo";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de cartas. La
 * abierta se despliega con su descripción y el nombre abajo como rótulo, y de
 * las otras asoma solo el canto, sin nada escrito.
 *
 * El apilado lo resuelve `ui/mazo`, que es el mismo que usan los sectores en
 * Nuestros servicios.
 */

/** Alto de la carta y cuánto asoma de las tapadas, medidos en la maqueta. */
const ALTO = 278;
const ASOMA = 38;

export function ServiciosMobile({
  servicios,
  className,
}: {
  servicios: Servicio[];
  className?: string;
}) {
  return (
    <Mazo
      items={servicios}
      alto={ALTO}
      asoma={ASOMA}
      claveDe={(s) => s.id}
      etiquetaDe={(s) => s.nombre}
      className={className}
    >
      {(servicio, estaAbierto) => (
        <span
          className={cn(
            "flex h-full flex-col justify-between p-6 transition-opacity duration-300",
            estaAbierto ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="text-h4 text-balance">
            {servicio.descripcion ??
              servicio.subservicios.map((sub) => sub.nombre).join(" · ")}
          </span>
          <span className="text-eyebrow text-blanco/50">{servicio.nombre}</span>
        </span>
      )}
    </Mazo>
  );
}
