"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { numero, texto, traducciones } from "@/lib/admin/campos";
import { requerirSesion } from "@/lib/api/guardia";
import type { EstadoForm } from "@/components/admin/piezas";

const SERVICIOS: Destino = {
  recurso: "servicios",
  etiqueta: "servicios",
  ruta: "/admin/servicios",
};

/**
 * Los subservicios llegan como listas paralelas —los nombres por un lado, las
 * descripciones por otro y los nombres en inglés por un tercero— porque un
 * formulario HTML no anida. Se juntan por posición y se descartan las filas sin
 * nombre, que son las que quedaron vacías.
 *
 * Devuelve las dos versiones ya alineadas: como salen del mismo envío, el
 * inglés no puede quedar corrido respecto del español.
 */
function leerSubservicios(datos: FormData) {
  const nombres = datos.getAll("subservicioNombre");
  const descripciones = datos.getAll("subservicioDescripcion");
  const nombresEn = datos.getAll("subservicioNombreEn");

  const filas = nombres
    .map((nombre, i) => ({
      nombre: String(nombre).trim(),
      descripcion: String(descripciones[i] ?? "").trim(),
      nombreEn: String(nombresEn[i] ?? "").trim(),
    }))
    .filter((fila) => fila.nombre);

  return {
    es: filas.map((fila) =>
      fila.descripcion
        ? { nombre: fila.nombre, descripcion: fila.descripcion }
        : { nombre: fila.nombre },
    ),
    /* El inglés viaja completo, con los huecos incluidos: es lo que mantiene
       la correspondencia por posición con la lista de arriba. */
    en: filas.some((fila) => fila.nombreEn)
      ? filas.map((fila) => ({ nombre: fila.nombreEn }))
      : [],
  };
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
  /* El catálogo de la Federación es suyo: una cooperativa carga servicios para
     su ficha, pero no decide cuáles muestran la Home y Nuestros servicios. Sin
     el campo, lo marcado queda como está. La API lo verifica igual. */
  const { esAdmin } = await requerirSesion();
  /* Los subservicios no se traducen todavía desde el panel: la API los acepta,
     pero el formulario los arma como dos listas paralelas y hay que resolver
     cómo emparejarlas con su traducción. */
  const enIngles = traducciones(datos, ["nombre", "descripcion"]);
  const subservicios = leerSubservicios(datos);
  const traduccion =
    enIngles || subservicios.en.length
      ? {
          en: {
            ...(enIngles?.en ?? {}),
            ...(subservicios.en.length
              ? { subservicios: subservicios.en }
              : {}),
          },
        }
      : undefined;

  // Servicios no tiene archivos, así que siempre va como JSON.
  return guardarEn(SERVICIOS, id, {
    nombre,
    descripcion: texto(datos, "descripcion"),
    ...(orden !== undefined ? { orden } : {}),
    ...(esAdmin ? { esDestacado: datos.get("esDestacado") === "on" } : {}),
    subservicios: subservicios.es,
    ...(traduccion ? { traducciones: traduccion } : {}),
  });
}

export async function borrarServicio(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(SERVICIOS, datos);
}
