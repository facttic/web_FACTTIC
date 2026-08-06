/**
 * Sitio web de cada cooperativa.
 *
 * Vive acá y no en la API porque el modelo de cooperativa no tiene el campo:
 * está pedido (ver `PENDIENTES`). Las tarjetas de Nuestra Red muestran "Ir al
 * sitio", así que sin esto el enlace no existiría.
 *
 * Las direcciones se tomaron de las fichas que FACTTIC publicaba en su sitio
 * anterior, recuperadas del Internet Archive. Las que no figuran ahí quedan
 * sin enlace, que es mejor que adivinar un dominio: la tarjeta simplemente no
 * muestra el enlace.
 *
 * Cuando la API tenga el campo, esto se borra y se lee de la cooperativa.
 */
export const SITIOS: Record<string, string> = {
  Animus: "https://animus.com.ar",
  Blaise: "https://blaise.coop.ar",
  Cambá: "https://camba.coop",
  Cambalache: "https://cambalache.coop.ar",
  "Código Libre": "https://codigolibrecoop.com",
  Coodesoft: "https://coodesoft.com.ar",
  Coprinf: "https://coprinf.com.ar",
  Devecoop: "https://devecoop.com",
  "El Maizal": "https://cooperativaelmaizal.com.ar",
  Equality: "https://equality.coop",
  Eryx: "https://eryx.co",
  Gcoop: "https://gcoop.coop",
  Geneos: "https://geneos.com.ar",
  IndepI: "https://indepi.coop.ar",
  Nayra: "https://nayra.coop",
  Sutty: "https://sutty.nl",
  Tecso: "https://tecso.coop",
  Tera: "https://teracoop.com",
};

/** El sitio de una cooperativa, o `null` si no lo tenemos. */
export function sitioDe(nombre: string): string | null {
  return SITIOS[nombre.trim()] ?? null;
}
