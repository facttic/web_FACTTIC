import { requerirSesion } from "@/lib/api/guardia";
import { traerSimples } from "@/lib/datos/admin";
import { ListadoSimple } from "@/components/admin/abm-simple";
import { CONFIG } from "./config";

export const metadata = { title: CONFIG.titulo };

export default async function Page() {
  await requerirSesion();
  return (
    <ListadoSimple
      config={CONFIG}
      registros={await traerSimples(CONFIG.recurso)}
    />
  );
}
