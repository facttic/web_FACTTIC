import type { Metadata } from "next";
import Image from "next/image";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Animacion } from "@/components/ui/animacion";
import { Carrusel } from "@/components/ui/carrusel";
import { CardLogo } from "@/components/tarjetas/red";
import { CardOportunidad } from "@/components/tarjetas/bloques";
import { Autoridades } from "@/components/secciones/autoridades";
import { ListaCooperativas } from "@/components/secciones/lista-cooperativas";
import { FONDOS } from "@/lib/animaciones";
import { SOBRE_FACTTIC as T } from "@/lib/contenido";
import {
  getAutoridades,
  getCooperativas,
  getOrganizaciones,
} from "@/lib/datos/catalogos";

export const metadata: Metadata = {
  title: "Sobre Facttic",
  description: T.hero.bajada,
};

/**
 * Sobre Facttic: la pantalla más larga del sitio.
 *
 * Mezcla texto institucional fijo con tres cosas que salen de la API —las
 * autoridades, las organizaciones de las que la Federación forma parte y las
 * cooperativas que la integran—. Cada bloque de datos se muestra solo si hay
 * algo cargado, así que la página no queda con huecos mientras el backoffice
 * se completa.
 *
 * Repite el patrón de dos columnas —rótulo y título a la izquierda, texto a la
 * derecha— que usan Servicios y las verticales.
 */
