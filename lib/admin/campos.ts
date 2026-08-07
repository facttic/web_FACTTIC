/**
 * Lectura de los formularios del panel.
 *
 * Un `FormData` devuelve `FormDataEntryValue | null`, así que sin estos
 * ayudantes cada acción repetiría el mismo `String(datos.get(...)).trim()` y
 * las mismas comprobaciones de archivo vacío. Todo lo que sale de acá ya está
 * en el tipo que espera la API: texto recortado, número o `undefined`, lista de
 * ids, archivo solo si de verdad se eligió uno.
 */

/** Texto recortado. Vacío es cadena vacía, nunca `null`. */
export function texto(datos: FormData, campo: string): string {
  const valor = datos.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

/**
 * Número, o `undefined` si el campo vino vacío.
 *
 * La diferencia importa: mandar `0` no es lo mismo que no mandar nada, y en un
 * campo de orden o de asociados el cero es un valor válido.
 */
export function numero(datos: FormData, campo: string): number | undefined {
  const valor = texto(datos, campo);
  if (!valor) return undefined;
  const n = Number(valor);
  return Number.isFinite(n) ? n : undefined;
}

/** Las casillas marcadas de un `CampoMultiple`. */
export function lista(datos: FormData, campo: string): string[] {
  return datos
    .getAll(campo)
    .filter((valor): valor is string => typeof valor === "string" && !!valor);
}

/**
 * El archivo elegido, o `null` si no se eligió ninguno.
 *
 * Un `<input type="file">` sin elegir igual manda una entrada de tamaño cero, y
 * si esa entrada viaja la API entiende que se quiere borrar el archivo que ya
 * estaba.
 */
export function archivo(datos: FormData, campo: string): File | null {
  const valor = datos.get(campo);
  return valor instanceof File && valor.size > 0 ? valor : null;
}

/** Lo mismo para un campo `multiple`. */
export function archivos(datos: FormData, campo: string): File[] {
  return datos
    .getAll(campo)
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);
}
