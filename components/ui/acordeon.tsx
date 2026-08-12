"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { FOCO } from "./boton";
import { SUAVE, TextoQueSube } from "./texto-que-sube";

/**
 * Acordeón de una sola apertura, como en "Nuestras soluciones" y en el detalle
 * de proyecto ("Desafío / Solución / Resultado"): el ítem abierto muestra una
 * flecha hacia arriba y el resto hacia abajo.
 *
 * Se construye con <button> y aria-expanded en vez de <details> porque el
 * diseño exige que abrir uno cierre los demás.
 *
 * El panel no aparece de una: crece hasta su alto real —con `grid-template-rows:
 * 0fr → 1fr`, que es la forma de animar hasta `auto` sin medir nada— y el texto
 * sube palabra por palabra mientras tanto.
 */

export interface ItemAcordeon {
  id: string;
  titulo: string;
  contenido: ReactNode;
}

export function Acordeon({
  items,
  inicial = 0,
  className,
}: {
  items: ItemAcordeon[];
  /** Índice abierto al montar; null para arrancar todo cerrado. */
  inicial?: number | null;
  className?: string;
}) {
  const [abierto, setAbierto] = useState<string | null>(
    inicial === null ? null : (items[inicial]?.id ?? null),
  );
  const baseId = useId();

  return (
    <div
      className={cn("divide-y divide-borde border-y border-borde", className)}
    >
      {items.map((item) => {
        const estaAbierto = abierto === item.id;
        const panelId = `${baseId}-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onClick={() => setAbierto(estaAbierto ? null : item.id)}
                className={cn(
                  "text-h4 flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left",
                  `transition-colors hover:text-blanco/70 ${FOCO}`,
                )}
              >
                {item.titulo}
                <IconoFlecha
                  direccion="abajo"
                  className={cn(
                    "transition-transform duration-500",
                    estaAbierto && "rotate-180",
                  )}
                  style={{ transitionTimingFunction: SUAVE }}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows] duration-500 motion-reduce:duration-0",
                estaAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              style={{ transitionTimingFunction: SUAVE }}
            >
              <div className="overflow-hidden">
                <TextoQueSube
                  visible={estaAbierto}
                  className="text-p1 pb-6 text-blanco/70"
                >
                  {item.contenido}
                </TextoQueSube>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
