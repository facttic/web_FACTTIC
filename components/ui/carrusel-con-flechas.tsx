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
 * Con `automatico` se pasa solo: empieza dos segundos después de que el bloque
 * queda a la vista, pasa una tarjeta cada cuatro, y se queda quieto mientras el
 * puntero está encima, mientras algo de adentro tiene el foco y un rato después
 * de que alguien lo haya movido a mano. Es la forma en que pasan todos los
 * carruseles del sitio.
 */

/** Lo que espera antes de la primera pasada, ya en pantalla. */
const ESPERA_AL_LLEGAR = 2000;
/** Cuánto dura un desplazamiento suave nuestro, para no confundirlo con el dedo. */
const DURA_LA_PASADA = 900;
/** Lo que se queda quieto después de que alguien lo mueve a mano. */
const ESPERA_TRAS_MANO = 4000;
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
  /* Hasta cuándo los `scroll` que lleguen son nuestros y no de la persona. */
  const pasadaNuestra = useRef(0);
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

  /**
   * Movimiento a mano: lo deja quieto un rato para no pelearle a quien está
   * mirando.
   *
   * Se detecta del `scroll` de la pista y no del puntero ni de la rueda, que
   * era el error: bajar la página con el dedo o con la rueda **sobre** el
   * carrusel disparaba los dos, así que llegar a la sección ya contaba como
   * haberlo tocado y lo dejaba esperando antes de la primera pasada. El scroll
   * horizontal, en cambio, solo ocurre si de verdad lo movieron —o si lo
   * movimos nosotros, y eso lo marca `pasadaNuestra`—.
   */
  const alDesplazar = () => {
    medir();
    if (automatico && performance.now() > pasadaNuestra.current) {
      esperaHasta.current = performance.now() + ESPERA_TRAS_MANO;
    }
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
    pasadaNuestra.current = performance.now() + DURA_LA_PASADA;
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
    let arranque: ReturnType<typeof setTimeout> | undefined;
    let reloj: ReturnType<typeof setInterval> | undefined;

    const paso = () => {
      if (!aLaVista || performance.now() < esperaHasta.current) return;
      // Leerlo del DOM evita escuchar cuatro eventos para saber lo mismo.
      if (nodo.matches(":hover") || nodo.matches(":focus-within")) return;

      // Al llegar al final vuelve al principio en vez de quedarse trabado.
      const sobra = nodo.scrollWidth - nodo.clientWidth;
      if (nodo.scrollLeft >= sobra - 4) {
        pasadaNuestra.current = performance.now() + DURA_LA_PASADA;
        nodo.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      correr(1);
    };

    const detener = () => {
      if (arranque) clearTimeout(arranque);
      if (reloj) clearInterval(reloj);
      arranque = undefined;
      reloj = undefined;
    };

    const enPantalla = new IntersectionObserver(
      ([entrada]) => {
        aLaVista = entrada.isIntersecting;
        if (!aLaVista) return detener();
        if (arranque || reloj) return;
        /*
         * La primera pasada va con su propio reloj y no esperando al primer
         * tic del intervalo: con el intervalo solo, se lo veía quieto los
         * cuatro segundos del paso antes de moverse por primera vez. Así se
         * mueve a los dos, que es lo que se pidió, y después sigue cada CADA.
         */
        arranque = setTimeout(() => {
          arranque = undefined;
          paso();
          reloj = setInterval(paso, CADA);
        }, ESPERA_AL_LLEGAR);
      },
      // Con la mitad a la vista: asomando apenas por el borde todavía no se lee.
      { threshold: 0.5 },
    );
    enPantalla.observe(nodo);

    return () => {
      enPantalla.disconnect();
      detener();
    };
  }, [automatico]);

  return (
    <>
      <div ref={pista} onScroll={alDesplazar} className={clasesCarrusel(resto)}>
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
