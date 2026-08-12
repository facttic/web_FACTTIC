"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { FOCO } from "./boton";
import type { ItemAcordeon } from "./acordeon";

/**
 * Acordeón que se abre de golpe y rebota.
 *
 * El de producción abre con `hidden`: el contenido aparece sin más. Acá el
 * panel crece de alto cero a su alto real —con `grid-template-rows: 0fr → 1fr`,
 * que es la forma de animar hasta `auto` sin medir nada— y el contenido entra
 * un pelo más grande y desde abajo, con la curva de resorte del sistema. El
 * conjunto se lee como un "plop": pasa de largo y se acomoda.
 *
 * La flecha acompaña con el mismo rebote, así que gira más de 180° y vuelve.
 *
 * Las tres cosas que se animan —`grid-template-rows`, `transform` y `opacity`—
 * las compone el navegador sin recalcular el layout de la página: el panel
 * crece dentro de su propia caja.
 */
export function AcordeonPlop({
  items,
  inicial = 0,
  className,
}: {
  items: ItemAcordeon[];
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
                    "transition-transform duration-500 ease-plop motion-reduce:duration-150 motion-reduce:ease-linear",
                    estaAbierto && "rotate-180",
                  )}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-plop",
                "motion-reduce:duration-0",
                estaAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "text-p1 pb-6 text-blanco/70",
                    "transition-[opacity,transform] duration-500 ease-plop",
                    "motion-reduce:transition-none",
                    estaAbierto
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-3 scale-[0.97] opacity-0",
                  )}
                >
                  {item.contenido}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
