import { NextResponse, type NextRequest } from "next/server";
import {
  IDIOMA_POR_DEFECTO,
  IDIOMAS,
  rutaEn,
  rutaInterna,
  type Idioma,
} from "@/lib/idioma";

/**
 * Reescritura de idioma y guardia del panel.
 *
 * El sitio vive bajo `app/[idioma]`, pero el español no lleva prefijo: las
 * direcciones que ya circulan —y las que están indexadas— siguen siendo las
 * mismas. Así que acá se traduce la URL pública a la ruta interna:
 *
 *   /proyectos      → /es/proyectos   (reescritura, la barra no cambia)
 *   /en/projects    → /en/proyectos   (las secciones tienen nombre en inglés)
 *   /es/proyectos   → /proyectos      (redirección: una sola URL por pantalla)
 *   /en/proyectos   → /en/projects    (ídem: la sección va con su nombre)
 *
 * Se llama `proxy` y no `middleware` porque es el nombre que usa esta versión
 * de Next; el archivo anterior quedaba deprecado.
 */

/**
 * Que la primera visita caiga en su idioma.
 *
 * El sitio es en español y esa es la dirección sin prefijo, pero a quien llega
 * con el navegador en otro idioma le sirve más el inglés. Así que la **primera
 * vez** se mira `Accept-Language` y, si no pide español, se lo manda a `/en`.
 *
 * Tres decisiones que vale la pena dejar escritas:
 *
 * - **Pasa una sola vez.** Al decidir se deja la cookie, y mientras esté el
 *   proxy no vuelve a mirar la cabecera. Si después alguien toca EN/ES, su
 *   elección queda: no hay nada que lo rebote al idioma del navegador. Por eso
 *   el selector sigue siendo un par de enlaces comunes y no hubo que tocarlo.
 * - **Sin cabecera no se redirige.** Si no sabemos qué idioma quiere, se queda
 *   en español, que es el del sitio. Esto además es lo que mantiene indexada la
 *   versión en español: los rastreadores suelen no mandar `Accept-Language`, y
 *   si los mandáramos a `/en` dejarían de ver el sitio en castellano.
 * - **El panel no entra.** `/admin` se trabaja en español y sus rutas no se
 *   traducen.
 */
const COOKIE_IDIOMA = "facttic_idioma";

/** Un año: es una preferencia, no una sesión. */
const DURACION_COOKIE = 60 * 60 * 24 * 365;

/**
 * Quiénes no entran en la detección de idioma.
 *
 * Un enlace al sitio en español pegado en Telegram salía previsualizado en
 * inglés: su rastreador manda `Accept-Language: en` y se comía la redirección,
 * así que leía `/en` en vez de la dirección compartida. Lo mismo vale para
 * Google: si lo mandamos a `/en`, la versión en español deja de indexarse.
 *
 * A un rastreador se le sirve **la dirección que pidió**, sin adivinarle nada.
 * La lista es por nombre porque no hay otra forma: se mira el `User-Agent`.
 */
const RASTREADORES =
  /bot|crawler|spider|crawling|facebookexternalhit|telegram|whatsapp|slackbot|discordbot|embedly|quora|pinterest|vkshare|preview|skype|linkedin|twitter|google|bing|duckduck|yandex|baidu|applebot|lighthouse|headlesschrome/i;

/**
 * Qué idioma pide el navegador, del `Accept-Language`.
 *
 * Devuelve `null` si no hay con qué decidir. Español es español; cualquier otra
 * cosa cae en inglés, que es el otro idioma que tenemos.
 */
function idiomaDelNavegador(cabecera: string | null): Idioma | null {
  if (!cabecera) return null;

  const preferencias = cabecera
    .split(",")
    .map((parte) => {
      const [etiqueta = "", ...resto] = parte.split(";");
      const calidad = resto
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      return {
        // `es-AR` y `es` son lo mismo para nosotros: alcanza con la raíz.
        base: etiqueta.trim().toLowerCase().split("-")[0],
        peso: calidad ? Number(calidad.slice(2)) : 1,
      };
    })
    /* `q=0` es "este no lo quiero", y `*` no dice nada. */
    .filter((p) => p.base && p.base !== "*" && Number.isFinite(p.peso))
    .filter((p) => p.peso > 0)
    .sort((a, b) => b.peso - a.peso);

  const elegida = preferencias[0];
  if (!elegida) return null;
  return elegida.base === IDIOMA_POR_DEFECTO ? IDIOMA_POR_DEFECTO : "en";
}

