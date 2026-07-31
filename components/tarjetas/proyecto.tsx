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
 * Reciben el proyecto ya adaptado: la portada viene como URL lista para usar y
 * las relaciones ya resueltas, así que acá no hay nada que sepa cómo responde
 * la API.
 */

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

/** Tarjeta de la grilla de Proyectos y del carrusel de destacados. */
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
      className={cn("block", FOCO, className)}
    >
      <Tarjeta className="h-full overflow-hidden transition-colors hover:border-blanco/30">
        <Portada proyecto={proyecto} className="aspect-[16/10] w-full" />
        <div className="p-5">
          <h3 className="text-h4 text-balance">{proyecto.nombre}</h3>
        </div>
      </Tarjeta>
    </Link>
  );
}

/**
 * Variante extendida: suma la descripción, el cliente, el sector y los
 * servicios. Se usa donde el proyecto ocupa el ancho completo.
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
      className={cn("block", FOCO, className)}
    >
      <Tarjeta className="overflow-hidden transition-colors hover:border-blanco/30">
        <Portada proyecto={proyecto} className="aspect-[21/9] w-full" />
        <div className="space-y-5 p-6">
          <h3 className="text-h4 text-balance">{proyecto.nombre}</h3>

          {proyecto.desafio ? (
            <p className="text-p2 line-clamp-3 text-blanco/60">
              {proyecto.desafio}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {proyecto.cliente ? <Chip>{proyecto.cliente.nombre}</Chip> : null}
            {proyecto.sector ? (
              <ChipSector nombre={proyecto.sector.nombre} />
            ) : null}
            {proyecto.servicios.length ? (
              <span className="text-p3 text-blanco/40">
                {proyecto.servicios.map((s) => s.nombre).join(" · ")}
              </span>
            ) : null}
          </div>
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
      <span className="text-p2 flex-1 md:pr-6">{proyecto.nombre}</span>

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
