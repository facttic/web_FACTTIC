import Image from "next/image";
import { Enlace as Link } from "@/components/ui/enlace";
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
  /**
   * A dónde lleva. Con `null` se dibuja sin enlace: es el caso del pie, donde
   * ir a la Home ya lo cubre el logo de la barra de arriba y el enlace competía
   * con los cinco toques del arcoíris —el primero se llevaba a quien lo
   * intentaba antes del segundo—.
   */
  href?: string | null;
}) {
  const marca = (
    <Image
      src="/marca/logo-facttic.png"
      alt="FACTTIC"
      width={ANCHO}
      height={ALTO}
      priority
      className="h-[22px] w-auto"
    />
  );

  if (!href) {
    return <span className={cn("inline-block", className)}>{marca}</span>;
  }

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
      {marca}
    </Link>
  );
}
