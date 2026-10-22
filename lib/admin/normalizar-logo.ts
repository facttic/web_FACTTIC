"use client";

/**
 * Encuadra el logo de una cooperativa antes de subirlo.
 *
 * El problema que resuelve: cada cooperativa manda el logo como lo tiene, y en
 * "Nuestra Red" todos se dibujan en la misma caja. Sutty subió uno de 867×255
 * con el dibujo chico adentro y se vio diminuto; Cambalache subió uno de 200×68
 * con el dibujo pegado a los bordes y se vio el doble que el resto. Los dos
 * hubo que arreglarlos a mano después, uno por uno.
 *
 * La medida no se inventó: sale de los 33 logos que ya estaban bien. Ajustando
 * cada uno dentro de una caja de 150×53 centrada en 289×85, la escala mediana
 * da 1.00 y ninguno se mueve más de un 27%. O sea que es la regla que el
 * conjunto ya venía siguiendo sin estar escrita.
 *
 * Es idempotente: volver a pasar por acá un logo ya encuadrado lo deja igual.
 */

/** El lienzo del resto de los logos, en proporción 289:85. */
const LIENZO = { ancho: 289, alto: 85 };

/** Dónde entra el dibujo, centrado. Relevado sobre los 33 que ya estaban bien. */
const CAJA = { ancho: 150, alto: 53 };

/** El fondo del conjunto, para los que llegan con transparencia. */
const FONDO = "#f2f2f2";

/**
 * Hasta cuántas veces el lienzo base. Sirve para que un logo en alta no se
 * guarde a 289 de ancho y se vea blando en pantallas densas —la tarjeta lo
 * dibuja a 163 CSS, que al triple son 489—. Nunca agranda píxeles: si el
 * original no da, se queda en la densidad que alcance.
 */
const DENSIDAD_MAXIMA = 3;

/** Cuánto puede separarse un píxel del fondo y seguir siendo fondo. */
const TOLERANCIA = 14;

/** Por debajo de esto el píxel se considera transparente. */
const OPACO_MINIMO = 16;

/**
 * Qué tan claro tiene que ser un fondo liso para tratarlo como fondo.
 *
 * Un logo blanco sobre negro, recortado contra su propio negro, quedaría como
 * letras blancas sobre un lienzo claro: invisible. Si el fondo no es claro no
 * se recorta nada y el dibujo entra entero, con su fondo incluido.
 */
const CLARO_MINIMO = 0.9;

interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

function enPosicion(datos: Uint8ClampedArray, i: number): Pixel {
  return { r: datos[i], g: datos[i + 1], b: datos[i + 2], a: datos[i + 3] };
}

function luminancia({ r, g, b }: Pixel): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function iguales(a: Pixel, b: Pixel): boolean {
  return (
    Math.abs(a.r - b.r) <= 8 &&
    Math.abs(a.g - b.g) <= 8 &&
    Math.abs(a.b - b.b) <= 8
  );
}

/**
 * Qué hay de fondo: transparencia, un color liso y claro, o nada reconocible.
 *
 * Se mira en las cuatro esquinas. Si no coinciden entre sí es una foto o un
 * degradé, y entonces no hay fondo que sacar.
 */
function fondoDe(datos: Uint8ClampedArray, ancho: number, alto: number) {
  const esquinas = [
    enPosicion(datos, 0),
    enPosicion(datos, (ancho - 1) * 4),
    enPosicion(datos, (alto - 1) * ancho * 4),
    enPosicion(datos, ((alto - 1) * ancho + ancho - 1) * 4),
  ];

  if (esquinas.every((p) => p.a < OPACO_MINIMO)) return { tipo: "alfa" } as const;

  const primera = esquinas[0];
  if (!esquinas.every((p) => p.a >= OPACO_MINIMO && iguales(p, primera))) {
    return null;
  }
  if (luminancia(primera) < CLARO_MINIMO) return null;
  return { tipo: "color", color: primera } as const;
}

