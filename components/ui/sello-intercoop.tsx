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
 * No es una etiqueta apoyada encima: está **prendido al borde de arriba**, con
 * una chapa que asoma por detrás de la tarjeta. El truco es el orden de
 * pintado: la chapa de atrás lleva `-z-10`, y una tarjeta posicionada se dibuja
 * después de los `z-index` negativos, así que la tapa salvo en el pedazo que
 * sobresale. Por eso tiene que vivir **afuera** de la tarjeta: con el
 * `overflow-hidden` de adentro no habría nada que sobresaliera.
 *
 * El dibujo son dos círculos que se superponen —dos cooperativas con una parte
 * en común—, que a este tamaño se lee mejor que cualquier ícono con detalle.
 */
export function SelloIntercoop({
  cooperativas,
  prendido = true,
  className,
}: {
  /** Cuántas cooperativas lo hicieron; va en el texto que aparece al apoyar. */
  cooperativas: number;
  /**
   * Si va prendido al borde de una tarjeta. Con `false` se dibuja solo la
   * pieza de adelante: la chapa de atrás sin un borde que agarrar queda como
   * un halo alrededor, que no significa nada.
   */
  prendido?: boolean;
  className?: string;
}) {
  const T = contenido(useIdioma()).PROYECTOS_PAGINA.sello;

  return (
    <span className={cn("select-none", prendido && "absolute", className)}>
      {/* La chapa de atrás. Asoma unos píxeles por arriba y por los costados;
          de la mitad para abajo la tapa la tarjeta, que es justo lo que hace
          creer que el sello la agarra. */}
      {prendido ? (
        <span
          aria-hidden
          className="absolute -top-2 -right-1.5 -bottom-2 -left-1.5 -z-10 rounded-[14px] bg-[#8a6fbe]"
        />
      ) : null}

      <span
        title={T.explica(cooperativas)}
        className={cn(
          "text-eyebrow relative inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5",
          /* Degradado de arriba hacia abajo y sombra: sin eso es un rectángulo
             plano pegado, y lo que se quiere es que parezca una pieza. */
          "bg-gradient-to-b from-[#e7d6fb] to-[#c9a9ec] text-negro-oscuro",
          "shadow-[0_6px_16px_rgba(16,16,16,0.45)]",
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
    </span>
  );
}
