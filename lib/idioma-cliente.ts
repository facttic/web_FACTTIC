"use client";

import { usePathname } from "next/navigation";
import { IDIOMA_POR_DEFECTO, esIdioma, type Idioma } from "@/lib/idioma";

/**
 * El idioma de la pantalla, para los componentes de cliente.
 *
 * Los de servidor lo reciben en `params`; acá se lee de la URL, que es la
 * misma fuente: el español va sin prefijo y el inglés bajo `/en`.
 */
export function useIdioma(): Idioma {
  const ruta = usePathname() ?? "/";
  const primero = ruta.split("/")[1];
  return esIdioma(primero) ? primero : IDIOMA_POR_DEFECTO;
}
