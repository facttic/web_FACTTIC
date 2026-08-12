"use client";

import { useSyncExternalStore } from "react";

/**
 * ¿La persona pidió menos movimiento en su sistema?
 *
 * Se lee con `useSyncExternalStore` y no con un efecto: la preferencia es
 * estado que vive afuera de React, y leerla en un efecto obliga a renderizar
 * dos veces —una con movimiento y otra sin— además de disparar el aviso de
 * "setState dentro de un efecto".
 *
 * En el servidor se asume que hay movimiento, que es lo que ve la mayoría; si
 * la preferencia está puesta, el primer render en el browser ya la respeta.
 *
 * La mayoría de los casos no necesita este hook: `motion-reduce:` de Tailwind
 * resuelve lo mismo en CSS y sin JavaScript. Queda para cuando la preferencia
 * cambia la estructura y no solo el estilo, como el bloque de pasos, que sin
 * movimiento deja de fijarse en pantalla y pasa a ser una lista.
 */
const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribir(alCambiar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

/*
 * El nombre arranca con `use` aunque el resto del código esté en español: es
 * parte del contrato de React —el linter reconoce los hooks por el prefijo y
 * sin él no valida las reglas—, no una elección de idioma.
 */
export function useMenosMovimiento(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
