"use client";

import { useEffect } from "react";
import { construirConsola, invitacion } from "@/lib/consola";
import { idiomaDelNavegador } from "@/lib/idioma-cliente";

/**
 * El saludo de la consola.
 *
 * Quien abre las herramientas del navegador en un sitio de cooperativas de
 * tecnología probablemente escriba código. Para esa persona: el wordmark, que
 * el código es software libre y dónde está el repositorio.
 *
 * Habla el idioma del **navegador** y no el de la pantalla. La consola no es
 * parte de la página: no la abre quien está leyendo el sitio sino quien vino a
 * mirar cómo está hecho, y esa persona la lee en su idioma, no en el que le
 * tocó a la URL.
 *
 * Dice "el código de este sitio" y no "este sitio": la AGPL cubre el código, y
 * los textos y las fotos van por otro lado. El README lo detalla.
 *
 * No vende nada ni invita a nada. Es decir "esto se puede leer, copiar y
 * mejorar", que de un sitio de FACTTIC es lo que corresponde decir.
 *
 * Se imprime una sola vez por carga, en el sitio y en el panel. Llegó a estar
 * solo en el sitio, con la idea de que en el backoffice la consola es
 * herramienta de trabajo y el adorno estorba; pero quien entra al panel es de
 * la casa, y ver el wordmark al abrir la consola es parte de lo mismo.
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
    const idioma = idiomaDelNavegador();
    const saludo =
      idioma === "en"
        ? "%cThis site's code is free software.%c\n" +
          `Code: %c${LICENCIA.repo}%c\n` +
          `Licence: %c${LICENCIA.nombre}%c — read it, copy it, study it, improve it.\n\n` +
          "Built inter-co-operatively."
        : "%cEl código de este sitio es software libre.%c\n" +
          `Código: %c${LICENCIA.repo}%c\n` +
          `Licencia: %c${LICENCIA.nombre}%c — podés leerlo, copiarlo, estudiarlo y mejorarlo.\n\n` +
          "Hecho de forma intercooperativa.";

    console.log(
      saludo,
      "font-weight:bold",
      "",
      "text-decoration:underline",
      "",
      "font-weight:bold",
      "",
    );

    /*
     * Y los datos de la red, consultables desde acá mismo. Se instala el
     * objeto y nada más: los comandos piden `/api/red` recién cuando se
     * escribe el primero, así nadie paga esos kilobytes por una visita en la
     * que no abrió la consola.
     */
    (window as typeof window & { facttic?: unknown }).facttic =
      construirConsola(idioma);
    console.log(
      invitacion(idioma).texto,
      "color:#b99de8;font-weight:bold",
      "color:#8a8a8a",
    );
  }, []);

  return null;
}
