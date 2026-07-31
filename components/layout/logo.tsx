import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Wordmark FACT[TIC].
 *
 * Provisorio: está compuesto tipográficamente hasta que se exporte el logo real
 * en SVG desde Figma. Se centraliza acá para que ese reemplazo sea un solo
 * cambio y no toque header, pie ni metadatos.
 */
export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="FACTTIC — inicio"
      className={cn(
        'text-h4 font-sans tracking-tight text-blanco transition-opacity hover:opacity-70',
        className
      )}
    >
      FACT<span className="font-normal">[</span>TIC<span className="font-normal">]</span>
    </Link>
  )
}
