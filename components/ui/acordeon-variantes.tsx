"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { FOCO } from "./boton";
import type { ItemAcordeon } from "./acordeon";

/**
 * Variantes de apertura para el acordeón, para elegir mirando.
 *
 * El de producción abre con `hidden`: el contenido aparece de una. Todas estas
 * animan el alto con `grid-template-rows: 0fr → 1fr`, que es la forma de llegar
 * hasta `auto` sin medir nada en JavaScript, y se diferencian en cómo entra el
 * contenido:
 *
 *  - `plop`: crece de golpe y rebota, con el resorte de `--ease-plop`.
 *  - `suave`: sin rebote. Arranca rápido y frena largo, que es lo que hace que
 *    un movimiento se sienta caro en vez de mecánico.
 *  - `lineas`: el texto sube por palabras, escalonado, como si se leyera solo.
 *  - `barrido`: el bloque se descubre de arriba abajo con un recorte, sin que
 *    nada se mueva de lugar.
 *
 * Se borra cuando se elija una: la elegida pasa a `acordeon.tsx`.
 */

export type EfectoAcordeon = "plop" | "suave" | "lineas" | "barrido";

/** Sale rápido y frena largo. Es la curva de las interfaces de sistema. */
const SUAVE = "cubic-bezier(0.16, 1, 0.3, 1)";

function Contenido({
  efecto,
  abierto,
  children,
}: {
  efecto: EfectoAcordeon;
  abierto: boolean;
  children: ReactNode;
}) {
  if (efecto === "lineas" && typeof children === "string") {
    const palabras = children.split(" ");
    return (
      <p className="text-p1 flex flex-wrap pb-6 text-blanco/70">
        {palabras.map((palabra, i) => (
          <span key={`${palabra}-${i}`} className="overflow-hidden py-0.5">
            <span
              className={cn(
                "inline-block transition-[transform,opacity] duration-500 motion-reduce:transition-none",
                abierto
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
              )}
              style={{
                transitionTimingFunction: SUAVE,
                // Cada palabra sale un pelo después que la anterior; el tope
                // evita que un párrafo largo termine de entrar diez segundos
                // más tarde.
                transitionDelay: abierto ? `${Math.min(i * 18, 400)}ms` : "0ms",
              }}
            >
              {palabra}&nbsp;
            </span>
          </span>
        ))}
      </p>
    );
  }

  if (efecto === "barrido") {
    return (
      <div
        className="text-p1 pb-6 text-blanco/70 transition-[clip-path,opacity] duration-500 motion-reduce:transition-none"
        style={{
          transitionTimingFunction: SUAVE,
          clipPath: abierto ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          opacity: abierto ? 1 : 0,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-p1 pb-6 text-blanco/70 transition-[opacity,transform] duration-500 motion-reduce:transition-none",
        abierto
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-3 scale-[0.97] opacity-0",
      )}
      style={{
        transitionTimingFunction: efecto === "plop" ? undefined : SUAVE,
      }}
    >
      {children}
    </div>
  );
}

export function AcordeonVariante({
  items,
  efecto = "plop",
  inicial = 0,
  className,
}: {
  items: ItemAcordeon[];
  efecto?: EfectoAcordeon;
  inicial?: number | null;
  className?: string;
}) {
  const [abierto, setAbierto] = useState<string | null>(
    inicial === null ? null : (items[inicial]?.id ?? null),
  );
  const baseId = useId();
  const conResorte = efecto === "plop";

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
                    "transition-transform duration-500 motion-reduce:duration-150",
                    conResorte && "ease-plop",
                    estaAbierto && "rotate-180",
                  )}
                  style={
                    conResorte ? undefined : { transitionTimingFunction: SUAVE }
                  }
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows] duration-500 motion-reduce:duration-0",
                conResorte && "ease-plop",
                estaAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              style={
                conResorte ? undefined : { transitionTimingFunction: SUAVE }
              }
            >
              <div className="overflow-hidden">
                <Contenido efecto={efecto} abierto={estaAbierto}>
                  {item.contenido}
                </Contenido>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
