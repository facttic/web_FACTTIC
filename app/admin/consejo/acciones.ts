"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { archivo, texto } from "@/lib/admin/campos";
import type { EstadoForm } from "@/components/admin/piezas";

const CONSEJO: Destino = {
  recurso: "consejo",
  etiqueta: "consejo",
  ruta: "/admin/consejo",
};

export async function guardarAutoridad(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const nombre = texto(datos, "nombre");
  const cargo = texto(datos, "cargo");
  const cooperativa = texto(datos, "cooperativa");

  if (nombre.length < 2) {
    return { error: "El nombre tiene que tener al menos 2 caracteres" };
  }
  if (cargo.length < 2) {
    return { error: "El cargo tiene que tener al menos 2 caracteres" };
  }
  // La API la pide obligatoria, y la tarjeta del sitio la muestra como chip.
  if (!cooperativa) return { error: "Elegí a qué cooperativa pertenece" };

  const foto = archivo(datos, "file");

  // Sin foto va como JSON: un multipart sin archivo borra el que ya estaba.
  let cuerpo: FormData | object;
  if (foto) {
    const form = new FormData();
    form.set("nombre", nombre);
    form.set("cargo", cargo);
    form.set("cooperativa", cooperativa);
    form.set("file", foto);
    cuerpo = form;
  } else {
    cuerpo = { nombre, cargo, cooperativa };
  }

  return guardarEn(CONSEJO, id, cuerpo);
}

export async function borrarAutoridad(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(CONSEJO, datos);
}
