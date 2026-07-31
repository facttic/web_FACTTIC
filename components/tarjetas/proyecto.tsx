import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Proyecto } from "@/lib/dominio/tipos";
import { Chip, ChipSector } from "@/components/ui/chip";
import { Tarjeta } from "@/components/ui/seccion";
import { IconoFlecha } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";

/**
 * Tarjetas y filas de proyecto.
 *
 * La tarjeta tiene dos estados, como en el prototipo: en reposo se ve la imagen
 * grande con el título, y al pasar el mouse la imagen se achica para dejar
 * lugar a la descripción, el cliente, el sector y los servicios. La altura
 * total no cambia, así que la grilla no se mueve.
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

/** Alto de la tarjeta y de su imagen en reposo, medidos sobre el prototipo. */
const ALTO_TARJETA = "h-[385px]";
const ALTO_IMAGEN =
  "h-[310px] group-hover:h-[150px] group-focus-visible:h-[150px]";

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

/** Datos que se revelan al pasar el mouse. */
function Detalle({ proyecto }: { proyecto: Proyecto }) {
  const servicios = proyecto.servicios.map((s) => s.nombre).join(" · ");

  return (
    <div className="space-y-5 pt-4">
      {proyecto.desafio ? (
        <p className="text-p3 line-clamp-3 text-blanco/60">
          {proyecto.desafio}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-wrap items-center gap-2">
          {proyecto.cliente ? <Chip>{proyecto.cliente.nombre}</Chip> : null}
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
      <Tarjeta
        className={cn(
          "flex flex-col overflow-hidden transition-colors hover:border-blanco/30",
          ALTO_TARJETA,
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
          <h3 className="text-h4 line-clamp-2 text-balance">
            {proyecto.nombre}
          </h3>
          <div
            className={cn(
              "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300",
              "group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]",
            )}
          >
            <div className="overflow-hidden">
              <Detalle proyecto={proyecto} />
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
          <Detalle proyecto={proyecto} />
        </div>
      </Tarjeta>
    </Link>
  );
}

/**
 * Fila de la tabla "Últimos proyectos". En mobile el diseño apila los datos;
 * en desktop se despliegan en columnas separadas por líneas punteadas.
 */
export function FilaProyecto({ proyecto }: { proyecto: Proyecto }) {
  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className={cn(
        "group flex flex-col gap-4 border-b border-dashed border-borde py-5",
        `transition-colors hover:bg-superficie/50 ${FOCO}`,
        "md:flex-row md:items-center md:gap-6",
      )}
    >
      <span className="text-p2 line-clamp-2 flex-1 md:pr-6">
        {proyecto.nombre}
      </span>

      <span className="flex flex-wrap items-center gap-3 md:w-72 md:shrink-0">
        {proyecto.cliente ? <Chip>{proyecto.cliente.nombre}</Chip> : null}
        {proyecto.sector ? (
          <ChipSector nombre={proyecto.sector.nombre} />
        ) : null}
      </span>

      <span className="text-p3 text-blanco/40 md:w-72 md:shrink-0">
        {proyecto.servicios.map((s) => s.nombre).join(" · ")}
      </span>

      <IconoFlecha className="hidden transition-transform group-hover:translate-x-1 md:block" />
    </Link>
  );
}
