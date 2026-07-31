"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que cuenta hasta su valor al entrar en pantalla.
 *
 * Lo pide la anotación "Animación de conteo" sobre el componente Red contador
 * del board de Figma.
 *
 * El valor final está siempre en el DOM vía `aria-label`, así que un lector de
 * pantalla anuncia "+500" y no la cuenta regresiva. Con `prefers-reduced-motion`
 * el número aparece directamente en su valor final.
 */
export function Contador({
  valor,
  prefijo = "",
  duracionMs = 1600,
}: {
  valor: number;
  prefijo?: string;
  duracionMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [actual, setActual] = useState(valor);
  const [arrancado, setArrancado] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || arrancado) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActual(valor);
      return;
    }

    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();
      setArrancado(true);

      const inicio = performance.now();
      const paso = (ahora: number) => {
        const avance = Math.min((ahora - inicio) / duracionMs, 1);
        // Desaceleración cúbica: arranca rápido y frena al llegar.
        const suave = 1 - Math.pow(1 - avance, 3);
        setActual(Math.round(valor * suave));
        if (avance < 1) requestAnimationFrame(paso);
      };

      setActual(0);
      requestAnimationFrame(paso);
    });

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [valor, duracionMs, arrancado]);

  return (
    <span ref={ref} aria-label={`${prefijo}${valor}`}>
      <span aria-hidden>
        {prefijo}
        {actual}
      </span>
    </span>
  );
}
