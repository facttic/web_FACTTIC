import "server-only";

import { apiFetch, normalizePage, sanitize } from "@/lib/api/client";
import type * as Api from "@/lib/api/esquema";
import { isPopulated, type Ref } from "@/lib/api/esquema";
import { mediaUrl } from "@/lib/media";
import type { RegistroSimple } from "@/components/admin/abm-simple";
import type { Opcion } from "@/components/admin/piezas";

/**
 * Lectura para el panel, sin cache.
 *
 * El sitio público cachea; el panel tiene que mostrar lo que acaba de
 * guardarse: si leyera de la misma cache, alguien cargaría algo y no lo vería
 * en la lista.
 *
 * Tampoco reusa el modelo de `lib/dominio`, y no es por descuido: los
 * Las traducciones viajan tal cual, en `en`: el formulario las muestra al lado
 * de cada campo en español y las devuelve igual.
 *
 * Tampoco reusa el modelo de `lib/dominio`, y no es por descuido: los
 * adaptadores del sitio descartan las relaciones que llegan sin popular,
 * porque a una vista no le sirve un id sin nombre. Al formulario le sirve
 * justamente eso —el id es lo que hay que dejar marcado y lo que se manda de
 * vuelta—, así que acá las relaciones se guardan como ids y el nombre viaja
 * aparte, solo para mostrar.
 */

const TODOS = 200;

/** Lo cargado en inglés, con los campos vacíos como cadena, que es lo que
 *  esperan los `defaultValue` del formulario. */
function enIngles<T extends string>(
  traducciones: { en?: Partial<Record<T, unknown>> } | undefined,
  campos: readonly T[],
): Record<T, string> {
  return Object.fromEntries(
    campos.map((campo) => [campo, texto(traducciones?.en?.[campo] as string)]),
  ) as Record<T, string>;
}

/** Trae una colección entera, en la forma cruda de la API. */
async function traerTodos<T>(recurso: string): Promise<T[]> {
  const raw = await apiFetch<Api.Paginated<T>>(`/api/${recurso}`, {
    params: { perPage: TODOS, page: 1 },
  });
  return normalizePage<T>(raw, TODOS).items;
}

async function traerUno<T>(recurso: string, id: string): Promise<T | null> {
  try {
    return sanitize(await apiFetch<T>(`/api/${recurso}/${id}`));
  } catch {
    return null;
  }
}

/* ---------- Relaciones ---------- */

/**
 * Una relación como la necesita el panel. La API la manda populada en unos
 * endpoints y como ObjectId suelto en otros, así que el id siempre está y el
 * nombre solo cuando vino.
 */
export interface Vinculo {
  id: string;
  nombre: string | null;
}

/**
 * Una opción de selector o de casilla: siempre tiene nombre que mostrar. La
 * define el campo que la dibuja, así hay una sola forma de esto en el panel.
 */
export type { Opcion };

function vinculo(
  ref: Ref<{ _id: string; nombre?: string }> | undefined | null,
): Vinculo | null {
  if (!ref) return null;
  if (!isPopulated(ref)) return { id: ref, nombre: null };
  return { id: ref._id, nombre: ref.nombre?.trim() || null };
}

/** Solo los ids: lo que el formulario deja marcado y lo que se manda de vuelta. */
function ids(refs: Ref<{ _id: string }>[] | undefined): string[] {
  return (refs ?? []).map((ref) => (isPopulated(ref) ? ref._id : ref));
}

function texto(valor: string | undefined | null): string {
  return valor?.trim() ?? "";
}

/* ---------- Catálogos simples: tecnologías, clientes, organizaciones ---------- */

export async function traerSimples(recurso: string): Promise<RegistroSimple[]> {
  const items = await traerTodos<Record<string, unknown>>(recurso);

  return sanitize(items).map((item) => ({
    id: String(item._id),
    nombre: String(item.nombre ?? "").trim(),
    logo: mediaUrl((item.fileName as string) ?? (item.logo as string) ?? null),
  }));
}

export async function traerSimple(
  recurso: string,
  id: string,
): Promise<RegistroSimple | null> {
  const item = await traerUno<Record<string, unknown>>(recurso, id);
  if (!item) return null;
  return {
    id: String(item._id),
    nombre: String(item.nombre ?? "").trim(),
    logo: mediaUrl((item.fileName as string) ?? (item.logo as string) ?? null),
  };
}

/* ---------- Sectores ---------- */

export interface Sector {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number | null;
  /** Del catálogo de la Federación: es lo único que sale en el sitio. */
  destacado: boolean;
  imagen: string | null;
  animacion: string | null;
  en: { nombre: string; descripcion: string };
}