export default async function SobreFactticPage() {
  const [autoridades, organizaciones, cooperativas] = await Promise.all([
    getAutoridades(),
    getOrganizaciones(),
    getCooperativas(),
  ]);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/*
          El envoltorio lleva la clase del contenedor para que la animación se
          ate al borde derecho del contenido y no al de la ventana: en
          pantallas más anchas que 1440 se despegaba del texto y se iba al
          extremo.
        */}
        <div className="contenedor pointer-events-none absolute inset-x-0 top-0 -z-10">
          {/*
            La caja recorta la animación a la franja derecha, que es donde el
            diseño la deja: su composición es mucho más ancha que eso y sin el
            recorte le cruzan círculos por encima al texto.
          */}
          <div className="absolute top-0 -right-4 h-[190px] w-[210px] overflow-hidden md:-right-10 md:h-[520px] md:w-[620px]">
            <Animacion
              nombre={FONDOS.sobreFacttic}
              className="absolute -top-[150px] -left-[110px] aspect-square w-[420px] opacity-70 md:-top-[437px] md:-left-[154px] md:w-[1200px] md:opacity-100"
            />
          </div>
        </div>

        <Seccion className="pt-24 md:pt-32">
          <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
          <p className="text-p1 mt-8 max-w-3xl text-blanco/80">
            {T.hero.bajada}
          </p>
        </Seccion>
      </section>

      <Seccion>
        <BloqueTexto
          rotulo={T.quienes.rotulo}
          titulo={T.quienes.titulo}
          parrafos={T.quienes.parrafos}
        />

        {/*
          Las tarjetas van debajo del párrafo y alineadas con él, o sea en la
          columna derecha: la izquierda queda vacía. Y se apilan al desplazar,
          como las de servicios, que es lo que pide la anotación del archivo.
        */}
        <div className="mt-12 md:mt-16 md:grid md:grid-cols-[352px_1fr] md:gap-16">
          <div aria-hidden />
          <div className="grid items-start gap-5 md:grid-cols-2">
            {T.quienes.tarjetas.map((tarjeta, i) => (
              <CardOportunidad
                key={tarjeta.pregunta}
                indice={i}
                pregunta={tarjeta.pregunta}
                descripcion={T.hero.bajada}
                acento={tarjeta.acento}
                vidrioEnMobile={"vidrioEnMobile" in tarjeta}
                className="md:sticky md:top-24"
              />
            ))}
          </div>
        </div>
      </Seccion>

      {/*
        La foto cruza la pantalla de punta a punta.

        La copia que hay salió del PNG de mobile y mide 393px de ancho, así que
        acá se agranda casi cuatro veces y se pixela. Queda igual porque es lo
        que dibuja la maqueta; se arregla sola cuando llegue la original en
        alta (PENDIENTES, ítem 34).
      */}
      <Image
        src={T.foto.src}
        alt={T.foto.alt}
        width={1440}
        height={470}
        className="h-56 w-full object-cover md:h-[470px]"
      />

      <Seccion>
        <BloqueTexto
          titulo={T.modelo.titulo}
          rotulo={T.modelo.rotulo}
          parrafos={T.modelo.parrafos}
        />
      </Seccion>

      {organizaciones.length ? (
        <Seccion className="pt-0">
          <div className="border-t border-dotted border-punteado pt-10 md:grid md:grid-cols-[352px_1fr] md:gap-16">
            <h2 className="text-h2 whitespace-pre-line">{T.espacios.titulo}</h2>
            <Carrusel
              grilla="md:grid-cols-4"
              gap="gap-5"
              className="mt-8 md:mt-0"
            >
              {organizaciones.map((organizacion) => (
                <CardLogo
                  key={organizacion.id}
                  nombre={organizacion.nombre}
                  logo={organizacion.logo}
                  className="h-[90px] w-[180px] shrink-0 snap-start md:w-auto"
                />
              ))}
            </Carrusel>
          </div>
        </Seccion>
      ) : null}

      <Seccion>
        <BloqueTexto
          rotulo={T.organizacion.rotulo}
          titulo={T.organizacion.titulo}
          parrafos={T.organizacion.parrafos}
        />
        {/* Alineadas con el párrafo, en la columna derecha, como la maqueta. */}
        <div className="mt-12 md:grid md:grid-cols-[352px_1fr] md:gap-16">
          <div aria-hidden />
          <Autoridades
            autoridades={autoridades}
            etiquetas={T.organizacion.organos}
          />
        </div>
      </Seccion>

      {cooperativas.length ? (
        <Seccion>
          {/* Título a la izquierda y la lista a la derecha, como el resto de
              los bloques de esta pantalla. */}
          <div className="grid gap-x-16 gap-y-3 md:grid-cols-[352px_1fr]">
            <p className="text-eyebrow text-blanco/40 md:col-start-1 md:row-start-1">
              {T.red.rotulo}
            </p>
            <h2 className="text-h2 whitespace-pre-line md:col-start-1 md:row-start-2">
              {T.red.titulo}
            </h2>
            <div className="md:col-start-2 md:row-span-2 md:row-start-2">
              <ListaCooperativas cooperativas={cooperativas} />
            </div>
          </div>
        </Seccion>
      ) : null}

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

/**
 * Rótulo y título a la izquierda, párrafos a la derecha: la forma que repiten
 * casi todos los bloques de esta pantalla.
 */
function BloqueTexto({
  rotulo,
  titulo,
  parrafos,
}: {
  rotulo: string;
  titulo: string;
  parrafos: readonly string[];
}) {
  /*
   * El rótulo va en una fila propia de la columna izquierda, para que el texto
   * de la derecha quede alineado con el título y no con él: es lo que hace la
   * maqueta —el párrafo arranca a la misma altura que "¿Cómo nos
   * organizamos?", no que "ORGANIZACIÓN"—.
   */
  return (
    <div className="grid gap-x-16 gap-y-3 md:grid-cols-[352px_1fr]">
      <p className="text-eyebrow text-blanco/40 md:col-start-1 md:row-start-1">
        {rotulo}
      </p>
      <h2 className="text-h2 whitespace-pre-line md:col-start-1 md:row-start-2">
        {titulo}
      </h2>
      <div className="flex flex-col gap-6 md:col-start-2 md:row-span-2 md:row-start-2">
        {parrafos.map((parrafo) => (
          <p key={parrafo} className="text-p1 text-blanco/80">
            {parrafo}
          </p>
        ))}
      </div>
    </div>
  );
}
