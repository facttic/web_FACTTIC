"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { MALVINAS, PROVINCIAS } from "@/lib/mapa/provincias";

/**
 * Mapa federal: las provincias dibujadas, pintadas y elegibles.
 *
 * Resuelve las dos anotaciones del archivo:
 *
 *  - "Que cada provincia tenga un color distinto de la paleta de colores, de
 *    forma aleatoria": el color aparece al pasar el mouse y al elegirla; en
 *    reposo todas las que tienen cooperativas van en gris claro. Cada una
 *    tiene el suyo, tomado de su posición en la lista y no de un sorteo por
 *    visita —si cambiara en cada carga, el mapa parpadearía y el servidor y el
 *    browser dibujarían distinto—. Las que no tienen quedan en gris oscuro.
 *  - "En cada provincia debería haber puntitos dependiendo la cantidad de coop
 *    que hay": un punto por cooperativa, repartidos dentro del contorno.
 *
 * Las provincias sin cooperativas no se pueden elegir: el mapa cuenta dónde
 * está la red, no la división política.
 */

/**
 * Recuadro del país sin la Antártida ni las islas del Atlántico Sur, que
 * estirarían el dibujo hasta volverlo ilegible.
 */
/** Los colores de la identidad con los que se pintan las provincias. */
const COLORES = [
  "var(--color-lila)",
  "var(--color-celeste)",
  "var(--color-amarillo)",
  "var(--color-naranja)",
  "var(--color-azul)",
  "var(--color-rojo)",
];

const CAJA = { oeste: -73.6, este: -53.6, norte: -21.8, sur: -55.1 };

/** Lo que tarda el dibujo en acomodarse; igual que la transición del CSS. */
const VIAJE = 700;

/**
 * Cuánto baja cada copia del contorno para dibujar el canto, en unidades.
 *
 * Seis pasos de 1,6 y no diez de 1: el mismo espesor con cuatro copias menos
 * del país entero, que es lo que el navegador rasteriza en cada cuadro.
 */
const ESPESOR = [1.6, 3.2, 4.8, 6.4, 8, 9.6];

/**
 * Medidas del grupo del mapa en el archivo: 419,02 × 900,21, o sea una
 * proporción de 2,148. La proyección corregida por latitud da 2,126 sola, así
 * que se fuerza el alto para que coincida.
 *
 * Y sobre eso, un 10% más de ancho: el dibujo del archivo es más panzón que la
 * proyección fiel, y así calza.
 */
const ANCHO = Math.round(419 * 1.1);
const ALTO_DEL_DISENO = 900;

/**
 * Los meridianos se juntan hacia el sur, así que un grado de longitud mide
 * menos que uno de latitud: a los -38° de la mitad del país, un 78%.
 */
const LATITUD_MEDIA = (CAJA.norte + CAJA.sur) / 2;
const ACHATE = Math.cos((LATITUD_MEDIA * Math.PI) / 180);

const ESCALA = ANCHO / ((CAJA.este - CAJA.oeste) * ACHATE);
const ALTO = ALTO_DEL_DISENO;
/** Ajuste del 1% entre la proyección y la medida del archivo. */
const ESCALA_Y = ALTO / ((CAJA.norte - CAJA.sur) * ESCALA);

/**
 * Equirrectangular corregida por latitud. La proporción sale 2,13, que es la
 * de Argentina: unos 3.700 km de norte a sur por 1.700 de este a oeste. No se
 * deforma para que entre —la maqueta tampoco lo hace: lo que parecía un
 * achatamiento es que el panel se le superpone y tapa la Patagonia—; el tamaño
 * se resuelve en el layout, limitando el alto.
 */
function proyectar(lng: number, lat: number): [number, number] {
  return [
    (lng - CAJA.oeste) * ACHATE * ESCALA,
    (CAJA.norte - lat) * ESCALA * ESCALA_Y,
  ];
}

/**
 * Dónde caen las Malvinas en el dibujo, para plantarles la bandera encima.
 *
 * Sale de la geometría y no de números a ojo: si mañana se simplifica más el
 * contorno o cambia el encuadre, la bandera se acomoda sola.
 */
