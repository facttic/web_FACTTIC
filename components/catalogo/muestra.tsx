import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Andamiaje del catálogo de componentes: cada bloque lleva su nombre, una nota
 * de dónde se usa en el sitio y el componente renderizado sobre el fondo real.
 */

export function Grupo({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-h2 border-b border-borde pb-4">{titulo}</h2>
      <div className="mt-10 space-y-12">{children}</div>
    </section>
  );
}

export function Muestra({
  nombre,
  usoEn,
  children,
  className,
}: {
  nombre: string;
  usoEn?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-p2 font-sans font-bold text-blanco">{nombre}</h3>
        {usoEn ? <p className="text-p3 text-blanco/40">{usoEn}</p> : null}
      </div>
      <div
        className={cn(
          "rounded-xl border border-dashed border-borde p-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
