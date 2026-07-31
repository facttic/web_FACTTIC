import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Campos de formulario, según la pantalla de Contacto: etiqueta arriba en
 * mono chico, control con borde sutil y fondo apenas más claro que la superficie.
 */

const CONTROL =
  'w-full rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-3 text-p2 text-blanco ' +
  'placeholder:text-blanco/30 transition-colors ' +
  'focus:border-blanco/40 focus:outline-2 focus:outline-offset-2 focus:outline-lila ' +
  'disabled:opacity-40 aria-[invalid=true]:border-rojo'

function Etiqueta({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-p3 mb-2 block text-blanco/70">
      {children}
    </label>
  )
}

function Error({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-p3 mt-2 text-rojo">
      {children}
    </p>
  )
}

export function Campo({
  id,
  etiqueta,
  error,
  className,
  ...props
}: { id: string; etiqueta: string; error?: string } & ComponentProps<'input'>) {
  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={CONTROL}
        {...props}
      />
      {error ? <Error id={`${id}-error`}>{error}</Error> : null}
    </div>
  )
}

export function CampoTexto({
  id,
  etiqueta,
  error,
  className,
  ...props
}: { id: string; etiqueta: string; error?: string } & ComponentProps<'textarea'>) {
  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <textarea
        id={id}
        rows={5}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(CONTROL, 'resize-y')}
        {...props}
      />
      {error ? <Error id={`${id}-error`}>{error}</Error> : null}
    </div>
  )
}

/**
 * Select de filtro (Sectores, Servicios, Tecnologías en la grilla de Proyectos).
 * Usa un <select> nativo para que funcione sin JavaScript y sea navegable con
 * teclado; el chevron se dibuja encima.
 */
export function Selector({
  id,
  etiqueta,
  children,
  className,
  ...props
}: { id: string; etiqueta: string } & ComponentProps<'select'>) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <select
        id={id}
        className={cn(CONTROL, 'cursor-pointer appearance-none pr-10')}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-blanco/50"
      >
        <path
          d="M5 8l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
