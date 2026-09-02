"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Palabras del vocabulario cooperativo que viajan por el fondo de la Home.
 *
 * Es el "On-Scroll Text Motion" de Codrops (MIT) con su mecánica intacta: cada
 * palabra tiene dos clases de posición y Flip interpola entre las dos a la vez
 * —margen, opacidad y desenfoque—, así que se reacomodan en vez de deslizarse.
 * Son dos animaciones encadenadas: una mientras la palabra sube hasta el centro
 * de la pantalla y otra del centro hacia arriba, que es lo que hace que llegue,
 * se acomode y se vuelva a ir. Al entrar se descifra con ScrambleText.
 *
 * Dos cosas se apartan del demo, por lo que el demo es y esta pantalla no:
 *
 *  - **Sin ScrollSmoother.** El original reemplaza el scroll de la página por
 *    el suyo, y ahí adentro `position: fixed` deja de anclarse a la ventana:
 *    se romperían el encabezado, el menú de mobile y la grilla de fondo. La
 *    suavidad se recupera con `scrub` con retardo, que amortigua el seguimiento
 *    sin tocar cómo scrollea la página.
 *  - **Los grupos se reparten por toda la altura.** En el demo las palabras son
 *    el contenido y se apilan; acá son fondo de una pantalla que mide varias
 *    veces la ventana, así que apilarlas las dejaba a todas en el primer tramo
 *    —detrás del hero y con su recorrido ya consumido antes de que la página
 *    terminara de cargar—. Van distribuidas, y por eso cada una se cruza con
 *    una sección distinta.
 *
 * Va de fondo y es decoración: `aria-hidden`, detrás de todo y sin recibir
 * eventos. Con `prefers-reduced-motion` no se anima nada.
 */

/**
 * Un grupo por tramo de la Home. `de` y `a` son las clases entre las que viaja
 * cada palabra; están en `globals.css` con los mismos valores del demo.
 */
const GRUPOS = [
  [
    { texto: "cooperativismo", de: "pal-pos-4", a: "pal-pos-2" },
    { texto: "software libre", de: "pal-pos-4", a: "pal-pos-2" },
  ],
  [
    { texto: "intercooperación", de: "pal-pos-1", a: "pal-pos-3" },
    { texto: "trabajo asociado", de: "pal-pos-1", a: "pal-pos-3" },
  ],
  [
    { texto: "código abierto", de: "pal-pos-3", a: "pal-pos-2" },
    { texto: "conocimiento libre", de: "pal-pos-3", a: "pal-pos-2" },
  ],
  [
    { texto: "autogestión", de: "pal-pos-2", a: "pal-pos-4" },
    { texto: "ayuda mutua", de: "pal-pos-2", a: "pal-pos-4" },
  ],
  [
    { texto: "soberanía tecnológica", de: "pal-pos-1", a: "pal-pos-3" },
    { texto: "el código es de todas", de: "pal-pos-1", a: "pal-pos-3" },
  ],
] as const;

export function PalabrasDeFondo({ className }: { className?: string }) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let vivo = true;
    let limpiar: (() => void) | undefined;

    /*
     * GSAP se carga aparte del bundle de la página: esto es decoración y no
     * tiene por qué demorar lo que se lee. Si la carga falla, las palabras
     * quedan en su posición de partida y no pasa nada.
     */
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { Flip }, { ScrambleTextPlugin }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/Flip"),
          import("gsap/ScrambleTextPlugin"),
        ]);
      if (!vivo) return;
      gsap.registerPlugin(ScrollTrigger, Flip, ScrambleTextPlugin);

      const propios: InstanceType<typeof ScrollTrigger>[] = [];

      for (const el of nodo.querySelectorAll<HTMLElement>(".pal-el")) {
        const origen = [...el.classList].find((c) => c.startsWith("pal-pos-"));
        const destino = el.dataset.altPos;
        if (!origen || !destino) continue;

        /*
         * El estado de llegada se captura como en el demo: se cambia la clase,
         * se mide y se vuelve a la de partida antes de que el navegador pinte.
         * `props` es lo que hace que la opacidad y el desenfoque viajen con la
         * posición en vez de saltar.
         */
        el.classList.add(destino);
        el.classList.remove(origen);
        const estado = Flip.getState(el, { props: "opacity,filter" });
        el.classList.add(origen);
        el.classList.remove(destino);

        const ease = "expo.inOut";

        const ida = Flip.to(estado, {
          ease,
          scrollTrigger: {
            trigger: el,
            start: "clamp(top bottom)",
            end: "clamp(center center)",
            scrub: 0.8,
          },
        });

        const vuelta = Flip.from(estado, {
          ease,
          scrollTrigger: {
            trigger: el,
            start: "clamp(center center)",
            end: "clamp(bottom top)",
            scrub: 0.8,
          },
        });

        for (const tl of [ida, vuelta]) {
          const st = tl?.scrollTrigger;
          if (st) propios.push(st);
        }

        const texto = el.textContent ?? "";
        propios.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            once: true,
            onEnter: () =>
              gsap.fromTo(
                el,
                { scrambleText: { text: "", chars: "" } },
                {
                  duration: 1.1,
                  scrambleText: {
                    text: texto,
                    chars: "upperAndLowerCase",
                    revealDelay: 0.3,
                  },
                },
              ),
          }),
        );
      }

      limpiar = () => propios.forEach((st) => st.kill());
    })();

    return () => {
      vivo = false;
      limpiar?.();
    };
  }, []);

  return (
    <div
      ref={caja}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/*
        `justify-between` con la altura completa reparte los grupos por toda la
        Home: apilados quedaban todos en el primer tramo. El primero arranca
        debajo del hero, que ocupa la pantalla entera y los taparía.
      */}
      <div className="flex h-full flex-col justify-between pt-[100vh] pb-[20vh]">
        {GRUPOS.map((grupo, i) => (
          <div key={i} className="flex flex-col">
            {grupo.map((p) => (
              <div
                key={p.texto}
                className={cn("pal-el text-display text-blanco/[0.07]", p.de)}
                data-alt-pos={p.a}
              >
                {p.texto}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