function aSector(api: Api.Sector): Sector {
  return {
    id: api._id,
    nombre: texto(api.nombre),
    descripcion: texto(api.descripcion),
    orden: api.orden ?? null,
    destacado: api.esDestacado === true,
    imagen: mediaUrl(api.imageFileName),
    animacion: mediaUrl(api.lottieFileName),
    en: enIngles(api.traducciones, ["nombre", "descripcion"]),
  };
}

export async function traerSectores(): Promise<Sector[]> {
  const sectores = await traerTodos<Api.Sector>("sectores");
  return sectores
    .map(aSector)
    .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}

export async function traerSector(id: string): Promise<Sector | null> {
  const sector = await traerUno<Api.Sector>("sectores", id);
  return sector && aSector(sector);
}

/* ---------- Servicios ---------- */

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number | null;
  /** Del catálogo de la Federación: es lo único que sale en el sitio. */
  destacado: boolean;
  subservicios: Array<{ nombre: string; descripcion: string }>;
  /** La cooperativa que lo creó; vacío si es del catálogo de la Federación. */
  cooperativa: string;
  /*
   * Los subservicios no se editan en inglés desde el panel —el formulario los
   * arma como dos listas paralelas y hay que resolver cómo emparejarlas—, pero
   * sí viajan de ida y vuelta: si no, guardar un servicio borraría la
   * traducción que ya tuvieran cargada.
   */
  en: {
    nombre: string;
    descripcion: string;
    subservicios: Array<{ nombre?: string; descripcion?: string }>;
  };
}

function aServicio(api: Api.Servicio): Servicio {
  return {
    id: api._id,
    nombre: texto(api.nombre),
    descripcion: texto(api.descripcion),
    orden: api.orden ?? null,
    destacado: api.esDestacado === true,
    subservicios: (api.subservicios ?? []).map((sub) => ({
      nombre: texto(sub.nombre),
      descripcion: texto(sub.descripcion),
    })),
    cooperativa: texto(api.cooperativa),
    en: {
      ...enIngles(api.traducciones, ["nombre", "descripcion"]),
      subservicios: api.traducciones?.en?.subservicios ?? [],
    },
  };
}

export async function traerServicios(): Promise<Servicio[]> {
  const servicios = await traerTodos<Api.Servicio>("servicios");
  return servicios
    .map(aServicio)
    .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}

export async function traerServicio(id: string): Promise<Servicio | null> {
  const servicio = await traerUno<Api.Servicio>("servicios", id);
  return servicio && aServicio(servicio);
}

/* ---------- Consejo ---------- */

export interface Autoridad {
  id: string;
  nombre: string;
  cargo: string;
  cooperativa: Vinculo | null;
  foto: string | null;
}

function aAutoridad(api: Api.Consejo): Autoridad {
  return {
    id: api._id,
    nombre: texto(api.nombre),
    cargo: texto(api.cargo),
    cooperativa: vinculo(api.cooperativa),
    foto: mediaUrl(api.fileName),
  };
}

export async function traerConsejo(): Promise<Autoridad[]> {
  const consejo = await traerTodos<Api.Consejo>("consejo");
  return consejo.map(aAutoridad);
}

export async function traerAutoridad(id: string): Promise<Autoridad | null> {
  const autoridad = await traerUno<Api.Consejo>("consejo", id);
  return autoridad && aAutoridad(autoridad);
}

/* ---------- Novedades ---------- */

export interface Novedad {
  id: string;
  tipo: Api.Novedad["tipo"];
  titulo: string;
  bajada: string;
  cuerpo: string;
  /** ISO completo, como lo guarda la API. */
  fecha: string;
  imagen: string | null;
  en: { titulo: string; bajada: string; cuerpo: string };
}

function aNovedad(api: Api.Novedad): Novedad {
  return {
    id: api._id,
    tipo: api.tipo,
    titulo: texto(api.titulo),
    bajada: texto(api.bajada),
    cuerpo: texto(api.cuerpo),
    fecha: texto(api.fecha) || texto(api.createdAt),
    imagen: mediaUrl(api.fileName),
    en: enIngles(api.traducciones, ["titulo", "bajada", "cuerpo"]),
  };
}

export async function traerNovedades(): Promise<Novedad[]> {
  const raw = await apiFetch<Api.Paginated<Api.Novedad>>("/api/novedades", {
    params: { perPage: TODOS, page: 1, sort: "fecha", order: "DESC" },
  });
  return normalizePage<Api.Novedad>(raw, TODOS).items.map(aNovedad);
}

export async function traerNovedad(id: string): Promise<Novedad | null> {
  const novedad = await traerUno<Api.Novedad>("novedades", id);
  return novedad && aNovedad(novedad);
}

