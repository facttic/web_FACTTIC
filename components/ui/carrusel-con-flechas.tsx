"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { clasesCarrusel, type PropsCarrusel } from "@/components/ui/carrusel";
import { BotonFlecha } from "@/components/ui/boton";

/**
 * El carrusel con un par de flechas debajo, alineadas a la derecha.
 *
 * En el board mobile los proyectos de la Home se pasan así y no con un botón
 * de "ver todos": una tarjeta a la vista y las flechas para moverse. En
 * desktop el bloque pasa a grilla y las flechas sobran, así que se ocultan.
 *
 * El desplazamiento se mide del propio scroll y no de un índice: la pista es
 * scrollable a mano —con el dedo— y un contador propio se desincronizaría.
 *
 * Con `automatico` se pasa solo, con las mismas reglas que la cinta del
 * Consejo: empieza recién cuando el bloque está a la vista, espera un momento
 * antes de la primera pasada, y se queda quieto mientras el puntero está
 * encima, mientras algo de adentro tiene el foco y un rato después de que
 * alguien lo haya movido a mano.
 */

/** Lo que espera antes de la primera pasada, ya en pantalla. */
const ESPERA_AL_LLEGAR = 2000;
/** Lo que se queda quieto después de que alguien lo mueve a mano. */
const ESPERA_TRAS_MANO = 8000;
/** Cada cuánto pasa una tarjeta. */
const CADA = 4000;

export function CarruselConFlechas({
  automatico = false,
  children,
  ...resto
}: PropsCarrusel & { automatico?: boolean }) {
  // Donde la pista sigue siendo carrusel en desktop, las flechas también.
  const siempre = resto.desdeAncho === "nunca";
  const pista = useRef<HTMLDivElement>(null);
  const esperaHasta = useRef(0);
  const [puede, setPuede] = useState({ atras: false, adelante: true });

  const medir = () => {
    const nodo = pista.current;
    if (!nodo) return;
    const sobra = nodo.scrollWidth - nodo.clientWidth;
    setPuede({
      atras: nodo.scrollLeft > 4,
      adelante: nodo.scrollLeft < sobra - 4,
    });
  };

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  /** Una tarjeta por paso: el primer hijo manda la medida. */
  const correr = (sentido: 1 | -1) => {
    const nodo = pista.current;
    if (!nodo) return;
    const paso =
      (nodo.firstElementChild as HTMLElement | null)?.offsetWidth ??
      nodo.clientWidth;
    nodo.scrollBy({ left: sentido * (paso + 20), behavior: "smooth" });
  };

  const avanzar = (sentido: 1 | -1) => {
    esperaHasta.current = performance.now() + ESPERA_TRAS_MANO;
    correr(sentido);
  };

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo || !automatico) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let aLaVista = false;
    let reloj: ReturnType<typeof setInterval> | undefined;

    const paso = () => {
      if (!aLaVista || performance.now() < esperaHasta.current) return;
      // Leerlo del DOM evita escuchar cuatro eventos para saber lo mismo.
      if (nodo.matches(":hover") || nodo.matches(":focus-within")) return;

      // Al llegar al final vuelve al principio en vez de quedarse trabado.
      const sobra = nodo.scrollWidth - nodo.clientWidth;
      if (nodo.scrollLeft >= sobra - 4) {
        nodo.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      correr(1);
    };

    const enPantalla = new IntersectionObserver(
      ([entrada]) => {
        aLaVista = entrada.isIntersecting;
        if (aLaVista && !reloj) {
          // Se lo ve quieto un momento antes de que empiece a pasar solo.
          esperaHasta.current = Math.max(
            esperaHasta.current,
            performance.now() + ESPERA_AL_LLEGAR,
          );
          reloj = setInterval(paso, CADA);
        } else if (!aLaVista && reloj) {
          clearInterval(reloj);
          reloj = undefined;
        }
      },
      // Con la mitad a la vista: asomando apenas por el borde todavía no se lee.
      { threshold: 0.5 },
    );
    enPantalla.observe(nodo);

    return () => {
      enPantalla.disconnect();
      if (reloj) clearInterval(reloj);
    };
  }, [automatico]);

  /** Moverlo a mano —con el dedo o la rueda— también lo deja quieto un rato. */
  const aMano = () => {
    if (automatico) esperaHasta.current = performance.now() + ESPERA_TRAS_MANO;
  };

  return (
    <>
      <div
        ref={pista}
        onScroll={medir}
        onPointerDown={aMano}
        onWheel={aMano}
        className={clasesCarrusel(resto)}
      >
        {children}
      </div>
      <div
        className={cn(
          "mt-6 flex justify-end gap-2",
          siempre ? null : "md:hidden",
        )}
      >
        <BotonFlecha
          direccion="anterior"
          disabled={!puede.atras}
          onClick={() => avanzar(-1)}
        />
        <BotonFlecha
          direccion="siguiente"
          variante={puede.adelante ? "solida" : "punteada"}
          disabled={!puede.adelante}
          onClick={() => avanzar(1)}
        />
      </div>
    </>
  );
}