const CAJA_MALVINAS = (() => {
  const puntos = MALVINAS.flat().map((p) => proyectar(p[0], p[1]));
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  return {
    x0,
    x1,
    y0,
    y1,
    /* El mástil se clava entre las dos islas grandes, no en el centro exacto
       de la caja: ahí hay mar y la bandera quedaría flotando. */
    pieX: x0 + (x1 - x0) * 0.52,
    pieY: y0 + (y1 - y0) * 0.62,
  };
})();

/* Los tres paños de la bandera y el sol, en los tonos de la ley. */
const CELESTE = "#75AADB";
const SOL = "#F6B40E";

/**
 * La bandera que se planta en las Malvinas.
 *
 * Mide poco más que las islas a propósito: tiene que leerse como una banderita
 * clavada ahí y no como un cartel encima del mapa.
 *
 * Entra creciendo desde el pie del mástil —`transform-box: fill-box` para que
 * el origen sea el de la figura y no el del lienzo entero— y vuelve a
 * guardarse al salir. El paño lleva una ondulación muy corta, lo justo para
 * que no parezca una calcomanía.
 */
function BanderaPlantada({
  x,
  y,
  puesta,
}: {
  /** El pie del mástil, en coordenadas del dibujo. */
  x: number;
  y: number;
  puesta: boolean;
}) {
  const ALTO_MASTIL = 30;
  const ANCHO_PANO = 21;
  const ALTO_PANO = 13.5;
  const arriba = y - ALTO_MASTIL;

  return (
    <g
      className={cn(
        "pointer-events-none origin-bottom [transform-box:fill-box]",
        "transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-opacity",
        puesta ? "scale-100 opacity-100" : "scale-y-0 opacity-0",
      )}
    >
      {/* El mástil, con su sombrita sobre la isla para que se vea clavado. */}
      <ellipse
        cx={x}
        cy={y}
        rx="3.2"
        ry="1.1"
        fill="var(--color-negro-oscuro)"
        fillOpacity="0.45"
      />
      <rect
        x={x - 0.6}
        y={arriba}
        width="1.2"
        height={ALTO_MASTIL}
        rx="0.6"
        fill="var(--color-blanco)"
      />

      <g className={puesta ? "flamea" : undefined}>
        <rect
          x={x}
          y={arriba}
          width={ANCHO_PANO}
          height={ALTO_PANO}
          fill={CELESTE}
        />
        <rect
          x={x}
          y={arriba + ALTO_PANO / 3}
          width={ANCHO_PANO}
          height={ALTO_PANO / 3}
          fill="var(--color-blanco)"
        />
        {/* El sol, resumido: a este tamaño los treinta y dos rayos serían una
            mancha, así que van ocho y el disco. */}
        <g fill={SOL}>
          <circle cx={x + ANCHO_PANO / 2} cy={arriba + ALTO_PANO / 2} r="1.9" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <rect
                key={i}
                x={x + ANCHO_PANO / 2 - 0.35}
                y={arriba + ALTO_PANO / 2 - 3.4}
                width="0.7"
                height="2"
                transform={`rotate(${(a * 180) / Math.PI} ${x + ANCHO_PANO / 2} ${arriba + ALTO_PANO / 2})`}
              />
            );
          })}
        </g>
      </g>
    </g>
  );
}

/** Proporción del dibujo, para que quien lo enmarque reserve la caja justa. */
export const PROPORCION_MAPA = ANCHO / ALTO;

/**
 * Centro de una provincia en porcentaje del dibujo, para colgarle algo encima
 * —el panel se abre al lado de la provincia que se toca—.
 */
export function centroDe(nombre: string): { x: number; y: number } | null {
  const provincia = PROVINCIAS.find((p) => p.nombre === nombre);
  if (!provincia) return null;
  const puntos = provincia.anillos.flat().map((p) => proyectar(p[0], p[1]));
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  return {
    x: ((Math.min(...xs) + Math.max(...xs)) / 2 / ANCHO) * 100,
    y: ((Math.min(...ys) + Math.max(...ys)) / 2 / ALTO) * 100,
  };
}

/**
 * Caja de una provincia en porcentaje del dibujo, para encuadrarla.
 *
 * El centro no alcanza: para acercarse hay que saber cuánto mide, porque no es
 * lo mismo encuadrar Tucumán que Buenos Aires.
 */
