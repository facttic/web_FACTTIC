import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { crear, editar, borrar, type Resultado } from "@/lib/api/escritura";
import type { EstadoForm, Opcion } from "@/components/admin/piezas";

/**
 * El esqueleto de las acciones del panel.
 *
 * Los seis ABMs hacen la misma secuencia —pedir sesión, escribir, refrescar el
 * listado, volver— y solo cambian en cómo arman el cuerpo. Eso es lo único que
 * queda en cada ABM; el resto vive acá.
 *
 * Al guardar bien se redirige al listado y no se vuelve del `useActionState`;
 * al fallar se devuelve el error, que el formulario muestra sin perder lo
 * escrito.
 */

export interface Destino {
  /** Cómo se llama el recurso en la API. */
  recurso: string;
  /** Etiqueta de cache del sitio público, para que el cambio se vea al toque. */
  etiqueta: string;
  /** Listado al que se vuelve. */
  ruta: string;
  /**
   * A dónde volver en vez del listado, cuando se llegó desde otra pantalla:
   * un proyecto dado de alta desde la ficha de una cooperativa vuelve ahí.
   */
  volverA?: string;
}

/**
 * Una vuelta segura.
 *
 * El destino llega en el formulario, así que podría ser cualquier cosa: se
 * acepta solo una ruta del propio panel. Sin esto, alguien podría armar un
 * enlace al backoffice que termine mandando a un sitio ajeno.
 */
function vueltaValida(ruta: string | undefined): string | null {
  if (!ruta) return null;
  return /^\/admin\/[\w\-/]*$/.test(ruta) ? ruta : null;
}

export async function guardarEn(
  destino: Destino,
  /** Sin id es un alta. */
  id: string | null,
  cuerpo: FormData | object,
  /**
   * Segundo paso opcional, para lo que no entra en el mismo cuerpo que el
   * resto: hoy solo las imágenes de un proyecto, que viajan en un multipart
   * aparte. Recibe el id definitivo, así sirve igual en el alta.
   */
  luego?: (id: string) => Promise<Resultado>,
): Promise<EstadoForm> {
  await requerirSesion();

  const resultado = id
    ? await editar(destino.recurso, id, cuerpo, destino.etiqueta)
    : await crear(destino.recurso, cuerpo, destino.etiqueta);

  if (!resultado.ok) return { error: resultado.error };

  if (luego) {
    const idFinal = id ?? resultado.id;
    if (!idFinal) {
      return {
        error:
          "Se guardó, pero la API no devolvió el identificador y los archivos quedaron sin subir.",
      };
    }
    const segundo = await luego(idFinal);
    if (!segundo.ok) {
      // El registro ya existe: decirlo evita que se cargue dos veces.
      return { error: `Se guardó, pero los archivos no: ${segundo.error}` };
    }
  }

  const vuelta = vueltaValida(destino.volverA);
  revalidatePath(destino.ruta);
  if (vuelta && vuelta !== destino.ruta) revalidatePath(vuelta);

  redirect(vuelta ?? destino.ruta);
}

/**
 * Alta al vuelo de un catálogo que es solo un nombre, desde el formulario de
 * otro recurso: un servicio que falta mientras se completa una cooperativa, una
 * tecnología que falta mientras se carga un proyecto.
 *
 * Devuelve la opción con su id en vez de refrescar la página. Es la diferencia
 * entre agregar lo que falta y perder todo lo que se venía escribiendo por ir a
 * darlo de alta a otra pantalla.
 *
 * Ojo con los servicios: hasta que la API tenga `destacado` (PENDIENTES, 19
 * bis), lo que se cree acá también aparece en la Home, en Nuestros servicios y
 * en el filtro de Proyectos, porque el sitio los pide todos.
 */
export async function crearOpcion(
  recurso: "servicios" | "sectores" | "tecnologias" | "clientes",
  nombre: string,
): Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }> {
  await requerirSesion();

  const limpio = nombre.trim();
  if (limpio.length < 3) {
    return {
      ok: false,
      error: "El nombre tiene que tener al menos 3 caracteres",
    };
  }

  const resultado = await crear(recurso, { nombre: limpio }, recurso);
  if (!resultado.ok) return { ok: false, error: resultado.error };
  if (!resultado.id) {
    return {
      ok: false,
      error: "Se creó, pero la API no devolvió su identificador",
    };
  }

  return { ok: true, opcion: { id: resultado.id, nombre: limpio } };
}

/** Borra la fila cuyo id viaja en el formulario del botón. */
export async function borrarDe(
  destino: Destino,
  datos: FormData,
): Promise<EstadoForm> {
  await requerirSesion();

  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "No se pudo saber qué registro borrar." };

  const resultado = await borrar(destino.recurso, id, destino.etiqueta);
  if (!resultado.ok) return { error: resultado.error };

  revalidatePath(destino.ruta);
  return undefined;
}
