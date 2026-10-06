"use server";

import {
  borrarDe,
  crearOpcion,
  guardarEn,
  type Destino,
} from "@/lib/admin/acciones";
import {
  archivo,
  lista,
  numero,
  texto,
  traducciones,
} from "@/lib/admin/campos";
import { escribirEn } from "@/lib/api/escritura";
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
  /*
   * Sin ubicación la cooperativa no aparece en ninguna parte del sitio: Nuestra
   * Red agrupa por provincia y la provincia se calcula con las coordenadas. Una
   * ficha completa que no se muestra en ningún lado es peor que no tenerla, así
   * que acá se pide.
   */
  if (lat === undefined || lng === undefined) {
    return {
      error:
        "Falta la ubicación: buscá la ciudad en el mapa. Sin ella la cooperativa no se muestra en el sitio.",
    };
  }
  if (lat !== undefined && (lat < -90 || lat > 90)) {
    return { error: "La latitud va entre -90 y 90" };
  }
  if (lng !== undefined && (lng < -180 || lng > 180)) {
    return { error: "La longitud va entre -180 y 180" };
  }

  const servicios = lista(datos, "servicios");
  const sectores = lista(datos, "sectores");

  /*
   * Lo que cuenta quién es la cooperativa. Va siempre, también vacío: así se
   * puede borrar un sitio o un teléfono que ya no corresponde. Si se omitiera,
   * la API dejaría el valor viejo.
   */
  const fundacion = numero(datos, "fundacion");
  const presentacion = {
    descripcion: texto(datos, "descripcion"),
    sitio: texto(datos, "sitio"),
    email: texto(datos, "email"),
    telefono: texto(datos, "telefono"),
    redes: {
      linkedin: texto(datos, "linkedin"),
      instagram: texto(datos, "instagram"),
      github: texto(datos, "github"),
    },
    ...(fundacion !== undefined ? { fundacion } : {}),
  };
  const enIngles = traducciones(datos, ["descripcion"]);
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
    form.set("descripcion", presentacion.descripcion);
    form.set("sitio", presentacion.sitio);
    form.set("email", presentacion.email);
    form.set("telefono", presentacion.telefono);
    form.set("redes", JSON.stringify(presentacion.redes));
    if (fundacion !== undefined) form.set("fundacion", String(fundacion));
    if (enIngles) form.set("traducciones", JSON.stringify(enIngles));
    form.set("file", logo);
    cuerpo = form;
  } else {
    cuerpo = {
      nombre,
      ...(asociados !== undefined ? { asociados } : {}),
      ...(ubicacion ? { ubicacion } : {}),
      servicios,
      sectores,
      ...presentacion,
      ...(enIngles ? { traducciones: enIngles } : {}),
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

/**
 * Suma a alguien como editor de una cooperativa y le manda la invitación.
 *
 * Solo la Federación. La API lo verifica igual; acá se corta antes para no
 * mostrar un error inútil. El mail queda habilitado en el momento en que se
 * agrega: el link es para que pueda crear su cuenta.
 */
export async function invitarEditor(
  id: string,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const email = texto(datos, "email");
  if (!email.includes("@")) return { error: "Escribí un correo válido" };

  const res = await escribirEn(
    `/api/cooperativas/${id}/editores`,
    "POST",
    { email },
    "cooperativas",
  );
  return res.ok ? undefined : { error: res.error };
}

/** Le quita el acceso a alguien y revoca su invitación pendiente. */
export async function quitarEditor(
  id: string,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const email = texto(datos, "email");
  const res = await escribirEn(
    `/api/cooperativas/${id}/editores/${encodeURIComponent(email)}`,
    "DELETE",
    undefined,
    "cooperativas",
  );
  return res.ok ? undefined : { error: res.error };
}