export function cajaDe(
  nombre: string,
): { x: number; y: number; ancho: number; alto: number } | null {
  const provincia = PROVINCIAS.find((p) => p.nombre === nombre);
  if (!provincia) return null;
  const puntos = provincia.anillos.flat().map((p) => proyectar(p[0], p[1]));
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  return {
    x: (x0 / ANCHO) * 100,
    y: (y0 / ALTO) * 100,
    ancho: ((Math.max(...xs) - x0) / ANCHO) * 100,
    alto: ((Math.max(...ys) - y0) / ALTO) * 100,
  };
}

/**
 * Cómo se acerca el dibujo a una provincia.
 *
 * La provincia queda en el medio de su caja: el panel se abre **afuera** del
 * mapa, a su derecha, así que no hay que correrla para que no la pise.
 *
 * El acercamiento se limita a 3,4: más que eso y las provincias vecinas salen
 * de cuadro, que es lo que da la referencia de dónde está parado uno.
 */
function encuadre(
  caja: { x: number; y: number; ancho: number; alto: number },
  /** Dónde queda el centro de la provincia, en porcentaje del ancho. */
  objetivoX = 50,
  tope = 3.4,
  /** Y en porcentaje del alto: en el teléfono baja, debajo del cajón. */
  objetivoY = 50,
) {
  const escala = Math.min(
    tope,
    Math.max(1.5, 34 / Math.max(caja.ancho, caja.alto * 0.55)),
  );
  const cx = caja.x + caja.ancho / 2;
  const cy = caja.y + caja.alto / 2;
  return {
    escala,
    x: objetivoX - cx * escala,
    y: objetivoY - cy * escala,
    // Dónde queda el centro de la provincia en pantalla: ahí va el marcador.
    objetivoX,
    objetivoY,
  };
}

/**
 * Lo que el teléfono usa.
 *
 * La provincia queda centrada a lo ancho y corrida hacia abajo, justo debajo de
 * donde termina la ficha: así la ficha puede ocupar todo el ancho —que es lo
 * que necesita para contar algo— sin taparla nunca. El corrimiento se calcula
 * por provincia, porque no mide lo mismo Tucumán que Buenos Aires.
 */
const ENCUADRE_CHICO = {
  objetivoX: 50,
  tope: 1.9,
  /**
   * Dónde queda el centro de la provincia: en el medio del hueco que deja la
   * ficha, no apenas debajo de ella. Apoyada contra la ficha, una provincia
   * chica como CABA quedaba con el marcador tocándole el borde.
   */
  objetivoY: 68,
} as const;

/** El encuadre del teléfono para una caja ya medida. */
function encuadreChico(caja: {
  x: number;
  y: number;
  ancho: number;
  alto: number;
}) {
  const { escala } = encuadre(
    caja,
    ENCUADRE_CHICO.objetivoX,
    ENCUADRE_CHICO.tope,
  );
  // Las grandes suben lo necesario para no salirse por abajo.
  const mitad = (caja.alto * escala) / 2;
  return encuadre(
    caja,
    ENCUADRE_CHICO.objetivoX,
    ENCUADRE_CHICO.tope,
    Math.min(ENCUADRE_CHICO.objetivoY, 96 - mitad),
  );
}

/**
 * El pin de mapa de toda la vida: una gota con la punta hacia abajo, apoyada en
 * el origen del grupo. Veintidós unidades de alto, que a este dibujo le quedan
 * como un marcador chico y no como un globo.
 */
const PIN =
  "M0 0 C0 0 -10 -13 -10 -18.5 A10 10 0 1 1 10 -18.5 C10 -13 0 0 0 0 Z";

