"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapaLeaflet, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { BotonAdmin, CONTROL, Etiqueta } from "./piezas";
import type { Lugar } from "@/app/api/lugares/route";

/**
 * Elegir dónde está una cooperativa, sobre el mapa de OpenStreetMap.
 *
 * Antes eran dos campos de números, que obligaban a buscar las coordenadas en
 * otro lado y a confiar en que estuvieran bien tipeadas —un signo de menos de
 * menos y la cooperativa aparece en China—. Acá se busca la ciudad por nombre,
 * se elige del listado y, si hace falta, se corrige arrastrando el punto.
 *
 * Los valores siguen viajando en `lat` y `lng`, así que la acción que guarda no
 * cambió: para el formulario esto sigue siendo dos números.
 */

/** Argentina entera, para cuando todavía no hay nada elegido. */
const PAIS = { lat: -38.4, lng: -63.6, zoom: 4 };
/** Al elegir una ciudad se acerca lo suficiente para reconocer el lugar. */
const ZOOM_CIUDAD = 12;

/**
 * Un clic en el mapa da catorce decimales, que son fracciones de micrón. Cinco
 * son un metro: de sobra para algo que el sitio usa para agrupar por provincia,
 * y así lo guardado se parece a lo que ya está cargado.
 */
function redondear({ lat, lng }: { lat: number; lng: number }) {
  return {
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
  };
}

