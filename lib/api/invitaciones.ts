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

/**
 * Por qué falló, para que quien llama decida sin leer el texto del error.
 *
 * Antes la pantalla reintentaba con otro nombre de usuario preguntando si el
 * mensaje contenía la palabra "usuario". Funcionaba, pero cualquiera que
 * reescribiera ese texto apagaba el reintento sin enterarse.
 */
export type FalloInvitacion =
  "usuarioTomado" | "invitacionInvalida" | "contrasenaDebil" | "sinApi";

export async function aceptarInvitacion(
  token: string,
  usuario: string,
  contrasena: string,
): Promise<
  | { ok: true; cooperativa: string }
  | { ok: false; error: string; codigo: FalloInvitacion }
> {
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
    return {
      ok: false,
      error: "No pudimos conectarnos con la API",
      codigo: "sinApi",
    };
  }

  if (!res.ok) {
    const { code } = (await res.json().catch(() => ({}))) as { code?: string };
    if (code === "usernameAlreadyExists") {
      return {
        ok: false,
        /* Nadie eligió un nombre de usuario: lo arma el panel. Decirle a la
           persona que "ya está tomado" la deja buscando un campo que no
           existe, así que el texto habla de lo único que puede hacer. */
        error:
          "No pudimos crear tu cuenta. Escribile a FACTTIC y lo resolvemos: " +
          "es un problema nuestro, no de lo que cargaste.",
        codigo: "usuarioTomado",
      };
    }
    if (code === "invitacionInvalida") {
      return {
        ok: false,
        error:
          "La invitación ya se usó o venció. Pedile a FACTTIC que te mande otra.",
        codigo: "invitacionInvalida",
      };
    }
    return {
      ok: false,
      error:
        "La contraseña necesita al menos 6 caracteres, con letras y números",
      codigo: "contrasenaDebil",
    };
  }

  const { cooperativa } = (await res.json()) as { cooperativa: string };
  return { ok: true, cooperativa };
}

/**
 * El nombre de usuario, armado del correo.
 *
 * La API lo exige para crear la cuenta, pero nadie lo necesita después: para
 * entrar alcanza el correo. Pedírselo a la persona era hacerle inventar —y
 * recordar— un dato que el sistema puede deducir, en la única pantalla donde no
 * hay margen para trabarse.
 *
 * Las reglas son las del backend: entre 4 y 32 caracteres, solo letras, números
 * y guiones bajos. De `hernan.gigena@lawal.com.ar` sale `hernangigena_lawal`.
 *
 * **Va el dominio además de la parte de adelante**, y no es decorativo. Antes
 * se usaba solo lo anterior al arroba, y las cooperativas escriben desde
 * casillas genéricas: `contacto@coodesoft.com.ar` y `contacto@eryx.co` daban
 * las dos `contacto`. La primera en aceptar se quedaba con el nombre y la
 * segunda chocaba, probaba `contacto2`…`contacto5`, y si también estaban
 * tomados la persona quedaba trabada con un error sobre un nombre de usuario
 * que nunca eligió. Le pasó a Coodesoft. Con la casa incluida el choque solo
 * puede darse entre dos direcciones iguales, que son la misma persona.
 *
 * Del dominio va la primera etiqueta y no el resto: `coodesoft` dice lo mismo
 * que `coodesoftcomar` y deja lugar antes del tope de 32.
 *
 * El `intento` queda igual, de red: suma un número al final en vez de fallar.
 * Ahora casi no debería usarse, pero los nombres largos se recortan y ahí dos
 * direcciones distintas todavía podrían encontrarse.
 */
const LARGO_MAXIMO = 32;
/** Cuánto del dominio se guarda: suficiente para distinguir dos cooperativas. */
const LARGO_DE_LA_CASA = 12;

export function usuarioDesdeElCorreo(correo: string, intento = 0): string {
  const [local = "", dominio = ""] = correo.toLowerCase().split("@");
  const soloValido = (parte: string) => parte.replace(/[^a-z0-9]/g, "");

  const sufijo = intento > 0 ? String(intento + 1) : "";
  const casa = soloValido(dominio.split(".")[0] ?? "").slice(
    0,
    LARGO_DE_LA_CASA,
  );

  /* El recorte se le hace a la parte de adelante y no a la casa: si se cortara
     por el final, una dirección larga perdería justo el dominio, que es lo que
     vuelve único al nombre, y volvería el choque que esto viene a resolver. */
  const lugar = LARGO_MAXIMO - sufijo.length - (casa ? casa.length + 1 : 0);
  const adelante = soloValido(local).slice(0, Math.max(lugar, 0));

  /* Un correo que no deja nada utilizable —todo acentos o signos— igual tiene
     que dar una cuenta. El mínimo se completa antes de sumar el número, para
     que dos intentos del mismo correo no terminen pareciéndose de casualidad. */
  const base = [adelante, casa].filter(Boolean).join("_") || "coop";
  return base.padEnd(4, "0") + sufijo;
}
