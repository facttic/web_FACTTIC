"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { rutaEn } from "@/lib/idioma";
import { useIdioma } from "@/lib/idioma-cliente";

/**
 * Enlace interno que se queda en el idioma de la pantalla.
 *
 * El español va sin prefijo y el inglés bajo `/en`, así que navegar desde una
 * pantalla en inglés con un `href` suelto —`/proyectos`— devolvía al visitante
 * al español sin avisar. Este componente le pone el prefijo que corresponde,
 * y por eso las vistas siguen escribiendo las rutas de una sola forma.
 *
 * Lo que apunta afuera, a un ancla o a un `mailto:` pasa tal cual.
 */
export function Enlace({ href, ...props }: ComponentProps<typeof Link>) {
  const idioma = useIdioma();
  const destino =
    typeof href === "string" && href.startsWith("/")
      ? rutaEn(idioma, href)
      : href;

  return <Link href={destino} {...props} />;
}
