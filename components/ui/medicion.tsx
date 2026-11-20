"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { DOMINIO } from "@/lib/sitio";

/**
 * Cuántas visitas tiene el sitio, con GoatCounter.
 *
 * GoatCounter es software libre —EUPL—, no usa cookies, no guarda la dirección
 * IP y no construye un perfil de nadie: por eso el sitio sigue sin necesitar
 * cartel de consentimiento. Es la única razón por la que esto puede existir
 * acá.
 *
 * **No carga el script de GoatCounter.** La visita se avisa pidiendo una
 * imagen —su endpoint `/count` devuelve un GIF de 1×1— y eso alcanza para
 * todo lo que interesa. La diferencia importa:
 *
 *  - `script-src` sigue cerrado en `'self'`. Si usáramos `count.js` habría que
 *    abrirlo a `gc.zgo.at`, y ahí un tercero pasa a poder ejecutar código en
 *    todas las páginas del sitio. Con el pixel lo único que se abre es
 *    `img-src`, que en el peor caso recibe un GIF.
 *  - No viajan los 3 KB de su script, ni se bloquea nada esperándolo.
 *  - Se ve exactamente qué se manda, acá abajo, en cinco líneas.
 *
 * Se hace desde JavaScript y no con una etiqueta `<img>` suelta porque una
 * etiqueta no puede contar dos cosas: el referente y el tamaño de pantalla. Y
 * sobre todo porque el sitio navega del lado del cliente —todo pasa por
 * `next/link`—, así que un `<img>` en el HTML contaría la primera pantalla de
 * la visita y ninguna de las siguientes.
 *
 * Lo monta `MarcoPublico`, así que cubre el sitio público y el 404, y deja
 * afuera el backoffice: cuántas veces entró una compañera a cargar un proyecto
 * no es una estadística del sitio.
 */
export function Medicion({ endpoint }: { endpoint: string }) {
  const ruta = usePathname();
  const primera = useRef(true);

  useEffect(() => {
    const esPrimera = primera.current;
    primera.current = false;

    /*
     * Solo el dominio de verdad. Las direcciones de preview y
     * `dev.facttic.org.ar` siguen en pie y apuntando al mismo Vercel: sin esto
     * cada vez que alguien de la casa abre un deploy para revisar algo queda
     * anotado como visita. En desarrollo tampoco cuenta, porque `localhost` no
     * es el dominio —que de paso evita que el doble montaje del modo estricto
     * sume dos.
     */
    if (location.hostname.replace(/^www\./, "") !== DOMINIO) return;

    const url = new URL(endpoint);
    /*
     * La ruta sin la parte de la consulta. GoatCounter la acepta, pero en una
     * estadística no tiene por qué entrar nunca nada que alguien haya tipeado
     * ni nada que viaje en una URL; saber que se usó un filtro no lo vale.
     */
    url.searchParams.set("p", location.pathname);
    url.searchParams.set(
      "s",
      `${screen.width},${screen.height},${devicePixelRatio}`,
    );
    /*
     * El referente vale solo para la primera pantalla. `document.referrer` es
     * del documento y no cambia al navegar del lado del cliente, así que
     * mandarlo siempre le atribuiría a Google —o a quien sea— cada clic
     * interno de la visita, y el informe de referentes quedaría inflado.
     */
    if (esPrimera && document.referrer) {
      url.searchParams.set("r", document.referrer);
    }
    /* Para que el navegador no sirva la segunda visita desde su caché. */
    url.searchParams.set("rnd", Math.random().toString(36).slice(2));

    /* La petición queda viva sola mientras está en vuelo. */
    new Image().src = url.toString();
  }, [ruta, endpoint]);

  return null;
}
