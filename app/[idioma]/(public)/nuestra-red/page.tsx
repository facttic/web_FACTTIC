import type { Metadata } from "next";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { RedFederal } from "@/components/secciones/red-federal";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { getRedFederal } from "@/lib/datos/red";
import { metadatosDe } from "@/lib/seo";

/* Antes era un objeto fijo y en español: la versión en inglés se publicaba con
   el título "Nuestra Red · FACTTIC". */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  const T = contenido(idioma).NUESTRA_RED;
  return metadatosDe({
    idioma,
    ruta: "/nuestra-red",
    titulo: T.seo.titulo,
    descripcion: T.seo.descripcion,
  });
}

/**
 * Nuestra Red: el mapa federal.
 *
 * La provincia de cada cooperativa no viene de la API sino que se calcula acá,
 * en el servidor, a partir de su ubicación. Al componente interactivo le llega
 * todo resuelto, así que el browser no descarga los límites provinciales ni
 * repite el cálculo.
 */
export default async function NuestraRedPage({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}) {
  const { idioma } = await params;
  const T = contenido(idioma).NUESTRA_RED;
  const { provincias } = await getRedFederal(idioma);

  return (
    <>
      <Seccion className="relative pt-24 md:pt-32">
        {/* El título se apoya sobre el mapa en desktop, como en la maqueta. */}
        <h1 className="text-h1 whitespace-pre-line md:absolute md:z-10 md:max-w-md">
          <span className="md:hidden">{T.hero.tituloMobile}</span>
          <span className="hidden md:inline">{T.hero.titulo}</span>
        </h1>

        <RedFederal provincias={provincias} className="mt-10 md:mt-0" />
      </Seccion>

      <div className="contenedor pb-12 md:pb-16">
        <BandaCta
          variante="punteada"
          titulo={T.cierre.titulo}
          accion={
            <BotonLink href={T.cierre.cta.href}>{T.cierre.cta.texto}</BotonLink>
          }
        />
      </div>
    </>
  );
}
