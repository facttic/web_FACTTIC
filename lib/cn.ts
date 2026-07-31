import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Los estilos tipográficos del design system se llaman `text-h1`, `text-p1`,
 * etc. Sin declararlos, tailwind-merge los confunde con clases de color y hace
 * que, por ejemplo, `text-p3` pise a `text-negro-oscuro` y el botón sólido
 * quede con texto blanco sobre fondo blanco.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'h3', 'h4', 'p1', 'p2', 'p3', 'eyebrow'] },
      ],
    },
  },
})

/** Une clases resolviendo los conflictos de Tailwind (la última gana). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
