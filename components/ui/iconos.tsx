import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Iconos del sistema.
 *
 * Están acá y no repetidos en cada componente porque la flecha aparece en las
 * tarjetas, en los enlaces, en las filas de proyecto y en los carruseles: si
 * cambia el trazo, cambia en un solo lugar.
 *
 * Son trazos propios sobre una grilla de 20 (24 para las redes) para no sumar
 * una librería de iconos por unas pocas formas.
 */

type IconoProps = ComponentProps<"svg">;

function Svg({ className, children, ...props }: IconoProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

const TRAZO = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function IconoFlecha({
  direccion = "derecha",
  ...props
}: IconoProps & {
  direccion?: "derecha" | "izquierda" | "abajo" | "arriba";
}) {
  const trazos = {
    derecha: "M4 10h12M11 5l5 5-5 5",
    izquierda: "M16 10H4M9 5l-5 5 5 5",
    abajo: "M10 4v12M5 11l5 5 5-5",
    arriba: "M10 16V4M5 9l5-5 5 5",
  };

  return (
    <Svg {...props}>
      <path d={trazos[direccion]} {...TRAZO} />
    </Svg>
  );
}

export function IconoChevron({ ...props }: IconoProps) {
  return (
    <Svg {...props}>
      <path d="M5 8l5 5 5-5" {...TRAZO} />
    </Svg>
  );
}

export function IconoUbicacion({ className, ...props }: IconoProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-3.5 shrink-0", className)}
      {...props}
    >
      <path
        d="M8 1.8a4.2 4.2 0 00-4.2 4.2c0 3.15 4.2 8.2 4.2 8.2s4.2-5.05 4.2-8.2A4.2 4.2 0 008 1.8z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconoMenu({
  abierto = false,
  className,
  ...props
}: IconoProps & { abierto?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-6", className)}
      {...props}
    >
      <path
        d={abierto ? "M6 6l12 12M18 6L6 18" : "M3 7h18M3 12h18M3 17h18"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
