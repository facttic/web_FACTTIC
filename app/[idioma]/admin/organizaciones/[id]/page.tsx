import { notFound } from "next/navigation";
import { requerirFederacion } from "@/lib/api/guardia";
import { traerSimple } from "@/lib/datos/admin";
import { EdicionSimple } from "@/components/admin/abm-simple";
import { CONFIG } from "../config";

export const metadata = { title: `Editar ${CONFIG.singular}` };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerirFederacion();
  const registro = await traerSimple(CONFIG.recurso, (await params).id);
  if (!registro) notFound();
  return <EdicionSimple config={CONFIG} registro={registro} />;
}
