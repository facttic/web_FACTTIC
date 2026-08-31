import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Una fila que se desplaza sola, recortada a su contenedor.
 *
 * La animación recorre media cinta y vuelve a empezar, así que **cada mitad
 * tiene que ser más ancha que el contenedor**: si no, al llegar al salto queda
 * un hueco y las tarjetas parecen desaparecer y reaparecer. Por eso la lista se
 * repite hasta cubrir `anchoMinimo` antes de duplicarse.
 *
 * La duración se calcula sobre lo que mide media cinta en vez de fijarse: con
 * un tiempo fijo, sumar tarjetas haría la vuelta más rápida y el ritmo
 * cambiaría solo. Se detiene al pasar el mouse, al enfocar con teclado y con
 * `prefers-reduced-motion`.
 *
 * Con pocas tarjetas no se mueve nada: una cinta que no llega a llenar el
 * ancho es puro movimiento sin motivo. El corte lo pone `minimoParaMover`.
 *
 * La banda de aliados no usa esto: va de punta a punta de la pantalla y no
 * recortada a una columna, y sus logos no necesitan detenerse para leerse.
 */
export function Cinta<T>({
  items,
  clave,
  children,
  anchoItem,
  separacion = 20,
  minimoParaMover,
  anchoMinimo = 1600,
  velocidad = 40,
  className,
  etiqueta,
}: {
  items: readonly T[];
  clave: (item: T) => string;
  /** Cómo se dibuja cada tarjeta. */
  children: (item: T) => ReactNode;
  /** Lo que mide cada tarjeta, para saber cuánto repetir y cuánto tarda. */
  anchoItem: number;
  /** Separación entre tarjetas: va al `gap` y al cálculo, así no se desfasan. */
  separacion?: number;
  /** Con esta cantidad o menos, la fila queda quieta. */
  minimoParaMover: number;
  /** Lo que tiene que cubrir cada mitad de la cinta. */
  anchoMinimo?: number;
  /** Píxeles por segundo. Lento como para leer una tarjeta al pasar. */
  velocidad?: number;
  className?: string;
  etiqueta?: string;
}) {
  if (!items.length) return null;

  const gap = `${separacion}px`;

  if (items.length <= minimoParaMover) {
    return (
      <ul
        aria-label={etiqueta}
        className={cn("flex", className)}
        style={{ gap }}
      >
        {items.map((item) => (
          <li key={clave(item)} className="shrink-0">
            {children(item)}
          </li>
        ))}
      </ul>
    );
  }

  const anchoPasada = items.length * (anchoItem + separacion);
  const pasadas = Math.ceil(anchoMinimo / anchoPasada);
  const vueltas = Array.from({ length: pasadas * 2 }, (_, i) => i);
  const segundos = Math.round((pasadas * anchoPasada) / velocidad);

  return (
    // `min-w-0` porque suele ser hijo de un grid, y sin eso el track se estira
    // al ancho de la cinta en vez de recortarla.
    <div className={cn("min-w-0 overflow-hidden", className)}>
      <ul
        aria-label={etiqueta}
        className="animate-marquesina marquesina-detenible flex w-max motion-reduce:animate-none"
        style={{ animationDuration: `${segundos}s`, gap }}
      >
        {vueltas.map((vuelta) =>
          items.map((item) => (
            <li
              key={`${vuelta}-${clave(item)}`}
              // Solo la primera pasada se anuncia; el resto es repetición.
              aria-hidden={vuelta > 0 || undefined}
              className="shrink-0"
            >
              {children(item)}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
