import { requerirFederacion } from "@/lib/api/guardia";
import { EdicionSimple } from "@/components/admin/abm-simple";
import { CONFIG } from "../config";

export const metadata = { title: `Agregar ${CONFIG.singular}` };

export default async function Page() {
  await requerirFederacion();
  return <EdicionSimple config={CONFIG} />;
}
