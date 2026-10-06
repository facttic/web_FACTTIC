"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { archivo, numero, texto, traducciones } from "@/lib/admin/campos";
import { requerirSesion } from "@/lib/api/guardia";
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
  /* Las verticales del sitio son de la Federación: una cooperativa carga
     sectores para su ficha, pero no decide cuáles tienen pantalla propia, ni
     les pone la imagen y la animación de esa pantalla. Sin los campos, lo que
     ya estuviera marcado o cargado queda como está. La API lo verifica igual. */
  const { esAdmin } = await requerirSesion();
  const esDestacado = esAdmin && datos.get("esDestacado") === "on";
  const imagen = esAdmin ? archivo(datos, "imageFile") : undefined;
  const animacion = esAdmin ? archivo(datos, "lottieFile") : undefined;
  const enIngles = traducciones(datos, ["nombre", "descripcion"]);

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
    if (esAdmin) form.set("esDestacado", String(esDestacado));
    if (imagen) form.set("imageFile", imagen);
    if (animacion) form.set("lottieFile", animacion);
    // Por multipart los objetos no viajan: la API acepta el JSON serializado.
    if (enIngles) form.set("traducciones", JSON.stringify(enIngles));
    cuerpo = form;
  } else {
    cuerpo = {
      nombre,
      descripcion,
      ...(orden !== undefined ? { orden } : {}),
      ...(esAdmin ? { esDestacado } : {}),
      ...(enIngles ? { traducciones: enIngles } : {}),
    };
  }

  return guardarEn(SECTORES, id, cuerpo);
}

export async function borrarSector(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(SECTORES, datos);
}
