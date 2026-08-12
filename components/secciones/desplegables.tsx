"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { IconoFlecha } from "@/components/ui/iconos";
import { SUAVE, TextoQueSube } from "@/components/ui/texto-que-sube";

/**
 * Lista desplegable con el título de la sección al costado: la usan "Nuestras
 * soluciones" en Servicios y "Metodologías de trabajo" en las verticales.
 *
 * No es `ui/acordeon`: el ítem abierto muestra una línea de apoyo además de la
 * descripción, la flecha apunta hacia arriba y en lila, y el separador cambia
 * —sólido debajo del abierto, punteado entre los cerrados—.
 */

export interface ItemDesplegable {
  id: string;
  titulo: string;
  descripcion?: string | null;
  /** Renglón secundario bajo la descripción, como la lista de subservicios. */
  detalle?: string | null;
}

export function Desplegables({
  items,
  className,
}: {
  items: ItemDesplegable[];
  className?: string;
}) {
  /*
   * Arranca con el primero desplegado en desktop y con todos cerrados en
   * mobile, que es como lo muestran las dos maquetas. Se resuelve en el cliente
   * porque depende del ancho; hasta que se monta se ve cerrado, que es el
   * estado más discreto de los dos.
   */
  const [abierto, setAbierto] = useState(-1);
  const baseId = useId();

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) setAbierto(0);
  }, []);

  if (!items.length) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const estaAbierto = i === abierto;
        const panelId = `${baseId}-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              "border-b",
              estaAbierto
                ? "border-solid border-borde"
                : "border-dashed border-gris-oscuro",
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onClick={() => setAbierto(estaAbierto ? -1 : i)}
                className={cn(
                  "text-h4 flex w-full cursor-pointer items-start justify-between gap-6 py-8 text-left",
                  /*
                    Solo el primero arranca sin aire arriba, para quedar a la
                    altura del título de la sección. Va por índice y no con
                    `first:`, que acá se cumple siempre —el botón es el único
                    hijo de su <h3>— y les sacaba el padding a todos.
                  */
                  i === 0 && "pt-0",
                  `transition-colors hover:text-blanco/70 ${FOCO}`,
                )}
              >
                {item.titulo}
                <IconoFlecha
                  direccion={estaAbierto ? "arriba" : "abajo"}
                  className={cn(
                    "mt-1 shrink-0 transition-colors",
                    estaAbierto ? "text-lila" : "text-blanco/60",
                  )}
                />
              </button>
            </h3>

            {/* El panel crece hasta su alto real y el texto sube palabra por
                palabra, igual que en el acordeón. */}
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
                <div className="pb-6">
                  {item.descripcion ? (
                    <TextoQueSube
                      visible={estaAbierto}
                      className="text-p1 text-blanco/80"
                    >
                      {item.descripcion}
                    </TextoQueSube>
                  ) : null}
                  {item.detalle ? (
                    <TextoQueSube
                      visible={estaAbierto}
                      className="text-p2 mt-3 text-blanco/50"
                    >
                      {item.detalle}
                    </TextoQueSube>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * El bloque completo: el título de la sección a la izquierda y la lista a la
 * derecha. En mobile el título va arriba y la lista ocupa todo el ancho.
 */
export function BloqueDesplegable({
  rotulo,
  titulo,
  tamano = "h1",
  items,
  className,
}: {
  rotulo?: string;
  titulo: string;
  /**
   * "Nuestras soluciones" va en H1 y "Metodologías de trabajo" en H2, medido
   * sobre cada maqueta. No hay una regla común entre pantallas.
   */
  tamano?: "h1" | "h2";
  items: ItemDesplegable[];
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-8 md:grid-cols-[352px_1fr] md:gap-16", className)}
    >
      {/* En desktop el título entra en una línea por columna: sin esto se parte
          y deja de coincidir con la maqueta. */}
      <h2
        className={cn(
          "whitespace-pre-line",
          tamano === "h1" ? "text-h1" : "text-h2",
        )}
      >
        {rotulo ? (
          <span className="text-eyebrow mb-3 block text-blanco/40">
            {rotulo}
          </span>
        ) : null}
        {titulo}
      </h2>
      <Desplegables items={items} />
    </div>
  );
}
