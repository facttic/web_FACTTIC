"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { numero, texto } from "@/lib/admin/campos";
import type { EstadoForm } from "@/components/admin/piezas";

const SERVICIOS: Destino = {
  recurso: "servicios",
  etiqueta: "servicios",
  ruta: "/admin/servicios",
};

/**
 * Los subservicios llegan como dos listas paralelas —los nombres por un lado y
 * las descripciones por otro— porque un formulario HTML no anida. Se juntan por
 * posición y se descartan las filas sin nombre, que son las que quedaron
 * vacías.
 */
function leerSubservicios(
  datos: FormData,
): Array<{ nombre: string; descripcion?: string }> {
  const nombres = datos.getAll("subservicioNombre");
  const descripciones = datos.getAll("subservicioDescripcion");

  return nombres
    .map((nombre, i) => ({
      nombre: String(nombre).trim(),
      descripcion: String(descripciones[i] ?? "").trim(),
    }))
    .filter((sub) => sub.nombre)
    .map((sub) =>
      sub.descripcion
        ? { nombre: sub.nombre, descripcion: sub.descripcion }
        : { nombre: sub.nombre },
    );
}

export async function guardarServicio(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const nombre = texto(datos, "nombre");
  if (nombre.length < 3) {
    return { error: "El nombre tiene que tener al menos 3 caracteres" };
  }

  const orden = numero(datos, "orden");

  // Servicios no tiene archivos, así que siempre va como JSON.
  return guardarEn(SERVICIOS, id, {
    nombre,
    descripcion: texto(datos, "descripcion"),
    ...(orden !== undefined ? { orden } : {}),
    esDestacado: datos.get("esDestacado") === "on",
    subservicios: leerSubservicios(datos),
  });
}

export async function borrarServicio(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(SERVICIOS, datos);
}
