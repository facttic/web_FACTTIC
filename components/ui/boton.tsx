import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";

/**
 * Botón del sistema.
 *
 * La variante `punteada` es la que domina el sitio: casi todos los CTA del
 * diseño ("Trabajá con FACTTIC", "Ver todos", "Sumate a FACTTIC") usan borde
 * punteado sobre fondo transparente, y al pasar el mouse se rellenan.
 */

type Variante = "punteada" | "solida" | "contorno" | "sutil" | "acento";
type Tamano = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  punteada:
    "border border-dashed border-borde-pleno text-blanco hover:border-solid hover:bg-blanco hover:text-negro-oscuro",
  solida: "bg-blanco text-negro-oscuro hover:bg-blanco/85",
  contorno:
    "border border-borde-pleno text-blanco hover:bg-blanco hover:text-negro-oscuro",
  sutil: "bg-superficie-alta/60 text-blanco hover:bg-superficie-alta",
  acento:
    "border border-naranja text-naranja hover:bg-naranja hover:text-negro-oscuro",
};

/**
 * Los botones del diseño miden 53px de alto con texto de 16px: en el SVG del
 * Home los rects van de 134x53 a 247x53, todos con radio 8. `md` es esa
 * medida; `sm` queda para el backoffice, donde un botón de 53px es demasiado.
 */
const TAMANOS: Record<Tamano, string> = {
  sm: "h-9 px-4 text-p3",
  md: "h-[53px] px-6 text-p1-bold",
  // El CTA del hero es el único con texto de 18px: en el SVG mide 247x53 y
  // "Trabajá con FACTTIC" solo llega a ese ancho en P1 regular, no en P1/Bold.
  // En mobile el board lo dibuja más alto, de 60.
  lg: "h-[60px] px-5 text-p1 md:h-[53px]",
};

/** Anillo de foco compartido por todo lo interactivo. */
export const FOCO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-mono whitespace-nowrap " +
  `transition-colors duration-200 cursor-pointer ${FOCO} ` +
  "disabled:pointer-events-none disabled:opacity-40";

interface BotonBaseProps {
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
  className?: string;
}

export function Boton({
  variante = "punteada",
  tamano = "md",
  className,
  ...props
}: BotonBaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(BASE, VARIANTES[variante], TAMANOS[tamano], className)}
      {...props}
    />
  );
}

export function BotonLink({
  variante = "punteada",
  tamano = "md",
  className,
  ...props
}: BotonBaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(BASE, VARIANTES[variante], TAMANOS[tamano], className)}
      {...props}
    />
  );
}

/**
 * Enlace sin caja, solo texto con una flecha. Se usa dentro de tarjetas, donde
 * un botón con borde competiría con el borde de la propia tarjeta.
 */
export function BotonTexto({
  children,
  conFlecha = true,
  className,
  ...props
}: { children: ReactNode; conFlecha?: boolean } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "text-p3 group/enlace inline-flex items-center gap-2 font-mono text-blanco/70",
        `transition-colors hover:text-blanco ${FOCO}`,
        className,
      )}
      {...props}
    >
      {children}
      {conFlecha ? (
        <IconoFlecha className="size-4 transition-transform group-hover/enlace:translate-x-1" />
      ) : null}
    </Link>
  );
}

/**
 * Selector de idioma. Está construido pero no se usa todavía: la v1 sale solo
 * en español porque el contenido de la API no tiene campos por idioma.
 */
export function BotonIdioma({
  idioma,
  activo,
  /** Sobre el bloque de color de las verticales se invierte, para que se lea. */
  sobreColor = false,
  className,
  ...props
}: {
  idioma: string;
  activo: boolean;
  sobreColor?: boolean;
} & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={cn(
        "text-p3 size-10 cursor-pointer rounded-lg font-mono uppercase transition-colors",
        FOCO,
        activo
          ? sobreColor
            ? "bg-negro-oscuro text-blanco"
            : "bg-blanco text-negro-oscuro"
          : sobreColor
            ? "border border-dashed border-negro-oscuro/40 text-negro-oscuro/60 hover:text-negro-oscuro"
            : "border border-dashed border-blanco/40 text-blanco/60 hover:text-blanco",
        className,
      )}
      {...props}
    >
      {idioma}
    </button>
  );
}

/**
 * Botón cuadrado de navegación de carrusel. En el diseño, el que no se puede
 * usar queda punteado y el activo va sólido.
 */
/**
 * La misma flecha, pero como enlace: en Novedades las solapas filtran sin
 * JavaScript, así que las flechas también tienen que ser navegación. Sin
 * `href` queda el mismo aspecto apagado que el botón deshabilitado.
 */
export function BotonFlechaLink({
  direccion,
  href,
  variante = "punteada",
  className,
}: {
  direccion: "anterior" | "siguiente";
  href?: string;
  variante?: "punteada" | "solida";
  className?: string;
}) {
  const aspecto = cn(
    "grid size-13 place-items-center rounded-lg transition-colors duration-200",
    variante === "solida"
      ? "bg-blanco text-negro-oscuro hover:bg-blanco/85"
      : "border border-dashed border-borde-pleno text-blanco hover:border-solid hover:bg-blanco hover:text-negro-oscuro",
    FOCO,
    className,
  );
  const icono = (
    <IconoFlecha
      direccion={direccion === "anterior" ? "izquierda" : "derecha"}
      className="size-4"
    />
  );

  if (!href) {
    return (
      <span
        aria-hidden
        className={cn(aspecto, "pointer-events-none opacity-30")}
      >
        {icono}
      </span>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      aria-label={direccion === "anterior" ? "Anterior" : "Siguiente"}
      className={aspecto}
    >
      {icono}
    </Link>
  );
}

export function BotonFlecha({
  direccion,
  variante = "punteada",
  className,
  ...props
}: {
  direccion: "anterior" | "siguiente";
  /**
   * En los carruseles de mobile la flecha hacia donde sí se puede avanzar va
   * rellena y la otra, punteada.
   */
  variante?: "punteada" | "solida";
} & ComponentProps<"button">) {
  return (
    <button
      aria-label={direccion === "anterior" ? "Anterior" : "Siguiente"}
      className={cn(
        "grid size-13 cursor-pointer place-items-center rounded-lg transition-colors duration-200",
        variante === "solida"
          ? "bg-blanco text-negro-oscuro enabled:hover:bg-blanco/85"
          : "border border-dashed border-borde-pleno text-blanco enabled:hover:border-solid enabled:hover:bg-blanco enabled:hover:text-negro-oscuro",
        "disabled:pointer-events-none disabled:opacity-30",
        FOCO,
        className,
      )}
      {...props}
    >
      <IconoFlecha
        direccion={direccion === "anterior" ? "izquierda" : "derecha"}
        className="size-4"
      />
    </button>
  );
}
