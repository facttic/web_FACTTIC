"use client";

import { useEffect, useRef, useState } from "react";

/**
 * El comportamiento de una pista que se pasa sola.
 *
 * Vivía dentro de `CarruselConFlechas`, y cuando "Proyectos destacados" de las
 * verticales tuvo que pasar igual, copiarlo habría dejado dos relojes que se
 * van separando con el primer ajuste. Acá está una sola vez: los tiempos, el
 * arranque al llegar a pantalla, la pausa cuando alguien mira, y el estado de
 * las flechas.
 *
 * Lo que cambia entre un carrusel y otro es cuánto avanza cada pasada, que
 * entra por `paso`.
 *
 * El desplazamiento se mide del propio scroll y no de un índice: la pista es
 * scrollable a mano —con el dedo— y un contador propio se desincronizaría.
 */

/** Lo que espera antes de la primera pasada, ya en pantalla. */
const ESPERA_AL_LLEGAR = 2000;
/** Cuánto dura un desplazamiento suave nuestro, para no confundirlo con el dedo. */
const DURA_LA_PASADA = 900;
/** Lo que se queda quieto después de que alguien lo mueve a mano. */
const ESPERA_TRAS_MANO = 4000;
/** Cada cuánto pasa. */
const CADA = 4000;

/** El hueco entre tarjetas, que hay que sumar al ancho de una. */
const HUECO = 20;

/** Una tarjeta por paso: el primer hijo manda la medida. */
export function unaTarjeta(nodo: HTMLElement): number {
  const primero = nodo.firstElementChild as HTMLElement | null;
  return (primero?.offsetWidth ?? nodo.clientWidth) + HUECO;
}

/**
 * Una pantalla por paso. Lo usan los bloques que alternan una tarjeta ancha y
 * una angosta: de a una tarjeta, el par se desalinea y el ritmo de la maqueta
 * —ancha, angosta, ancha— se pierde a la segunda pasada.
 */
export function unaPantalla(nodo: HTMLElement): number {
  return nodo.clientWidth;
}

/*
 * El nombre arranca con `use` aunque el resto esté en español: es parte del
 * contrato de React, que reconoce los hooks por el prefijo.
 */
export function usePista({
  automatico = false,
  paso: cuanto = unaTarjeta,
}: {
  automatico?: boolean;
  /** Cuánto avanza cada pasada. Tiene que ser estable entre renders. */
  paso?: (nodo: HTMLElement) => number;
} = {}) {
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

  const correr = (sentido: 1 | -1) => {
    const nodo = pista.current;
    if (!nodo) return;
    pasadaNuestra.current = performance.now() + DURA_LA_PASADA;
    nodo.scrollBy({ left: sentido * cuanto(nodo), behavior: "smooth" });
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

    /*
     * Donde la pista está oculta no corre nada: un elemento en `display:none`
     * nunca intersecta, así que el bloque que en mobile es una lista de filas
     * no deja relojes andando.
     */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automatico]);

  return { pista, puede, alDesplazar, avanzar };
}
