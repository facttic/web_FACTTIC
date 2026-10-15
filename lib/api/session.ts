import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "./tokens";
import { sesionDeLaApi, traerPerfil, type Perfil } from "./refresco";

/**
 * Sesión del backoffice.
 *
 * El token de cada persona se guarda en una cookie propia, `HttpOnly` y
 * `SameSite=Lax`, para que no la pueda leer ningún script del browser. Las
 * escrituras del panel usan ese token y no el de servicio, así `createdBy` y
 * `updatedBy` quedan con quien realmente hizo el cambio.
 *
 * El token de la API dura quince minutos, así que esa cookie dura catorce. Lo
 * que ya no se pierde es la sesión: al entrar se guarda aparte, por treinta
 * días, la cookie que la propia API devuelve, y con ella `proxy.ts` pide un
 * token nuevo cuando el anterior venció. Se entra una vez y se sigue adentro.
 *
 * El token sigue siendo corto a propósito —si se filtra, sirve poco— y lo que
 * sostiene la sesión es algo que la API puede revocar borrando la sesión del
 * usuario. Nunca se guarda la contraseña.
 */

const COOKIE = "facttic_sesion";
/** Un minuto menos que los quince de la API, para no usarlo justo al vencer. */
const DURACION = 14 * 60;

/** Lo que permite renovar sin volver a pedir la contraseña. */
const COOKIE_REFRESCO = "facttic_refresco";
/** Los mismos treinta días que la API le da a su propia cookie. */
const DURACION_REFRESCO = 30 * 24 * 60 * 60;

/** Las dos cookies llevan los mismos cuidados; solo cambia cuánto duran. */
export function opcionesDeCookie(duracion: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: duracion,
  };
}

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

/**
 * Entra con el usuario o con el correo, lo que haya escrito la persona.
 *
 * La API acepta cualquiera de los dos, pero en campos distintos y valida cada
 * uno por su cuenta: `username` solo admite letras, números y guiones bajos, así
 * que mandar un correo ahí da 400 y no 401. Por eso se decide acá según tenga
 * arroba o no.
 *
 * Importa porque el nombre de usuario ya no se le pide a nadie —se genera solo
 * al aceptar la invitación— y el correo es lo único que la persona sabe.
 */
export async function iniciarSesion(
  usuario: string,
  contrasena: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const credencial = usuario.includes("@")
    ? { email: usuario }
    : { username: usuario };

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credencial, password: contrasena }),
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
          ? "Correo o contraseña incorrectos"
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
    opcionesDeCookie(DURACION),
  );

  /* La cookie que la API devolvió al entrar: es lo que después permite pedir
     un token nuevo. Si no vino —una API vieja, o sin `Set-Cookie`— la sesión
     sigue funcionando como antes y vence a los catorce minutos. */
  const refresco = sesionDeLaApi(res);
  if (refresco) {
    almacen.set(
      COOKIE_REFRESCO,
      JSON.stringify({ sesion: refresco, usuario }),
      opcionesDeCookie(DURACION_REFRESCO),
    );
  }

  return { ok: true };
}

export async function cerrarSesion(): Promise<void> {
  const almacen = await cookies();
  almacen.delete(COOKIE);
  /* También la de renovar: si quedara, el próximo pedido al panel volvería a
     entrar solo y el "Salir" no habría salido de nada. */
  almacen.delete(COOKIE_REFRESCO);
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
export const NOMBRE_COOKIE_REFRESCO = COOKIE_REFRESCO;
export const DURACION_SESION = DURACION;

/** Lo que guarda la cookie de renovar. */
export interface Refresco {
  /** El valor de la cookie `user-session` que puso la API. */
  sesion: string;
  usuario: string;
}

/** El contenido de la cookie de sesión, para que lo arme también `proxy.ts`. */
export function armarSesion(
  token: string,
  usuario: string,
  quien: Perfil,
): string {
  return JSON.stringify({ token, usuario, ...quien } satisfies Sesion);
}
