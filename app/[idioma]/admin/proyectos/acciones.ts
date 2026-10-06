"use server";

import {
  borrarDe,
  crearOpcion,
  editarOpcion,
  guardarEn,
  type Destino,
} from "@/lib/admin/acciones";
import { archivos, lista, texto, traducciones } from "@/lib/admin/campos";
import { editar } from "@/lib/api/escritura";
import { requerirSesion } from "@/lib/api/guardia";
import type { EstadoForm } from "@/components/admin/piezas";

const PROYECTOS: Destino = {
  recurso: "proyectos",
  etiqueta: "proyectos",
  ruta: "/admin/proyectos",
};

/*
 * Lo que se puede dar de alta sin salir del proyecto: el stack cambia con cada
 * uno y el cliente casi siempre es nuevo, y los tres son catálogos de un solo
 * campo, así que crearlos desde acá no deja nada a medias.
 *
 * Cooperativas no: una creada con solo el nombre queda como una ficha vacía en
 * Nuestra Red. Esas se cargan en su propia pantalla.
 */
export async function crearTecnologia(nombre: string) {
  return crearOpcion("tecnologias", nombre);
}

export async function crearCliente(nombre: string, logo?: File) {
  return crearOpcion("clientes", nombre, logo);
}

/*
 * Corregir sin salir del proyecto: si el nombre quedó mal escrito, la única
 * salida era crear otro cliente y dejar el error en el catálogo. La API lo
 * deja a quien lo creó, y a la Federación con cualquiera.
 */
export async function editarCliente(id: string, nombre: string, logo?: File) {
  return editarOpcion("clientes", id, nombre, logo);
}

export async function editarTecnologia(id: string, nombre: string) {
  return editarOpcion("tecnologias", id, nombre);
}

export async function crearServicio(nombre: string) {
  return crearOpcion("servicios", nombre);
}

/*
 * Un sector creado desde acá queda fuera del catálogo de la Federación: sirve
 * para clasificar el proyecto y para que lo encuentren los filtros, pero no
 * arma una vertical del sitio —eso lleva imagen, animación y una pantalla
 * entera, y se carga en Sectores—.
 */
export async function crearSector(nombre: string) {
  return crearOpcion("sectores", nombre);
}

export async function guardarProyecto(
  id: string | null,
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  const nombre = texto(datos, "nombre");
  if (nombre.length < 3) {
    return { error: "El nombre tiene que tener al menos 3 caracteres" };
  }

  const enIngles = traducciones(datos, [
    "nombre",
    "desafio",
    "solucion",
    "resultado",
  ]);
  const sector = texto(datos, "sector");
  const cliente = texto(datos, "cliente");

  /*
   * Destacar es cosa de la Federación: decide qué proyectos muestra la Home,
   * y una cooperativa no elige eso para el sitio entero. Si no es admin el
   * campo ni viaja, así que lo que ya estaba marcado queda como estaba: la
   * API solo pisa los campos que recibe. La comprobación de verdad es la
   * suya; esto es para que el panel no mande lo que no corresponde.
   */
  const { esAdmin } = await requerirSesion();

  const cuerpo = {
    nombre,
    // Los ObjectId vacíos no se mandan: la API los rechaza por formato.
    ...(sector ? { sector } : {}),
    ...(cliente ? { cliente } : {}),
    servicios: lista(datos, "servicios"),
    tecnologias: lista(datos, "tecnologias"),
    cooperativas: lista(datos, "cooperativas"),
    desafio: texto(datos, "desafio"),
    solucion: texto(datos, "solucion"),
    resultado: texto(datos, "resultado"),
    ...(esAdmin ? { esDestacado: datos.get("esDestacado") === "on" } : {}),
    /* Las traducciones van en el mismo cuerpo JSON: las imágenes viajan en un
       PUT aparte y ahí no hace falta repetirlas. */
    ...(enIngles ? { traducciones: enIngles } : {}),
  };

  /*
   * Las imágenes van en un PUT aparte, y no por gusto: el multipart de
   * proyectos no acepta las relaciones en la misma forma que el JSON, así que
   * mandar todo junto obligaría a serializar cada lista y a confiar en un
   * camino que la API tiene a medio hacer. Un PUT multipart con solo los
   * archivos, en cambio, deja intacto todo lo demás —probado contra la API—, y
   * en el alta se hace con el id que devuelve el POST.
   *
   * `imageFiles` va sin corchetes: con `imageFiles[]`, que es lo que documenta
   * el spec, la API responde 500.
   */
  const imagenes = archivos(datos, "imageFiles");

  // Si se llegó desde la ficha de una cooperativa, se vuelve ahí y no al listado.
  const volverA = texto(datos, "volver") || undefined;

  return guardarEn(
    { ...PROYECTOS, volverA },
    id,
    cuerpo,
    imagenes.length
      ? async (idFinal) => {
          const form = new FormData();
          for (const imagen of imagenes) form.append("imageFiles", imagen);
          return editar("proyectos", idFinal, form, PROYECTOS.etiqueta);
        }
      : undefined,
  );
}

export async function borrarProyecto(
  _estado: EstadoForm,
  datos: FormData,
): Promise<EstadoForm> {
  return borrarDe(PROYECTOS, datos);
}
