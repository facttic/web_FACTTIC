"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de tarjetas. La
 * abierta se despliega con su descripción y el nombre abajo como rótulo, y de
 * las otras asoma solo el canto. Al tocar una, pasa a ser la abierta.
 *
 * Cómo se apilan, que es lo que da el efecto:
 *
 *  - Todas miden lo mismo y van una encima de otra, desplazadas 38px. No se
 *    achican: si se les bajara la altura, el radio de 21 las volvería píldoras.
 *  - La abierta va al frente y las demás quedan detrás, así que de cada una se
 *    ve su **borde inferior** curvo asomando por debajo —el canto de la carta—,
 *    no su borde superior. Por eso el z-index baja a medida que se alejan de la
 *    abierta.
 *  - Todas comparten el relleno gris, para que el mazo se lea como un solo
 *    volumen separado por las líneas del borde.
 *
 * Es un acordeón, pero no el de `ui/acordeon`: ese muestra los títulos de todos
 * los ítems y acá las tapadas no muestran nada más que su canto.
 */

/** Alto de la tarjeta y cuánto asoma de las tapadas, medidos en la maqueta. */
const ALTO = 278;
const ASOMA = 38;

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

  // El mazo mide lo mismo esté abierta la que esté: la última arranca en
  // (n-1)·38 y termina justo en el borde de abajo.
  const alto = ALTO + (servicios.length - 1) * ASOMA;

  return (
    <div style={{ height: alto }} className={cn("relative", className)}>
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
            style={{
              top: i * ASOMA,
              height: ALTO,
              // Máximo en la abierta y bajando hacia los dos lados, para que
              // las de arriba asomen por arriba y las de abajo, por abajo.
              zIndex: servicios.length - Math.abs(i - abierto),
            }}
            className={cn(
              "absolute inset-x-0 cursor-pointer overflow-hidden rounded-[21px] text-left",
              "border border-borde-pleno bg-superficie-alta",
              "transition-opacity duration-200",
              FOCO,
              // Las tapadas se atenúan al apuntarlas, para que se lea que son
              // parte del mazo y se pueden traer al frente. Solo se llega al
              // canto: el resto queda detrás de las otras y no recibe el puntero.
              estaAbierto ? null : "hover:opacity-80 focus-visible:opacity-80",
            )}
          >
            {/*
              El nombre del servicio nunca se dibuja en el canto: la tarjeta
              abierta lo muestra abajo como rótulo y las tapadas, en la maqueta,
              no muestran nada. Igual va en el DOM para que un lector de pantalla
              sepa qué se está por abrir.
            */}
            <span className="sr-only">{servicio.nombre}</span>

            <span
              id={panelId}
              aria-hidden={!estaAbierto}
              className={cn(
                "flex h-full flex-col justify-between p-6 transition-opacity duration-300",
                estaAbierto ? "opacity-100" : "opacity-0",
              )}
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
