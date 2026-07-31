import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Tarjeta } from "@/components/ui/seccion";
import { IconoFlecha } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";
import { Animacion } from "@/components/ui/animacion";
import { animacionDeSector } from "@/lib/animaciones";
import type { Sector } from "@/lib/dominio/tipos";

/**
 * Tarjetas de sector (Organizaciones, Agro, Financiero).
 *
 * En el diseño aparecen de dos formas: la de Home y Servicios, con la
 * ilustración arriba y el número y el nombre abajo; y la de la grilla de
 * verticales, con el título grande, un separador y "Ver más".
 */

/**
 * Ilustración del sector. Prefiere la animación de diseño; si no hay, cae a la
 * imagen que tenga cargada la API, y por último a un marcador.
 */
function Ilustracion({ sector }: { sector: Sector }) {
  const animacion = animacionDeSector(sector.nombre);

  if (animacion) {
    return <Animacion nombre={animacion} className="aspect-square w-full" />;
  }

  if (!sector.imagen) {
    return (
      <div className="aspect-square w-full rounded-lg bg-superficie-alta/30" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sector.imagen}
      alt=""
      className="aspect-square w-full rounded-lg object-cover"
      loading="lazy"
    />
  );
}

/** Alto de la tarjeta, para que las dos caras del hover coincidan. */
const ALTO_SECTOR = "h-[360px]";

/**
 * Tarjeta de sector de la Home.
 *
 * En reposo muestra la ilustración con el número y el nombre abajo; al pasar el
 * mouse la reemplaza por la propuesta de valor del sector y un "Ver más", como
 * en el prototipo. Es la misma mecánica que las tarjetas de proyecto y de
 * beneficio.
 *
 * Sin descripción cargada no hay nada que revelar, así que se queda en reposo.
 */
export function CardSector({
  sector,
  indice,
  href,
  className,
}: {
  sector: Sector;
  indice: number;
  href?: string;
  className?: string;
}) {
  const numero = String(indice + 1).padStart(2, "0");

  const reposo = (
    <div className="absolute inset-0 flex flex-col p-4 transition-opacity duration-300 group-hover:opacity-0">
      <Ilustracion sector={sector} />
      <div className="mt-auto flex items-baseline justify-between gap-4 pt-6">
        <span className="text-h4">{numero}.</span>
        <span className="text-h4">{sector.nombre}</span>
      </div>
    </div>
  );

  if (!href) {
    return (
      <Tarjeta className={cn("relative", ALTO_SECTOR, className)}>
        {reposo}
      </Tarjeta>
    );
  }

  return (
    <Link href={href} className={cn("group block", FOCO, className)}>
      <Tarjeta
        className={cn(
          "relative overflow-hidden transition-colors hover:border-blanco/30",
          ALTO_SECTOR,
        )}
      >
        {reposo}

        {sector.descripcion ? (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <p className="text-h3 text-balance">{sector.descripcion}</p>
            <div>
              <div className="border-t border-blanco/30" />
              <div className="text-p3 mt-4 flex items-center justify-between">
                Ver más
                <IconoFlecha className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ) : null}
      </Tarjeta>
    </Link>
  );
}

/**
 * Variante con la propuesta de valor del sector y enlace al detalle, como en la
 * grilla de verticales de "Nuestros servicios".
 *
 * El enlace envuelve toda la tarjeta, así que el "Ver más" se dibuja acá en vez
 * de usar `BotonTexto`: anidar dos <a> no es válido.
 */
export function CardSectorDetalle({
  titulo,
  href,
  etiqueta = "Ver más",
  className,
}: {
  titulo: ReactNode;
  href: string;
  etiqueta?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group block", FOCO, className)}>
      <Tarjeta className="flex h-full flex-col justify-between p-6 transition-colors hover:border-blanco/30">
        <p className="text-h3 text-balance">{titulo}</p>
        <div className="mt-10">
          <div className="border-t border-borde" />
          <div className="text-p3 mt-4 flex items-center justify-between text-blanco/70 transition-colors group-hover:text-blanco">
            {etiqueta}
            <IconoFlecha className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Tarjeta>
    </Link>
  );
}
