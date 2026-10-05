"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha } from "@/components/ui/boton";

/**
 * Una fila que se desplaza sola, recortada a su contenedor.
 *
 * **Arranca cuando la cinta entra en pantalla**, no antes: si empieza con la
 * página, para cuando se llega a la sección ya va por la mitad y las primeras
 * tarjetas —en el Consejo, la presidencia— quedaron atrás sin que nadie las
 * viera. Fuera de pantalla también se detiene, que es trabajo para nadie.
 *
 * El movimiento es scroll de verdad y no una animación de CSS: así la fila se
 * puede arrastrar con el dedo, pasar con las flechas y seguir andando sola
 * después. La lista se repite hasta cubrir `anchoMinimo` y después se duplica,
 * y al llegar a la mitad el scroll vuelve atrás esa misma distancia: como las
 * dos mitades son idénticas, el salto no se ve.
 *
 * Se detiene al pasar el mouse, al enfocar con teclado, un rato después de
 * tocar una flecha, y del todo con `prefers-reduced-motion` —ahí quedan las
 * flechas, que es movimiento pedido, no impuesto—.
 *
 * Con pocas tarjetas no se mueve nada: una cinta que no llega a llenar el
 * ancho es puro movimiento sin motivo. El corte lo pone `minimoParaMover`.
 *
 * La banda de aliados no usa esto: va de punta a punta de la pantalla y no
 * recortada a una columna, y sus logos no necesitan detenerse para leerse.
 */

/** Lo que se queda quieta después de tocar una flecha, en milisegundos. */
const ESPERA_TRAS_FLECHA = 1500;

/**
 * Lo que espera antes de arrancar, ya en pantalla. Sin esta pausa la cinta se
 * mueve en el mismo momento en que aparece y la primera tarjeta se va antes de
 * que nadie alcance a leerla.
 */
const ESPERA_AL_LLEGAR = 1200;

export function Cinta<T>({
  items,
  clave,
  children,
  anchoItem,
  separacion = 20,
  minimoParaMover,
  anchoMinimo = 1600,
  velocidad = 40,
  conFlechas = false,
  className,
  etiqueta,
}: {
  items: readonly T[];
  clave: (item: T) => string;
  /** Cómo se dibuja cada tarjeta. */
  children: (item: T) => ReactNode;
  /** Lo que mide cada tarjeta, para saber cuánto repetir y cuánto avanza una flecha. */
  anchoItem: number;
  /** Separación entre tarjetas: va al `gap` y al cálculo, así no se desfasan. */
  separacion?: number;
  /** Con esta cantidad o menos, la fila queda quieta. */
  minimoParaMover: number;
  /** Lo que tiene que cubrir cada mitad de la cinta. */
  anchoMinimo?: number;
  /** Píxeles por segundo. Lento como para leer una tarjeta al pasar. */
  velocidad?: number;
  /** Suma un par de flechas al pie para pasar las tarjetas a mano. */
  conFlechas?: boolean;
  className?: string;
  etiqueta?: string;
}) {
  const pista = useRef<HTMLDivElement>(null);
  /* Momento hasta el que no se mueve sola, porque alguien usó una flecha. */
  const esperaHasta = useRef(0);

  const mueve = items.length > minimoParaMover;

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo || !mueve) return;

    const quieto = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cuadro = 0;
    let anterior = 0;
    let aLaVista = false;

    const paso = (ahora: number) => {
      cuadro = requestAnimationFrame(paso);
      const transcurrido = anterior ? (ahora - anterior) / 1000 : 0;
      anterior = ahora;

      // Al volver a la vista no recupera lo que no avanzó mientras no estaba.
      if (transcurrido > 0.5) return;
      if (quieto || ahora < esperaHasta.current) return;
      // Leerlo del DOM evita escuchar cuatro eventos para saber lo mismo.
      if (nodo.matches(":hover") || nodo.matches(":focus-within")) return;

      nodo.scrollLeft += velocidad * transcurrido;
      const mitad = nodo.scrollWidth / 2;
      if (nodo.scrollLeft >= mitad) nodo.scrollLeft -= mitad;
    };

    const enPantalla = new IntersectionObserver(
      ([entrada]) => {
        aLaVista = entrada.isIntersecting;
        if (aLaVista && !cuadro) {
          anterior = 0;
          // Se la ve quieta un momento antes de que empiece a correr.
          esperaHasta.current = Math.max(
            esperaHasta.current,
            performance.now() + ESPERA_AL_LLEGAR,
          );
          cuadro = requestAnimationFrame(paso);
        } else if (!aLaVista && cuadro) {
          cancelAnimationFrame(cuadro);
          cuadro = 0;
        }
      },
      // Con la mitad a la vista: asomando apenas por el borde todavía no se lee.
      { threshold: 0.5 },
    );
    enPantalla.observe(nodo);

    return () => {
      enPantalla.disconnect();
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [mueve, velocidad]);

  if (!items.length) return null;

  const gap = `${separacion}px`;

  if (!mueve) {
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

  /** Una tarjeta por toque, y vuelta a la otra mitad si está en el principio. */
  const avanzar = (sentido: 1 | -1) => {
    const nodo = pista.current;
    if (!nodo) return;
    esperaHasta.current = performance.now() + ESPERA_TRAS_FLECHA;

    const paso = anchoItem + separacion;
    const mitad = nodo.scrollWidth / 2;
    // Yendo hacia atrás desde el arranque no hay a dónde ir: se salta a la
    // mitad equivalente, que es idéntica, y desde ahí sí se puede retroceder.
    if (sentido === -1 && nodo.scrollLeft < paso) nodo.scrollLeft += mitad;

    nodo.scrollBy({ left: sentido * paso, behavior: "smooth" });
  };

  return (
    /* `min-w-0` en los dos: la cinta suele ser hija de un grid, y sin eso el
       track se estira al ancho del contenido —21.000px en el stack— en vez de
       recortarlo, así que no queda nada que desplazar. */
    <div className={cn("min-w-0", className)}>
      <div ref={pista} className="scroll-limpio min-w-0 overflow-x-auto">
        <ul aria-label={etiqueta} className="flex w-max" style={{ gap }}>
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

      {conFlechas ? (
        <div className="mt-6 flex justify-end gap-2">
          <BotonFlecha
            direccion="anterior"
            aria-label="Anterior"
            onClick={() => avanzar(-1)}
          />
          <BotonFlecha
            direccion="siguiente"
            variante="solida"
            aria-label="Siguiente"
            onClick={() => avanzar(1)}
          />
        </div>
      ) : null}
    </div>
  );
}
