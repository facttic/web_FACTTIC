import { cn } from "@/lib/cn";
import type { Organizacion } from "@/lib/dominio/tipos";

/**
 * Banda de logos de aliados ("Eligen soluciones cooperativas").
 *
 * Se desplaza sola y de punta a punta, sin acotarse al contenedor: en la
 * maqueta los logos entran y salen por los bordes de la pantalla.
 *
 * La animación recorre media cinta y vuelve a empezar, así que **cada mitad
 * tiene que ser más ancha que la pantalla**: si no, al llegar al salto queda un
 * hueco y los logos parecen desaparecer y reaparecer. Con tres aliados una
 * pasada mide 780px y no alcanza para 1440, por eso la lista se repite hasta
 * llenar el ancho antes de duplicarse.
 *
 * Se detiene con `prefers-reduced-motion`, igual que la marquesina del lema.
 */

/** Alto y ancho de la tarjeta de logo, medidos en la maqueta. */
const ALTO = "h-[120px]";
const ANCHO_TARJETA = 240;
const SEPARACION = 20;
/** Lo que tiene que cubrir cada mitad de la cinta, con margen sobre 1440. */
const ANCHO_MINIMO = 1600;

export function Aliados({
  logos,
  className,
}: {
  logos: Organizacion[];
  className?: string;
}) {
  if (!logos.length) return null;

  // Cuántas veces entra la lista en media cinta para que no queden huecos.
  const pasadas = Math.ceil(
    ANCHO_MINIMO / (logos.length * (ANCHO_TARJETA + SEPARACION)),
  );
  const cinta = Array.from({ length: pasadas * 2 }, (_, i) => i);

  return (
    <div className={cn("overflow-hidden", className)}>
      <ul className="animate-marquesina flex w-max gap-5 motion-reduce:animate-none">
        {cinta.map((vuelta) =>
          logos.map((logo) => (
            <li
              key={`${vuelta}-${logo.id}`}
              // Solo la primera pasada se anuncia; el resto es repetición.
              aria-hidden={vuelta > 0 || undefined}
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
