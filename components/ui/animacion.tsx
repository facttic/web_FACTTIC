"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/lib/cn";

/**
 * Reproductor de las animaciones Lottie que entregó diseño.
 *
 * Son decorativas, así que se cargan con cuidado de no penalizar la página:
 *   - el motor de Lottie llega por import dinámico, fuera del bundle inicial;
 *   - el JSON se pide recién cuando la animación asoma en pantalla;
 *   - **se pausan al salir de pantalla y siguen al volver**;
 *   - con `prefers-reduced-motion` no se anima: se muestra el primer fotograma.
 *
 * Lo de pausar no es un detalle. Lottie no es un video ni una animación de
 * CSS: redibuja el SVG desde JavaScript en cada cuadro, sobre el hilo
 * principal. Antes el observador se desconectaba después de cargar, así que
 * una vez vistas seguían corriendo para siempre —en la Home son varias— y el
 * hilo quedaba ocupado aunque estuvieras diez pantallas más abajo. Medido
 * arriba de todo, con todas cargadas: 7 cuadros de 240 pasaban de 20ms.
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
  /**
   * En bucle mientras esté en pantalla. Es lo que corresponde a los fondos,
   * que son atmósfera; las ilustraciones de las tarjetas van con `false` para
   * que corran una vez al entrar y de nuevo al pasarles el mouse.
   */
  bucle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lottie = useRef<LottieRefCurrentProps>(null);
  const [datos, setDatos] = useState<unknown>(null);
  /** Ya asomó alguna vez: dispara el pedido del JSON, que se hace una sola. */
  const [cargar, setCargar] = useState(false);
  /** Está a la vista ahora: decide si corre o espera. */
  const [enPantalla, setEnPantalla] = useState(false);

  /* El observador queda escuchando y no se desconecta al primer cruce: hace
     falta para enterarse también de cuándo se fue. */
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        setEnPantalla(entrada.isIntersecting);
        if (entrada.isIntersecting) setCargar(true);
      },
      { rootMargin: "200px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!cargar) return;
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
  }, [cargar, nombre]);

  const menosMovimiento =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /*
   * Sin bucle la animación corre una vez al entrar y vuelve a correr cuando el
   * mouse pasa por encima: la ilustración deja de girar en el vacío y responde
   * a la persona. Además es lo que baja el costo —cuatro Lottie en bucle
   * permanente mantienen el hilo principal despierto todo el tiempo—.
   */
  const reproducir = () => {
    if (menosMovimiento || bucle) return;
    lottie.current?.goToAndPlay(0);
  };

  /* Corre solo mientras se ve. */
  useEffect(() => {
    const api = lottie.current;
    if (!api || !datos) return;
    if (enPantalla && !menosMovimiento) api.play();
    else api.pause();
  }, [enPantalla, datos, menosMovimiento]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      aria-hidden
      onMouseEnter={reproducir}
    >
      {datos ? (
        <Lottie
          lottieRef={lottie}
          animationData={datos}
          loop={bucle && !menosMovimiento}
          autoplay={!menosMovimiento}
          className="size-full"
        />
      ) : null}
    </div>
  );
}
