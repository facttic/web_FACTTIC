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

export async function POST(request: Request) {
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
