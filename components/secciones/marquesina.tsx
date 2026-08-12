"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Banda con el lema desplazándose, como en la Home ("Nuestro código es
 * cooperar"). El texto se repite para que el recorrido no muestre huecos.
 *
 * No va a velocidad fija: **la marca el scroll**. En reposo se desplaza sola,
 * despacio; al bajar acelera y al subir se da vuelta. Es lo que convierte una
 * banda decorativa en algo que responde a la persona que está leyendo.
 *
 * Está escrita a mano y no con una librería de animación por una cuestión de
 * peso: son cuarenta líneas contra los 36 KB que sumaba traer Motion entero
 * para esto. El bucle solo escribe `transform` sobre un nodo —nunca lee el
 * DOM—, así que no hay medición forzada y el navegador lo compone sin tocar
 * layout.
 *
 * La animación se detiene si la persona pidió menos movimiento en su sistema:
 * un texto grande cruzando la pantalla es justo lo que esa preferencia busca
 * evitar.
 */
export function Marquesina({
  texto,
  velocidad = 22,
  className,
}: {
  texto: string;
  /** Píxeles por segundo en reposo, sin scroll de por medio. */
  velocidad?: number;
  className?: string;
}) {
  const repeticiones = Array.from({ length: 4 });
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let sentido = 1;
    /** Cuánto empuja el scroll ahora mismo, y hacia dónde. */
    let empuje = 0;
    let anterior = performance.now();
    let scrollAnterior = window.scrollY;
    let vuelta = 0;
    let pedido = 0;

    // El ancho de una repetición se mide una sola vez por tamaño de ventana:
    // dentro del bucle sería una lectura de layout en cada cuadro.
    const medir = () => {
      vuelta = nodo.scrollWidth / repeticiones.length;
    };
    medir();

    const tic = (ahora: number) => {
      const delta = Math.min(ahora - anterior, 100);
      anterior = ahora;

      const dy = window.scrollY - scrollAnterior;
      scrollAnterior = window.scrollY;

      /*
       * El empuje del scroll se acota y se suaviza: sin el tope, una rueda
       * fuerte manda el texto a una velocidad ilegible; sin el suavizado, cada
       * clic de la rueda se siente como un tirón. Al dejar de scrollear vuelve
       * solo a cero y la banda retoma su marcha lenta.
       */
      const objetivo = Math.max(-5, Math.min(5, dy / 6));
      empuje += (objetivo - empuje) * 0.1;

      // Pasado cierto punto el scroll no solo acelera: invierte el sentido.
      if (empuje < -0.6) sentido = -1;
      else if (empuje > 0.6) sentido = 1;

      if (vuelta) {
        x -= sentido * velocidad * (1 + Math.abs(empuje)) * (delta / 1000);
        // El contenido está repetido cuatro veces: al recorrer uno, vuelve al
        // principio y el salto no se ve.
        if (x <= -vuelta) x += vuelta;
        if (x > 0) x -= vuelta;
        nodo.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      }

      pedido = requestAnimationFrame(tic);
    };

    pedido = requestAnimationFrame(tic);
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(pedido);
      window.removeEventListener("resize", medir);
    };
  }, [velocidad, repeticiones.length]);

  return (
    <div
      className={cn("overflow-hidden py-10 md:py-16", className)}
      aria-hidden
    >
      <div ref={pista} className="flex w-max gap-8 will-change-transform">
        {repeticiones.map((_, i) => (
          <span
            key={i}
            className="text-display shrink-0 whitespace-nowrap text-blanco/10"
          >
            {texto} /
          </span>
        ))}
      </div>
    </div>
  );
}
