import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { iniciarSesion } from "@/lib/api/session";
import { FormularioIngreso } from "./formulario";

export const metadata: Metadata = {
  title: "Ingresar · Panel",
  // El panel no se indexa ni se cachea en ningún lado.
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Ingreso al panel.
 *
 * La contraseña viaja a una acción de servidor y no a un endpoint propio: así
 * no queda una ruta pública que acepte credenciales, y Next verifica el origen
 * de la petición por su cuenta, que es la protección contra CSRF.
 *
 * La contraseña no se registra en ningún lado ni vuelve al formulario si algo
 * falla; el usuario sí, para no obligar a escribirlo de nuevo.
 */
export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ volver?: string }>;
}) {
  const { volver } = await searchParams;

  async function ingresar(_estado: unknown, datos: FormData) {
    "use server";

    const usuario = String(datos.get("usuario") ?? "").trim();
    const contrasena = String(datos.get("contrasena") ?? "");
    if (!usuario || !contrasena) {
      return { error: "Completá usuario y contraseña", usuario };
    }

    const resultado = await iniciarSesion(usuario, contrasena);
    if (!resultado.ok) return { error: resultado.error, usuario };

    /*
     * Solo se vuelve a rutas del propio panel: si `volver` viniera con una URL
     * de otro sitio, sería una redirección abierta y se podría usar para
     * mandar a alguien a una página falsa después de entrar.
     */
    const destino = String(datos.get("volver") ?? "");
    redirect(destino.startsWith("/admin") ? destino : "/admin");
  }

  return <FormularioIngreso accion={ingresar} volver={volver ?? "/admin"} />;
}
