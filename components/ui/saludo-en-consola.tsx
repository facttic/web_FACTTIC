"use client";

import { useEffect } from "react";

/**
 * El saludo de la consola.
 *
 * Quien abre las herramientas del navegador en un sitio de cooperativas de
 * tecnología probablemente escriba código. Para esa persona: el wordmark, que
 * el código es software libre y dónde está el repositorio.
 *
 * Dice "el código de este sitio" y no "este sitio": la AGPL cubre el código, y
 * los textos y las fotos van por otro lado. El README lo detalla.
 *
 * No vende nada ni invita a nada. Es decir "esto se puede leer, copiar y
 * mejorar", que de un sitio de FACTTIC es lo que corresponde decir.
 *
 * Se imprime una sola vez por carga, y no en el panel: ahí la consola es
 * herramienta de trabajo y el adorno estorba.
 */

const WORDMARK = [
  " ___ _   ___ _____ ┌ _____ ___ ___ ┐",
  "| __/_\\ / __|_   _|│|_   _|_ _/ __|│",
  "| _/ _ \\ (__  | |  │  | |  | | (__ │",
  "|_/_/ \\_\\___| |_|  │  |_| |___\\___|│",
  "                   └               ┘",
].join("\n");

/**
 * De dónde sale el código y bajo qué licencia. Va en una constante porque lo
 * dicen dos lugares —acá y el pie— y tienen que contar lo mismo.
 */
export const LICENCIA = {
  nombre: "AGPL-3.0-or-later",
  url: "https://www.gnu.org/licenses/agpl-3.0.html",
  repo: "https://github.com/facttic/web_FACTTIC",
};

export function SaludoEnConsola() {
  useEffect(() => {
    /* En desarrollo el efecto corre dos veces —el modo estricto monta, desmonta
       y vuelve a montar—, y el saludo saldría repetido. */
    if (typeof window === "undefined") return;
    const ventana = window as typeof window & { __saludo?: boolean };
    if (ventana.__saludo) return;
    ventana.__saludo = true;

    /*
     * Los colores van en tonos medios y no en los de la identidad: la consola
     * puede estar en claro o en oscuro y no hay forma de saberlo, así que se
     * eligen los que se leen en las dos.
     */
    console.log(
      `%c${WORDMARK}`,
      "color:#8b7bb8;font-weight:bold;line-height:1.15",
    );
    console.log(
      "%cEl código de este sitio es software libre.%c\n" +
        `Código: %c${LICENCIA.repo}%c\n` +
        `Licencia: %c${LICENCIA.nombre}%c — podés leerlo, copiarlo, estudiarlo y mejorarlo.\n\n` +
        "Hecho de forma intercooperativa.",
      "font-weight:bold",
      "",
      "text-decoration:underline",
      "",
      "font-weight:bold",
      "",
    );
  }, []);

  return null;
}
