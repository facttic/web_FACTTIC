import type { Metadata } from "next";
import { getSesion } from "@/lib/api/session";
import { MarcoAdmin } from "@/components/admin/marco";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
  // El panel no se indexa: ni en buscadores ni en el historial compartido.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Marco del backoffice.
 *
 * `force-dynamic` es deliberado: ninguna pantalla del panel puede quedar
 * cacheada ni servirse estática, porque muestran datos que dependen de quién
 * entró.
 *
 * La pantalla de ingreso comparte este layout pero no lleva navegación —no
 * tendría a dónde ir—, así que se la deja pasar sin el marco.
 */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await getSesion();

  if (!sesion) return <>{children}</>;

  // Del usuario solo viaja el nombre; el token se queda en el servidor.
  return <MarcoAdmin usuario={sesion.usuario}>{children}</MarcoAdmin>;
}
