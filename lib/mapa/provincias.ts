import mapa from "./provincias.json";

/**
 * Límites de las provincias argentinas y en qué provincia cae un punto.
 *
 * El GeoJSON está versionado en el repo, ya simplificado a tres decimales
 * —unos cien metros, de sobra para pintar un mapa—. Sale de
 * `alvarezgarcia/provincias-argentinas-geojson`, que no incluye CABA: su
 * contorno se dibuja aparte, siguiendo la General Paz, el Riachuelo y el río.
 *
 * Las **Islas Malvinas** van bajo Tierra del Fuego, que es la provincia a la
 * que pertenecen —Tierra del Fuego, Antártida e Islas del Atlántico Sur—, y
 * por eso se dibujan con el mismo trazo que el resto del país. Esa fuente no
 * las traía: su contorno sale de Natural Earth (dominio público), en las seis
 * piezas que tiene el archipiélago.
 *
 * La provincia de cada cooperativa se resuelve acá y no se le pide al backend,
 * porque el modelo solo guarda `ubicacion {lat,lng}`. Al ser una función pura
 * sobre datos del repo, se calcula al construir el sitio y no cuesta nada en
 * cada visita.
 */

export interface Provincia {
  nombre: string;
  /** Anillos exteriores, en pares [lng, lat] como manda GeoJSON. */
  anillos: number[][][];
}

type Geometria =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] };

/**
 * Una provincia puede venir en varias piezas —Tierra del Fuego tiene islas—,
 * así que se juntan todas bajo el mismo nombre.
 */
export const PROVINCIAS: Provincia[] = (() => {
  const porNombre = new Map<string, number[][][]>();

  for (const rasgo of mapa.features as Array<{
    properties: { nombre: string };
    geometry: Geometria;
  }>) {
    const piezas =
      rasgo.geometry.type === "Polygon"
        ? [rasgo.geometry.coordinates]
        : rasgo.geometry.coordinates;
    // Solo el anillo exterior: los huecos no cambian a qué provincia pertenece
    // un punto de FACTTIC y ahorran la mitad del recorrido.
    const anillos = piezas.map((pieza) => pieza[0]);
    porNombre.set(rasgo.properties.nombre, [
      ...(porNombre.get(rasgo.properties.nombre) ?? []),
      ...anillos,
    ]);
  }

  return [...porNombre]
    .map(([nombre, anillos]) => ({ nombre, anillos }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
})();

/**
 * Los anillos de las Malvinas, aparte del resto.
 *
 * Para el mapa son parte de Tierra del Fuego y se dibujan con ella; esto es
 * solo para saber dónde caen, que es lo que necesita quien les quiera colgar
 * algo encima.
 */
export const MALVINAS: number[][][] = (
  mapa.features as Array<{
    properties: { nombre: string; parte?: string };
    geometry: Geometria;
  }>
)
  .filter((rasgo) => rasgo.properties.parte === "Islas Malvinas")
  .flatMap((rasgo) =>
    (rasgo.geometry.type === "Polygon"
      ? [rasgo.geometry.coordinates]
      : rasgo.geometry.coordinates
    ).map((pieza) => pieza[0]),
  );

/** Algoritmo del rayo: cuenta cuántos lados cruza una semirrecta hacia el este. */
function dentroDelAnillo(
  lng: number,
  lat: number,
  anillo: number[][],
): boolean {
  let dentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i];
    const [xj, yj] = anillo[j];
    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      dentro = !dentro;
    }
  }
  return dentro;
}

/**
 * En qué provincia cae un punto, o `null` si queda fuera del país.
 *
 * CABA se prueba primero porque está contenida dentro del contorno de la
 * provincia de Buenos Aires: si se recorriera en orden alfabético, todo el
 * conurbano y la ciudad caerían en la misma.
 */
export function provinciaDe(lat: number, lng: number): string | null {
  const caba = PROVINCIAS.find((p) => p.nombre === "CABA");
  if (caba?.anillos.some((anillo) => dentroDelAnillo(lng, lat, anillo))) {
    return "CABA";
  }

  for (const provincia of PROVINCIAS) {
    if (provincia.nombre === "CABA") continue;
    if (provincia.anillos.some((anillo) => dentroDelAnillo(lng, lat, anillo))) {
      return provincia.nombre;
    }
  }
  return null;
}