/** Deja asentado el idioma para no volver a mirar la cabecera. */
function recordar(respuesta: NextResponse, idioma: Idioma): NextResponse {
  respuesta.cookies.set(COOKIE_IDIOMA, idioma, {
    maxAge: DURACION_COOKIE,
    path: "/",
    sameSite: "lax",
  });
  /* La respuesta depende de la cabecera: sin esto, un intermediario podría
     guardar la redirección y servírsela a quien pide español. */
  respuesta.headers.set("Vary", "Accept-Language");
  return respuesta;
}

/** El panel no es público: sin sesión, al ingreso. */
function guardiaDelPanel(request: NextRequest, ruta: string) {
  const tieneSesion = request.cookies.has("facttic_sesion");
  const esLogin = ruta === "/admin/ingresar";
  /*
   * La invitación se abre sin sesión: es la pantalla donde se crea la cuenta.
   * Lo que autoriza ahí es el token del link, que verifica la API.
   */
  const esInvitacion = ruta.startsWith("/admin/invitacion/");

  if (esInvitacion) return null;

  if (!tieneSesion && !esLogin) {
    const destino = new URL("/admin/ingresar", request.url);
    // Se recuerda a dónde quería ir, para volver ahí después de entrar.
    destino.searchParams.set("volver", ruta + request.nextUrl.search);
    return NextResponse.redirect(destino);
  }

  if (tieneSesion && esLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El español no se escribe en la URL: si alguien la pide con prefijo, se la
  // devuelve sin él, para no tener la misma pantalla en dos direcciones.
  if (
    pathname === `/${IDIOMA_POR_DEFECTO}` ||
    pathname.startsWith(`/${IDIOMA_POR_DEFECTO}/`)
  ) {
    const destino = request.nextUrl.clone();
    destino.pathname = pathname.slice(IDIOMA_POR_DEFECTO.length + 1) || "/";
    return NextResponse.redirect(destino);
  }

  const conPrefijo = IDIOMAS.some(
    (idioma) => pathname === `/${idioma}` || pathname.startsWith(`/${idioma}/`),
  );
  // La ruta interna: la que existe en `app/`, siempre con los nombres en español.
  const ruta = conPrefijo ? rutaInterna(pathname) : pathname;

  /*
   * En inglés cada sección tiene su propia dirección, así que la versión con
   * el nombre en español se manda a la buena en vez de servir la misma
   * pantalla en dos URLs.
   */
  if (conPrefijo) {
    const publica = rutaEn("en", pathname);
    if (publica !== pathname && !pathname.startsWith("/admin")) {
      const destino = request.nextUrl.clone();
      destino.pathname = publica;
      return NextResponse.redirect(destino);
    }
  }

  const esPanel = ruta === "/admin" || ruta.startsWith("/admin/");

  if (esPanel) {
    const respuesta = guardiaDelPanel(request, ruta);
    if (respuesta) return respuesta;
  }

  /*
   * Primera visita a una pantalla pública: se decide el idioma y se recuerda.
   * De acá en más manda la cookie y la cabecera no se vuelve a mirar.
   */
  const sinDecidir = !esPanel && !request.cookies.has(COOKIE_IDIOMA);

  if (sinDecidir && !conPrefijo) {
    const quienPide = request.headers.get("user-agent") ?? "";
    const delNavegador = RASTREADORES.test(quienPide)
      ? null
      : idiomaDelNavegador(request.headers.get("accept-language"));
    if (delNavegador === "en") {
      const aIngles = request.nextUrl.clone();
      aIngles.pathname = rutaEn("en", pathname);
      return recordar(NextResponse.redirect(aIngles, 307), "en");
    }
  }

  const destino = request.nextUrl.clone();
  destino.pathname = conPrefijo
    ? `/en${ruta === "/" ? "" : ruta}`
    : `/${IDIOMA_POR_DEFECTO}${pathname}`;
  const respuesta = NextResponse.rewrite(destino);

  /*
   * Quien entra directo a `/en` también queda anotado: si no, al tocar ES
   * volvería a una dirección sin prefijo, sin cookie, y el navegador en inglés
   * lo rebotaría a `/en` otra vez. El selector dejaría de funcionar.
   */
  return sinDecidir
    ? recordar(respuesta, conPrefijo ? "en" : IDIOMA_POR_DEFECTO)
    : respuesta;
}

export const config = {
  /*
   * Todo menos lo que no es una pantalla: los recursos de Next, la API propia
   * del sitio y los archivos estáticos.
   */
  matcher: ["/((?!_next/|api/|.*\\.[a-z0-9]+$).*)"],
};
