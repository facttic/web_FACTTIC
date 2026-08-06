import { firstMediaUrl, mediaUrl } from "@/lib/media";
import { isPopulated, type Ref } from "@/lib/api/esquema";
import type * as Api from "@/lib/api/esquema";
import type * as Dominio from "./tipos";

/**
 * Traducción de la API al modelo del sitio.
 *
 * Este archivo es el único lugar que conoce las dos formas a la vez. Si la API
 * cambia, se cambia acá y nada más.
 *
 * Cambios ya pedidos al backend y dónde impactarían:
 *
 *   - `slug` en proyectos      → `slugDeProyecto()`
 *   - `provincia` en coops     → `provinciaDe()`
 *   - `logo` en cooperativas   → `aCooperativa()`
 *   - unificar la paginación   → `aPagina()` (hoy tolera las dos formas)
 *   - novedades y contacto     → recursos nuevos, no afectan a estos
 *   - GET públicos             → no llega hasta acá: es cosa del transporte
 */

function texto(valor: string | undefined | null): string | null {
  const limpio = valor?.trim();
  return limpio ? limpio : null;
}

/** Convierte un nombre en algo usable en una URL. */
export function slugify(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Resuelve una relación que puede venir como ObjectId o como objeto. Cuando
 * llega solo el id no hay nombre que mostrar, así que se descarta.
 */
function aReferencia(
  ref: Ref<{ _id: string; nombre?: string }> | undefined | null,
): Dominio.Referencia | null {
  if (!isPopulated(ref)) return null;
  const nombre = texto(ref.nombre);
  return nombre ? { id: ref._id, nombre } : null;
}

function aReferencias(
  refs: Ref<{ _id: string; nombre?: string }>[] | undefined,
): Dominio.Referencia[] {
  return (refs ?? [])
    .map(aReferencia)
    .filter((r): r is Dominio.Referencia => r !== null);
}

export function aServicio(api: Api.Servicio): Dominio.Servicio {
  return {
    id: api._id,
    nombre: texto(api.nombre) ?? "Sin nombre",
    descripcion: texto(api.descripcion),
    orden: api.orden ?? 99,
    subservicios: (api.subservicios ?? [])
      .map((s) => ({
        nombre: texto(s.nombre) ?? "",
        descripcion: texto(s.descripcion),
      }))
      .filter((s) => s.nombre),
  };
}

export function aSector(api: Api.Sector): Dominio.Sector {
  const nombre = texto(api.nombre) ?? "Sin nombre";
  return {
    id: api._id,
    nombre,
    slug: slugify(nombre),
    descripcion: texto(api.descripcion),
    orden: api.orden ?? 99,
    imagen: mediaUrl(api.imageFileName),
    animacion: mediaUrl(api.lottieFileName),
  };
}

export function aTecnologia(api: Api.Tecnologia): Dominio.Tecnologia {
  return {
    id: api._id,
    nombre: texto(api.nombre) ?? "Sin nombre",
    // La base guarda el logo en dos campos distintos según cómo se cargó.
    logo: mediaUrl(api.fileName) ?? mediaUrl(api.logo),
  };
}

/**
 * Provincia de una cooperativa.
 *
 * El modelo no tiene el campo y ninguna cooperativa trae ubicación cargada, así
 * que hoy devuelve null. Cuando el backend agregue `provincia`, se lee de ahí;
 * mientras tanto, el mapa federal la deriva de las coordenadas con el GeoJSON.
 */
function provinciaDe(_api: Api.Cooperativa): string | null {
  return null;
}

export function aCooperativa(api: Api.Cooperativa): Dominio.Cooperativa {
  return {
    id: api._id,
    nombre: texto(api.nombre) ?? "Sin nombre",
    asociados: api.asociados ?? 0,
    ubicacion:
      api.ubicacion?.lat != null && api.ubicacion?.lng != null
        ? api.ubicacion
        : null,
    provincia: provinciaDe(api),
    // Pendiente: el modelo todavía no tiene campo de logo.
    logo: null,
    servicios: aReferencias(api.servicios),
    sectores: aReferencias(api.sectores),
  };
}

export function aAutoridad(api: Api.Consejo): Dominio.Autoridad {
  return {
    id: api._id,
    nombre: texto(api.nombre) ?? "Sin nombre",
    cargo: texto(api.cargo) ?? "",
    cooperativa: aReferencia(api.cooperativa),
  };
}

export function aOrganizacion(api: Api.Organizacion): Dominio.Organizacion {
  return {
    id: api._id,
    nombre: texto(api.nombre) ?? "Sin nombre",
    logo: mediaUrl(api.logo) ?? mediaUrl(api.fileName),
  };
}

/**
 * Identificador del proyecto en la URL: el slug si la API lo trae y el
 * ObjectId si no.
 *
 * La API genera el slug al crear el proyecto y lo declara inmutable, así que
 * los que se cargaron antes de que existiera el campo se quedaron sin él —un
 * PUT no lo rellena— y necesitan una migración del backend. Hasta entonces
 * conviven las dos formas de URL, y el detalle resuelve cualquiera porque
 * `GET /api/proyectos/{id}` acepta las dos.
 */
function slugDeProyecto(api: Api.Proyecto): string {
  return texto(api.slug) ?? api._id;
}

export function aProyecto(api: Api.Proyecto): Dominio.Proyecto {
  const imagenes = (api.imageFileNames ?? [])
    .map((nombre) => mediaUrl(nombre))
    .filter((url): url is string => url !== null);

  return {
    id: api._id,
    slug: slugDeProyecto(api),
    nombre: texto(api.nombre) ?? "Sin nombre",
    cliente: aReferencia(api.cliente),
    sector: aReferencia(api.sector),
    servicios: aReferencias(api.servicios),
    tecnologias: (api.tecnologias ?? [])
      .filter(isPopulated)
      .map((t) => aTecnologia(t as Api.Tecnologia)),
    cooperativas: aReferencias(api.cooperativas),
    desafio: texto(api.desafio),
    solucion: texto(api.solucion),
    resultado: texto(api.resultado),
    destacado: api.esDestacado ?? false,
    portada: firstMediaUrl(api.imageFileNames),
    imagenes,
    videos: (api.videoFileNames ?? [])
      .map((nombre) => mediaUrl(nombre))
      .filter((url): url is string => url !== null),
    fecha: api.createdAt ?? null,
  };
}

/** Traduce una página de la API al modelo del sitio. */
export function aPagina<A, D>(
  pagina: Api.Paginated<A>,
  adaptador: (item: A) => D,
): Dominio.Pagina<D> {
  return {
    items: pagina.items.map(adaptador),
    total: pagina.total,
    pagina: pagina.page,
    porPagina: pagina.perPage,
    paginas: pagina.pages,
  };
}

/**
 * Novedad para las vistas.
 *
 * La API todavía no expone slug acá, así que la URL usa el id. El `tipo` se
 * valida contra los tres que declara el backend: si llegara otro, cae en
 * "comunicado" en vez de romper la pantalla.
 */
export function aNovedad(api: Api.Novedad): Dominio.Novedad {
  const tipos: Dominio.TipoNovedad[] = ["comunicado", "noticia", "actividad"];
  const tipo = tipos.includes(api.tipo as Dominio.TipoNovedad)
    ? (api.tipo as Dominio.TipoNovedad)
    : "comunicado";

  return {
    id: api._id,
    slug: api._id,
    tipo,
    titulo: texto(api.titulo) ?? "Sin título",
    bajada: texto(api.bajada) ?? null,
    cuerpo: texto(api.cuerpo) ?? null,
    fecha: texto(api.fecha) ?? texto(api.createdAt) ?? null,
    imagen: mediaUrl(api.fileName ?? null),
  };
}
