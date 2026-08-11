import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Proyecto } from "@/lib/dominio/tipos";
import { ChipCliente, ChipSector } from "@/components/ui/chip";
import { Tarjeta } from "@/components/ui/seccion";
import { IconoFlecha } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";

/**
 * Tarjetas y filas de proyecto.
 *
 * La tarjeta tiene dos estados, como en el prototipo: en reposo se ve la imagen
 * grande con el título, y al pasar el mouse la imagen se achica para dejar
 * lugar al cliente, el sector y los servicios —y a la descripción, solo en la
 * destacada—. La altura total no cambia, así que la grilla no se mueve.
 *
 * Los títulos se acotan a dos líneas: vienen de la API sin límite de largo y,
 * sin eso, uno extenso desalinea toda la grilla. La anotación del diseño pide
 * además un máximo de caracteres, que hay que definir con diseño y validar en
 * el backoffice.
 *
 * Reciben el proyecto ya adaptado: la portada viene como URL lista para usar y
 * las relaciones ya resueltas, así que acá no hay nada que sepa cómo responde
 * la API.
 */

/**
 * Medidas del board de Componentes, que trae las dos caras de la tarjeta: en
 * reposo 808x406 con la imagen a 310, y al pasar el mouse la misma caja con la
 * imagen recortada a 129 para dejar lugar al detalle.
 *
 * La cara pintada además cambia de piel: pierde el relleno al 3% y su borde
 * pasa de 10% a blanco pleno.
 */
const ALTO_TARJETA = "h-[366px] md:h-[406px]";
const ALTO_IMAGEN =
  "h-[310px] group-hover:h-[129px] group-focus-visible:h-[129px]";
const PIEL_TARJETA =
  "transition-colors duration-300 group-hover:border-borde-pleno group-hover:bg-transparent " +
  "group-focus-visible:border-borde-pleno group-focus-visible:bg-transparent";

function Portada({
  proyecto,
  className,
}: {
  proyecto: Proyecto;
  className?: string;
}) {
  if (!proyecto.portada) {
    return <div className={cn("bg-superficie-alta/30", className)} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proyecto.portada}
      alt=""
      className={cn("object-cover", className)}
      loading="lazy"
    />
  );
}

/**
 * Datos que se revelan al pasar el mouse.
 *
 * La descripción es lo único que separa las dos tarjetas: la de proyecto son
 * imagen, título, etiquetas y servicios, y recién la destacada suma el texto.
 *
 * Las etiquetas van al pie —`mt-auto`— porque en la maqueta cierran la tarjeta:
 * el alto no cambia entre reposo y hover, así que si el detalle se apila
 * debajo del título queda un hueco muerto abajo.
 */
