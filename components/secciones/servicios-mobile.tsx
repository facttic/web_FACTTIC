"use client";

import { cn } from "@/lib/cn";
import { Mazo } from "@/components/ui/mazo";
import {
  FONDO_ACENTO,
  acentoPorIndice,
  type Acento,
} from "@/components/ui/acento";
import { acentoDeServicio } from "@/lib/animaciones";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Servicios en mobile.
 *
 * La maqueta no usa solapas acá: los servicios son un mazo de cartas. La
 * abierta se despliega con su descripción y el nombre abajo como rótulo, y de
 * las otras asoma el canto con su nombre.
 *
 * Dos cosas que el board mobile corrige de la maqueta vieja: cada carta va
 * **pintada con su color** —no en gris— y el canto de las tapadas **muestra su
 * nombre**, así que sigue escrito aunque la carta esté cerrada.
 *
 * Y la anotación del archivo pide "Animación de superposición": la carta al
 * frente cambia sola a medida que el mazo cruza la pantalla, sin dejar de
 * responder al clic. Eso lo resuelve `porScroll` en `ui/mazo`.
 */

/** Alto de la carta y cuánto asoma de las tapadas, medidos en la maqueta. */
const ALTO = 328;
const ASOMA = 51;

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
      porScroll
      claveDe={(s) => s.id}
      etiquetaDe={(s) => s.nombre}
      claseCarta="border-transparent"
      className={className}
    >
      {(servicio, estaAbierto, i, abierto) => {
        const acento: Acento =
          acentoDeServicio(servicio.nombre) ?? acentoPorIndice(i);
        /*
         * De las tapadas solo se ve un canto, y de qué lado está depende de
         * dónde queden respecto de la abierta: las de arriba muestran su borde
         * superior y las de abajo, el inferior. El nombre va del lado que se
         * ve.
         */
        const cantoArriba = i < abierto;

        return (
          <span
            className={cn(
              "flex h-full flex-col justify-between p-6",
              FONDO_ACENTO[acento],
            )}
          >
            {/* `P2/Regular` en el archivo: DM Mono 14, no la sans en negrita.
                Solo se lee en la carta abierta; en las tapadas queda debajo. */}
            {/*
              `min-h-0 flex-1` para que no empuje: la descripción sigue ocupando
              su alto en las cartas cerradas y en las más largas dejaba el nombre
              fuera del canto, que es lo único que se ve de ellas.
            */}
            <span
              className={cn(
                "text-p2 min-h-0 flex-1 overflow-hidden transition-opacity duration-300",
                estaAbierto ? "opacity-100" : "opacity-0",
              )}
            >
              {servicio.descripcion ??
                servicio.subservicios.map((sub) => sub.nombre).join(" · ")}
            </span>
            <span
              className={cn(
                "text-eyebrow opacity-70",
                cantoArriba && "order-first",
              )}
            >
              {servicio.nombre}
            </span>
          </span>
        );
      }}
    </Mazo>
  );
}
