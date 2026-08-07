"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { archivo, numero, texto } from "@/lib/admin/campos";
import type { EstadoForm } from "@/components/admin/piezas";

const SECTORES: Destino = {
  recurso: "sectores",
  etiqueta: "sectores",
  ruta: "/admin/sectores",
};

export async function guardarSector(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const nombre = texto(datos, "nombre");
  if (nombre.length < 3) {
    return { error: "El nombre tiene que tener al menos 3 caracteres" };
  }

  const descripcion = texto(datos, "descripcion");
  const orden = numero(datos, "orden");
  const imagen = archivo(datos, "imageFile");
  const animacion = archivo(datos, "lottieFile");

  /*
   * Con archivos va como multipart y sin archivos como JSON: un multipart sin
   * la parte del archivo hace que la API interprete que se quiere borrar el que
   * ya estaba. Como son dos archivos distintos —imagen y animación— y cada uno
   * se manda solo si se eligió, el que no viaja queda intacto.
   */
  let cuerpo: FormData | object;
  if (imagen || animacion) {
    const form = new FormData();
    form.set("nombre", nombre);
    if (descripcion) form.set("descripcion", descripcion);
    if (orden !== undefined) form.set("orden", String(orden));
    if (imagen) form.set("imageFile", imagen);
    if (animacion) form.set("lottieFile", animacion);
    cuerpo = form;
  } else {
    cuerpo = { nombre, descripcion, ...(orden !== undefined ? { orden } : {}) };
  }

  return guardarEn(SECTORES, id, cuerpo);
}

export async function borrarSector(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(SECTORES, datos);
}
