"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useMenosMovimiento } from "@/lib/movimiento";

/**
 * Los pasos de la metodología, contados con el scroll.
 *
 * El bloque se queda fijo en pantalla mientras se avanza, y cada paso se
 * enciende cuando le toca su tramo. A diferencia del revelado —que pasa
 * mientras el bloque sube y se termina antes de que uno lo mire—, acá el scroll
 * deja de mover la página y pasa a mover el contenido: es imposible no notarlo.
 *
 * El pin lo hace `position: sticky`, o sea el navegador; lo único que calcula
 * este componente es en qué tramo va, y solo lee `getBoundingClientRect` del
 * contenedor —una medición por cuadro, sobre un elemento— dentro del callback
 * del scroll.
 *
 * Con `prefers-reduced-motion` no hay pin ni tramos: los pasos se listan uno
 * abajo del otro, todos encendidos.
 */
export function PasosFijos({
  pasos,
  className,
}: {
  pasos: readonly { titulo: string; descripcion: string }[];
  className?: string;
}) {
  const marco = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const quieto = useMenosMovimiento();

  useEffect(() => {
    if (quieto) return;

    const nodo = marco.current;
    if (!nodo) return;
    let pedido = 0;

    const medir = () => {
      pedido = 0;
      const r = nodo.getBoundingClientRect();
      // Cuánto se recorrió del bloque, de 0 a 1, descontando la pantalla que
      // ocupa el contenido fijo.
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const avance = Math.min(Math.max(-r.top / total, 0), 0.999);
      setActivo(Math.floor(avance * pasos.length));
    };

    const alScrollear = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };

    // La primera medición va en el cuadro siguiente y no acá: llamarla en el
    // cuerpo del efecto sería fijar estado durante el render.
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [pasos.length, quieto]);

  if (quieto) {
    return (
      <div className={cn("grid gap-10 md:grid-cols-3", className)}>
        {pasos.map((paso, i) => (
          <div key={paso.titulo}>
            <p className="text-display text-blanco/30">
              {String(i + 1).padStart(2, "0")}.
            </p>
            <p className="text-h4 mt-4">{paso.titulo}</p>
            <p className="text-p2 mt-3 text-blanco/60">{paso.descripcion}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    // El alto reservado es lo que da recorrido: una pantalla por paso.
    <div
      ref={marco}
      className={className}
      style={{ height: `${(pasos.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <div className="grid gap-8 md:grid-cols-[160px_1fr] md:gap-16">
          {/* El número grande cambia con el tramo. */}
          <p className="text-display text-lila tabular-nums">
            {String(activo + 1).padStart(2, "0")}.
          </p>

          <div className="grid">
            {pasos.map((paso, i) => (
              <div
                key={paso.titulo}
                aria-hidden={i !== activo}
                className={cn(
                  "col-start-1 row-start-1 transition-all duration-500",
                  i === activo
                    ? "translate-y-0 opacity-100 blur-none"
                    : "pointer-events-none translate-y-6 opacity-0 blur-[3px]",
                )}
              >
                <p className="text-h1 text-balance">{paso.titulo}</p>
                <p className="text-p1 mt-6 max-w-xl text-blanco/70">
                  {paso.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* La barra de avance: la única parte que se mueve de forma continua. */}
        <div className="mt-16 flex gap-2">
          {pasos.map((paso, i) => (
            <span
              key={paso.titulo}
              className={cn(
                "h-0.5 flex-1 transition-colors duration-500",
                i <= activo ? "bg-lila" : "bg-borde",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
