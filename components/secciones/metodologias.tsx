"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { COLOR_ACENTO, type Acento } from "@/components/ui/acento";

/**
 * "¿Cómo trabajamos?" en mobile.
 *
 * En desktop son tres bloques de color con el nombre y nada más. En pantallas
 * chicas la maqueta los convierte en un carrusel: una solapa por modalidad, con
 * el nombre en su color y subrayado del mismo tono, flechas para recorrerlas y
 * la descripción debajo —que en desktop no se muestra—.
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
  const mover = (paso: number) =>
    setActivo((i) => (i + paso + items.length) % items.length);

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        <div
          role="tablist"
          aria-label="Modalidades de trabajo"
          className="scroll-limpio -mx-6 flex flex-1 gap-6 overflow-x-auto px-6"
        >
          {items.map((item, i) => (
            <button
              key={item.titulo}
              role="tab"
              type="button"
              id={`${baseId}-tab-${i}`}
              aria-selected={i === activo}
              aria-controls={`${baseId}-panel`}
              onClick={() => setActivo(i)}
              className={cn(
                "text-h4 relative cursor-pointer whitespace-nowrap pb-4 transition-colors",
                FOCO,
                // El nombre toma el color de su modalidad al estar activo.
                i === activo ? COLOR_ACENTO[item.acento] : "text-blanco/40",
              )}
            >
              {item.titulo.replace("\n", " ")}
              {i === activo ? (
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[3px]",
                    FONDO_SUBRAYADO[item.acento],
                  )}
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <BotonFlecha direccion="anterior" onClick={() => mover(-1)} />
          <BotonFlecha direccion="siguiente" onClick={() => mover(1)} />
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activo}`}
        className="text-p1 mt-8 text-blanco/80"
      >
        {actual.descripcion}
      </div>
    </div>
  );
}

/**
 * Subrayado de la solapa activa. Va aparte de `COLOR_ACENTO` porque ahí el
 * color pinta el texto y acá, el fondo de la línea.
 */
const FONDO_SUBRAYADO: Record<Acento, string> = {
  lila: "bg-lila",
  celeste: "bg-celeste",
  naranja: "bg-naranja",
  amarillo: "bg-amarillo",
  verde: "bg-verde",
  rojo: "bg-rojo",
  azul: "bg-azul",
};
