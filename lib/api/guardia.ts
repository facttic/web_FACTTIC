import "server-only";

import { redirect } from "next/navigation";
import { getSesion, type Sesion } from "./session";

/**
 * Puerta de entrada al panel, del lado del servidor.
 *
 * El middleware solo mira que la cookie exista, porque validar el token en
 * cada navegación costaría medio segundo por paso. Eso alcanza para redirigir
 * a quien no inició sesión, pero **no es la defensa**: una cookie se puede
 * fabricar a mano.
 *
 * La defensa real es doble y está acá abajo:
 *
 *  1. Cada página y cada acción del panel llama a `requerirSesion()`, que
 *     corre en el servidor y no se puede saltear desde el browser.
 *  2. Todas las escrituras van con el token de esa sesión. Si es inventado o
 *     venció, la API responde 401 y no se escribe nada: el panel nunca es la
 *     única barrera.
 *
 * El token no sale nunca del servidor: no se pasa como prop a componentes de
 * cliente ni viaja en el HTML.
 */
export async function requerirSesion(): Promise<Sesion> {
  const sesion = await getSesion();
  if (!sesion) redirect("/admin/ingresar");
  return sesion;
}

/**
 * Lo mismo para las acciones de formulario, pero devolviendo un error en vez
 * de redirigir: así el formulario puede mostrar qué pasó en vez de perder lo
 * que la persona estaba escribiendo.
 */
export async function sesionDeAccion(): Promise<
  { ok: true; sesion: Sesion } | { ok: false; error: string }
> {
  const sesion = await getSesion();
  if (!sesion) {
    return {
      ok: false,
      error: "Tu sesión venció. Volvé a entrar y probá de nuevo.",
    };
  }
  return { ok: true, sesion };
}
