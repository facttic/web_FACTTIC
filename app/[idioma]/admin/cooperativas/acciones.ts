"use server";

import {
  borrarDe,
  crearOpcion,
  guardarEn,
  type Destino,
} from "@/lib/admin/acciones";
import { archivo, lista, numero, texto } from "@/lib/admin/campos";
import type { EstadoForm } from "@/components/admin/piezas";

const COOPERATIVAS: Destino = {
  recurso: "cooperativas",
  etiqueta: "cooperativas",
  ruta: "/admin/cooperativas",
};

export async function crearServicio(nombre: string) {
  return crearOpcion("servicios", nombre);
}

export async function crearSector(nombre: string) {
  return crearOpcion("sectores", nombre);
}

export async function guardarCooperativa(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const nombre = texto(datos, "nombre");
  if (nombre.length < 3) {
    return { error: "El nombre tiene que tener al menos 3 caracteres" };
  }

  const asociados = numero(datos, "asociados");
  if (
    asociados !== undefined &&
    (asociados < 0 || !Number.isInteger(asociados))
  ) {
    return { error: "Los asociados tienen que ser un número entero" };
  }

  const lat = numero(datos, "lat");
  const lng = numero(datos, "lng");
  // O van las dos coordenadas o no va ninguna: media ubicación no ubica nada.
  if ((lat === undefined) !== (lng === undefined)) {
    return { error: "La ubicación necesita latitud y longitud" };
  }
  if (lat !== undefined && (lat < -90 || lat > 90)) {
    return { error: "La latitud va entre -90 y 90" };
  }
  if (lng !== undefined && (lng < -180 || lng > 180)) {
    return { error: "La longitud va entre -180 y 180" };
  }

  const servicios = lista(datos, "servicios");
  const sectores = lista(datos, "sectores");
  const ubicacion =
    lat !== undefined && lng !== undefined ? { lat, lng } : null;
  const logo = archivo(datos, "file");

  /*
   * Con logo va como multipart, y ahí los campos compuestos viajan serializados:
   * la API espera `ubicacion` y las dos listas como cadenas JSON. Sin logo va
   * como JSON, que además es la única forma de vaciar una lista.
   */
  let cuerpo: FormData | object;
  if (logo) {
    const form = new FormData();
    form.set("nombre", nombre);
    if (asociados !== undefined) form.set("asociados", String(asociados));
    if (ubicacion) form.set("ubicacion", JSON.stringify(ubicacion));
    form.set("servicios", JSON.stringify(servicios));
    form.set("sectores", JSON.stringify(sectores));
    form.set("file", logo);
    cuerpo = form;
  } else {
    cuerpo = {
      nombre,
      ...(asociados !== undefined ? { asociados } : {}),
      ...(ubicacion ? { ubicacion } : {}),
      servicios,
      sectores,
    };
  }

  return guardarEn(COOPERATIVAS, id, cuerpo);
}

export async function borrarCooperativa(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(COOPERATIVAS, datos);
}
