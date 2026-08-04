"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de tarjetas. La
 * abierta se ve entera, con su descripción y el nombre abajo como rótulo, y las
 * demás quedan apiladas debajo asomando solo su borde superior. Al tocar una,
 * pasa a ser la abierta.
 *
 * La clave del efecto es que **todas las tarjetas miden lo mismo**: las
 * colapsadas no se achican, se tapan entre sí con un margen negativo. Por eso se
 * les ve el arco de las esquinas y parecen cartas. Si se les bajara la altura,
 * el radio las convertiría en píldoras y el mazo se perdería.
 *
 * Es un acordeón, pero no el de `ui/acordeon`: ese muestra los títulos de todos
 * los ítems y acá las cerradas no muestran nada más que su borde.
 */

/** Alto de la tarjeta y cuánto asoma cuando está tapada, medidos en la maqueta. */
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

  /*
   * El mazo mide siempre lo mismo, esté abierta la que esté: la tarjeta
   * desplegada más la franja que asoma de cada una de las otras. Sin fijarlo, la
   * última —que no tiene ninguna encima que la tape— se desplegaría entera por
   * debajo. El recorte va redondeado para que el mazo cierre con la misma
   * curvatura que las tarjetas.
   */
  const alto = ALTO + (servicios.length - 1) * ASOMA;

  return (
    <div
      style={{ height: alto }}
      className={cn("flex flex-col overflow-hidden rounded-[21px]", className)}
    >
      {servicios.map((servicio, i) => {
        const estaAbierto = i === abierto;
        const panelId = `${baseId}-${servicio.id}`;
        const descripcion =
          servicio.descripcion ??
          servicio.subservicios.map((sub) => sub.nombre).join(" · ");

        /*
         * Cada tarjeta se monta sobre la anterior tapando todo menos su franja
         * superior. Si la de arriba está abierta no hay nada que tapar, así que
         * esta arranca justo debajo.
         */
        const anteriorAbierta = i - 1 === abierto;
        const margen = i === 0 || anteriorAbierta ? 0 : -(ALTO - ASOMA);

        return (
          <button
            key={servicio.id}
            type="button"
            aria-expanded={estaAbierto}
            aria-controls={panelId}
            onClick={() => setAbierto(i)}
            style={{ height: ALTO, marginTop: margen, zIndex: i }}
            className={cn(
              // shrink-0: el contenedor tiene el alto del mazo, que es menor
              // que la suma de las tarjetas, y sin esto flex las comprimiría.
              "relative shrink-0 cursor-pointer overflow-hidden rounded-[21px] text-left",
              "border border-borde-pleno transition-[margin-top,background-color] duration-300",
              FOCO,
              // Las tapadas llevan el fondo del sitio para ocultar la de atrás.
              estaAbierto ? "bg-superficie-alta" : "bg-fondo",
            )}
          >
            {/*
              El nombre del servicio nunca se dibuja en la franja: la tarjeta
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
