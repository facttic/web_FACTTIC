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

/**
 * El idioma que pide el navegador, no el de la pantalla.
 *
 * Sirve para lo que no es parte de la página y por lo tanto no sigue su ruta:
 * hoy, el saludo y los comandos de la consola. La regla es la misma que aplica
 * `proxy.ts` sobre `Accept-Language` —la primera preferencia, y solo español
 * es español—, para que las dos cosas no se contradigan.
 */
export function idiomaDelNavegador(): Idioma {
  if (typeof navigator === "undefined") return IDIOMA_POR_DEFECTO;
  const pedido = navigator.languages?.[0] ?? navigator.language ?? "";
  const base = pedido.toLowerCase().split("-")[0];
  return base === IDIOMA_POR_DEFECTO ? IDIOMA_POR_DEFECTO : "en";
}
