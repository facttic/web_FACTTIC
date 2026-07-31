import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Sector } from '@/lib/dominio/tipos'

/**
 * Tarjetas de sector (Organizaciones, Agro, Financiero).
 *
 * En el diseño aparecen de dos formas: la de Home y Servicios, con la
 * ilustración arriba y el número y el nombre abajo; y la de la grilla de
 * verticales, con el título grande, un separador y "Ver más".
 */

const FLECHA = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 shrink-0">
    <path
      d="M4 10h12M11 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Ilustración del sector, o un marcador si todavía no está cargada. */
function Ilustracion({ sector }: { sector: Sector }) {
  if (!sector.imagen) {
    return <div className="aspect-square w-full rounded-lg bg-superficie-alta/30" />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sector.imagen}
      alt=""
      className="aspect-square w-full rounded-lg object-cover"
      loading="lazy"
    />
  )
}

export function CardSector({
  sector,
  indice,
  href,
  className,
}: {
  sector: Sector
  indice: number
  href?: string
  className?: string
}) {
  const contenido = (
    <>
      <Ilustracion sector={sector} />
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <span className="text-h4">{String(indice + 1).padStart(2, '0')}.</span>
        <span className="text-h4">{sector.nombre}</span>
      </div>
    </>
  )

  const clases = cn(
    'block rounded-xl border border-borde bg-superficie p-4 transition-colors',
    href && 'hover:border-blanco/30',
    className
  )

  return href ? (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  ) : (
    <div className={clases}>{contenido}</div>
  )
}

/**
 * Variante con la propuesta de valor del sector y enlace al detalle, como en la
 * grilla de verticales de "Nuestros servicios".
 */
export function CardSectorDetalle({
  titulo,
  href,
  etiqueta = 'Ver más',
  className,
}: {
  titulo: ReactNode
  href: string
  etiqueta?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col justify-between rounded-xl border border-borde bg-superficie p-6',
        'transition-colors hover:border-blanco/30',
        className
      )}
    >
      <p className="text-h3 text-balance">{titulo}</p>
      <div className="mt-10">
        <div className="border-t border-borde" />
        <div className="text-p3 mt-4 flex items-center justify-between text-blanco/70 transition-colors group-hover:text-blanco">
          {etiqueta}
          {FLECHA}
        </div>
      </div>
    </Link>
  )
}
