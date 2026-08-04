import { cn } from "@/lib/cn";
import type { Organizacion } from "@/lib/dominio/tipos";

/**
 * Banda de logos de aliados ("Eligen soluciones cooperativas").
 *
 * Se desplaza sola y de punta a punta, sin acotarse al contenedor: en la
 * maqueta los logos entran y salen por los bordes de la pantalla. La lista se
 * duplica para que el recorrido no muestre huecos, y la copia va oculta para
 * lectores de pantalla.
 *
 * Se detiene con `prefers-reduced-motion`, igual que la marquesina del lema.
 */

/** Alto de la tarjeta de logo, medido en la maqueta. */
const ALTO = "h-[120px]";

export function Aliados({
  logos,
  className,
}: {
  logos: Organizacion[];
  className?: string;
}) {
  if (!logos.length) return null;

  return (
    <div className={cn("overflow-hidden", className)}>
      <ul className="animate-marquesina flex w-max gap-5 motion-reduce:animate-none">
        {[0, 1].map((vuelta) =>
          logos.map((logo) => (
            <li
              key={`${vuelta}-${logo.id}`}
              aria-hidden={vuelta === 1 || undefined}
              className={cn(
                "grid w-[240px] shrink-0 place-items-center rounded-lg bg-superficie-alta px-8",
                ALTO,
              )}
            >
              {logo.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.logo}
                  alt={logo.nombre}
                  loading="lazy"
                  className="max-h-12 w-auto max-w-full object-contain"
                />
              ) : (
                <span className="text-p2 text-center text-blanco/70">
                  {logo.nombre}
                </span>
              )}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
