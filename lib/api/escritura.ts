import "server-only";

import { revalidateTag } from "next/cache";
import { API_URL } from "./tokens";
import { sesionDeAccion } from "./guardia";

/**
 * Crear, editar y borrar desde el panel.
 *
 * Todo pasa por acá para que las tres cosas que importan estén en un solo
 * lugar y no dependan de que cada ABM se acuerde:
 *
 *  1. **Sesión.** Cada operación pide la sesión del servidor. Sin ella no se
 *     hace nada, y el token viaja en la petición pero nunca vuelve al browser.
 *  2. **El token es el de la persona**, no el de servicio, así `createdBy` y
 *     `updatedBy` quedan con quien hizo el cambio.
 *  3. **Cache.** Después de escribir se invalida la etiqueta del recurso, así
 *     el sitio público muestra el cambio sin esperar a que venza el TTL.
 *
 * Los errores vuelven como texto para mostrar en el formulario: nunca se
 * pierde lo que la persona escribió.
 */

export type Resultado =
  { ok: true; id?: string } | { ok: false; error: string };

/** Traduce el error de la API a algo que se entienda en pantalla. */
async function leerError(res: Response): Promise<string> {
  if (res.status === 401) return "Tu sesión venció. Volvé a entrar.";
  if (res.status === 413) return "El archivo es demasiado grande.";
  try {
    const cuerpo = (await res.json()) as { field?: string; message?: string };
    if (cuerpo.field && cuerpo.message) {
      return `${cuerpo.field}: ${cuerpo.message}`;
    }
    if (cuerpo.message) return cuerpo.message;
  } catch {
    // Algunas respuestas de error no son JSON.
  }
  return `La API respondió ${res.status}`;
}

async function pedir(
  ruta: string,
  metodo: "POST" | "PUT" | "DELETE",
  cuerpo: FormData | object | undefined,
  etiqueta: string,
): Promise<Resultado> {
  const guardia = await sesionDeAccion();
  if (!guardia.ok) return { ok: false, error: guardia.error };

  const esArchivo = cuerpo instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${guardia.sesion.token}`,
        // Con FormData el header lo pone el runtime, con su boundary.
        ...(esArchivo || cuerpo === undefined
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: esArchivo ? cuerpo : cuerpo ? JSON.stringify(cuerpo) : undefined,
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "No pudimos conectarnos con la API" };
  }

  if (!res.ok) return { ok: false, error: await leerError(res) };

  // En esta versión de Next la etiqueta lleva el perfil de cache.
  revalidateTag(etiqueta, "max");

  try {
    const creado = (await res.json()) as { _id?: string };
    return { ok: true, id: creado?._id };
  } catch {
    return { ok: true };
  }
}

export function crear(
  recurso: string,
  cuerpo: FormData | object,
  etiqueta: string,
): Promise<Resultado> {
  return pedir(`/api/${recurso}`, "POST", cuerpo, etiqueta);
}

export function editar(
  recurso: string,
  id: string,
  cuerpo: FormData | object,
  etiqueta: string,
): Promise<Resultado> {
  return pedir(`/api/${recurso}/${id}`, "PUT", cuerpo, etiqueta);
}

export function borrar(
  recurso: string,
  id: string,
  etiqueta: string,
): Promise<Resultado> {
  return pedir(`/api/${recurso}/${id}`, "DELETE", undefined, etiqueta);
}
