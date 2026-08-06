import Link from "next/link";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { NOVEDADES } from "@/lib/contenido";
import type { Novedad } from "@/lib/dominio/tipos";

/**
 * Tarjeta de novedad: la imagen arriba, el título debajo y el tipo al pie.
 *
 * La imagen se acerca al pasar el mouse, que es lo que piden las tres
 * anotaciones del archivo ("Animación: Zoom in en la img"). El recorte lo hace
 * el contenedor, así que la tarjeta no cambia de tamaño.
 */
export function CardNovedad({
  novedad,
  className,
}: {
  novedad: Novedad;
  className?: string;
}) {
  return (
    <Link
      href={`/novedades/${novedad.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-superficie",
        "transition-colors hover:bg-superficie-alta",
        FOCO,
        className,
      )}
    >
      <div className="overflow-hidden">
        {novedad.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={novedad.imagen}
            alt=""
            loading="lazy"
            className="aspect-[443/196] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Sin imagen queda el hueco en gris, con la misma proporción, para
          // que la grilla no se descuadre.
          <div className="aspect-[443/196] w-full bg-gris-oscuro" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-h4 text-balance">{novedad.titulo}</h3>
        <p className="text-eyebrow mt-auto text-blanco/40">
          {NOVEDADES.solapas[novedad.tipo]}
        </p>
      </div>
    </Link>
  );
}
