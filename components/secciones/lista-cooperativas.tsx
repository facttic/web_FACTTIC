import Link from "next/link";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import type { Referencia } from "@/lib/dominio/tipos";

/**
 * Las cooperativas que integran la Federación, en columnas y por orden
 * alfabético.
 *
 * La anotación del archivo pide que "linkee a la página de cada coop", pero la
 * API todavía no guarda el sitio de cada una (`PENDIENTES`). Mientras tanto,
 * cada nombre lleva a Nuestra Red, que es donde se la puede ubicar; en cuanto
 * exista el campo se cambia el `href` y nada más.
 */
export function ListaCooperativas({
  cooperativas,
  className,
}: {
  cooperativas: Referencia[];
  className?: string;
}) {
  const ordenadas = [...cooperativas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es"),
  );

  /*
   * Columnas de CSS y no una grilla: la maqueta lee cada columna hacia abajo
   * —Abrapalabra, ALT, Animus…— y una grilla las ordenaría a lo ancho. Los
   * renglones van cada 18px, medidos sobre el archivo.
   */
  return (
    <ul
      className={cn(
        "columns-2 gap-x-8 text-[0px] md:columns-4 md:gap-x-16",
        className,
      )}
    >
      {ordenadas.map((cooperativa) => (
        <li key={cooperativa.id} className="h-[18px]">
          <Link
            href="/nuestra-red"
            className={cn(
              "text-p2 inline-block text-blanco underline decoration-blanco/30 underline-offset-4",
              "transition-colors hover:decoration-blanco",
              FOCO,
            )}
          >
            {cooperativa.nombre}
          </Link>
        </li>
      ))}
    </ul>
  );
}
