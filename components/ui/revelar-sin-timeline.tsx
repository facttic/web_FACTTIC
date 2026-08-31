"use client";

import { useEffect } from "react";

/**
 * Hace que las entradas del sitio también corran donde no hay
 * `animation-timeline: view()`.
 *
 * `revelar-al-entrar` y `crecer-al-entrar` atan su animación al recorrido del
 * elemento por la pantalla, que es CSS puro y no manda nada al bundle. Firefox
 * todavía lo tiene detrás de un flag, así que ahí las dos utilidades quedan sin
 * efecto y el sitio entero se ve quieto —son veinte bloques solo en la Home—.
 *
 * Este componente cubre ese hueco con un `IntersectionObserver` y nada más:
 *
 *  - Donde `view()` existe no hace absolutamente nada, ni siquiera observa.
 *  - El estado inicial —invisible, corrido— lo pone el CSS colgado de
 *    `data-revelar="js"`, que se escribe recién acá. Si el JavaScript no
 *    corre, ese atributo no aparece y el contenido se ve completo y quieto,
 *    igual que hoy: nada queda invisible por un script que no llegó.
 *  - Se desconecta de cada elemento apenas entra. La entrada es una sola vez,
 *    como la de `view()` con `both`.
 *
 * Con `prefers-reduced-motion` no se activa: el CSS ya no anima, y sin el
 * atributo tampoco hay estado inicial que revertir.
 */
export function RevelarSinTimeline() {
  useEffect(() => {
    if (CSS.supports("animation-timeline", "view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const raiz = document.documentElement;
    raiz.dataset.revelar = "js";

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.visible = "";
          observador.unobserve(entrada.target);
        }
      },
      // Un poco antes del borde, para que la entrada arranque mientras sube.
      { rootMargin: "0px 0px -10% 0px" },
    );

    const marcar = () => {
      document
        .querySelectorAll(".revelar-al-entrar, .crecer-al-entrar")
        .forEach((nodo) => {
          if (!(nodo as HTMLElement).dataset.visible) observador.observe(nodo);
        });
    };

    marcar();

    /*
     * El contenido cambia al navegar entre pantallas —el marco se mantiene—,
     * así que hay que volver a barrer cuando aparecen nodos nuevos. Se agrupa
     * por cuadro: abrir un acordeón dispara varias mutaciones seguidas y no
     * tiene sentido recorrer el documento una vez por cada una.
     */
    let pedido = 0;
    const mutaciones = new MutationObserver(() => {
      if (pedido) return;
      pedido = requestAnimationFrame(() => {
        pedido = 0;
        marcar();
      });
    });
    mutaciones.observe(document.body, { childList: true, subtree: true });

    return () => {
      observador.disconnect();
      mutaciones.disconnect();
      if (pedido) cancelAnimationFrame(pedido);
      delete raiz.dataset.revelar;
    };
  }, []);

  return null;
}
