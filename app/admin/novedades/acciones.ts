"use server";

import { borrarDe, guardarEn, type Destino } from "@/lib/admin/acciones";
import { archivo, texto } from "@/lib/admin/campos";
import type { EstadoForm } from "@/components/admin/piezas";

const NOVEDADES: Destino = {
  recurso: "novedades",
  etiqueta: "novedades",
  ruta: "/admin/novedades",
};

const TIPOS = ["comunicado", "noticia", "actividad"] as const;

/**
 * El campo de fecha del formulario da un día suelto (`2025-11-04`) y la API
 * exige un ISO con hora: `2025-11-04` responde 400. Se completa al mediodía
 * UTC, que en Argentina sigue cayendo el mismo día —a las 00:00 se correría al
 * anterior— y es lo que ya tienen cargadas las novedades que existen.
 */
function aIso(dia: string): string {
  return `${dia}T12:00:00Z`;
}

export async function guardarNovedad(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const tipo = texto(datos, "tipo");
  const titulo = texto(datos, "titulo");
  const bajada = texto(datos, "bajada");
  const cuerpo = texto(datos, "cuerpo");
  const dia = texto(datos, "fecha");

  if (!TIPOS.includes(tipo as (typeof TIPOS)[number])) {
    return { error: "Elegí si es un comunicado, una noticia o una actividad" };
  }
  if (titulo.length < 3) {
    return { error: "El título tiene que tener al menos 3 caracteres" };
  }
  if (bajada.length < 3) {
    return { error: "La bajada tiene que tener al menos 3 caracteres" };
  }
  if (cuerpo.length < 10) {
    return { error: "El cuerpo tiene que tener al menos 10 caracteres" };
  }
  if (!dia) return { error: "Poné la fecha de la novedad" };

  const campos = { tipo, titulo, bajada, cuerpo, fecha: aIso(dia) };
  const portada = archivo(datos, "file");

  // Sin portada va como JSON: un multipart sin archivo borra la que ya estaba.
  let contenido: FormData | object;
  if (portada) {
    const form = new FormData();
    for (const [campo, valor] of Object.entries(campos)) form.set(campo, valor);
    form.set("file", portada);
    contenido = form;
  } else {
    contenido = campos;
  }

  return guardarEn(NOVEDADES, id, contenido);
}

export async function borrarNovedad(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(NOVEDADES, datos);
}
