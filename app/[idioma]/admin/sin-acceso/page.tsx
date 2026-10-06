import { requerirSesion } from "@/lib/api/guardia";

export const metadata = { title: "Sin acceso" };

/**
 * Para quien entró pero todavía no tiene ninguna cooperativa asignada.
 *
 * Pasa si la Federación le quitó el acceso después de crear la cuenta, o si la
 * invitación quedó revocada. No es un error: la cuenta existe y es válida, lo
 * que no hay es nada que editar.
 */
export default async function SinAccesoPage() {
  const sesion = await requerirSesion();

  return (
    <div className="max-w-xl">
      <h1 className="text-h3">Hola, {sesion.usuario}</h1>
      <p className="text-p2 mt-4 text-blanco/60">
        Tu cuenta no tiene ninguna cooperativa asignada, así que no hay nada
        para editar. Si te invitaron a editar una, escribile a FACTTIC para que
        te vuelvan a dar acceso.
      </p>
    </div>
  );
}
