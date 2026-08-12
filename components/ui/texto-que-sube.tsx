"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Texto que sube palabra por palabra desde atrás de un recorte.
 *
 * Es el revelado de los paneles que se abren —acordeones y desplegables—: en
 * vez de aparecer de una, el párrafo se va armando de izquierda a derecha, como
 * si se leyera solo. Le queda bien al mono del sitio.
 *
 * Cada palabra viaja en un `inline-block` dentro de otro con `overflow-hidden`,
 * que es lo que la esconde antes de subir. Entre palabra y palabra va un
 * espacio de texto real y no un margen: así el párrafo se puede seleccionar y
 * copiar como cualquier otro, y un lector de pantalla lo lee de corrido.
 *
 * Solo se anima `transform` y `opacity`, o sea que corre en el compositor. Con
 * `prefers-reduced-motion` el texto está y no se mueve.
 */

/** Sale rápido y frena largo: la curva de las interfaces de sistema. */
export const SUAVE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Tope del escalonado, para que un párrafo largo no tarde una eternidad. */
const RETRASO_MAXIMO_MS = 400;

export function TextoQueSube({
  children,
  visible,
  className,
}: {
  /** Si es texto, sube palabra por palabra; si no, entra el bloque entero. */
  children: ReactNode;
  visible: boolean;
  className?: string;
}) {
  if (typeof children !== "string") {
    return (
      <div
        className={cn(
          "transition-[opacity,transform] duration-500 motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          className,
        )}
        style={{ transitionTimingFunction: SUAVE }}
      >
        {children}
      </div>
    );
  }

  const palabras = children.split(" ");

  return (
    <p className={className}>
      {palabras.map((palabra, i) => (
        <span key={`${palabra}-${i}`}>
          {/* El recorte va en su propia caja para no comerse las tildes ni las
              colas de las jotas: el interior sube dentro de este marco. */}
          <span className="inline-flex overflow-hidden align-bottom">
            <span
              className={cn(
                "inline-block transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
              )}
              style={{
                transitionTimingFunction: SUAVE,
                transitionDelay: visible
                  ? `${Math.min(i * 18, RETRASO_MAXIMO_MS)}ms`
                  : "0ms",
              }}
            >
              {palabra}
            </span>
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
