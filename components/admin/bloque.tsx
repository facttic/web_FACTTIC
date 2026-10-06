import { cn } from "@/lib/cn";

/**
 * Un tramo del formulario, con su título.
 *
 * Los formularios del panel son largos —una cooperativa tiene datos, ubicación,
 * imagen, servicios y quién puede editarla— y antes iban como una lista de
 * campos repartida en dos columnas: la derecha quedaba casi vacía y no se
 * entendía qué iba con qué. Agrupar en bloques devuelve esa jerarquía: cada uno
 * dice de qué se trata y se completa de arriba abajo.
 *
 * En pantalla grande el título y su ayuda se corren a una columna propia a la
 * izquierda y los campos ocupan el resto: así el ancho se usa de verdad en vez
 * de dejar media pantalla vacía, y de un vistazo se ve qué bloques tiene la
 * ficha sin leer campo por campo.
 */
export function Bloque({
  titulo,
  ayuda,
  accion,
  children,
  className,
}: {
  titulo: string;
  ayuda?: string;
  /** Un botón propio del bloque, como "Agregar proyecto". */
  accion?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-x-12 gap-y-5 rounded-xl border border-borde bg-superficie/30 p-7",
        "lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-p1-bold">{titulo}</h2>
        {ayuda ? <p className="text-p3 mt-2 text-blanco/55">{ayuda}</p> : null}
        {accion ? <div className="mt-4">{accion}</div> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}

/** La pila de bloques de un formulario, a todo el ancho que haya. */
export function Bloques({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

/** Dos campos cortos en la misma fila, cuando se leen juntos. */
export function Par({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
