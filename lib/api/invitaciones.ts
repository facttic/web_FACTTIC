import "server-only";

import { API_URL } from "./tokens";

/**
 * Invitaciones para editar una cooperativa.
 *
 * La Federación suma un mail desde el panel y la persona recibe un link de un
 * solo uso. Acá viven las dos llamadas que necesita esa pantalla: ver qué hay
 * detrás del link y aceptarlo creando la cuenta.
 *
 * El mail no se manda nunca desde el formulario: sale de la invitación, del
 * lado de la API. Si viajara, cualquiera con un link válido podría crearse la
 * cuenta de otra dirección.
 */

export interface Invitacion {
  email: string;
  cooperativa: { id: string; nombre: string };
  /** Con cuenta no hace falta crear nada: alcanza con entrar. */
  tieneCuenta: boolean;
}

export async function verInvitacion(token: string): Promise<Invitacion | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/invitaciones/${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const datos = (await res.json()) as {
      email: string;
      cooperativa: { _id: string; nombre: string };
      tieneCuenta: boolean;
    };
    return {
      email: datos.email,
      cooperativa: {
        id: datos.cooperativa._id,
        nombre: datos.cooperativa.nombre,
      },
      tieneCuenta: datos.tieneCuenta,
    };
  } catch {
    return null;
  }
}

export async function aceptarInvitacion(
  token: string,
  usuario: string,
  contrasena: string,
): Promise<{ ok: true; cooperativa: string } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(
      `${API_URL}/api/invitaciones/${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: contrasena }),
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, error: "No pudimos conectarnos con la API" };
  }

  if (!res.ok) {
    const { code } = (await res.json().catch(() => ({}))) as { code?: string };
    if (code === "usernameAlreadyExists") {
      return { ok: false, error: "Ese nombre de usuario ya está tomado" };
    }
    if (code === "invitacionInvalida") {
      return {
        ok: false,
        error:
          "La invitación ya se usó o venció. Pedile a FACTTIC que te mande otra.",
      };
    }
    return {
      ok: false,
      error:
        "La contraseña necesita al menos 6 caracteres, con letras y números",
    };
  }

  const { cooperativa } = (await res.json()) as { cooperativa: string };
  return { ok: true, cooperativa };
}
