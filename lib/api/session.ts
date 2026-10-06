import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "./tokens";

/**
 * Sesión del backoffice.
 *
 * El token de cada persona se guarda en una cookie propia, `HttpOnly` y
 * `SameSite=Lax`, para que no la pueda leer ningún script del browser. Las
 * escrituras del panel usan ese token y no el de servicio, así `createdBy` y
 * `updatedBy` quedan con quien realmente hizo el cambio.
 *
 * El token de la API dura quince minutos y no hay forma de renovarlo sin la
 * cookie que ella misma pone (`PENDIENTES`, ítem 15), así que la sesión dura
 * eso: cuando vence, el panel manda a entrar de nuevo. Es incómodo y está
 * pedido, pero es preferible a guardar la contraseña.
 */

const COOKIE = "facttic_sesion";
/** Un minuto menos que los quince de la API, para no usarlo justo al vencer. */
const DURACION = 14 * 60;

export interface Sesion {
  token: string;
  usuario: string;
  /**
   * Quién es y qué puede editar, tal como lo responde `GET /api/me` al entrar.
   *
   * Es para que el panel sepa qué mostrar: la Federación ve todo y una
   * cooperativa, lo suyo. **No es el permiso**: cada escritura la autoriza la
   * API por su cuenta, así que si esto quedara desactualizado —por ejemplo
   * porque le quitaron el acceso— lo peor que pasa es que vea un formulario
   * que al guardar devuelve 403.
   */
  esAdmin: boolean;
  cooperativas: Array<{ id: string; nombre: string }>;
}

export async function iniciarSesion(
  usuario: string,
  contrasena: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usuario, password: contrasena }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "No pudimos conectarnos con la API" };
  }

  if (!res.ok) {
    return {
      ok: false,
      error:
        res.status === 401
          ? "Usuario o contraseña incorrectos"
          : "No pudimos iniciar sesión",
    };
  }

  const { access_token: token } = (await res.json()) as {
    access_token?: string;
  };
  if (!token) return { ok: false, error: "La API no devolvió un token" };

  const quien = await traerPerfil(token);

  const almacen = await cookies();
  almacen.set(
    COOKIE,
    JSON.stringify({ token, usuario, ...quien } satisfies Sesion),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DURACION,
    },
  );

  return { ok: true };
}

/**
 * Lo que la API dice de quien entró.
 *
 * Contra una API vieja —sin `/me`— la sesión queda como administradora, que es
 * lo que esa versión hace de todos modos: ahí **todos** los endpoints de
 * escritura exigen `admin:all`, así que nadie más podía entrar al panel. Dar
 * por administrador a quien ya lo era no abre ninguna puerta, y evita que
 * publicar el sitio antes que la API deje a la Federación sin su panel.
 *
 * Si la respuesta falla por otro motivo, la sesión queda sin permisos: ahí sí
 * conviene ver de menos.
 */
async function traerPerfil(
  token: string,
): Promise<Pick<Sesion, "esAdmin" | "cooperativas">> {
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

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** La sesión actual, o `null` si no hay o está rota. */
export async function getSesion(): Promise<Sesion | null> {
  const cruda = (await cookies()).get(COOKIE)?.value;
  if (!cruda) return null;
  try {
    const sesion = JSON.parse(cruda) as Sesion;
    return sesion.token ? sesion : null;
  } catch {
    return null;
  }
}

/** El token de quien está usando el panel, para firmar sus escrituras. */
export async function getTokenDeSesion(): Promise<string | null> {
  return (await getSesion())?.token ?? null;
}

export const NOMBRE_COOKIE = COOKIE;
