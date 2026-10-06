import { firstMediaUrl, mediaUrl } from "@/lib/media";
import { isPopulated, type Ref } from "@/lib/api/esquema";
import type * as Api from "@/lib/api/esquema";
import type * as Dominio from "./tipos";
import { IDIOMA_POR_DEFECTO, type Idioma } from "@/lib/idioma";

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
 *   - unificar la paginación   → `aPagina()` (hoy tolera las dos formas)
 *   - novedades y contacto     → recursos nuevos, no afectan a estos
 *   - GET públicos             → no llega hasta acá: es cosa del transporte
 */

function texto(valor: string | undefined | null): string | null {
  const limpio = valor?.trim();
  return limpio ? limpio : null;
}

/**
 * El texto en el idioma pedido, con reserva al español.
 *
 * La reserva es campo por campo y no por entidad: un proyecto con el nombre
 * traducido y el desafío sin traducir muestra lo que haya de cada uno, en vez
 * de caerse entero al español o dejar el hueco.
 */
function enIdioma(
  traducido: string | undefined | null,
  original: string | undefined | null,
): string | null {
  return texto(traducido) ?? texto(original);
}

/** Las traducciones que correspondan, o ninguna si la pantalla va en español. */
function traducciones<T>(
  api: { traducciones?: Api.Traducciones<T> },
  idioma: Idioma,
): Partial<T> {
  return idioma === IDIOMA_POR_DEFECTO ? {} : (api.traducciones?.en ?? {});
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
 *
 * La API devuelve la relación entera, traducciones incluidas, así que el chip
 * de sector y la lista de servicios de un proyecto también se leen en inglés.
 * Lo que no tiene traducción —clientes, cooperativas— cae al español, que es su
 * nombre propio.
 */
/*
 * De una referencia solo se lee el nombre. Las traducciones van sueltas porque
 * cada entidad traduce lo suyo —una cooperativa traduce su descripción, no su
 * nombre— y acá no interesa cuáles son, solo si hay un `nombre` adentro.
 */
type RefConNombre = Ref<{
  _id: string;
  nombre?: string;
  traducciones?: Api.Traducciones<Record<string, unknown>>;
}>;

function aReferencia(
  ref: RefConNombre | undefined | null,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Referencia | null {
  if (!isPopulated(ref)) return null;
  // Lo traducido llega sin tipar porque cada entidad traduce campos distintos.
  const traducido = traducciones(ref, idioma).nombre;
  const nombre = enIdioma(
    typeof traducido === "string" ? traducido : null,
    ref.nombre,
  );
  return nombre ? { id: ref._id, nombre } : null;
}

function aReferencias(
  refs: RefConNombre[] | undefined,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Referencia[] {
  return (refs ?? [])
    .map((ref) => aReferencia(ref, idioma))
    .filter((r): r is Dominio.Referencia => r !== null);
}

export function aServicio(
  api: Api.Servicio,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Servicio {
  const t = traducciones(api, idioma);
  /* Los subservicios se traducen por posición: son la misma lista en los dos
     idiomas y se cargan juntos. Si falta la traducción, van los de español. */
  const subservicios = api.subservicios ?? [];
  return {
    id: api._id,
    nombre: enIdioma(t.nombre, api.nombre) ?? "Sin nombre",
    descripcion: enIdioma(t.descripcion, api.descripcion),
    orden: api.orden ?? 99,
    destacado: api.esDestacado === true,
    subservicios: subservicios
      .map((s, i) => ({
        nombre: enIdioma(t.subservicios?.[i]?.nombre, s.nombre) ?? "",
        descripcion: enIdioma(t.subservicios?.[i]?.descripcion, s.descripcion),
      }))
      .filter((s) => s.nombre),
  };
}

export function aSector(
  api: Api.Sector,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Sector {
  const t = traducciones(api, idioma);
  const nombre = enIdioma(t.nombre, api.nombre) ?? "Sin nombre";
  return {
    id: api._id,
    nombre,
    /* El slug sale siempre del nombre en español: la dirección de cada
       vertical es la misma en los dos idiomas y no se rompe al traducir. */
    slug: slugify(texto(api.nombre) ?? nombre),
    descripcion: enIdioma(t.descripcion, api.descripcion),
    orden: api.orden ?? 99,
    destacado: api.esDestacado === true,
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

export function aCooperativa(
  api: Api.Cooperativa,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Cooperativa {
  const t = traducciones(api, idioma);
  return {
    id: api._id,
    // El nombre no se traduce: es un nombre propio.
    nombre: texto(api.nombre) ?? "Sin nombre",
    asociados: api.asociados ?? 0,
    ubicacion:
      api.ubicacion?.lat != null && api.ubicacion?.lng != null
        ? api.ubicacion
        : null,
    provincia: provinciaDe(api),
    // La API lo guarda en `fileName`, igual que el resto de los recursos con
    // archivo; hoy ninguna cooperativa tiene uno cargado.
    logo: mediaUrl(api.fileName),
    servicios: aReferencias(api.servicios),
    sectores: aReferencias(api.sectores),
    descripcion: enIdioma(t.descripcion, api.descripcion) ?? "",
    sitio: texto(api.sitio),
    email: texto(api.email),
    telefono: texto(api.telefono),
    fundacion: api.fundacion ?? null,
    redes: {
      linkedin: texto(api.redes?.linkedin),
      instagram: texto(api.redes?.instagram),
      github: texto(api.redes?.github),
    },
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

export function aProyecto(
  api: Api.Proyecto,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Proyecto {
  const t = traducciones(api, idioma);
  const imagenes = (api.imageFileNames ?? [])
    .map((nombre) => mediaUrl(nombre))
    .filter((url): url is string => url !== null);

  return {
    id: api._id,
    slug: slugDeProyecto(api),
    nombre: enIdioma(t.nombre, api.nombre) ?? "Sin nombre",
    cliente: aReferencia(api.cliente, idioma),
    sector: aReferencia(api.sector, idioma),
    servicios: aReferencias(api.servicios, idioma),
    tecnologias: (api.tecnologias ?? [])
      .filter(isPopulated)
      .map((t) => aTecnologia(t as Api.Tecnologia)),
    cooperativas: aReferencias(api.cooperativas),
    desafio: enIdioma(t.desafio, api.desafio),
    solucion: enIdioma(t.solucion, api.solucion),
    resultado: enIdioma(t.resultado, api.resultado),
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
export function aNovedad(
  api: Api.Novedad,
  idioma: Idioma = IDIOMA_POR_DEFECTO,
): Dominio.Novedad {
  const t = traducciones(api, idioma);
  const tipos: Dominio.TipoNovedad[] = ["comunicado", "noticia", "actividad"];
  const tipo = tipos.includes(api.tipo as Dominio.TipoNovedad)
    ? (api.tipo as Dominio.TipoNovedad)
    : "comunicado";

  return {
    id: api._id,
    slug: api._id,
    tipo,
    titulo: enIdioma(t.titulo, api.titulo) ?? "Sin título",
    bajada: enIdioma(t.bajada, api.bajada),
    cuerpo: enIdioma(t.cuerpo, api.cuerpo),
    fecha: texto(api.fecha) ?? texto(api.createdAt) ?? null,
    imagen: mediaUrl(api.fileName ?? null),
  };
}
