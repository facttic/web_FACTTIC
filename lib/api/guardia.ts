import "server-only";

import { notFound, redirect } from "next/navigation";
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
 * Las pantallas que son solo de la Federación.
 *
 * Una cooperativa entra al panel para su ficha, sus proyectos y sus servicios;
 * el resto —sectores, novedades, consejo, aliados— es de la Federación. Si
 * alguien escribe la URL a mano, vuelve a su cooperativa en vez de ver una
 * pantalla que igual no podría guardar.
 *
 * Es comodidad, no seguridad: quien manda es la API, que rechaza la escritura
 * con 403 aunque el panel se haya equivocado y mostrado el formulario.
 */
export async function requerirFederacion(): Promise<Sesion> {
  const sesion = await requerirSesion();
  if (!sesion.esAdmin) redirect(destinoDe(sesion));
  return sesion;
}

/**
 * La ficha de una cooperativa, que no es de cualquiera.
 *
 * `requerirSesion()` sola alcanza para saber que hay alguien del otro lado,
 * pero no para saber si esa ficha es suya. Faltaba justamente eso, y como la
 * lectura salía con credencial de administrador la API tampoco lo negaba:
 * cualquiera con acceso al panel podía abrir la ficha de cualquier
 * cooperativa, y con ella los correos de sus editores.
 *
 * La Federación entra a todas; el resto, solo a las que `/api/me` le reconoce.
 *
 * Contesta "no existe" y no "no podés", que es lo contrario de lo que haría
 * `requerirFederacion`: ahí la URL es de una pantalla que existe para todas y
 * el desvío es comodidad, acá la ficha es de otra cooperativa y confirmar que
 * está no le aporta nada a quien la pidió.
 */
export async function requerirCooperativa(id: string): Promise<Sesion> {
  const sesion = await requerirSesion();
  if (sesion.esAdmin) return sesion;
  if (!sesion.cooperativas.some((suya) => suya.id === id)) notFound();
  return sesion;
}

/** A dónde mandar a alguien según lo que puede editar. */
export function destinoDe(sesion: Sesion): string {
  if (sesion.esAdmin) return "/admin";
  const suya = sesion.cooperativas[0];
  return suya ? `/admin/cooperativas/${suya.id}` : "/admin/sin-acceso";
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
      /* Que diga que no se perdió nada, y que se entre **en otra pestaña**:
         un "volvé a entrar" a secas se lee como "navegá a la pantalla de
         ingreso", que es justamente lo que se lleva puesto el formulario. */
      error:
        "Se venció la sesión antes de guardar. Entrá de nuevo en otra " +
        "pestaña y volvé a apretar Guardar: lo que cargaste sigue acá.",
    };
  }
  return { ok: true, sesion };
}