/** La caja del dibujo, sin el fondo alrededor. `null` si está todo vacío. */
function cajaDeTinta(
  datos: Uint8ClampedArray,
  ancho: number,
  alto: number,
  fondo: NonNullable<ReturnType<typeof fondoDe>>,
) {
  const esTinta =
    fondo.tipo === "alfa"
      ? (p: Pixel) => p.a >= OPACO_MINIMO
      : (p: Pixel) =>
          p.a >= OPACO_MINIMO &&
          (Math.abs(p.r - fondo.color.r) > TOLERANCIA ||
            Math.abs(p.g - fondo.color.g) > TOLERANCIA ||
            Math.abs(p.b - fondo.color.b) > TOLERANCIA);

  let x1 = ancho;
  let y1 = alto;
  let x2 = -1;
  let y2 = -1;
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      if (!esTinta(enPosicion(datos, (y * ancho + x) * 4))) continue;
      if (x < x1) x1 = x;
      if (x > x2) x2 = x;
      if (y < y1) y1 = y;
      if (y > y2) y2 = y;
    }
  }
  if (x2 < 0) return null;
  return { x: x1, y: y1, ancho: x2 - x1 + 1, alto: y2 - y1 + 1 };
}

export async function normalizarLogo(archivo: File): Promise<File> {
  if (!archivo.type.startsWith("image/")) return archivo;
  /* Un SVG escala solo y un GIF puede estar animado: ninguno pasa por lienzo. */
  if (/svg|gif/.test(archivo.type)) return archivo;

  try {
    const imagen = await createImageBitmap(archivo, {
      imageOrientation: "from-image",
    });
    const { width: ancho, height: alto } = imagen;

    const crudo = document.createElement("canvas");
    crudo.width = ancho;
    crudo.height = alto;
    const lapiz = crudo.getContext("2d", { willReadFrequently: true });
    if (!lapiz) {
      imagen.close();
      return archivo;
    }
    lapiz.drawImage(imagen, 0, 0);
    imagen.close();

    const datos = lapiz.getImageData(0, 0, ancho, alto).data;
    const fondo = fondoDe(datos, ancho, alto);
    /* Sin un fondo reconocible entra el dibujo entero, tal como llegó. */
    const caja = fondo
      ? cajaDeTinta(datos, ancho, alto, fondo)
      : { x: 0, y: 0, ancho, alto };
    if (!caja) return archivo;

    const aCaja = Math.min(CAJA.ancho / caja.ancho, CAJA.alto / caja.alto);
    /*
     * Cuánto lienzo se puede permitir sin agrandar un solo píxel: si el dibujo
     * entra achicándose a la mitad, hay margen para dibujarlo al doble.
     */
    const densidad = Math.min(
      DENSIDAD_MAXIMA,
      Math.max(1, Math.floor(1 / aCaja)),
    );

    const salida = document.createElement("canvas");
    salida.width = LIENZO.ancho * densidad;
    salida.height = LIENZO.alto * densidad;
    const pincel = salida.getContext("2d");
    if (!pincel) return archivo;

    /*
     * El lienzo se pinta del mismo color que traía el original, y solo si no
     * traía ninguno se usa el del conjunto. Así no queda un rectángulo más
     * claro flotando adentro de otro: un logo con fondo blanco recortado y
     * pegado sobre #f2f2f2 se ve como una ficha dentro de la ficha.
     */
    pincel.fillStyle =
      fondo?.tipo === "color"
        ? `rgb(${fondo.color.r} ${fondo.color.g} ${fondo.color.b})`
        : FONDO;
    pincel.fillRect(0, 0, salida.width, salida.height);

    const dibujo = {
      ancho: Math.max(1, Math.round(caja.ancho * aCaja * densidad)),
      alto: Math.max(1, Math.round(caja.alto * aCaja * densidad)),
    };
    pincel.imageSmoothingQuality = "high";
    pincel.drawImage(
      crudo,
      caja.x,
      caja.y,
      caja.ancho,
      caja.alto,
      Math.round((salida.width - dibujo.ancho) / 2),
      Math.round((salida.height - dibujo.alto) / 2),
      dibujo.ancho,
      dibujo.alto,
    );

    crudo.width = 0;
    crudo.height = 0;

    /* PNG y no JPEG: son letras sobre un fondo liso, que es justo donde el
       JPEG ensucia los bordes. A esta medida el archivo pesa unos 10 KB. */
    const blob = await new Promise<Blob | null>((listo) =>
      salida.toBlob(listo, "image/png"),
    );
    salida.width = 0;
    salida.height = 0;
    if (!blob) return archivo;

    return new File(
      [blob],
      `${archivo.name.replace(/\.[^.]+$/, "")}.png`,
      { type: "image/png", lastModified: Date.now() },
    );
  } catch {
    /* Lo que el navegador no puede decodificar sube como vino: que lo rechace
       la API con su mensaje, en vez de desaparecer acá en silencio. */
    return archivo;
  }
}
