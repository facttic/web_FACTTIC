"use client";

import { cn } from "@/lib/cn";
import { contenido } from "@/lib/contenido";
import { useIdioma } from "@/lib/idioma-cliente";

/**
 * El sello de los proyectos hechos entre varias cooperativas.
 *
 * Es lo que distingue a una federación de un directorio: para un proyecto
 * grande se arma un equipo entre varias en vez de competir por él. Siete de
 * los veintiocho proyectos publicados son así, y hasta ahora no se notaba sin
 * abrir cada uno.
 *
 * No es una etiqueta apoyada encima: va **montado sobre el borde de arriba**,
 * medio adentro y medio afuera. Por eso tiene que vivir fuera de la tarjeta:
 * con el `overflow-hidden` de adentro no habría nada que sobresaliera.
 *
 * Llegó a tener una chapa oscura asomando por detrás, para que pareciera que
 * agarra la tarjeta de los dos lados. Se sacó: a este tamaño no se leía como
 * una pieza atrás sino como un halo sucio alrededor del sello.
 *
 * El dibujo son dos círculos que se superponen —dos cooperativas con una parte
 * en común—, que a este tamaño se lee mejor que cualquier ícono con detalle.
 */
export function SelloIntercoop({
  cooperativas,
  className,
}: {
  /** Cuántas cooperativas lo hicieron; va en el texto que aparece al apoyar. */
  cooperativas: number;
  /** De dónde cuelga. Las tarjetas lo mandan montado sobre su borde de arriba. */
  className?: string;
}) {
  const T = contenido(useIdioma()).PROYECTOS_PAGINA.sello;

  return (
    <span
      title={T.explica(cooperativas)}
      className={cn(
        "text-eyebrow inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5",
        /* Degradado de arriba hacia abajo y sombra: sin eso es un rectángulo
           plano pegado, y lo que se quiere es que parezca una pieza. */
        "bg-gradient-to-b from-[#e7d6fb] to-[#c9a9ec] text-negro-oscuro select-none",
        "shadow-[0_6px_16px_rgba(16,16,16,0.45)]",
        className,
      )}
    >
      <svg viewBox="0 0 20 12" aria-hidden className="h-3 w-5 shrink-0">
        <circle
          cx="7"
          cy="6"
          r="4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="13"
          cy="6"
          r="4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      {T.intercoop}
    </span>
  );
}
