/**
 * Los dos idiomas del sitio.
 *
 * El español es el idioma en el que se carga el contenido y el que va sin
 * prefijo en las URLs; el inglés vive bajo `/en`. Lo que no esté traducido se
 * muestra en español, campo por campo: es preferible una ficha con una línea
 * en el otro idioma a un hueco.
 */

export const IDIOMAS = ["es", "en"] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = "es";

export function esIdioma(valor: string | undefined): valor is Idioma {
  return IDIOMAS.includes(valor as Idioma);
}

/** El otro idioma, para el selector del encabezado. */
export function otroIdioma(idioma: Idioma): Idioma {
  return idioma === "es" ? "en" : "es";
}

/**
 * Las secciones, con su dirección en cada idioma.
 *
 * Las carpetas de `app/` están en español —son las rutas internas— y esto es
 * lo que se ve en la barra: en inglés `/en/projects` y no `/en/proyectos`. El
 * `proxy` traduce de la pública a la interna y las vistas siguen escribiendo
 * sus enlaces en español, una sola forma para todo el código.
 *
 * Los slugs no se traducen: el de un proyecto o una vertical sale del nombre
 * en español y es el mismo en los dos idiomas, para no romper las direcciones
 * que ya circulan.
 */
const SECCIONES: Record<string, string> = {
  "nuestros-servicios": "services",
  "suma-tu-coop": "join-your-co-op",
  proyectos: "projects",
  "nuestra-red": "our-network",
  "sobre-facttic": "about",
  contacto: "contact",
  novedades: "news",
};

const EN_ESPANOL: Record<string, string> = Object.fromEntries(
  Object.entries(SECCIONES).map(([es, en]) => [en, es]),
);

/** Parte una ruta en su primer tramo y el resto, dejando afuera `?` y `#`. */
function partir(ruta: string): [string, string] {
  const corte = ruta.search(/[?#]/);
  const camino = corte === -1 ? ruta : ruta.slice(0, corte);
  const cola = corte === -1 ? "" : ruta.slice(corte);
  const [, primero = "", ...resto] = camino.split("/");
  return [primero, (resto.length ? `/${resto.join("/")}` : "") + cola];
}

/** Saca el prefijo de idioma, si lo tiene. */
function sinPrefijo(ruta: string): string {
  return ruta.replace(/^\/en(?=\/|$|[?#])/, "") || "/";
}

/**
 * La ruta interna —la que existe en `app/`— de una dirección pública. Solo la
 * usa el proxy.
 */
export function rutaInterna(ruta: string): string {
  const [seccion, resto] = partir(sinPrefijo(ruta));
  const enEspanol = EN_ESPANOL[seccion];
  return enEspanol ? `/${enEspanol}${resto}` : sinPrefijo(ruta);
}

/**
 * La dirección pública de una pantalla en un idioma.
 *
 * Acepta la ruta escrita en cualquiera de los dos —las vistas la escriben en
 * español; el selector de idioma le pasa la que está abierta— y devuelve la
 * que corresponde al idioma pedido.
 */
export function rutaEn(idioma: Idioma, ruta: string): string {
  const [seccion, resto] = partir(sinPrefijo(ruta));
  if (!seccion) return idioma === IDIOMA_POR_DEFECTO ? "/" : "/en";

  const enEspanol = EN_ESPANOL[seccion] ?? seccion;
  const tramo =
    idioma === IDIOMA_POR_DEFECTO
      ? enEspanol
      : (SECCIONES[enEspanol] ?? seccion);
  const camino = `/${tramo}${resto}`;

  return idioma === IDIOMA_POR_DEFECTO ? camino : `/en${camino}`;
}