function Detalle({
  proyecto,
  conDescripcion,
}: {
  proyecto: Proyecto;
  conDescripcion?: boolean;
}) {
  const servicios = proyecto.servicios.map((s) => s.nombre).join(" · ");

  return (
    <div className="flex h-full flex-col gap-5 pt-4">
      {conDescripcion && proyecto.desafio ? (
        <p className="text-p3 line-clamp-3 text-blanco/60">
          {proyecto.desafio}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-wrap items-center gap-2">
          {proyecto.cliente ? (
            <ChipCliente>{proyecto.cliente.nombre}</ChipCliente>
          ) : null}
          {proyecto.sector ? (
            <ChipSector nombre={proyecto.sector.nombre} />
          ) : null}
        </span>
        {servicios ? (
          <span className="text-p3 text-blanco/40">{servicios}</span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Tarjeta de la grilla de Proyectos y del bloque de destacados.
 *
 * El detalle se despliega con una transición de `grid-template-rows`, que es la
 * forma de animar de alto cero a alto automático sin fijar una altura a mano.
 */
export function CardProyecto({
  proyecto,
  alto,
  destacada,
  className,
}: {
  proyecto: Proyecto;
  /** Alto propio de la pantalla: en las verticales la tarjeta es más baja. */
  alto?: string;
  /**
   * La tarjeta ancha de "Proyectos destacados", que es la única que muestra la
   * descripción. En la angosta el texto no entra y el diseño no lo pide.
   */
  destacada?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn("group block", FOCO, className)}
    >
      <Tarjeta
        className={cn(
          "flex flex-col overflow-hidden",
          PIEL_TARJETA,
          alto ?? ALTO_TARJETA,
        )}
      >
        <Portada
          proyecto={proyecto}
          className={cn(
            "w-full shrink-0 transition-all duration-300",
            ALTO_IMAGEN,
          )}
        />
        <div className="flex flex-1 flex-col justify-start p-6">
          <h3 className="text-h4 line-clamp-2 shrink-0 text-balance">
            {proyecto.nombre}
          </h3>
          {/*
            El detalle se despliega ocupando todo lo que sobra de la tarjeta
            —de ahí el `flex-1`—, así el pie queda abajo en vez de dejar un
            hueco entre las etiquetas y el borde.
          */}
          <div
            className={cn(
              "grid flex-1 grid-rows-[0fr] transition-[grid-template-rows] duration-300",
              "group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <Detalle proyecto={proyecto} conDescripcion={destacada} />
            </div>
          </div>
        </div>
      </Tarjeta>
    </Link>
  );
}

/**
 * Variante siempre desplegada, para cuando el proyecto ocupa el ancho completo
 * y no hay un estado de reposo que valga la pena.
 */
export function CardProyectoDetalle({
  proyecto,
  className,
}: {
  proyecto: Proyecto;
  className?: string;
}) {
  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn("group block", FOCO, className)}
    >
      <Tarjeta className="overflow-hidden transition-colors hover:border-blanco/30">
        <Portada proyecto={proyecto} className="h-56 w-full md:h-[310px]" />
        <div className="p-6">
          <h3 className="text-h4 line-clamp-2 text-balance">
            {proyecto.nombre}
          </h3>
          <Detalle proyecto={proyecto} conDescripcion />
        </div>
      </Tarjeta>
    </Link>
  );
}

/**
 * Fila de proyecto, separada por líneas punteadas. Tiene dos formas:
 *
 *  - `detalle`: título con flecha, servicios y chips al pie. Es la lista de
 *    las verticales en mobile.
 *  - `ultimos`: la tabla "Últimos proyectos". En mobile el chip del sector va
 *    arriba del título con la flecha al lado; en desktop la fila se abre en
 *    columnas —título, chip, servicios y flecha—.
 */
export function FilaProyecto({
  proyecto,
  variante = "detalle",
}: {
  proyecto: Proyecto;
  variante?: "detalle" | "ultimos";
}) {
  const servicios = proyecto.servicios.map((s) => s.nombre).join(" · ");

  if (variante === "ultimos") {
    /*
     * En desktop la fila se abre en columnas —título en mono, chips de cliente
     * y sector, y los servicios detrás de una línea vertical— separadas por
     * punteado blanco al 40%, como la tabla de la maqueta. En mobile queda el
     * chip del sector arriba con la flecha al lado y el título debajo.
     */
    return (
      <Link
        href={`/proyectos/${proyecto.slug}`}
        className={cn(
          "group flex flex-col gap-3 border-b border-dotted border-punteado py-6",
          `transition-colors hover:bg-superficie/50 ${FOCO}`,
          "md:grid md:grid-cols-[minmax(0,1fr)_150px_170px_300px_28px] md:items-center md:gap-4",
        )}
      >
        <span className="flex items-center justify-between md:hidden">
          {proyecto.sector ? (
            <ChipSector nombre={proyecto.sector.nombre} />
          ) : (
            <span />
          )}
          <IconoFlecha className="shrink-0 text-lila transition-transform group-hover:translate-x-1" />
        </span>

        <span className="text-p1 text-balance md:truncate md:text-nowrap">
          {proyecto.nombre}
        </span>

        <span className="hidden self-stretch border-l border-dotted border-punteado md:flex md:items-center md:pl-6">
          {proyecto.cliente ? (
            <ChipCliente>{proyecto.cliente.nombre}</ChipCliente>
          ) : null}
        </span>

        <span className="hidden md:block">
          {proyecto.sector ? (
            <ChipSector nombre={proyecto.sector.nombre} />
          ) : null}
        </span>

        <span className="text-p3 hidden self-stretch border-l border-dotted border-punteado text-blanco/50 md:flex md:items-center md:pl-6">
          {servicios}
        </span>

        <IconoFlecha className="hidden shrink-0 text-blanco/70 transition-transform group-hover:translate-x-1 md:block" />
      </Link>
    );
  }

  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn(
        "group flex flex-col gap-3 border-b border-dotted border-punteado py-6",
        `transition-colors hover:bg-superficie/50 ${FOCO}`,
      )}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-h4 text-balance">{proyecto.nombre}</span>
        <IconoFlecha className="mt-1 shrink-0 text-lila transition-transform group-hover:translate-x-1" />
      </span>

      {servicios ? (
        <span className="text-p2 text-blanco/50">{servicios}</span>
      ) : null}

      <span className="flex flex-wrap items-center gap-3">
        {proyecto.cliente ? (
          <ChipCliente>{proyecto.cliente.nombre}</ChipCliente>
        ) : null}
        {proyecto.sector ? (
          <ChipSector nombre={proyecto.sector.nombre} />
        ) : null}
      </span>
    </Link>
  );
}
