/**
 * Acentos de color para las tarjetas que van pintadas.
 *
 * Las clases se escriben completas y no se arman por interpolación, porque
 * Tailwind necesita verlas literales en el código para generarlas.
 *
 * El color de texto lo decide el contraste: sobre los tonos claros va el negro
 * y solo el azul lleva texto blanco. El naranja aparece en el diseño con ambos;
 * se usa negro, que es el que pasa contraste AA.
 */

export type Acento =
  "lila" | "celeste" | "naranja" | "amarillo" | "verde" | "rojo" | "azul";

/**
 * Variante al pasar el mouse, para las tarjetas que se pintan recién en hover.
 *
 * Va con `hover:` y no con `group-hover:` porque se aplica sobre el mismo
 * elemento que lleva la clase `group`: `group-hover` solo alcanza a los
 * descendientes, así que ahí no pintaba nada. Las capas de adentro sí usan
 * `group-hover` para cruzarse en opacidad.
 *
 * Está escrito como clases completas porque Tailwind necesita verlas literales
 * en el código y no puede armarlas concatenando el prefijo.
 */
export const HOVER_ACENTO: Record<Acento, string> = {
  lila: "hover:bg-lila hover:text-negro-oscuro",
  celeste: "hover:bg-celeste hover:text-negro-oscuro",
  naranja: "hover:bg-naranja hover:text-negro-oscuro",
  amarillo: "hover:bg-amarillo hover:text-negro-oscuro",
  verde: "hover:bg-verde hover:text-negro-oscuro",
  rojo: "hover:bg-rojo hover:text-negro-oscuro",
  azul: "hover:bg-azul hover:text-blanco",
};

export const FONDO_ACENTO: Record<Acento, string> = {
  lila: "bg-lila text-negro-oscuro",
  celeste: "bg-celeste text-negro-oscuro",
  naranja: "bg-naranja text-negro-oscuro",
  amarillo: "bg-amarillo text-negro-oscuro",
  verde: "bg-verde text-negro-oscuro",
  rojo: "bg-rojo text-negro-oscuro",
  azul: "bg-azul text-blanco",
};

/**
 * Los mismos rellenos, pero recién desde el breakpoint de escritorio. Sirven
 * cuando una maqueta mobile deja la pieza sin color y la de desktop la pinta,
 * como la segunda tarjeta de "Elegí tu camino" en Sumá tu coop: las clases van
 * escritas enteras porque Tailwind lee el código fuente y no las armaría por
 * concatenación.
 */
export const FONDO_ACENTO_DESKTOP: Record<Acento, string> = {
  lila: "md:bg-lila md:text-negro-oscuro",
  celeste: "md:bg-celeste md:text-negro-oscuro",
  naranja: "md:bg-naranja md:text-negro-oscuro",
  amarillo: "md:bg-amarillo md:text-negro-oscuro",
  verde: "md:bg-verde md:text-negro-oscuro",
  rojo: "md:bg-rojo md:text-negro-oscuro",
  azul: "md:bg-azul md:text-blanco",
};

/** Secuencia con la que el diseño alterna colores en las grillas. */
export const CICLO_ACENTOS: Acento[] = [
  "lila",
  "celeste",
  "naranja",
  "amarillo",
  "verde",
  "azul",
];

export function acentoPorIndice(indice: number): Acento {
  return CICLO_ACENTOS[indice % CICLO_ACENTOS.length];
}

/** El acento aplicado al texto, para lo que se pinta sin fondo. */
export const COLOR_ACENTO: Record<Acento, string> = {
  lila: "text-lila",
  celeste: "text-celeste",
  naranja: "text-naranja",
  amarillo: "text-amarillo",
  verde: "text-verde",
  rojo: "text-rojo",
  azul: "text-azul",
};
