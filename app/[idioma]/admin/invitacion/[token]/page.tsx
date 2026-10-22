import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  aceptarInvitacion,
  usuarioDesdeElCorreo,
  verInvitacion,
} from "@/lib/api/invitaciones";
import { iniciarSesion } from "@/lib/api/session";
import { FormularioInvitacion, type Estado } from "./formulario";

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

  async function aceptar(_estado: unknown, datos: FormData): Promise<Estado> {
    "use server";

    const contrasena = String(datos.get("contrasena") ?? "");
    if (!contrasena) return { error: "Escribí una contraseña" };
    if (!invitacion) return { yaNoSirve: true };

    /*
     * El nombre de usuario lo arma el sistema a partir del correo: la API lo
     * exige para crear la cuenta pero después no se usa, porque para entrar
     * alcanza el correo.
     *
     * Si ya está tomado se reintenta con un número al final en vez de devolver
     * el error. Para la persona es un dato que no eligió ni va a ver, así que
     * trabarla con "ese nombre ya existe" sería pedirle que resuelva un
     * problema nuestro.
     */
    let resultado = await aceptarInvitacion(
      token,
      usuarioDesdeElCorreo(invitacion.email),
      contrasena,
    );
    for (let intento = 1; !resultado.ok && intento < 5; intento++) {
      if (resultado.codigo !== "usuarioTomado") break;
      resultado = await aceptarInvitacion(
        token,
        usuarioDesdeElCorreo(invitacion.email, intento),
        contrasena,
      );
    }

    if (!resultado.ok) {
      /*
       * Una invitación que servía al abrir la pantalla y ya no sirve al
       * enviarla: la usaron desde otra pestaña, o la Federación sacó a esa
       * persona de la lista de editores mientras completaba.
       *
       * No alcanza con devolver el texto del error. Al volver, la pantalla se
       * dibuja de nuevo, `verInvitacion` ya da 404 y el formulario entero
       * quedaba reemplazado por un cartel que decía "pedí otra invitación" sin
       * decir lo que de verdad importa: si la cuenta quedó creada o no. Si fue
       * un segundo envío del mismo formulario, la cuenta existe y lo único que
       * hay que hacer es entrar.
       */
      if (resultado.codigo === "invitacionInvalida") {
        return { yaNoSirve: true, email: invitacion.email };
      }
      return { error: resultado.error };
    }

    /* Se entra con el correo —que es lo que la persona sabe— y se cae en la
       ficha de la cooperativa, que es a lo que vino. */
    const sesion = await iniciarSesion(invitacion.email, contrasena);
    /*
     * La cuenta quedó creada y la invitación, usada. Mandarla a la pantalla de
     * ingreso sin decirle nada la deja creyendo que no se guardó —y la
     * invitación ya no la va a dejar volver a intentar—.
     */
    if (!sesion.ok) return { cuentaCreada: true, email: invitacion.email };
    redirect(`/admin/cooperativas/${resultado.cooperativa}`);
  }

  return <FormularioInvitacion accion={aceptar} invitacion={invitacion} />;
}
