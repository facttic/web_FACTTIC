import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";

/**
 * Recibe el formulario de Contacto y lo reenvía a la API.
 *
 * Va por acá y no directo desde el browser para no exponer la URL de la API ni
 * depender de su CORS, y para poder validar antes de gastar una llamada. La
 * API pide los cuatro campos, así que se rechaza en el borde lo que no los
 * traiga.
 */

const MOTIVO_POR_DEFECTO = "Necesito sus servicios";

/**
 * Topes de cada campo.
 *
 * Es el único POST del sitio que cualquiera puede llamar sin credencial, y lo
 * que entra termina en la casilla de FACTTIC. Sin un tope, un mensaje de diez
 * megas viaja entero hasta la API antes de que nadie lo mire.
 */
const LARGO = { nombre: 120, email: 150, mensaje: 4000, motivo: 120 };

/**
 * Cuántos mensajes se aceptan por dirección IP y en cuánto tiempo.
 *
 * Sin esto, el formulario es una forma de inundar la casilla de la Federación
 * desde un script, y de paso de hacer que a la cuenta de correo la marquen por
 * enviar de más.
 *
 * La cuenta vive en memoria del proceso: en Vercel hay varias instancias y se
 * reinician, así que no es una barrera dura —para eso haría falta que el
 * contador viva afuera—, pero corta el abuso simple de un solo origen, que es
 * el que de verdad pasa.
 */
const TOPE_POR_IP = 5;
const VENTANA = 10 * 60 * 1000;
const vistos = new Map<string, number[]>();

function demasiados(ip: string): boolean {
  const ahora = Date.now();
  const previos = (vistos.get(ip) ?? []).filter((t) => ahora - t < VENTANA);
  previos.push(ahora);
  vistos.set(ip, previos);

  /* La tabla se limpia sola: sin esto crece con cada visitante nuevo hasta que
     el proceso se reinicie. */
  if (vistos.size > 5000) {
    for (const [clave, marcas] of vistos) {
      if (marcas.every((t) => ahora - t >= VENTANA)) vistos.delete(clave);
    }
  }

  return previos.length > TOPE_POR_IP;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconocida";
  if (demasiados(ip)) {
    return NextResponse.json(
      { error: "Probá de nuevo en un rato" },
      { status: 429 },
    );
  }

  let datos: FormData;
  try {
    datos = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  const texto = (campo: string) => String(datos.get(campo) ?? "").trim();

  const cuerpo = {
    nombre: texto("nombre"),
    email: texto("email"),
    mensaje: texto("mensaje"),
    // El motivo viene de un grupo de radios con uno marcado; si igual llegara
    // vacío, se manda el primero en vez de que la API rechace todo el mensaje.
    motivo: texto("motivo") || MOTIVO_POR_DEFECTO,
  };

  const falta = Object.entries(cuerpo).find(([, valor]) => !valor);
  if (falta) {
    return NextResponse.json({ error: `Falta ${falta[0]}` }, { status: 400 });
  }

  const largo = Object.entries(cuerpo).find(
    ([campo, valor]) => valor.length > LARGO[campo as keyof typeof LARGO],
  );
  if (largo) {
    return NextResponse.json(
      { error: `${largo[0]} es demasiado largo` },
      { status: 400 },
    );
  }

  try {
    await apiFetch("/api/contacto", {
      method: "POST",
      body: JSON.stringify(cuerpo),
      headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Los errores de validación de la API son del mensaje, no del servidor.
    const status = error instanceof ApiError ? error.status : 502;
    return NextResponse.json(
      { error: "No se pudo enviar" },
      { status: status >= 400 && status < 500 ? 400 : 502 },
    );
  }
}
