"use server";

import { requerirSesion } from "@/lib/api/guardia";

/**
 * Traducir al inglés desde el panel.
 *
 * Usa **LibreTranslate**, que es software libre (AGPL) y no un servicio
 * cerrado: la traducción automática entra al sitio sin atarlo a una empresa
 * que mañana cambie las condiciones. La instancia va en una variable de
 * entorno, así que se puede mover —a la oficial con clave, a una comunitaria,
 * o a una propia— sin tocar código.
 *
 * Lo que devuelve es un borrador: lo escribe en el campo y queda editable. La
 * máquina no decide qué se publica, propone.
 *
 * Solo se manda lo que de todos modos va a ser público —descripciones,
 * novedades, el relato de un proyecto—, nunca datos de cuentas ni de personas.
 */

const SERVICIO =
  process.env.TRADUCTOR_URL ?? "https://translate.disroot.org/translate";
const CLAVE = process.env.TRADUCTOR_CLAVE;

/**
 * Lo que entra en un pedido. La instancia pública corta en 1000 caracteres, y
 * los cuerpos de una novedad llegan a cinco mil: se mandan por partes.
 */
const TOPE = 900;

/**
 * Parte el texto sin romper frases.
 *
 * Primero por párrafos, que es el corte natural; si un párrafo solo ya pasa el
 * tope, se sigue cortando por puntos. Traducir media oración da resultados
 * peores que traducir una de más.
 */
function enPartes(texto: string): string[] {
  const partes: string[] = [];
  let actual = "";

  const empujar = (trozo: string) => {
    if (actual.length + trozo.length <= TOPE) {
      actual += trozo;
      return;
    }
    if (actual) partes.push(actual);
    actual = trozo.length <= TOPE ? trozo : "";
    if (!actual) {
      // Un solo párrafo gigante: se corta por oraciones.
      for (const oracion of trozo.match(/[^.!?]+[.!?]*\s*/g) ?? [trozo]) {
        if (actual.length + oracion.length > TOPE && actual) {
          partes.push(actual);
          actual = "";
        }
        actual += oracion;
      }
    }
  };

  for (const parrafo of texto.split(/(\n\s*\n)/)) empujar(parrafo);
  if (actual) partes.push(actual);
  return partes.filter((p) => p.trim());
}

async function unaParte(texto: string): Promise<string> {
  const res = await fetch(SERVICIO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: texto,
      source: "es",
      target: "en",
      format: "text",
      ...(CLAVE ? { api_key: CLAVE } : {}),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const cuerpo = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(cuerpo.error ?? `el traductor respondió ${res.status}`);
  }

  const { translatedText } = (await res.json()) as { translatedText?: string };
  if (!translatedText) throw new Error("el traductor no devolvió texto");
  return translatedText;
}

export async function traducirAlIngles(
  texto: string,
): Promise<{ ok: true; texto: string } | { ok: false; error: string }> {
  await requerirSesion();

  const limpio = texto.trim();
  if (!limpio) {
    return { ok: false, error: "Escribí primero el texto en español" };
  }

  try {
    /* En serie y no en paralelo: son instancias comunitarias y conviene no
       dispararles cinco pedidos juntos por un solo campo. */
    const traducidas: string[] = [];
    for (const parte of enPartes(limpio)) traducidas.push(await unaParte(parte));
    return { ok: true, texto: traducidas.join(" ").replace(/\s+\n/g, "\n") };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `No se pudo traducir: ${error.message}`
          : "No se pudo traducir",
    };
  }
}
