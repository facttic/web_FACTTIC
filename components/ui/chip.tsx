import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconoUbicacion } from "./iconos";

/**
 * Etiqueta de sector o categoría.
 *
 * En el diseño cada sector tiene su color: Finanzas en rojo, Organizaciones en
 * amarillo y Agro en celeste, siempre sobre un fondo tenue del mismo tono. El
 * color se resuelve por nombre para que los datos de la API —que solo traen el
 * nombre del sector— pinten solos.
 */

type Tono = "rojo" | "amarillo" | "celeste" | "lila" | "naranja" | "neutro";

const TONOS: Record<Tono, string> = {
  rojo: "bg-rojo/15 text-rojo",
  amarillo: "bg-amarillo/15 text-amarillo",
  celeste: "bg-celeste/15 text-celeste",
  lila: "bg-lila/15 text-lila",
  naranja: "bg-naranja/15 text-naranja",
  neutro: "bg-superficie-alta/70 text-blanco",
};

/** Mapa de sector a tono, según los colores que usa el diseño. */
const TONO_POR_SECTOR: Record<string, Tono> = {
  finanzas: "rojo",
  financiero: "rojo",
  organizaciones: "amarillo",
  agro: "celeste",
};

export function tonoDeSector(nombre: string | undefined): Tono {
  if (!nombre) return "neutro";
  return TONO_POR_SECTOR[nombre.trim().toLowerCase()] ?? "neutro";
}

export function Chip({
  children,
  tono = "neutro",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-p3 inline-flex items-center rounded px-2 py-1 font-medium",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Chip de cliente: el único que va de contorno.
 *
 * En el board de Componentes la etiqueta del cliente es un rectángulo sin
 * relleno con borde gris (`stroke #3C3C3C`), mientras que las de sector van
 * rellenas y con el texto del color de la vertical. Tenerlo aparte evita que
 * vuelvan a igualarse: el cliente nunca es un chip neutro.
 */
export function ChipCliente({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Chip
      className={cn(
        "border border-gris-oscuro bg-transparent text-blanco",
        className,
      )}
    >
      {children}
    </Chip>
  );
}

/** Chip de sector que elige su color a partir del nombre. */
export function ChipSector({
  nombre,
  className,
}: {
  nombre: string;
  className?: string;
}) {
  return (
    <Chip tono={tonoDeSector(nombre)} className={className}>
      {nombre}
    </Chip>
  );
}

/** Chip de ubicación, con el pin adelante. Se usa en el mapa federal. */
export function ChipUbicacion({
  lugar,
  className,
}: {
  lugar: string;
  className?: string;
}) {
  return (
    <Chip tono="neutro" className={cn("gap-1.5", className)}>
      <IconoUbicacion />
      {lugar}
    </Chip>
  );
}
