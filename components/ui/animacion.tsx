"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Reproductor de las animaciones Lottie que entregó diseño.
 *
 * Son decorativas, así que se cargan con cuidado de no penalizar la página:
 *   - el motor de Lottie llega por import dinámico, fuera del bundle inicial;
 *   - el JSON se pide recién cuando la animación asoma en pantalla;
 *   - con `prefers-reduced-motion` no se anima: se muestra el primer fotograma.
 *
 * Los archivos viven en `public/animaciones/`. Los de sector deberían pasar a
 * servirse desde la API cuando el backend cargue el campo `lottieFileName`, que
 * el modelo ya tiene.
 */

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function Animacion({
  nombre,
  className,
  bucle = true,
}: {
  /** Nombre del archivo en public/animaciones, sin extensión. */
  nombre: string;
  className?: string;
  bucle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [datos, setDatos] = useState<unknown>(null);
  const [visible, setVisible] = useState(false);

  // Solo se pide el JSON cuando la animación está por entrar en pantalla.
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelado = false;

    fetch(`/animaciones/${nombre}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelado) setDatos(json);
      })
      .catch(() => {
        // Es decorativa: si no carga, el hueco queda vacío y no rompe nada.
      });

    return () => {
      cancelado = true;
    };
  }, [visible, nombre]);

  const menosMovimiento =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden>
      {datos ? (
        <Lottie
          animationData={datos}
          loop={bucle && !menosMovimiento}
          autoplay={!menosMovimiento}
          className="size-full"
        />
      ) : null}
    </div>
  );
}
