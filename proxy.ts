import { NextResponse, type NextRequest } from "next/server";
import { IDIOMA_POR_DEFECTO, IDIOMAS, rutaEn, rutaInterna } from "@/lib/idioma";

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

  if (ruta === "/admin" || ruta.startsWith("/admin/")) {
    const respuesta = guardiaDelPanel(request, ruta);
    if (respuesta) return respuesta;
  }

  const destino = request.nextUrl.clone();
  destino.pathname = conPrefijo
    ? `/en${ruta === "/" ? "" : ruta}`
    : `/${IDIOMA_POR_DEFECTO}${pathname}`;
  return NextResponse.rewrite(destino);
}

export const config = {
  /*
   * Todo menos lo que no es una pantalla: los recursos de Next, la API propia
   * del sitio y los archivos estáticos.
   */
  matcher: ["/((?!_next/|api/|.*\\.[a-z0-9]+$).*)"],
};
