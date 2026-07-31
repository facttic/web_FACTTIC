"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Animaciones de texto pedidas en los comentarios del diseño.
 *
 * Las dos respetan `prefers-reduced-motion`: si la persona pidió menos
 * movimiento, el texto aparece completo de entrada. Y en ambos casos el texto
 * está siempre entero en el DOM —expuesto con `aria-label` o sin ocultar— para
 * que un lector de pantalla y los buscadores lo lean completo desde el inicio,
 * sin importar la animación.
 */

function prefiereMenosMovimiento(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Efecto máquina de escribir. Arranca después de `retrasoMs`, que en la Home
 * sirve para que el título entre unos segundos más tarde que el video.
 */
export function Typewriter({
  texto,
  retrasoMs = 0,
  velocidadMs = 45,
  className,
}: {
  texto: string;
  retrasoMs?: number;
  velocidadMs?: number;
  className?: string;
}) {
  const [visibles, setVisibles] = useState(0);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      setVisibles(texto.length);
      return;
    }

    setAnimar(true);
    const inicio = window.setTimeout(() => {
      const paso = window.setInterval(() => {
        setVisibles((n) => {
          if (n >= texto.length) {
            window.clearInterval(paso);
            return n;
          }
          return n + 1;
        });
      }, velocidadMs);
    }, retrasoMs);

    return () => window.clearTimeout(inicio);
  }, [texto, retrasoMs, velocidadMs]);

  // Sin JS o con menos movimiento, se ve el texto completo desde el principio.
  const mostrado = animar ? texto.slice(0, visibles) : texto;
  const terminado = !animar || visibles >= texto.length;

  /*
   * Las dos capas van superpuestas en la misma celda de la grilla: la de abajo
   * es el texto completo invisible, que reserva desde el inicio la altura de
   * las tres líneas finales. Sin eso el título crece mientras se escribe y
   * empuja al resto del hero.
   */
  return (
    <span
      aria-label={texto}
      className={cn("grid whitespace-pre-line", className)}
    >
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {texto}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden>
        {mostrado}
        {!terminado ? (
          <span className="animate-latido ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.05em] bg-current align-baseline" />
        ) : null}
      </span>
    </span>
  );
}

/**
 * Revelado al entrar en pantalla: el contenido sube y toma nitidez.
 *
 * Se dispara una sola vez, cuando el bloque asoma en el viewport.
 */
export function RevelarAlScroll({
  children,
  retrasoMs = 0,
  className,
}: {
  children: ReactNode;
  retrasoMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      setVisible(true);
      return;
    }

    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${retrasoMs}ms` }}
      className={cn(
        "transition-[opacity,filter,transform] duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100 blur-none"
          : "translate-y-4 opacity-0 blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
