'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Acordeón de una sola apertura, como en "Nuestras soluciones" y en el detalle
 * de proyecto ("Desafío / Solución / Resultado"): el ítem abierto muestra una
 * flecha hacia arriba y el resto hacia abajo.
 *
 * Se construye con <button> y aria-expanded en vez de <details> porque el
 * diseño exige que abrir uno cierre los demás.
 */

export interface ItemAcordeon {
  id: string
  titulo: string
  contenido: ReactNode
}

export function Acordeon({
  items,
  inicial = 0,
  className,
}: {
  items: ItemAcordeon[]
  /** Índice abierto al montar; null para arrancar todo cerrado. */
  inicial?: number | null
  className?: string
}) {
  const [abierto, setAbierto] = useState<string | null>(
    inicial === null ? null : (items[inicial]?.id ?? null)
  )
  const baseId = useId()

  return (
    <div className={cn('divide-y divide-borde border-y border-borde', className)}>
      {items.map((item) => {
        const estaAbierto = abierto === item.id
        const panelId = `${baseId}-${item.id}`

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onClick={() => setAbierto(estaAbierto ? null : item.id)}
                className={cn(
                  'text-h4 flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left',
                  'transition-colors hover:text-blanco/70',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila'
                )}
              >
                {item.titulo}
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className={cn(
                    'size-5 shrink-0 transition-transform duration-200',
                    estaAbierto && 'rotate-180'
                  )}
                >
                  <path
                    d="M10 4v12M5 11l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div id={panelId} hidden={!estaAbierto} className="text-p1 pb-6 text-blanco/70">
              {item.contenido}
            </div>
          </div>
        )
      })}
    </div>
  )
}
