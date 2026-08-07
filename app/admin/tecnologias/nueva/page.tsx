import { requerirSesion } from "@/lib/api/guardia";
import { EdicionSimple } from "@/components/admin/abm-simple";
import { CONFIG } from "../config";

export const metadata = { title: `Agregar ${CONFIG.singular}` };

export default async function Page() {
  await requerirSesion();
  return <EdicionSimple config={CONFIG} />;
}
