"use client";

import { useEffect, useRef, useState } from "react";
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
 */
export function CarruselConFlechas({ children, ...resto }: PropsCarrusel) {
  const pista = useRef<HTMLDivElement>(null);
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

  const avanzar = (sentido: 1 | -1) => {
    const nodo = pista.current;
    if (!nodo) return;
    // Un ancho de tarjeta por toque: el primer hijo manda la medida.
    const paso =
      (nodo.firstElementChild as HTMLElement | null)?.offsetWidth ??
      nodo.clientWidth;
    nodo.scrollBy({ left: sentido * (paso + 20), behavior: "smooth" });
  };

  return (
    <>
      <div ref={pista} onScroll={medir} className={clasesCarrusel(resto)}>
        {children}
      </div>
      <div className="mt-6 flex justify-end gap-2 md:hidden">
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
