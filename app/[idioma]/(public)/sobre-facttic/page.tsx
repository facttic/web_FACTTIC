import type { Metadata } from "next";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Animacion } from "@/components/ui/animacion";
import { Escaneo } from "@/components/ui/escaneo";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { CardLogo } from "@/components/tarjetas/red";
import { CardOportunidad } from "@/components/tarjetas/bloques";
import { Autoridades } from "@/components/secciones/autoridades";
import { ListaCooperativas } from "@/components/secciones/lista-cooperativas";
import { FONDOS } from "@/lib/animaciones";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import {
  getAutoridades,
  getCooperativas,
  getOrganizaciones,
} from "@/lib/datos/catalogos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}): Promise<Metadata> {
  const T = contenido((await params).idioma).SOBRE_FACTTIC;
  return { title: T.hero.titulo, description: T.hero.bajada };
}

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
export default async function SobreFactticPage({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}) {
  const { idioma } = await params;
  const T = contenido(idioma).SOBRE_FACTTIC;
  const [autoridades, organizaciones, cooperativas] = await Promise.all([
    getAutoridades(),
    getOrganizaciones(),
    getCooperativas(idioma),
  ]);

  return (
    <>
      {/* Recorta solo a lo ancho: `overflow-x: clip` contiene el eje que
          importa —el que le daría ancho de más a la página— y deja que la
          animación siga hacia abajo por detrás de lo que viene. Con
          `overflow-hidden` los dos ejes cortan, y la composición quedaba
          cercenada en seco donde termina el hero. */}
      <section className="relative isolate [overflow-x:clip]">
        {/*
          El envoltorio lleva la clase del contenedor para que la animación se
          ate al borde derecho del contenido y no al de la ventana: en
          pantallas más anchas que 1440 se despegaba del texto y se iba al
          extremo.
        */}
        <div className="contenedor pointer-events-none absolute inset-x-0 top-0 -z-10">
          {/*
            En desktop la animación no se recorta: la composición entera pasa
            por detrás del título y del párrafo —va en `-z-10`, así que no les
            tapa nada— y llega hasta el borde de la pantalla. Antes se cortaba
            por la izquierda para que sus círculos no cruzaran el texto, y el
            corte recto en medio de la página se leía peor que el cruce.

            En mobile sigue recortada: ahí la franja es de 210x190 y la
            composición completa taparía la pantalla entera.
          */}
          {/*
            La máscara en diagonal es lo que la deja pasar por detrás del texto
            sin pelearlo: los soles quedan a pleno arriba a la derecha, donde no
            hay nada que leer, y de ahí se va apagando hasta el 22% por la
            esquina de abajo a la izquierda, que es por donde cruza el título y
            el párrafo. Se desvanece en vez de cortarse, así que no aparece
            ninguna línea recta.
          */}
          <div className="absolute top-0 -right-4 h-[190px] w-[210px] overflow-hidden md:right-auto md:left-[calc(100%+2.5rem-620px)] md:h-[520px] md:w-screen md:overflow-visible md:[mask-image:linear-gradient(to_bottom_left,#000_45%,rgba(0,0,0,0.22)_85%)]">
            <Animacion
              nombre={FONDOS.sobreFacttic}
              className="absolute -top-[150px] -left-[110px] aspect-square w-[420px] opacity-70 md:-top-[437px] md:-left-[154px] md:w-[1200px] md:opacity-100"
            />
          </div>
        </div>

        <Seccion className="pt-24 md:pt-32">
          <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
          {/* `P1/Bold` —DM Mono 16— en mobile, como el resto de las bajadas
              de hero del board. */}
          <p className="text-p1-bold md:text-p1 mt-8 max-w-3xl text-blanco/80">
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
        {/* En mobile el board muestra una tarjeta por vez, pintada y con todo
            desplegado, igual que en Sumá tu coop. */}
        <CarruselConFlechas
          grilla=""
          gap="gap-5"
          className="mt-12 md:hidden"
          automatico
        >
          {T.quienes.tarjetas.map((tarjeta, i) => (
            <CardOportunidad
              key={tarjeta.pregunta}
              indice={i}
              pregunta={tarjeta.pregunta}
              descripcion={tarjeta.descripcion}
              enlace={tarjeta.enlace}
              acento={tarjeta.acento}
              desplegada
              className="w-full shrink-0 snap-start"
            />
          ))}
        </CarruselConFlechas>

        <div className="mt-12 hidden md:mt-16 md:grid md:grid-cols-[352px_1fr] md:gap-16">
          <div aria-hidden />
          <div className="grid items-start gap-5 md:grid-cols-2">
            {T.quienes.tarjetas.map((tarjeta, i) => (
              <CardOportunidad
                key={tarjeta.pregunta}
                indice={i}
                pregunta={tarjeta.pregunta}
                descripcion={tarjeta.descripcion}
                enlace={tarjeta.enlace}
                acento={tarjeta.acento}
                enMobile={"oscuraEnMobile" in tarjeta ? "oscura" : undefined}
                className="md:sticky md:top-24"
              />
            ))}
          </div>
        </div>
      </Seccion>

      {/*
        En desktop la foto no va al corte: entra en el contenedor y queda
        alineada con el texto. En mobile sigue cruzando la pantalla, como su
        maqueta. Va en alta —2880px de ancho, el doble de los 1440 a los que se
        muestra— para que no se vea blanda en pantallas densas.

        355px y no los 470 de la maqueta: es el alto que le corresponde a una
        panorámica de 2880×837 en el ancho del contenedor. Con 470 hay que
        recortar un 12% de cada lado y se pierden las personas de los extremos,
        que es justo lo que el escaneo invita a mirar. En mobile se mantiene el
        recorte: a lo ancho de un teléfono la foto entera sería una franja de
        poco más de cien píxeles.
      */}
      <div className="md:contenedor">
        <Escaneo
          src={T.foto.src}
          alt={T.foto.alt}
          relieve={0.15}
          ancho={0.09}
          duracion={9}
          intensidad={0.25}
          className="h-56 w-full rounded-xl md:h-[355px]"
        />
      </div>

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
            {/* Pasa solo y con flechas, como el resto: son más logos de los
                que entran a la vez y en mobile no se notaba que hubiera más. */}
            <CarruselConFlechas
              grilla="md:grid-cols-4"
              gap="gap-5"
              className="mt-8 md:mt-0"
              automatico
            >
              {organizaciones.map((organizacion) => (
                <CardLogo
                  key={organizacion.id}
                  nombre={organizacion.nombre}
                  logo={organizacion.logo}
                  className="h-[90px] w-[180px] shrink-0 snap-start md:w-auto"
                />
              ))}
            </CarruselConFlechas>
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
