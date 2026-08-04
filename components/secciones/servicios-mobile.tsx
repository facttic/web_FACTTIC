"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de tarjetas. La
 * abierta se despliega con su descripción y el nombre abajo como rótulo, y las
 * demás quedan debajo asomando apenas una franja. Al tocar una, pasa a ser la
 * abierta.
 *
 * Dos cosas hacen el efecto y conviene no tocarlas por separado:
 *
 *  - **Todas miden lo mismo.** Las tapadas no se achican: se montan sobre la
 *    anterior con un margen negativo. Si se les bajara la altura, el radio de 21
 *    las volvería píldoras y el mazo se vería como bloques sueltos en vez de
 *    cartas superpuestas.
 *  - **Todas comparten el relleno gris.** Así el mazo se lee como un solo
 *    volumen y lo único que separa una tarjeta de otra son las líneas curvas del
 *    borde. Con el fondo del sitio en las tapadas, el conjunto se parte.
 *
 * Es un acordeón, pero no el de `ui/acordeon`: ese muestra los títulos de todos
 * los ítems y acá las tapadas no muestran nada más que su franja.
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
   * desplegada más la franja de cada una de las otras. Sin fijarlo, la última
   * —que no tiene ninguna encima que la tape— se desplegaría entera por debajo.
   * El recorte va redondeado para que el mazo cierre con la misma curva que las
   * tarjetas.
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

        // Si la de arriba está desplegada no hay nada que tapar y esta arranca
        // justo debajo; si no, se monta y le deja ver solo la franja.
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
              // shrink-0: el contenedor tiene el alto del mazo, que es menor que
              // la suma de las tarjetas, y sin esto flex las comprimiría.
              "relative shrink-0 cursor-pointer overflow-hidden rounded-[21px] text-left",
              "border border-borde-pleno bg-superficie-alta",
              "transition-[margin-top] duration-300",
              FOCO,
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
