import type { Metadata } from "next";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { RedFederal } from "@/components/secciones/red-federal";
import { NUESTRA_RED as T } from "@/lib/contenido";
import { getRedFederal } from "@/lib/datos/red";

export const metadata: Metadata = {
  title: "Nuestra Red",
  description:
    "Las cooperativas de FACTTIC en todo el país: dónde están, cuántas son y a qué se dedican.",
};

/**
 * Nuestra Red: el mapa federal.
 *
 * La provincia de cada cooperativa no viene de la API sino que se calcula acá,
 * en el servidor, a partir de su ubicación. Al componente interactivo le llega
 * todo resuelto, así que el browser no descarga los límites provinciales ni
 * repite el cálculo.
 */
export default async function NuestraRedPage() {
  const { provincias } = await getRedFederal();

  return (
    <>
      <Seccion className="pt-24 md:pt-32">
        <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>

        <RedFederal provincias={provincias} className="mt-12 md:mt-16" />
      </Seccion>

      <div className="contenedor pb-12 md:pb-16">
        <BandaCta
          variante="vidrio"
          titulo={T.cierre.titulo}
          accion={
            <BotonLink href={T.cierre.cta.href}>{T.cierre.cta.texto}</BotonLink>
          }
        />
      </div>
    </>
  );
}
