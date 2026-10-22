import { NextResponse } from "next/server";
import { nuevoDesafio } from "@/lib/api/altcha";

/**
 * El desafío que el navegador tiene que resolver antes de mandar el formulario.
 *
 * Se pide acá y no se dibuja en la página porque la página está cacheada —cinco
 * minutos el contenido, una hora los catálogos—: un desafío horneado en el HTML
 * llegaría vencido, o peor, serviría para siempre.
 *
 * No se cachea nunca: cada visita tiene que llevarse uno propio.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await nuevoDesafio(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    /* Falta el secreto. Se avisa como falla del servidor y no en silencio: si
       no, el formulario quedaría sin prueba de trabajo sin que nadie se entere. */
    return NextResponse.json(
      { error: "No se pudo preparar el formulario" },
      { status: 503 },
    );
  }
}
