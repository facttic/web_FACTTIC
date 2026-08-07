import { NextResponse } from "next/server";
import { getSesion } from "@/lib/api/session";

/**
 * Busca un lugar por nombre y devuelve sus coordenadas.
 *
 * Va contra Nominatim, el buscador de OpenStreetMap, y pasa por acá y no
 * directo desde el browser por dos motivos:
 *
 *  1. **Su política de uso pide identificarse** con un `User-Agent` real y no
 *     hacer más de una consulta por segundo. Desde el servidor eso se cumple
 *     una vez; desde cada browser, no hay forma de garantizarlo.
 *  2. **Se cachea.** Las ciudades no se mudan: la misma búsqueda no vuelve a
 *     salir a la red en todo el día.
 *
 * Solo para quien tenga sesión: es una herramienta del panel, no del sitio, y
 * no hay razón para prestarle un proxy de búsqueda a cualquiera.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/**
 * Se busca solo en Argentina: es donde están las cooperativas de la
 * federación, y sin el filtro "Córdoba" devuelve primero la de España. Si
 * alguna vez hay una fuera del país, se saca este parámetro.
 */
const PAIS = "ar";

const UN_DIA = 86_400;

export interface Lugar {
  nombre: string;
  lat: number;
  lng: number;
}

export async function GET(request: Request) {
  if (!(await getSesion())) {
    return NextResponse.json({ error: "Sin sesión" }, { status: 401 });
  }

  const busqueda = new URL(request.url).searchParams.get("q")?.trim();
  if (!busqueda || busqueda.length < 3) {
    return NextResponse.json({ lugares: [] });
  }

  const url = new URL(NOMINATIM);
  url.searchParams.set("q", busqueda);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", PAIS);
  url.searchParams.set("accept-language", "es");

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        // Nominatim rechaza lo que no se identifica.
        "User-Agent": "FACTTIC backoffice (https://facttic.org.ar)",
      },
      next: { revalidate: UN_DIA },
    });
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectarnos con OpenStreetMap" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "OpenStreetMap no respondió bien" },
      { status: 502 },
    );
  }

  const crudos = (await res.json()) as Array<{
    display_name?: string;
    lat?: string;
    lon?: string;
  }>;

  const lugares: Lugar[] = crudos
    .map((lugar) => ({
      nombre: lugar.display_name ?? "",
      lat: Number(lugar.lat),
      lng: Number(lugar.lon),
    }))
    .filter(
      (lugar) =>
        lugar.nombre &&
        Number.isFinite(lugar.lat) &&
        Number.isFinite(lugar.lng),
    );

  return NextResponse.json({ lugares });
}
