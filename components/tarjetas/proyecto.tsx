import { Enlace as Link } from "@/components/ui/enlace";
import { ViewTransition } from "react";
import { cn } from "@/lib/cn";
import type { Proyecto } from "@/lib/dominio/tipos";
import { ChipCliente, ChipSector } from "@/components/ui/chip";
import { Tarjeta } from "@/components/ui/seccion";
import { IconoFlecha } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";
import { Inclinar } from "@/components/ui/inclinar";
import { PortadaGenerica } from "@/components/ui/portada-generica";

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
/*
  En mobile es un alto **mínimo** y no fijo. Con alto fijo, un título de dos
  líneas junto a una etiqueta que también ocupa dos —pasa con los clientes de
  nombre largo— empujaba la segunda etiqueta fuera de la caja, y el
  `overflow-hidden` se la comía. En desktop sigue fijo: ahí la tarjeta cambia
  de cara al pasar el mouse y el alto no puede moverse, o la grilla salta.
*/
const ALTO_TARJETA = "min-h-[366px] md:h-[406px]";
/*
  En mobile no hay cara de hover: el board dibuja la tarjeta con la imagen a
  204 y las etiquetas siempre a la vista. Con los 310 de desktop no entraba ni
  el título —dos líneas quedaban cortadas por el borde de abajo—.
*/
const ALTO_IMAGEN =
  "h-[204px] md:h-[310px] md:group-hover:h-[129px] md:group-focus-visible:h-[129px]";
const PIEL_TARJETA =
  "transition-colors duration-300 group-hover:border-borde-pleno group-hover:bg-transparent " +
  "group-focus-visible:border-borde-pleno group-focus-visible:bg-transparent";

function Portada({
  proyecto,
  indice = 0,
  className,
}: {
  proyecto: Proyecto;
  /** Reparte los colores cuando el proyecto no tiene sector cargado. */
  indice?: number;
  className?: string;
}) {
  // Sin foto cargada va la portada de la casa, distinta para cada proyecto.
  if (!proyecto.portada) {
    return <PortadaGenerica nombre={proyecto.slug} className={className} />;
  }

  return (
    /*
     * El nombre lo comparte con la portada del detalle: al abrir el proyecto,
     * una imagen se transforma en la otra en vez de cortar. Va con el
     * componente de React y no con `view-transition-name` en CSS, porque el
     * de CSS solo actúa cuando el navegador cambia de documento y acá la
     * navegación la resuelve el router del lado del cliente.
     *
     * `share="morph"` es lo que le pone la clase al grupo, para poder ajustar
     * la curva y la duración desde `globals.css`.
     */
    <ViewTransition name={`proyecto-${proyecto.slug}`} share="morph">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proyecto.portada}
        alt=""
        className={cn("object-cover", className)}
        loading="lazy"
      />
    </ViewTransition>
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
  className,
}: {
  proyecto: Proyecto;
  conDescripcion?: boolean;
  className?: string;
}) {
  const servicios = proyecto.servicios.map((s) => s.nombre).join(" · ");

  return (
    <div className={cn("flex h-full flex-col gap-5 pt-4", className)}>
      {/* En mobile no: el board deja la tarjeta en título y etiquetas, y con
          la descripción no entra ninguna de las dos. */}
      {conDescripcion && proyecto.desafio ? (
        <p className="text-p3 hidden line-clamp-3 text-blanco/60 md:block">
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
        {/* Solo en desktop: en mobile el board deja las etiquetas solas y no
            hay ancho para la lista de servicios al lado. */}
        {servicios ? (
          <span className="text-p3 hidden text-blanco/40 md:inline">
            {servicios}
          </span>
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
  indice = 0,
  alto,
  destacada,
  caraMobile = "destacada",
  className,
}: {
  proyecto: Proyecto;
  /** Reparte los colores de la portada genérica cuando no hay sector. */
  indice?: number;
  /** Alto propio de la pantalla: en las verticales la tarjeta es más baja. */
  alto?: string;
  /**
   * La tarjeta ancha de "Proyectos destacados", que es la única que muestra la
   * descripción. En la angosta el texto no entra y el diseño no lo pide.
   */
  destacada?: boolean;
  /**
   * En mobile el board dibuja dos tarjetas distintas: la del carrusel de
   * destacados —imagen de 204, título y etiquetas— y la del listado de
   * Proyectos —imagen de 276 y solo el título—. En desktop las dos son la
   * misma y cambian de cara con el mouse.
   */
  caraMobile?: "destacada" | "listado";
  className?: string;
}) {
  const listado = caraMobile === "listado";

  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn("group block", FOCO, className)}
    >
      {/* Se inclina hacia el cursor. En reposo queda plana, así que la grilla
          se sigue viendo como en la maqueta.

          El ángulo es corto por el borde: al pasar el mouse la tarjeta lo
          cambia a blanco pleno, y una línea de 1px con ese contraste, rotada en
          3D, se rasteriza a tramos claros y oscuros. Con seis grados el
          bandeado desaparece; con diez se veía. */}
      {/* `contain-layout` y no `contain-content`: al pasar el mouse cambian el
          alto de la portada y las filas de la grilla interna, que son cálculos
          de layout, y contenerlos evita que el navegador los rehaga para la
          página entera. `content` además recorta lo que se sale de la caja, y
          la tarjeta inclinada se sale: le comía los bordes. */}
      <Inclinar grados={6} className="contain-layout">
        <Tarjeta
          className={cn(
            "flex flex-col overflow-hidden",
            PIEL_TARJETA,
            alto ?? ALTO_TARJETA,
            listado && "min-h-[374px] md:h-[406px]",
          )}
        >
          <Portada
            proyecto={proyecto}
            indice={indice}
            className={cn(
              /* Solo el alto: `transition-all` hacía que el navegador vigilara
                 todas las propiedades de la portada en cada cuadro. */
              "w-full shrink-0 transition-[height] duration-300",
              ALTO_IMAGEN,
              listado && "h-[276px] md:h-[310px]",
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
                "grid flex-1 transition-[grid-template-rows] duration-300",
                // Desplegado de entrada en mobile; en desktop se abre al pasar
                // el mouse.
                "grid-rows-[1fr] md:grid-rows-[0fr]",
                "md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                {/* El listado no muestra etiquetas en mobile: el board deja
                    solo el título debajo de la foto. */}
                <Detalle
                  proyecto={proyecto}
                  conDescripcion={destacada}
                  className={listado ? "hidden md:flex" : undefined}
                />
              </div>
            </div>
          </div>
        </Tarjeta>
      </Inclinar>
    </Link>
  );
}

/**
 * Variante siempre desplegada, para cuando el proyecto ocupa el ancho completo
 * y no hay un estado de reposo que valga la pena.
 */
export function CardProyectoDetalle({
  proyecto,
  indice = 0,
  className,
}: {
  proyecto: Proyecto;
  /** Reparte los colores de la portada genérica cuando no hay sector. */
  indice?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn("group block", FOCO, className)}
    >
      <Tarjeta className="overflow-hidden transition-colors hover:border-blanco/30">
        <Portada
          proyecto={proyecto}
          indice={indice}
          className="h-56 w-full md:h-[310px]"
        />
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

        {/* En mobile el board lo escribe en la sans en negrita; en desktop la
            tabla lo lleva en mono, como el resto de la fila. */}
        <span className="text-h4 md:text-p1 text-balance md:truncate md:text-nowrap">
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
