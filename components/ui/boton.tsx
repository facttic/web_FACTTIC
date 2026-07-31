import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Botón del sistema.
 *
 * La variante `punteada` es la que domina el sitio: casi todos los CTA del
 * diseño ("Trabajá con FACTTIC", "Ver todos", "Sumate a FACTTIC") usan borde
 * punteado sobre fondo transparente, y al pasar el mouse se rellenan.
 */

type Variante = 'punteada' | 'solida' | 'contorno' | 'sutil' | 'acento'
type Tamano = 'sm' | 'md'

const VARIANTES: Record<Variante, string> = {
  punteada:
    'border border-dashed border-blanco/50 text-blanco hover:border-solid hover:bg-blanco hover:text-negro-oscuro',
  solida: 'bg-blanco text-negro-oscuro hover:bg-blanco/85',
  contorno: 'border border-blanco/60 text-blanco hover:bg-blanco hover:text-negro-oscuro',
  sutil: 'bg-superficie-alta/60 text-blanco hover:bg-superficie-alta',
  acento: 'border border-naranja text-naranja hover:bg-naranja hover:text-negro-oscuro',
}

const TAMANOS: Record<Tamano, string> = {
  sm: 'h-9 px-4 text-p3',
  md: 'h-11 px-5 text-p3',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-mono whitespace-nowrap ' +
  'transition-colors duration-200 cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila ' +
  'disabled:pointer-events-none disabled:opacity-40'

interface BotonBaseProps {
  variante?: Variante
  tamano?: Tamano
  children: ReactNode
  className?: string
}

export function Boton({
  variante = 'punteada',
  tamano = 'md',
  className,
  ...props
}: BotonBaseProps & ComponentProps<'button'>) {
  return (
    <button
      className={cn(BASE, VARIANTES[variante], TAMANOS[tamano], className)}
      {...props}
    />
  )
}

export function BotonLink({
  variante = 'punteada',
  tamano = 'md',
  className,
  ...props
}: BotonBaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(BASE, VARIANTES[variante], TAMANOS[tamano], className)} {...props} />
  )
}

/**
 * Botón circular de navegación de carrusel. En el diseño, el que no se puede
 * usar queda punteado y el activo va sólido.
 */
export function BotonFlecha({
  direccion,
  className,
  ...props
}: { direccion: 'anterior' | 'siguiente' } & ComponentProps<'button'>) {
  return (
    <button
      aria-label={direccion === 'anterior' ? 'Anterior' : 'Siguiente'}
      className={cn(
        'grid size-11 place-items-center rounded-lg transition-colors duration-200',
        'border border-dashed border-blanco/50 text-blanco cursor-pointer',
        'enabled:hover:border-solid enabled:hover:bg-blanco enabled:hover:text-negro-oscuro',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila',
        'disabled:opacity-30 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
        <path
          d={direccion === 'anterior' ? 'M12 4L6 10l6 6' : 'M8 4l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={direccion === 'anterior' ? 'M6 10h9' : 'M14 10H5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
