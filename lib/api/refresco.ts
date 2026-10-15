import { API_URL } from "./tokens";

/**
 * Renovar la sesión del panel sin volver a pedir la contraseña.
 *
 * El token de la API dura quince minutos. Antes la sesión duraba eso y a los
 * catorce minutos el panel mandaba a entrar de nuevo, estuviera alguien
 * trabajando o no.
 *
 * La API sí sabe renovar: al entrar devuelve una cookie propia, `user-session`,
 * que vale treinta días, y `POST /api/refresh-token` la cambia por un token
 * nuevo. Lo que pasaba es que esa cookie se perdía: el login lo hace el
 * servidor del sitio contra la API, así que llega a la respuesta del servidor
 * y nunca llegaba al browser de nadie.
 *
 * Ahora se guarda y se usa. El token sigue durando quince minutos —si se
 * filtra, sirve poco— y lo que sostiene la sesión es algo que la API puede
 * revocar borrando la sesión del usuario.
 *
 * Este módulo no toca `next/headers` a propósito: lo usa también `proxy.ts`,
 * que corre como middleware y ahí las cookies se leen y escriben sobre el
 * pedido y la respuesta, no con `cookies()`.
 */

/** Lo que la API dice de quien entró. */
export interface Perfil {
  esAdmin: boolean;
  cooperativas: Array<{ id: string; nombre: string }>;
}

/** La cookie que la API pone al entrar, tal como viaja. */
export const COOKIE_API = "user-session";

/** De la cabecera `Set-Cookie` de la API, el valor de su cookie de sesión. */
export function sesionDeLaApi(res: Response): string | null {
  const cabeceras =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [res.headers.get("set-cookie") ?? ""];

  for (const cruda of cabeceras) {
    const par = cruda.split(";")[0]?.trim() ?? "";
    const [nombre, ...resto] = par.split("=");
    if (nombre === COOKIE_API && resto.length) return resto.join("=");
  }
  return null;
}

/** Un token nuevo a cambio de la cookie de la API, o null si ya no vale. */
export async function tokenConRefresco(
  valor: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/refresh-token`, {
      method: "POST",
      headers: { Cookie: `${COOKIE_API}=${valor}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { access_token: token } = (await res.json()) as {
      access_token?: string;
    };
    return token ?? null;
  } catch {
    return null;
  }
}

/**
 * Quién es y qué puede editar.
 *
 * Contra una API vieja —sin `/me`— la sesión queda como administradora, que es
 * lo que esa versión hace de todos modos: ahí **todos** los endpoints de
 * escritura exigen `admin:all`, así que nadie más podía entrar al panel. Dar
 * por administrador a quien ya lo era no abre ninguna puerta, y evita que
 * publicar el sitio antes que la API deje a la Federación sin su panel.
 *
 * Si la respuesta falla por otro motivo, la sesión queda sin permisos: ahí sí
 * conviene ver de menos.
 *
 * Se vuelve a pedir en cada renovación y no se arrastra el de antes: si a
 * alguien le quitaron el acceso a una cooperativa, en quince minutos el panel
 * deja de ofrecérsela.
 */
export async function traerPerfil(token: string): Promise<Perfil> {
  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 404) return { esAdmin: true, cooperativas: [] };
    if (!res.ok) return { esAdmin: false, cooperativas: [] };
    const datos = (await res.json()) as {
      esAdmin?: boolean;
      cooperativas?: Array<{ _id: string; nombre: string }>;
    };
    return {
      esAdmin: datos.esAdmin === true,
      cooperativas: (datos.cooperativas ?? []).map((c) => ({
        id: c._id,
        nombre: c.nombre,
      })),
    };
  } catch {
    return { esAdmin: false, cooperativas: [] };
  }
}
