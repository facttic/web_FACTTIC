"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha } from "@/components/ui/boton";
import { COLOR_ACENTO, type Acento } from "@/components/ui/acento";

/**
 * "¿Cómo trabajamos?" en mobile.
 *
 * En desktop son tres bloques de color; en pantallas chicas la maqueta los
 * convierte en un carrusel de a uno: se ve solo el nombre de la modalidad
 * actual —en su color, subrayado del mismo tono— y las flechas para recorrerlas.
 * La descripción va debajo, y en desktop no se muestra.
 *
 * El subrayado ocupa lo que mide el nombre y la línea punteada sigue hasta el
 * borde, así que van en la misma fila y no como una barra de progreso.
 */
export function Metodologias({
  items,
  className,
}: {
  items: readonly {
    titulo: string;
    acento: Acento;
    descripcion: string | null;
  }[];
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();

  if (!items.length) return null;

  const actual = items[activo];

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        {/* El trazo del color mide lo que el nombre y la línea punteada sigue
            hasta el borde: por eso el subrayado sale del propio texto y no de
            una barra aparte. */}
        <div className="flex min-w-0 flex-1 items-end">
          <p
            id={`${baseId}-titulo`}
            className={cn(
              "text-h4 shrink-0 border-b-[3px] pb-4",
              COLOR_ACENTO[actual.acento],
              BORDE_ACENTO[actual.acento],
            )}
          >
            {actual.titulo.replace("\n", " ")}
          </p>
          <span className="flex-1 border-b border-dashed border-gris-oscuro" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
        </div>
      </div>

      <p
        aria-labelledby={`${baseId}-titulo`}
        className="text-p1 mt-8 text-blanco/80"
      >
        {actual.descripcion}
      </p>
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
