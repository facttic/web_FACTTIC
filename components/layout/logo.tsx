import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

/**
 * Logo FACT[TIC].
 *
 * Es el archivo del diseño, no texto: el wordmark usa una tipografía propia que
 * no es ninguna de las dos del sitio, así que componerlo con Inter no daba igual.
 *
 * Se exportó del archivo de Figma a 4x. Convendría reemplazarlo por el SVG
 * original cuando diseño lo entregue —en el archivo también está insertado como
 * imagen, así que hay que pedirlo aparte.
 */

/** Proporción del archivo: 352 × 89. */
const ANCHO = 88;
const ALTO = 22;

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="FACTTIC — inicio"
      className={cn(
        "inline-block transition-opacity hover:opacity-70",
        FOCO,
        className,
      )}
    >
      <Image
        src="/marca/logo-facttic.png"
        alt="FACTTIC"
        width={ANCHO}
        height={ALTO}
        priority
        className="h-[22px] w-auto"
      />
    </Link>
  );
}
