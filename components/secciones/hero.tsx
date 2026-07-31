import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BotonLink } from "@/components/ui/boton";

/**
 * Encabezado principal de la Home.
 *
 * En el diseño lleva una foto a sangre con un velo oscuro encima. Todavía no
 * tenemos ese asset exportado de Figma, así que mientras tanto va un degradado
 * con la paleta: cuando llegue la imagen, basta con pasar `imagen`.
 */
export function Hero({
  titulo,
  bajada,
  accion,
  imagen,
  className,
}: {
  titulo: ReactNode;
  bajada?: ReactNode;
  accion?: { texto: string; href: string };
  imagen?: string;
  className?: string;
}) {
  return (
    <section className={cn("contenedor pt-6", className)}>
      <div className="relative isolate overflow-hidden rounded-2xl">
        {imagen ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagen}
              alt=""
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-negro-oscuro/55" />
          </>
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_20%_0%,var(--color-gris-oscuro)_0%,var(--color-negro)_45%,var(--color-negro-oscuro)_100%)]" />
        )}

        <div className="flex min-h-[26rem] flex-col justify-end gap-8 p-6 md:min-h-[34rem] md:p-12">
          <h1 className="text-display max-w-3xl text-balance">{titulo}</h1>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {bajada ? (
              <p className="text-p1 max-w-xl text-blanco/80">{bajada}</p>
            ) : null}
            {accion ? (
              <BotonLink
                href={accion.href}
                variante="solida"
                className="self-start md:self-auto"
              >
                {accion.texto}
              </BotonLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
