import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { aceptarInvitacion, verInvitacion } from "@/lib/api/invitaciones";
import { iniciarSesion } from "@/lib/api/session";
import { FormularioInvitacion } from "./formulario";

export const metadata: Metadata = {
  title: "Invitación · Panel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Crear la cuenta desde una invitación.
 *
 * Es la única pantalla del panel que se abre sin sesión —`proxy.ts` la deja
 * pasar— porque es justamente donde se crea. Lo que autoriza es el token del
 * link, que la API verifica contra el hash que guardó.
 *
 * El mail no se muestra editable ni viaja en el formulario: lo pone la API a
 * partir de la invitación.
 */
export default async function InvitacionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitacion = await verInvitacion(token);

  async function aceptar(_estado: unknown, datos: FormData) {
    "use server";

    const usuario = String(datos.get("usuario") ?? "").trim();
    const contrasena = String(datos.get("contrasena") ?? "");
    if (!usuario || !contrasena) {
      return { error: "Completá usuario y contraseña", usuario };
    }

    const resultado = await aceptarInvitacion(token, usuario, contrasena);
    if (!resultado.ok) return { error: resultado.error, usuario };

    /* Se entra con lo recién creado y se cae en la ficha de la cooperativa,
       que es a lo que vino. */
    const sesion = await iniciarSesion(usuario, contrasena);
    if (!sesion.ok) redirect("/admin/ingresar");
    redirect(`/admin/cooperativas/${resultado.cooperativa}`);
  }

  return <FormularioInvitacion accion={aceptar} invitacion={invitacion} />;
}
