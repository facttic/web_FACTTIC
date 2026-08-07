import { NextResponse, type NextRequest } from "next/server";

/**
 * Deja pasar al panel solo con sesión abierta.
 *
 * Acá se mira nada más que la cookie exista: validar el token contra la API en
 * cada navegación sumaría medio segundo a cada paso, y las páginas del panel
 * igual la vuelven a pedir para trabajar. Si venció, la primera consulta
 * devuelve 401 y de ahí sale el mismo redirect.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const tieneSesion = request.cookies.has("facttic_sesion");
  const esLogin = pathname === "/admin/ingresar";

  if (!tieneSesion && !esLogin) {
    const destino = new URL("/admin/ingresar", request.url);
    // Se recuerda a dónde quería ir, para volver ahí después de entrar.
    destino.searchParams.set("volver", pathname + search);
    return NextResponse.redirect(destino);
  }

  if (tieneSesion && esLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
