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

export type Acento = 'lila' | 'celeste' | 'naranja' | 'amarillo' | 'verde' | 'rojo' | 'azul'

export const FONDO_ACENTO: Record<Acento, string> = {
  lila: 'bg-lila text-negro-oscuro',
  celeste: 'bg-celeste text-negro-oscuro',
  naranja: 'bg-naranja text-negro-oscuro',
  amarillo: 'bg-amarillo text-negro-oscuro',
  verde: 'bg-verde text-negro-oscuro',
  rojo: 'bg-rojo text-negro-oscuro',
  azul: 'bg-azul text-blanco',
}

/** Secuencia con la que el diseño alterna colores en las grillas. */
export const CICLO_ACENTOS: Acento[] = ['lila', 'celeste', 'naranja', 'amarillo', 'verde', 'azul']

export function acentoPorIndice(indice: number): Acento {
  return CICLO_ACENTOS[indice % CICLO_ACENTOS.length]
}
