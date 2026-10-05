import { Enlace as Link } from "@/components/ui/enlace";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Tarjeta } from "@/components/ui/seccion";
import { IconoFlecha } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";
import { Animacion } from "@/components/ui/animacion";
import { Inclinar } from "@/components/ui/inclinar";
import { FocoPuntero } from "@/components/ui/foco-puntero";
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
  const animacion = animacionDeSector(sector.slug);

  // En el board la ilustración mide 235px y va centrada, no a todo el ancho.
  const medida = "size-[157px] md:size-[235px]";

  // Sin bucle: corre al entrar y de nuevo al pasar el mouse por la tarjeta.
  if (animacion) {
    return <Animacion nombre={animacion} bucle={false} className={medida} />;
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

/**
 * 391x359 en el SVG de desktop y 345x449 en el board mobile. En desktop el alto
 * fijo es lo que hace coincidir las dos caras del hover.
 */
const ALTO_SECTOR = "h-[449px] md:h-[359px]";

/**
 * A diferencia de las de beneficio y proyecto, estas tarjetas no llevan relleno
 * —quedan sobre el fondo de la página— y su borde va a blanco pleno, no al 10%.
 * Así están en el SVG y es lo que las hace resaltar en la grilla.
 *
 * En mobile el board las define como tarjeta cerrada con **borde punteado** y
 * el contenido entero a la vista; en desktop el borde es sólido y blanco pleno,
 * y la propuesta de valor aparece al pasar el mouse.
 */
const CAJA_SECTOR =
  "bg-transparent rounded-lg border border-dotted border-borde-pleno " +
  "md:border-solid";

/** Con caja en los dos anchos, como en la pantalla de Servicios. */
const CAJA_SIEMPRE = "bg-transparent rounded-lg border border-borde-pleno";

/**
 * La cara de mobile: ilustración, nombre, propuesta de valor, una línea y el
 * "Ver más", todo junto y centrado. En mobile no hay dos caras —el cruce del
 * hover existe solo en desktop— y es la misma cara que muestra el mazo de
 * Nuestros servicios, así que vive acá y no adentro de `CardSector`.
 */
export function CaraSectorMobile({
  sector,
  className,
}: {
  sector: Sector;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col items-center justify-center gap-5 p-5 text-center",
        className,
      )}
    >
      <Ilustracion sector={sector} />
      {/* `H2/Mobile` el nombre y `H3/Mobile` la propuesta, los dos en la sans
          en negrita: en el board no van en mono. */}
      <span className="text-h2">{sector.nombre}</span>
      {/* Sin balancear: el board corta los renglones a lo ancho de la caja, y
          balanceados quedan tres cortos y desalineados con la maqueta. */}
      {sector.descripcion ? (
        <p className="text-h3">{sector.descripcion}</p>
      ) : null}
      <div className="w-full">
        <div className="border-t border-borde-pleno" />
        <div className="text-p3 mt-4 flex items-center justify-between">
          Ver más
          <IconoFlecha />
        </div>
      </div>
    </div>
  );
}

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
  conCaja = false,
  className,
}: {
  sector: Sector;
  indice: number;
  href?: string;
  /**
   * Mantiene el borde también en mobile. En la Home las tarjetas se abren y se
   * vuelven una lista; en Servicios conservan la caja en los dos anchos.
   */
  conCaja?: boolean;
  className?: string;
}) {
  const numero = String(indice + 1).padStart(2, "0");
  const caja = conCaja ? CAJA_SIEMPRE : CAJA_SECTOR;

  /*
    En mobile no hay dos caras: el board muestra la ilustración, el nombre, la
    propuesta de valor, una línea y el "Ver más", todo junto y centrado. El
    hover solo existe en desktop, donde el nombre y la descripción se cruzan.
  */
  /*
    En mobile la anotación del archivo pide un "Spotlight Card": el halo sigue
    al dedo dentro de la tarjeta. En desktop no va, que ahí la tarjeta ya cambia
    de cara con el mouse.
  */
  const foco = <FocoPuntero className="md:hidden" />;

  const completo = <CaraSectorMobile sector={sector} className="md:hidden" />;

  const reposo = (
    <div
      className={cn(
        "absolute inset-0 hidden flex-col transition-opacity duration-300 group-hover:opacity-0 md:flex md:p-6",
        conCaja && "p-6",
      )}
    >
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
      <Tarjeta className={cn("relative", caja, ALTO_SECTOR, className)}>
        {foco}
        {completo}
        {reposo}
      </Tarjeta>
    );
  }

  return (
    <Link href={href} className={cn("group block", FOCO, className)}>
      {/* Se inclina hacia donde está el cursor; en reposo queda plana y la
          maqueta no cambia.

          El ángulo es corto a propósito. Estas tarjetas no tienen relleno y su
          borde es blanco pleno: una línea de 1px con ese contraste, rotada en
          3D, se rasteriza a tramos claros y oscuros —el navegador la dibuja y
          después la deforma como si fuera una textura—. Con cinco grados el
          bandeado desaparece; con diez se veía de lejos. */}
      <Inclinar grados={5}>
        <Tarjeta
          className={cn(
            "relative overflow-hidden transition-colors",
            caja,
            ALTO_SECTOR,
          )}
        >
          {foco}
          {completo}
          {reposo}

          {sector.descripcion ? (
            /*
              La propuesta de valor va centrada en el alto de la tarjeta entera,
              no en el espacio que queda sobre el pie: por eso el "Ver más" se
              ancla en absoluto abajo en vez de repartirse con `justify-between`.
              Así está en el board de Componentes.
            */
            <div
              className="absolute inset-0 hidden p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
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
      </Inclinar>
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
