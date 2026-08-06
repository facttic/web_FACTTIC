import "server-only";

import { getCooperativas } from "./catalogos";
import { sitioDe } from "./sitios-cooperativas";
import { provinciaDe } from "@/lib/mapa/provincias";
import type * as Dominio from "@/lib/dominio/tipos";

/**
 * La red agrupada por provincia, que es lo que muestra el mapa federal.
 *
 * La provincia no viene de la API: se calcula a partir de `ubicacion {lat,lng}`
 * contra los límites versionados en `lib/mapa`. Como todo pasa en el servidor y
 * los datos están cacheados, el recorrido se hace una vez por revalidación y no
 * en cada visita.
 */

export interface CooperativaEnRed extends Dominio.Cooperativa {
  provincia: string | null;
  sitio: string | null;
}

export interface ProvinciaConRed {
  nombre: string;
  cooperativas: CooperativaEnRed[];
  asociados: number;
  /** Sectores y servicios que concentra, sin repetir y por frecuencia. */
  industrias: string[];
  servicios: string[];
}

/** Los nombres más frecuentes primero; desempata el alfabético. */
function porFrecuencia(nombres: string[]): string[] {
  const cuenta = new Map<string, number>();
  for (const nombre of nombres) {
    cuenta.set(nombre, (cuenta.get(nombre) ?? 0) + 1);
  }
  return [...cuenta]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([nombre]) => nombre);
}

export async function getRedFederal(): Promise<{
  provincias: ProvinciaConRed[];
  cooperativas: CooperativaEnRed[];
  totales: { cooperativas: number; asociados: number; provincias: number };
}> {
  const cooperativas: CooperativaEnRed[] = (await getCooperativas())
    // Las de prueba que quedaron en la base no son parte de la red.
    .filter((coop) => !/^Cooperativa [A-C]$/.test(coop.nombre))
    .map((coop) => ({
      ...coop,
      provincia: coop.ubicacion
        ? provinciaDe(coop.ubicacion.lat, coop.ubicacion.lng)
        : null,
      sitio: sitioDe(coop.nombre),
    }));

  const porProvincia = new Map<string, CooperativaEnRed[]>();
  for (const coop of cooperativas) {
    if (!coop.provincia) continue;
    porProvincia.set(coop.provincia, [
      ...(porProvincia.get(coop.provincia) ?? []),
      coop,
    ]);
  }

  const provincias: ProvinciaConRed[] = [...porProvincia]
    .map(([nombre, lista]) => ({
      nombre,
      cooperativas: [...lista].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es"),
      ),
      asociados: lista.reduce((total, c) => total + (c.asociados ?? 0), 0),
      industrias: porFrecuencia(
        lista.flatMap((c) => c.sectores.map((s) => s.nombre)),
      ),
      servicios: porFrecuencia(
        lista.flatMap((c) => c.servicios.map((s) => s.nombre)),
      ),
    }))
    // De mayor a menor: la primera es la que se muestra al entrar.
    .sort(
      (a, b) =>
        b.cooperativas.length - a.cooperativas.length ||
        a.nombre.localeCompare(b.nombre, "es"),
    );

  return {
    provincias,
    cooperativas,
    totales: {
      cooperativas: cooperativas.length,
      asociados: cooperativas.reduce((t, c) => t + (c.asociados ?? 0), 0),
      provincias: provincias.length,
    },
  };
}