function trazo(anillos: number[][][]): string {
  return anillos
    .map(
      (anillo) =>
        anillo
          .map((punto, i) => {
            const [x, y] = proyectar(punto[0], punto[1]);
            return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join("") + "Z",
    )
    .join("");
}

export function MapaFederal({
  cantidadPorProvincia,
  seleccionada,
  alElegir,
  acercar = false,
  cambiando = false,
  className,
}: {
  cantidadPorProvincia: Record<string, number>;
  seleccionada: string | null;
  alElegir: (provincia: string) => void;
  /** Acerca el dibujo a la provincia elegida y lo inclina. */
  acercar?: boolean;
  /** Mientras la ficha se va: el marcador se apaga y vuelve con la nueva. */
  cambiando?: boolean;
  className?: string;
}) {
  /*
   * El canto se dibuja recién cuando el mapa frenó.
   *
   * Es lo más caro del dibujo —seis copias del contorno del país— y mientras
   * dura el viaje se rasteriza en cada cuadro, que es donde se sentía el tirón.
   * Esperando a que llegue, la animación corre liviana y el espesor aparece con
   * el marcador, cuando ya hay algo que mirar.
   */
  const [asentado, setAsentado] = useState(false);
  useEffect(() => {
    if (!acercar) {
      setAsentado(false);
      return;
    }
    const id = setTimeout(() => setAsentado(true), VIAJE);
    return () => clearTimeout(id);
  }, [acercar, seleccionada]);

  const caja = acercar && seleccionada ? cajaDe(seleccionada) : null;
  /*
   * Dos encuadres: en escritorio la provincia queda centrada en su caja, con el
   * panel afuera; en el teléfono el cajón entra desde la izquierda y ocupa unos
   * 240px, así que la provincia se corre al 78% del ancho para quedar a su
   * derecha. Ahí también se acerca menos: el dibujo es angosto y pasado de 2,2
   * se pierde de vista dónde está uno.
   */
  const vista = caja ? encuadre(caja) : null;
  const vistaChica = caja ? encuadreChico(caja) : null;
  const marcador = acercar && seleccionada ? centroDe(seleccionada) : null;
  const color = seleccionada
    ? COLORES[
        PROVINCIAS.findIndex((p) => p.nombre === seleccionada) % COLORES.length
      ]
    : COLORES[0];
  const formas = useMemo(
    () =>
      PROVINCIAS.map((provincia, i) => ({
        nombre: provincia.nombre,
        d: trazo(provincia.anillos),
        // CABA mide unos pocos píxeles a esta escala y es la que más
        // cooperativas tiene: se le agrega un disco para que se vea y se
        // pueda tocar. Es lo que hacen los mapas federales impresos.
        disco: discoDe(provincia.anillos),
        color: COLORES[i % COLORES.length],
        cantidad: cantidadPorProvincia[provincia.nombre] ?? 0,
        // Los "pueblitos": un punto por cooperativa, repartidos por el
        // contorno para que se lean como un puñado y no como una fila.
        puntos: discoDe(provincia.anillos)
          ? []
          : puntosDe(
              provincia.anillos,
              cantidadPorProvincia[provincia.nombre] ?? 0,
            ),
      })),
    [cantidadPorProvincia],
  );

  /*
   * El dibujo se acerca con un transform y no cambiando el `viewBox`: así la
   * transición la hace el compositor y no obliga a redibujar los contornos en
   * cada cuadro, que a este nivel de detalle se nota.
   *
   * `vista-drone` lo inclina hacia atrás mientras está acercado, como mirarlo
   * desde arriba y de costado. Va en el contenedor y no en el `svg`, para que
   * la perspectiva envuelva también al acercamiento.
   */
  const [sobreLasMalvinas, setSobreLasMalvinas] = useState(false);
  /* En pantalla táctil la bandera se baja sola: no hay "salir de encima". */
  const relojBandera = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plantarUnRato = () => {
    setSobreLasMalvinas(true);
    if (relojBandera.current) clearTimeout(relojBandera.current);
    relojBandera.current = setTimeout(() => setSobreLasMalvinas(false), 3500);
  };
  useEffect(
    () => () => {
      if (relojBandera.current) clearTimeout(relojBandera.current);
    },
    [],
  );

  /* Un solo contorno con todas las provincias: el canto es del país, no de
     cada una, así que las fronteras internas no tienen que verse. */
  const silueta = useMemo(
    () => PROVINCIAS.map((p) => trazo(p.anillos)).join(""),
    [],
  );
  const formaElegida = useMemo(() => {
    const prov = PROVINCIAS.find((p) => p.nombre === seleccionada);
    return prov ? trazo(prov.anillos) : null;
  }, [seleccionada]);

  return (
    /* Las variables del marcador van acá y no en el `svg`: el marcador es su
       hermano, y una variable se hereda hacia abajo, no de costado. */
    <div
      className={cn("relative", className)}
      style={
        vista && vistaChica
          ? ({
              "--pin-x": `${vistaChica.objetivoX}%`,
              "--pin-y": `${vistaChica.objetivoY.toFixed(1)}%`,
              "--pin-x-grande": `${vista.objetivoX}%`,
              "--pin-y-grande": `${vista.objetivoY}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={cn(
          /* Sin recortar: al acercarse el dibujo se sale de su caja y sigue por
             detrás de lo que viene abajo, en vez de cortarse contra un borde. */
          "transition-transform duration-700 ease-out",
          acercar && "vista-drone",
        )}
      >
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          /*
           * El acercamiento va por variables y se aplica solo de `md` para
           * arriba: en el teléfono el panel se apoya encima del mapa y no al
           * lado, así que acercarse deja la provincia justo debajo del panel y
           * manda el resto del dibujo fuera de la pantalla.
           */
          className={cn(
            /* El alto del teléfono es cosa del mapa y va en el `svg`: puesto en
             el contenedor, el dibujo se estiraba al ancho disponible y salía
             mucho más alto que su caja. */
            "mx-auto h-[560px] w-auto origin-top-left transition-transform duration-700 ease-out md:h-auto md:w-full motion-reduce:transition-none",
            vista &&
              "[transform:translate(var(--mapa-x-chico),var(--mapa-y-chico))_scale(var(--mapa-k-chico))] md:[transform:translate(var(--mapa-x),var(--mapa-y))_scale(var(--mapa-k))]",
          )}
          style={
            vista && vistaChica
              ? ({
                  "--mapa-x": `${vista.x.toFixed(2)}%`,
                  "--mapa-y": `${vista.y.toFixed(2)}%`,
                  "--mapa-k": vista.escala.toFixed(3),
                  "--mapa-x-chico": `${vistaChica.x.toFixed(2)}%`,
                  "--mapa-y-chico": `${vistaChica.y.toFixed(2)}%`,
                  "--mapa-k-chico": vistaChica.escala.toFixed(3),
                } as React.CSSProperties)
              : undefined
          }
          role="group"
          aria-label="Mapa de las provincias argentinas con cooperativas de la red"
        >
          {/*
          El canto del mapa: el mismo contorno repetido hacia abajo, cada copia
          un poco más oscura. De frente no se ve —las caras lo tapan—, pero al
          inclinarse aparece como el costado de una pieza, que es lo que lo saca
          de parecer una calcomanía.
        */}
          {acercar ? (
            <g
              className="pointer-events-none"
              style={{ "--prov": color } as React.CSSProperties}
            >
              {/*
                El trazo se declara una vez y se repite con `use`: escrito diez
                veces, el contorno del país entero multiplicaba por diez el
                dibujo que el navegador tiene que leer —de 57 mil caracteres a
                660 mil— y el acercamiento se trababa.

                Opacas y todas del mismo color: con una rampa de opacidad el
                canto se leía como una sombra desenfocada y no como el costado
                de algo sólido.
              */}
              <defs>
                <path id="canto-pais" d={silueta} />
                {formaElegida ? (
                  <path id="canto-provincia" d={formaElegida} />
                ) : null}
              </defs>
              {ESPESOR.map((dy) => (
                <use
                  key={`pais-${dy}`}
                  href="#canto-pais"
                  transform={`translate(0 ${dy})`}
                  fill="var(--color-gris-oscuro)"
                  /* El canto va tapado por las caras: no necesita el suavizado
                     de bordes, y sin él se rasteriza bastante más rápido. */
                  shapeRendering="optimizeSpeed"
                />
              ))}
              {/* La provincia elegida sobresale: su costado va de su propio color
                apagado, así se ve como una pieza levantada del resto. */}
              {formaElegida
                ? ESPESOR.map((dy) => (
                    <use
                      key={`prov-${dy}`}
                      href="#canto-provincia"
                      transform={`translate(0 ${dy})`}
                      fill="color-mix(in srgb, var(--prov) 42%, black)"
                      shapeRendering="optimizeSpeed"
                    />
                  ))
                : null}
            </g>
          ) : null}

          {formas.map((provincia) => {
            const hay = provincia.cantidad > 0;
            const elegida = provincia.nombre === seleccionada;
            return (
              <g key={provincia.nombre}>
                <path
                  d={provincia.d}
                  role={hay ? "button" : undefined}
                  tabIndex={hay ? 0 : undefined}
                  aria-label={
                    hay
                      ? `${provincia.nombre}: ${provincia.cantidad} cooperativas`
                      : undefined
                  }
                  aria-pressed={hay ? elegida : undefined}
                  onClick={hay ? () => alElegir(provincia.nombre) : undefined}
                  onKeyDown={
                    hay
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            alElegir(provincia.nombre);
                          }
                        }
                      : undefined
                  }
                  style={{ "--prov": provincia.color } as React.CSSProperties}
                  stroke="var(--color-blanco)"
                  strokeOpacity={hay ? 0.35 : 0.12}
                  strokeWidth="0.7"
                  className={cn(
                    "transition-[fill,fill-opacity] duration-300",
                    hay
                      ? `cursor-pointer fill-blanco/25 hover:fill-[var(--prov)] ${FOCO}`
                      : "fill-gris-oscuro/55",
                    elegida && "fill-[var(--prov)]",
                  )}
                />
                {provincia.disco ? (
                  <circle
                    cx={provincia.disco[0]}
                    cy={provincia.disco[1]}
                    r={elegida ? 7 : 5.5}
                    style={{ "--prov": provincia.color } as React.CSSProperties}
                    stroke="var(--color-blanco)"
                    strokeOpacity="0.6"
                    strokeWidth="0.8"
                    onClick={hay ? () => alElegir(provincia.nombre) : undefined}
                    className={cn(
                      "transition-all duration-300",
                      hay
                        ? "cursor-pointer fill-blanco/50 hover:fill-[var(--prov)]"
                        : "fill-gris-oscuro/55",
                      elegida && "fill-[var(--prov)]",
                    )}
                  />
                ) : null}
                {provincia.puntos.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="1.6"
                    fill="var(--color-blanco)"
                    fillOpacity={elegida ? 0.85 : 0.4}
                    className="pointer-events-none transition-[fill-opacity] duration-300"
                  />
                ))}
              </g>
            );
          })}

          {/*
            Las Malvinas son argentinas, y al pasar por encima se les planta la
            bandera.

            Necesitan objetivo propio porque en el dibujo son parte del trazo de
            Tierra del Fuego: sin esto, el hover sería el de toda la provincia.
            El rectángulo es invisible y un poco más grande que el archipiélago
            —son islas chicas y finas, y perseguir el contorno exacto con el
            mouse sería un juego de puntería—; abajo solo hay mar, así que no le
            saca el hover a nada.

            El estado va en React y no en `group-hover`: Tailwind envuelve esa
            variante en `@media (hover: hover)` y acá, además, hace falta mover
            dos elementos a la vez.
          */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Islas Malvinas, Argentina"
            aria-pressed={sobreLasMalvinas}
            className="cursor-pointer focus-visible:outline-none"
            onMouseEnter={() => setSobreLasMalvinas(true)}
            onMouseLeave={() => setSobreLasMalvinas(false)}
            /*
              Con el dedo no hay hover: el toque la planta y se baja sola a los
              tres segundos y medio. No se alterna con un segundo toque porque
              el navegador manda un `mouseenter` fingido detrás del toque, que
              la volvería a levantar en el acto.
            */
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") plantarUnRato();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                plantarUnRato();
              }
            }}
          >
            {/*
              El área sensible es bastante más grande que las islas: en un
              teléfono eran 56 × 25 px, menos de lo que necesita un dedo. Crece
              hacia el mar —arriba, abajo y a la derecha— y poco hacia la
              izquierda, que es donde está Tierra del Fuego y no conviene
              robarle el toque.
            */}
            <rect
              x={CAJA_MALVINAS.x0 - 8}
              y={CAJA_MALVINAS.y0 - 18}
              width={CAJA_MALVINAS.x1 - CAJA_MALVINAS.x0 + 26}
              height={CAJA_MALVINAS.y1 - CAJA_MALVINAS.y0 + 36}
              fill="transparent"
            />
            <BanderaPlantada
              x={CAJA_MALVINAS.pieX}
              y={CAJA_MALVINAS.pieY}
              puesta={sobreLasMalvinas}
            />
          </g>
        </svg>
      </div>

      {/*
        El marcador va afuera del dibujo y sin escalar.

        Adentro se pixelaba: la inclinación es un transform 3D, así que el
        navegador rasteriza el SVG una sola vez y después lo agranda como si
        fuera una imagen —con el acercamiento al 3,4 de CABA se notaba de
        lejos—. Acá se dibuja a tamaño real, siempre nítido y siempre del mismo
        tamaño, y de paso queda derecho en vez de recostarse con el mapa, que es
        como se comportan los marcadores en los mapas inclinados.

        La posición no hay que calcularla: el encuadre deja el centro de la
        provincia justo en el punto al que apunta.
      */}
      {acercar && seleccionada ? (
        <svg
          /* Una por provincia: al cambiar la clave vuelve a montarse y la
             espera arranca de nuevo, junto con el viaje del mapa. */
          key={seleccionada}
          aria-hidden
          viewBox="-16 -42 32 48"
          className={cn(
            "pin-en-su-lugar pointer-events-none absolute z-10 size-10 -translate-x-1/2 -translate-y-full md:size-14",
            // Al irse se apaga de una; al llegar espera a que el mapa pare.
            cambiando
              ? "opacity-0 transition-opacity duration-150"
              : "aparece-al-llegar",
          )}
          style={{ "--prov": color } as React.CSSProperties}
        >
          {/* Degradado en vez de un desenfoque: un filtro SVG se recalcula en
              cada cuadro de la animación y acá se notaba. */}
          <ellipse
            rx="7"
            ry="2.6"
            fill="url(#sombra-marcador)"
            className="sombra-que-salta"
          />
          <g className="marcador-que-salta">
            <path
              d={PIN}
              fill="var(--color-negro-oscuro)"
              stroke="var(--color-blanco)"
              strokeOpacity="0.85"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cy="-16.5" r="4.2" fill="var(--prov)" />
          </g>
          <radialGradient id="sombra-marcador">
            <stop offset="35%" stopColor="var(--color-negro-oscuro)" />
            <stop
              offset="100%"
              stopColor="var(--color-negro-oscuro)"
              stopOpacity="0"
            />
          </radialGradient>
        </svg>
      ) : null}
    </div>
  );
}

/**
 * Centro de una provincia demasiado chica para verse, o `null` si se dibuja
 * bien sola. Hoy solo aplica a CABA.
 */
function discoDe(anillos: number[][][]): [number, number] | null {
  const puntos = anillos.flat().map((p) => proyectar(p[0], p[1]));
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const ancho = Math.max(...xs) - Math.min(...xs);
  const alto = Math.max(...ys) - Math.min(...ys);
  if (Math.max(ancho, alto) > 9) return null;
  return [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2,
  ];
}

/**
 * Reparte `cantidad` puntos dentro del contorno de una provincia.
 *
 * Se prueban posiciones sobre una espiral que arranca en el centro y se abre;
 * la primera que cae dentro se toma. Es determinista, así que el servidor y el
 * browser dibujan lo mismo.
 */
function puntosDe(anillos: number[][][], cantidad: number): [number, number][] {
  if (!cantidad) return [];

  const anillo = anillos.reduce((mayor, actual) =>
    actual.length > mayor.length ? actual : mayor,
  );
  const xs = anillo.map((p) => proyectar(p[0], p[1])[0]);
  const ys = anillo.map((p) => proyectar(p[0], p[1])[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const radio = Math.min(Math.max(...xs) - cx, Math.max(...ys) - cy) * 0.72;

  const plano = anillo.map((p) => proyectar(p[0], p[1]));
  const dentro = (x: number, y: number) => {
    let d = false;
    for (let i = 0, j = plano.length - 1; i < plano.length; j = i++) {
      const [xi, yi] = plano[i];
      const [xj, yj] = plano[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        d = !d;
      }
    }
    return d;
  };

  const puntos: [number, number][] = [];
  for (let i = 0; puntos.length < cantidad && i < cantidad * 40; i++) {
    // Espiral áurea: reparte sin amontonar y sin necesitar azar.
    const angulo = i * 2.399963;
    const r = radio * Math.sqrt(i / Math.max(cantidad, 6));
    const x = cx + Math.cos(angulo) * r;
    const y = cy + Math.sin(angulo) * r;
    if (dentro(x, y)) puntos.push([x, y]);
  }
  return puntos;
}
