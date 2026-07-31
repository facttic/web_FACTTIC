import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Piezas de estructura que se repiten en todas las pantallas: el rótulo con el
 * título de sección, la tarjeta y la banda de llamada a la acción.
 */

export function Seccion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("contenedor py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

/**
 * Encabezado de sección: rótulo chico arriba, título grande, y una acción
 * opcional alineada a la derecha en desktop.
 */
export function EncabezadoSeccion({
  rotulo,
  titulo,
  descripcion,
  accion,
  className,
}: {
  rotulo?: string;
  titulo: ReactNode;
  descripcion?: ReactNode;
  accion?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-10 md:mb-14", className)}>
      {rotulo ? <p className="text-eyebrow text-blanco/40">{rotulo}</p> : null}
      <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-h1 text-balance">{titulo}</h2>
          {descripcion ? (
            <p className="text-p1 mt-4 text-blanco/60">{descripcion}</p>
          ) : null}
        </div>
        {accion ? <div className="shrink-0">{accion}</div> : null}
      </div>
    </header>
  );
}

export function Tarjeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-borde bg-superficie", className)}
    >
      {children}
    </div>
  );
}

/**
 * Banda de conversión con borde punteado que cierra casi todas las páginas
 * ("¿Tenés algún proyecto en mente?", "¿Querés ser parte de la red?").
 */
export function BandaCta({
  titulo,
  accion,
  className,
}: {
  titulo: ReactNode;
  accion: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-dashed border-blanco/25 p-6",
        "md:flex-row md:items-center md:justify-between md:px-10 md:py-8",
        className,
      )}
    >
      <p className="text-h3">{titulo}</p>
      <div className="shrink-0">{accion}</div>
    </div>
  );
}
