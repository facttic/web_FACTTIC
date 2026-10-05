import { NextResponse, type NextRequest } from "next/server";
import { IDIOMA_POR_DEFECTO, IDIOMAS } from "@/lib/idioma";

/**
 * Reescritura de idioma y guardia del panel.
 *
 * El sitio vive bajo `app/[idioma]`, pero el español no lleva prefijo: las
 * direcciones que ya circulan —y las que están indexadas— siguen siendo las
 * mismas. Así que acá se traduce la URL pública a la ruta interna:
 *
 *   /proyectos      → /es/proyectos   (reescritura, la barra no cambia)
 *   /en/proyectos   → /en/proyectos   (pasa igual)
 *   /es/proyectos   → /proyectos      (redirección: una sola URL por pantalla)
 *
 * Se llama `proxy` y no `middleware` porque es el nombre que usa esta versión
 * de Next; el archivo anterior quedaba deprecado.
 */

/** El panel no es público: sin sesión, al ingreso. */
function guardiaDelPanel(request: NextRequest, ruta: string) {
  const tieneSesion = request.cookies.has("facttic_sesion");
  const esLogin = ruta === "/admin/ingresar";

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
  if (pathname === `/${IDIOMA_POR_DEFECTO}` || pathname.startsWith(`/${IDIOMA_POR_DEFECTO}/`)) {
    const destino = request.nextUrl.clone();
    destino.pathname = pathname.slice(IDIOMA_POR_DEFECTO.length + 1) || "/";
    return NextResponse.redirect(destino);
  }

  const conPrefijo = IDIOMAS.some(
    (idioma) => pathname === `/${idioma}` || pathname.startsWith(`/${idioma}/`),
  );
  const ruta = conPrefijo
    ? pathname.replace(/^\/[a-z]{2}/, "") || "/"
    : pathname;

  if (ruta === "/admin" || ruta.startsWith("/admin/")) {
    const respuesta = guardiaDelPanel(request, ruta);
    if (respuesta) return respuesta;
  }

  if (conPrefijo) return NextResponse.next();

  const destino = request.nextUrl.clone();
  destino.pathname = `/${IDIOMA_POR_DEFECTO}${pathname}`;
  return NextResponse.rewrite(destino);
}

export const config = {
  /*
   * Todo menos lo que no es una pantalla: los recursos de Next, la API propia
   * del sitio y los archivos estáticos.
   */
  matcher: ["/((?!_next/|api/|.*\\.[a-z0-9]+$).*)"],
};