export function CampoUbicacion({
  lat,
  lng,
}: {
  lat?: number | null;
  lng?: number | null;
}) {
  const inicial =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lng }
      : null;

  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(
    inicial,
  );
  const contenedor = useRef<HTMLDivElement>(null);
  const marcador = useRef<Marker | null>(null);

  /*
   * El mapa va en estado y no en una ref, y eso importa: se crea de forma
   * asíncrona, así que cuando corre el efecto que dibuja el punto todavía no
   * existe. En una ref no habría nada que avisara de su llegada y el punto
   * inicial no se dibujaría nunca.
   */
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);
  const [mapa, setMapa] = useState<MapaLeaflet | null>(null);

  /*
   * Leaflet toca `window` al importarse, así que entra por import dinámico
   * dentro del efecto: en el servidor este código no corre.
   */
  useEffect(() => {
    let vivo = true;
    let creado: MapaLeaflet | null = null;

    void (async () => {
      const L = await import("leaflet");
      if (!vivo || !contenedor.current) return;

      creado = L.map(contenedor.current, {
        center: inicial ?? PAIS,
        zoom: inicial ? ZOOM_CIUDAD : PAIS.zoom,
        // El scroll de la rueda es para leer la página, no para hacer zoom.
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(creado);

      creado.on("click", (evento) => {
        setPunto(redondear(evento.latlng));
      });

      setLeaflet(L);
      setMapa(creado);
      // El contenedor recién ahora tiene su tamaño definitivo.
      setTimeout(() => creado?.invalidateSize(), 0);
    })();

    return () => {
      vivo = false;
      creado?.remove();
      marcador.current = null;
    };
    // Solo al montar: el punto se sincroniza en el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Dibuja el punto elegido y sigue al mapa cuando cambia. */
  useEffect(() => {
    if (!mapa || !leaflet) return;
    const L = leaflet;
    const m = mapa;

    {
      if (!punto) {
        marcador.current?.remove();
        marcador.current = null;
        return;
      }

      if (!marcador.current) {
        marcador.current = L.marker(punto, {
          draggable: true,
          /*
           * Un icono propio y no el de Leaflet: el suyo son dos PNG que se
           * piden por una ruta relativa al CSS y que los empaquetadores suelen
           * dejar rota. Va con estilos escritos a mano y no con clases del
           * proyecto porque Leaflet lo inserta como HTML suelto, fuera de lo
           * que React renderiza; los tokens de color sí se usan, que para eso
           * son variables.
           */
          icon: L.divIcon({
            className: "",
            html:
              '<span style="display:block;width:16px;height:16px;border-radius:9999px;' +
              "background:var(--color-lila);border:2px solid var(--color-blanco);" +
              'box-shadow:0 1px 4px rgba(0,0,0,.6)"></span>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }).addTo(m);

        marcador.current.on("dragend", () => {
          const donde = marcador.current?.getLatLng();
          if (donde) setPunto(redondear(donde));
        });
      } else {
        marcador.current.setLatLng(punto);
      }

      // Si el punto quedó fuera de la vista, se acompaña; si no, no se mueve.
      if (!m.getBounds().contains(punto)) {
        m.setView(punto, Math.max(m.getZoom(), ZOOM_CIUDAD));
      }
    }
  }, [punto, mapa, leaflet]);

  return (
    <fieldset>
      <legend className="text-p3 mb-2 text-blanco/70">Ubicación</legend>
      <p className="text-p3 mb-3 text-blanco/35">
        Buscá la ciudad y elegila de la lista, o hacé clic en el mapa. El punto
        se puede arrastrar. Alcanza con la ciudad: el mapa del sitio agrupa por
        provincia, no dibuja la dirección exacta.
      </p>

      <Buscador alElegir={(lugar) => setPunto(redondear(lugar))} />

      <div
        ref={contenedor}
        className="mt-3 h-72 w-full overflow-hidden rounded-lg border border-borde"
        // Leaflet dibuja su propio fondo; sin esto se ve el negro del panel
        // mientras cargan los mosaicos.
        style={{ background: "#1a1a1a" }}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-p3 text-blanco/40">
          {punto
            ? `${punto.lat.toFixed(4)}, ${punto.lng.toFixed(4)}`
            : "Sin ubicación: no va a aparecer en el mapa federal."}
        </p>
        {punto ? (
          <button
            type="button"
            onClick={() => setPunto(null)}
            className={cn(
              "text-p3 cursor-pointer rounded-lg px-2 py-1 text-blanco/50 underline-offset-4 transition-colors hover:text-blanco hover:underline",
              FOCO,
            )}
          >
            Quitar ubicación
          </button>
        ) : null}
      </div>

      {/* Lo que ve la acción que guarda: dos números, como antes. */}
      <input type="hidden" name="lat" value={punto?.lat ?? ""} />
      <input type="hidden" name="lng" value={punto?.lng ?? ""} />
    </fieldset>
  );
}

/** El buscador de lugares, contra Nominatim a través de nuestra propia ruta. */
function Buscador({ alElegir }: { alElegir: (lugar: Lugar) => void }) {
  const [texto, setTexto] = useState("");
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  async function buscar() {
    const consulta = texto.trim();
    if (consulta.length < 3) {
      setError("Escribí al menos 3 letras");
      return;
    }

    setBuscando(true);
    setError(null);
    try {
      const res = await fetch(`/api/lugares?q=${encodeURIComponent(consulta)}`);
      const datos = (await res.json()) as { lugares?: Lugar[]; error?: string };
      if (!res.ok) throw new Error(datos.error);
      setLugares(datos.lugares ?? []);
      setBuscado(true);
    } catch {
      setError("No pudimos buscar el lugar. Probá de nuevo.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div>
      <Etiqueta htmlFor="buscar-lugar">Buscar</Etiqueta>
      <div className="flex flex-wrap items-start gap-2">
        <input
          id="buscar-lugar"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          // Enter dentro de un formulario lo enviaría entero; acá solo busca.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void buscar();
            }
          }}
          placeholder="Rosario, Santa Fe"
          className={cn(CONTROL, FOCO, "w-auto min-w-56 flex-1")}
        />
        <BotonAdmin
          type="button"
          onClick={() => void buscar()}
          disabled={buscando}
        >
          {buscando ? "Buscando…" : "Buscar"}
        </BotonAdmin>
      </div>

      {error ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {error}
        </p>
      ) : null}

      {buscado && lugares.length === 0 && !error ? (
        <p className="text-p3 mt-2 text-blanco/40">
          No encontramos ese lugar en Argentina.
        </p>
      ) : null}

      {lugares.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1">
          {lugares.map((lugar) => (
            <li key={`${lugar.lat},${lugar.lng}`}>
              <button
                type="button"
                onClick={() => {
                  alElegir(lugar);
                  setLugares([]);
                  setBuscado(false);
                }}
                className={cn(
                  "text-p3 w-full cursor-pointer rounded-lg border border-borde px-3 py-2 text-left text-blanco/70 transition-colors hover:bg-superficie hover:text-blanco",
                  FOCO,
                )}
              >
                {lugar.nombre}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
