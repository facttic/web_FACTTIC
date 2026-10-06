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
        "grid gap-x-10 gap-y-5 rounded-xl border border-borde bg-superficie/30 p-6",
        "lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-p1-bold">{titulo}</h2>
        {ayuda ? <p className="text-p3 mt-2 text-blanco/40">{ayuda}</p> : null}
        {accion ? <div className="mt-4">{accion}</div> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}

/**
 * La pila de bloques de un formulario.
 *
 * Con tope de ancho: un campo de texto de mil pixeles no se lee mejor, se lee
 * peor. El tope es ancho igual —entran dos campos cómodos por fila— y en una
 * pantalla grande el bloque usa todo ese espacio.
 */
export function Bloques({ children }: { children: React.ReactNode }) {
  return <div className="flex max-w-7xl flex-col gap-5">{children}</div>;
}

/** Dos campos cortos en la misma fila, cuando se leen juntos. */
export function Par({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
