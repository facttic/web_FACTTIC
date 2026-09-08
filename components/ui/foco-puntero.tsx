"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Halo que sigue al dedo o al cursor dentro de la tarjeta que lo contiene.
 *
 * Es el "Spotlight Card" que pide la anotación del archivo sobre las tarjetas
 * de sector. Se dibuja como una capa más adentro de la tarjeta, así que no hace
 * falta envolver nada: se cuelga del elemento que lo contiene —que ya es
 * `relative` y recorta— y escucha ahí.
 *
 * Escucha eventos de puntero y no de mouse, que son los únicos que llegan
 * también desde una pantalla táctil: con el dedo apoyado el halo lo acompaña y
 * al levantarlo se apaga.
 */
export function FocoPuntero({
  /** Diámetro del halo. */
  radio = 220,
  className,
}: {
  radio?: number;
  className?: string;
}) {
  const capa = useRef<HTMLSpanElement>(null);
  const [encendido, setEncendido] = useState(false);

  useEffect(() => {
    const nodo = capa.current?.parentElement;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pedido = 0;
    let x = 0;
    let y = 0;
    const pintar = () => {
      pedido = 0;
      capa.current?.style.setProperty("--foco-x", `${x}px`);
      capa.current?.style.setProperty("--foco-y", `${y}px`);
    };

    const alMover = (e: PointerEvent) => {
      const r = nodo.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };
    const encender = (e: PointerEvent) => {
      alMover(e);
      setEncendido(true);
    };
    const apagar = () => setEncendido(false);

    nodo.addEventListener("pointerenter", encender);
    nodo.addEventListener("pointerdown", encender);
    nodo.addEventListener("pointermove", alMover);
    nodo.addEventListener("pointerleave", apagar);
    nodo.addEventListener("pointercancel", apagar);
    nodo.addEventListener("pointerup", apagar);
    return () => {
      nodo.removeEventListener("pointerenter", encender);
      nodo.removeEventListener("pointerdown", encender);
      nodo.removeEventListener("pointermove", alMover);
      nodo.removeEventListener("pointerleave", apagar);
      nodo.removeEventListener("pointercancel", apagar);
      nodo.removeEventListener("pointerup", apagar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return (
    <span
      ref={capa}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300",
        encendido ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        background: `radial-gradient(${radio}px circle at var(--foco-x, 50%) var(--foco-y, 50%), rgb(242 242 242 / 0.12), transparent 70%)`,
      }}
    />
  );
}
