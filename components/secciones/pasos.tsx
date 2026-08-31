import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Acordeon, type ItemAcordeon } from "@/components/ui/acordeon";

/**
 * Pasos numerados de la metodología intercoop.
 *
 * En desktop van en tres columnas, con el número grande y tenue arriba, la
 * línea y el texto debajo. En mobile la maqueta los convierte en un acordeón
 * —"01 / Nos contás tu necesidad" con la flecha— así que ahí se arma con el
 * componente de acordeón en vez de apilar las tres columnas.
 *
 * Los tres entran en cascada y la línea de cada uno se dibuja de izquierda a
 * derecha: es un proceso ordenado y el movimiento lo dice. La línea va un paso
 * atrás de su bloque —`--i` corrido en uno— así que el número llega primero y
 * la línea se apoya debajo, en vez de aparecer ya puesta.
 */
export function Pasos({
  pasos,
  className,
}: {
  pasos: readonly { titulo: string; descripcion: string }[];
  className?: string;
}) {
  const items: ItemAcordeon[] = pasos.map((paso, i) => ({
    id: paso.titulo,
    titulo: `${String(i + 1).padStart(2, "0")} / ${paso.titulo}`,
    contenido: paso.descripcion,
  }));

  return (
    <>
      {/* En la maqueta las líneas del acordeón son punteadas y en Gris oscuro. */}
      <Acordeon
        items={items}
        className={cn(
          "divide-dashed divide-gris-oscuro border-gris-oscuro md:hidden",
          className,
        )}
      />

      <ol className={cn("hidden gap-8 md:grid md:grid-cols-3", className)}>
        {pasos.map((paso, i) => (
          <li
            key={paso.titulo}
            className="revelar-al-entrar"
            style={{ "--i": i } as CSSProperties}
          >
            <p className="text-h1 text-blanco/20">
              {String(i + 1).padStart(2, "0")}.
            </p>
            <div
              className="crecer-al-entrar mt-4 border-t border-borde"
              style={{ "--i": i + 1 } as CSSProperties}
            />
            <h3 className="text-h4 mt-5">{paso.titulo}</h3>
            <p className="text-p2 mt-3 text-blanco/60">{paso.descripcion}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
