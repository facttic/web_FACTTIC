"use client";

/**
 * Achica las imágenes en el navegador, antes de subirlas.
 *
 * El problema que resuelve: una cooperativa elige cinco capturas salidas del
 * teléfono, eso pesa 38 MB, y el envío falla —el tope son 18—. La salida que
 * teníamos era decirle "achicalas antes", que es pedirle que abra un editor.
 *
 * Como la compresión pasa acá, **las originales no viajan**: no hay nada que
 * borrar después en el servidor, y la subida deja de depender de la conexión
 * de quien carga, que en varias provincias no es la de un centro de datos.
 *
 * El destino es JPEG porque la API solo acepta `image/png` y `image/jpeg`.
 * WebP comprimiría bastante mejor, pero lo rechazaría.
 */

/** El lado más largo de la imagen guardada. */
const LADO_MAXIMO = 2000;
/** Calidad del JPEG. Por arriba de 0.85 el archivo crece sin que se note. */
const CALIDAD = 0.82;
/**
 * Lo que ni se toca. Volver a codificar una imagen chica no la achica y sí le
 * saca calidad, así que por debajo de esto pasa tal cual.
 */
const YA_ESTA_BIEN = 300 * 1024;

/** El mismo nombre con la extensión que corresponde al formato de salida. */
function renombrar(nombre: string, tipo: string): string {
  const sinExtension = nombre.replace(/\.[^.]+$/, "");
  return `${sinExtension}.${tipo === "image/png" ? "png" : "jpg"}`;
}

/**
 * ¿Tiene algún píxel transparente?
 *
 * Importa porque JPEG no tiene canal alfa: lo transparente saldría negro, y
 * los logos de las cooperativas son justamente PNG con fondo transparente. Si
 * hay alfa, la salida se queda en PNG aunque comprima menos.
 *
 * Solo se pregunta cuando la entrada pudo tenerlo: un JPEG nunca lo tiene, y
 * recorrer cuatro millones de píxeles para confirmarlo es tiempo regalado.
 */
function tieneTransparencia(datos: Uint8ClampedArray): boolean {
  for (let i = 3; i < datos.length; i += 4) {
    if (datos[i] < 250) return true;
  }
  return false;
}

export async function comprimirImagen(archivo: File): Promise<File> {
  /* El campo de sectores sube un JSON por el mismo componente. */
  if (!archivo.type.startsWith("image/")) return archivo;
  /* Un SVG es texto y escala solo; un GIF puede estar animado y el lienzo se
     quedaría con el primer cuadro. Ninguno de los dos se toca. */
  if (/svg|gif/.test(archivo.type)) return archivo;

  try {
    /* `from-image` respeta la orientación del EXIF. Sin eso, las fotos sacadas
       de costado con el teléfono se guardan rotadas: el lienzo no lee el EXIF,
       y al reescribir el archivo esa marca se pierde para siempre. */
    const imagen = await createImageBitmap(archivo, {
      imageOrientation: "from-image",
    });

    const escala = Math.min(
      1,
      LADO_MAXIMO / Math.max(imagen.width, imagen.height),
    );
    if (escala === 1 && archivo.size <= YA_ESTA_BIEN) {
      imagen.close();
      return archivo;
    }

    const ancho = Math.round(imagen.width * escala);
    const alto = Math.round(imagen.height * escala);
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const pincel = lienzo.getContext("2d");
    if (!pincel) {
      imagen.close();
      return archivo;
    }
    pincel.drawImage(imagen, 0, 0, ancho, alto);
    imagen.close();

    const conAlfa =
      archivo.type !== "image/jpeg" &&
      tieneTransparencia(pincel.getImageData(0, 0, ancho, alto).data);
    const tipo = conAlfa ? "image/png" : "image/jpeg";

    const blob = await new Promise<Blob | null>((listo) =>
      lienzo.toBlob(listo, tipo, CALIDAD),
    );
    /* Si no comprimió —pasa con PNG chicos de pocos colores, que el lienzo
       reescribe más pesados— se queda el original. */
    if (!blob || blob.size >= archivo.size) return archivo;

    return new File([blob], renombrar(archivo.name, tipo), {
      type: tipo,
      lastModified: Date.now(),
    });
  } catch {
    /* Un archivo que el navegador no puede decodificar sube como vino: que lo
       rechace la API con su mensaje, en vez de desaparecer acá en silencio. */
    return archivo;
  }
}
