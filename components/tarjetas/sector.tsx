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

  // En el board la ilustración mide 235px y va centrada, no a todo el ancho.
  const medida = "size-[177px] md:size-[235px]";

  if (animacion) {
    return <Animacion nombre={animacion} className={medida} />;
  }

  if (!sector.imagen) {
    return <div className={cn(medida, "rounded-lg bg-superficie-alta/30")} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sector.imagen}
      alt=""
      className={cn(medida, "rounded-lg object-cover")}
      loading="lazy"
    />
  );
}

/** Alto de la tarjeta en el SVG (391x359), para que las dos caras del hover coincidan. */
const ALTO_SECTOR = "h-[275px] md:h-[359px]";

/**
 * A diferencia de las de beneficio y proyecto, estas tarjetas no llevan relleno
 * —quedan sobre el fondo de la página— y su borde va a blanco pleno, no al 10%.
 * Así están en el SVG y es lo que las hace resaltar en la grilla.
 *
 * En mobile la maqueta las abre: dejan de ser tarjetas y pasan a ser una lista,
 * con la ilustración suelta y una única línea abajo separando cada sector. Por
 * eso el borde y el radio arrancan apagados y recién aparecen en desktop.
 */
const CAJA_SECTOR =
  "bg-transparent rounded-none border-x-0 border-t-0 border-b border-borde-pleno pb-4 " +
  "md:rounded-lg md:border md:pb-0";

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
    /* Sin padding en mobile: ahí el número y el nombre van contra los bordes
       del contenedor, no de una tarjeta. */
    <div className="absolute inset-0 flex flex-col transition-opacity duration-300 group-hover:opacity-0 md:p-6">
      <div className="grid flex-1 place-items-center">
        <Ilustracion sector={sector} />
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-6">
        <span className="text-h4">{numero}.</span>
        <span className="text-h4">{sector.nombre}</span>
      </div>
    </div>
  );

  if (!href) {
    return (
      <Tarjeta className={cn("relative", CAJA_SECTOR, ALTO_SECTOR, className)}>
        {reposo}
      </Tarjeta>
    );
  }

  return (
    <Link href={href} className={cn("group block", FOCO, className)}>
      <Tarjeta
        className={cn(
          "relative overflow-hidden transition-colors",
          CAJA_SECTOR,
          ALTO_SECTOR,
        )}
      >
        {reposo}

        {sector.descripcion ? (
          /*
            La propuesta de valor va centrada en el alto de la tarjeta entera,
            no en el espacio que queda sobre el pie: por eso el "Ver más" se
            ancla en absoluto abajo en vez de repartirse con `justify-between`.
            Así está en el board de Componentes.
          */
          <div
            className="absolute inset-0 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <p className="text-h3 flex h-full items-center text-balance">
              {sector.descripcion}
            </p>
            <div className="absolute inset-x-6 bottom-6">
              <div className="border-t border-borde-pleno" />
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