/* ---------- Cooperativas ---------- */

export interface Cooperativa {
  /** Los mails habilitados a editarla. Lo administra solo la Federación. */
  editores: string[];
  id: string;
  nombre: string;
  asociados: number | null;
  ubicacion: { lat: number; lng: number } | null;
  servicios: string[];
  sectores: string[];
  logo: string | null;
}

function aCooperativa(api: Api.Cooperativa): Cooperativa {
  return {
    editores: api.editores ?? [],
    id: api._id,
    nombre: texto(api.nombre),
    asociados: api.asociados ?? null,
    ubicacion:
      api.ubicacion?.lat != null && api.ubicacion?.lng != null
        ? { lat: api.ubicacion.lat, lng: api.ubicacion.lng }
        : null,
    servicios: ids(api.servicios),
    sectores: ids(api.sectores),
    logo: mediaUrl(api.fileName),
  };
}

export async function traerCooperativas(): Promise<Cooperativa[]> {
  const cooperativas = await traerTodos<Api.Cooperativa>("cooperativas");
  return cooperativas
    .map(aCooperativa)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function traerCooperativa(
  id: string,
): Promise<Cooperativa | null> {
  const cooperativa = await traerUno<Api.Cooperativa>("cooperativas", id);
  return cooperativa && aCooperativa(cooperativa);
}

/* ---------- Proyectos ---------- */

export interface Proyecto {
  id: string;
  nombre: string;
  sector: Vinculo | null;
  cliente: Vinculo | null;
  servicios: string[];
  tecnologias: string[];
  cooperativas: string[];
  desafio: string;
  solucion: string;
  resultado: string;
  destacado: boolean;
  /** URLs listas para mostrar. */
  imagenes: string[];
  en: { nombre: string; desafio: string; solucion: string; resultado: string };
}

function aProyecto(api: Api.Proyecto): Proyecto {
  return {
    id: api._id,
    nombre: texto(api.nombre),
    sector: vinculo(api.sector),
    cliente: vinculo(api.cliente),
    servicios: ids(api.servicios),
    tecnologias: ids(api.tecnologias),
    cooperativas: ids(api.cooperativas),
    desafio: texto(api.desafio),
    solucion: texto(api.solucion),
    resultado: texto(api.resultado),
    destacado: api.esDestacado ?? false,
    imagenes: (api.imageFileNames ?? [])
      .map((nombre) => mediaUrl(nombre))
      .filter((url): url is string => url !== null),
    en: enIngles(api.traducciones, [
      "nombre",
      "desafio",
      "solucion",
      "resultado",
    ]),
  };
}

export async function traerProyectos(): Promise<Proyecto[]> {
  // Proyectos usa la otra convención de paginación: `limit`, no `perPage`.
  const raw = await apiFetch<Api.Paginated<Api.Proyecto>>("/api/proyectos", {
    params: { limit: TODOS, page: 1 },
  });
  return normalizePage<Api.Proyecto>(raw, TODOS).items.map(aProyecto);
}

/** Los proyectos en los que participa una cooperativa, para su ficha. */
export async function traerProyectosDe(
  cooperativa: string,
): Promise<Proyecto[]> {
  const raw = await apiFetch<Api.Paginated<Api.Proyecto>>("/api/proyectos", {
    params: { limit: TODOS, page: 1, cooperativa },
  });
  return normalizePage<Api.Proyecto>(raw, TODOS).items.map(aProyecto);
}

export async function traerProyecto(id: string): Promise<Proyecto | null> {
  const proyecto = await traerUno<Api.Proyecto>("proyectos", id);
  return proyecto && aProyecto(proyecto);
}

/** Las listas que llenan los selectores de los formularios. */
export async function traerOpciones(): Promise<{
  sectores: Opcion[];
  servicios: Opcion[];
  tecnologias: Opcion[];
  clientes: Opcion[];
  cooperativas: Opcion[];
}> {
  const [sectores, servicios, tecnologias, clientes, cooperativas] =
    await Promise.all([
      traerSimples("sectores"),
      traerSimples("servicios"),
      traerSimples("tecnologias"),
      traerSimples("clientes"),
      traerSimples("cooperativas"),
    ]);

  const aOpciones = (registros: RegistroSimple[]): Opcion[] =>
    registros
      .map((registro) => ({ id: registro.id, nombre: registro.nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return {
    sectores: aOpciones(sectores),
    servicios: aOpciones(servicios),
    tecnologias: aOpciones(tecnologias),
    clientes: aOpciones(clientes),
    cooperativas: aOpciones(cooperativas),
  };
}
