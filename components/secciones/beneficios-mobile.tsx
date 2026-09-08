"use client";

import type { ReactNode } from "react";
import { Mazo } from "@/components/ui/mazo";

/**
 * Beneficios en mobile.
 *
 * En desktop son cuatro tarjetas en fila que cambian de cara al pasar el mouse.
 * En mobile no hay mouse y la maqueta las resuelve al revés: una sola tarjeta a
 * la vista, con la ilustración, el título y la descripción juntos, y de las que
 * siguen asoma apenas el canto. La anotación del archivo pide que la de adelante
 * cambie con el scroll —la "animación de superposición"—, así que es el mismo
 * mazo de los servicios con otra medida.
 */

/** Medidas del archivo: la tarjeta es de 346×403 y del canto se ven 13px. */
const ALTO = 403;
const ASOMA = 13;

export function BeneficiosMobile({
  items,
  className,
}: {
  items: readonly {
    titulo: string;
    descripcion: string;
    ilustracion: ReactNode;
  }[];
  className?: string;
}) {
  return (
    <Mazo
      items={items}
      alto={ALTO}
      asoma={ASOMA}
      porScroll
      claveDe={(b) => b.titulo}
      etiquetaDe={(b) => b.titulo}
      // El relleno es el mismo fondo de la página: la tarjeta se recorta sola
      // con el borde suave, como en el archivo.
      claseCarta="border-borde bg-negro rounded-lg"
      className={className}
    >
      {(beneficio) => (
        <span className="flex h-full flex-col items-center px-6 pt-[52px] pb-10 text-center">
          {/*
            La caja es más grande que el dibujo: las animaciones traen su propio
            margen, así que para que el círculo mida los 65 del board hay que
            darle 92.
          */}
          <span className="grid size-[80px] place-items-center">
            {beneficio.ilustracion}
          </span>
          <span className="text-h4 mt-10 text-balance">{beneficio.titulo}</span>
          {/*
            `min-h-0 flex-1 overflow-hidden` para que no se derrame: la tarjeta
            mide 403 fijos y las descripciones largas se salían por abajo, donde
            asoma el canto de la que sigue.
          */}
          <span className="text-p2 mt-8 min-h-0 flex-1 overflow-hidden text-balance text-blanco/80">
            {beneficio.descripcion}
          </span>
        </span>
      )}
    </Mazo>
  );
}
