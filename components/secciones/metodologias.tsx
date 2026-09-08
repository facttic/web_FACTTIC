"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha } from "@/components/ui/boton";
import {
  COLOR_ACENTO,
  FONDO_ACENTO,
  type Acento,
} from "@/components/ui/acento";

/**
 * "¿Cómo trabajamos?" en mobile: se ve una modalidad por vez y las flechas la
 * cambian. En desktop las tres pantallas usan otra cosa —bloques de color en
 * Nuestros servicios, desplegables en las verticales—, así que este componente
 * es solo para pantallas chicas.
 *
 * El board la dibuja de dos formas distintas según la pantalla y hay que
 * respetar las dos:
 *
 *  - `tarjeta` (Nuestros servicios): un panel pintado con el color de la
 *    modalidad, con el nombre y la descripción adentro y las flechas debajo.
 *  - `solapa` (las verticales): el nombre suelto en su color, subrayado del
 *    mismo tono, las flechas en la misma línea y la descripción debajo.
 */
export function Metodologias({
  items,
  variante = "tarjeta",
  className,
}: {
  items: readonly {
    titulo: string;
    acento: Acento;
    descripcion: string | null;
  }[];
  variante?: "tarjeta" | "solapa";
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();

  if (!items.length) return null;

  const actual = items[activo];

  const flechas = (
    <>
      <BotonFlecha
        direccion="anterior"
        disabled={activo === 0}
        onClick={() => setActivo((i) => Math.max(0, i - 1))}
      />
      <BotonFlecha
        direccion="siguiente"
        variante={activo < items.length - 1 ? "solida" : "punteada"}
        disabled={activo === items.length - 1}
        onClick={() => setActivo((i) => Math.min(items.length - 1, i + 1))}
      />
    </>
  );

  /* `P1/Bold` en el archivo: DM Mono 16, no los 18 de `P1/Regular`. */
  const descripcion = (
    <p aria-labelledby={`${baseId}-titulo`} className="text-p1-bold">
      {actual.descripcion}
    </p>
  );

  if (variante === "tarjeta") {
    return (
      <div className={className}>
        <div
          className={cn("rounded-xl px-6 py-10", FONDO_ACENTO[actual.acento])}
        >
          <p id={`${baseId}-titulo`} className="text-h3">
            {actual.titulo.replace("\n", " ")}
          </p>
          <div className="mt-8">{descripcion}</div>
        </div>
        <div className="mt-5 flex justify-end gap-2">{flechas}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* El trazo del color mide lo que el nombre y la línea punteada sigue
          hasta el borde: por eso el subrayado sale del propio texto y no de
          una barra aparte. Las flechas van encima de la línea —posicionadas,
          no en la misma fila— porque en el board la punteada les pasa por
          debajo y llega hasta el margen. */}
      <div className="relative flex items-end">
        <p
          id={`${baseId}-titulo`}
          className={cn(
            "text-h3 shrink-0 border-b-[3px] pb-6",
            COLOR_ACENTO[actual.acento],
            BORDE_ACENTO[actual.acento],
          )}
        >
          {actual.titulo.replace("\n", " ")}
        </p>
        <span className="flex-1 border-b border-dashed border-gris-oscuro" />

        <div className="absolute right-0 bottom-[13px] flex items-center gap-2">
          {flechas}
        </div>
      </div>

      <div className="mt-10">{descripcion}</div>
    </div>
  );
}

/** El acento aplicado al borde, que es de donde sale el subrayado. */
const BORDE_ACENTO: Record<Acento, string> = {
  lila: "border-lila",
  celeste: "border-celeste",
  naranja: "border-naranja",
  amarillo: "border-amarillo",
  verde: "border-verde",
  rojo: "border-rojo",
  azul: "border-azul",
};
