"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

/**
 * Un texto cortado a unos renglones, con "Leer más" para ver el resto.
 *
 * El botón aparece **solo si el texto se corta de verdad**. Es la diferencia
 * entre que sirva y que moleste: la mayoría de las cooperativas escribe dos
 * frases, y un "Leer más" abajo de dos frases es una promesa vacía. Para
 * saberlo hay que medir en el browser —comparar el alto real contra el
 * recortado—, no se puede resolver al dibujar.
 *
 * El recorte va en `style` y no en una clase de Tailwind porque la cantidad de
 * renglones entra por parámetro, y una clase no puede ser variable.
 */
export function TextoRecortado({
  children,
  lineas = 4,
  mas,
  menos,
  className,
}: {
  children: React.ReactNode;
  /** Cuántos renglones se ven plegado. */
  lineas?: number;
  mas: string;
  menos: string;
  className?: string;
}) {
  const parrafo = useRef<HTMLParagraphElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [desborda, setDesborda] = useState(false);

  useEffect(() => {
    /* Solo se mide plegado: desplegado el alto real y el visible coinciden, y
       volver a medir ahí daría "no desborda" justo cuando hace falta el botón
       para plegarlo de nuevo. */
    if (abierto) return;
    const nodo = parrafo.current;
    if (!nodo) return;

    const medir = () => setDesborda(nodo.scrollHeight > nodo.clientHeight + 1);
    medir();
    /* Al cambiar el ancho cambia cuánto entra por renglón: un texto que se
       corta en un teléfono puede no cortarse en desktop. */
    const observador = new ResizeObserver(medir);
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [abierto, children]);

  return (
    <div className={className}>
      <p
        ref={parrafo}
        style={
          abierto
            ? undefined
            : {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: lineas,
                overflow: "hidden",
              }
        }
      >
        {children}
      </p>

      {desborda ? (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          className={cn(
            "text-p3 mt-2 cursor-pointer text-blanco/60 underline-offset-4",
            "transition-colors hover:text-blanco hover:underline",
            FOCO,
          )}
        >
          {abierto ? menos : mas}
        </button>
      ) : null}
    </div>
  );
}
