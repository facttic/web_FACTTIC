import type { Metadata } from "next";
import { Tarjeta, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { CardSector } from "@/components/tarjetas/sector";
import { Resplandor } from "@/components/ui/resplandor";
import { GrillaViva } from "@/components/ui/grilla-viva";
import { HazDeBorde } from "@/components/ui/haz";
import { PasosFijos } from "@/components/secciones/pasos-fijos";
import { Acordeon } from "@/components/ui/acordeon";
import { AcordeonVariante } from "@/components/ui/acordeon-variantes";
import { Inclinar } from "@/components/ui/inclinar";
import { Imantar } from "@/components/ui/imantar";
import { Boton } from "@/components/ui/boton";
import { SERVICIOS_PAGINA } from "@/lib/contenido";
import { getSectoresDestacados } from "@/lib/datos/catalogos";
import { acentoDeSector } from "@/lib/animaciones";
import { HOME } from "@/lib/contenido";

export const metadata = {
  title: "Laboratorio de movimiento",
  robots: { index: false },
} satisfies Metadata;

/**
 * Banco de pruebas de movimiento.
 *
 * No es una pantalla del sitio: es donde se miran las variantes antes de
 * decidir cuáles entran, aplicadas a piezas reales y no a cuadraditos de
 * ejemplo. Se borra cuando se elija.
 */

const COLOR_ACENTO: Record<string, string> = {
  lila: "var(--color-lila)",
  celeste: "var(--color-celeste)",
  naranja: "var(--color-naranja)",
  amarillo: "var(--color-amarillo)",
  azul: "var(--color-azul)",
  verde: "var(--color-verde)",
  rojo: "var(--color-rojo)",
};

function Ficha({
  numero,
  titulo,
  nota,
  children,
}: {
  numero: string;
  titulo: string;
  nota: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-dotted border-punteado py-16">
      <div className="mb-10 flex flex-col gap-2">
        <p className="text-eyebrow text-lila">Variante {numero}</p>
        <h2 className="text-h2">{titulo}</h2>
        <p className="text-p2 max-w-2xl text-blanco/60">{nota}</p>
      </div>
      {children}
    </section>
  );
}

export default async function LaboratorioPage() {
  const sectores = await getSectoresDestacados();

  // Los mismos textos que muestra el acordeón de Nuestros servicios.
  const itemsAcordeon = SERVICIOS_PAGINA.metodologia.items.map((item) => ({
    id: item.titulo,
    titulo: item.titulo.replace("\n", " "),
    contenido: item.descripcion,
  }));

  return (
    <div className="contenedor pt-32 pb-24">
      <h1 className="text-h1">Laboratorio de movimiento</h1>
      <p className="text-p1 mt-4 max-w-2xl text-blanco/70">
        Cinco variantes sobre piezas reales del sitio. Pasá el mouse por todo y
        scrolleá despacio: cada una responde distinto.
      </p>

      <Ficha
        numero="01"
        titulo="La luz recorriendo el borde"
        nota="La que ya está en las bandas, ahora en una tarjeta y en un botón. Se mueve sola, sin depender del scroll ni del mouse."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Tarjeta className="relative isolate flex h-64 items-center justify-center">
            <HazDeBorde duracion={7} />
            <p className="text-h4">Tarjeta con luz lila</p>
          </Tarjeta>
          <Tarjeta className="relative isolate flex h-64 items-center justify-center">
            <HazDeBorde duracion={5} color="var(--color-naranja)" />
            <p className="text-h4">Más rápida, naranja</p>
          </Tarjeta>
          <Tarjeta className="relative isolate flex h-64 items-center justify-center">
            <HazDeBorde duracion={11} color="var(--color-celeste)" />
            <p className="text-h4">Lenta, celeste</p>
          </Tarjeta>
        </div>
      </Ficha>

      <Ficha
        numero="02"
        titulo="El resplandor sigue al cursor"
        nota="Cada tarjeta de sector se enciende con el color de su vertical, donde está el mouse. Responde apenas movés la mano."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {sectores.map((sector, i) => (
            <Resplandor
              key={sector.id}
              color={COLOR_ACENTO[acentoDeSector(sector.nombre)]}
              className="rounded-lg"
            >
              <CardSector sector={sector} indice={i} conCaja />
            </Resplandor>
          ))}
        </div>
      </Ficha>

      <Ficha
        numero="03"
        titulo="La grilla que se enciende"
        nota="Un fondo técnico que reacciona al cursor. Iría detrás de una sección entera, no en una caja suelta."
      >
        <GrillaViva className="grid h-80 place-items-center rounded-xl border border-borde">
          <p className="text-h3 max-w-md text-center text-balance">
            Pasá el mouse por acá
          </p>
        </GrillaViva>
      </Ficha>

      <Ficha
        numero="04"
        titulo="La sección se fija y el scroll cuenta los pasos"
        nota="Acá el scroll deja de mover la página y pasa a mover el contenido. Es lo más difícil de ignorar: seguí bajando."
      >
        <PasosFijos pasos={HOME.metodologia.pasos} className="-mx-6" />
      </Ficha>

      <Ficha
        numero="05"
        titulo="Cinco maneras de abrir el acordeón"
        nota="El primero es el que está hoy en Nuestros servicios: abre y ya. Abrí y cerrá los otros cuatro para comparar. El plop rebota; los tres siguientes no, y por eso se sienten más caros."
      >
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          <div>
            <p className="text-p3 mb-4 text-blanco/40">Como está hoy</p>
            <Acordeon items={itemsAcordeon} inicial={null} />
          </div>
          <div>
            <p className="text-p3 mb-4 text-blanco/40">Plop — crece y rebota</p>
            <AcordeonVariante items={itemsAcordeon} efecto="plop" inicial={null} />
          </div>
          <div>
            <p className="text-p3 mb-4 text-lila">
              Suave — arranca rápido y frena largo
            </p>
            <AcordeonVariante items={itemsAcordeon} efecto="suave" inicial={null} />
          </div>
          <div>
            <p className="text-p3 mb-4 text-lila">
              Líneas — el texto sube palabra por palabra
            </p>
            <AcordeonVariante
              items={itemsAcordeon}
              efecto="lineas"
              inicial={null}
            />
          </div>
          <div>
            <p className="text-p3 mb-4 text-lila">
              Barrido — se descubre de arriba abajo, sin mover nada
            </p>
            <AcordeonVariante
              items={itemsAcordeon}
              efecto="barrido"
              inicial={null}
            />
          </div>
        </div>
      </Ficha>

      <Ficha
        numero="06"
        titulo="La tarjeta se inclina hacia el cursor"
        nota="Volumen sin 3D: dos rotaciones en perspectiva. Movete despacio por encima y mirá cómo sigue la mano."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {sectores.map((sector, i) => (
            <Inclinar key={sector.id}>
              <CardSector sector={sector} indice={i} conCaja />
            </Inclinar>
          ))}
        </div>
      </Ficha>

      <Ficha
        numero="07"
        titulo="El botón sale a buscarte"
        nota="Acercá el cursor sin llegar a tocarlo: el botón se mueve hacia vos y al irte vuelve con rebote."
      >
        <div className="flex flex-wrap items-center gap-10">
          <Imantar>
            <Boton>Trabajá con FACTTIC</Boton>
          </Imantar>
          <Imantar fuerza={0.5}>
            <Boton>Con más imán</Boton>
          </Imantar>
          <Boton>Sin imán, para comparar</Boton>
        </div>
      </Ficha>

      <Ficha
        numero="08"
        titulo="Todo junto"
        nota="La banda de cierre con la luz, sobre la grilla viva. Para ver si conviven o se pelean."
      >
        <GrillaViva className="rounded-xl p-10">
          <BandaCta
            titulo={HOME.proyectos.cierre.titulo}
            accion={
              <BotonLink href={HOME.proyectos.cierre.cta.href}>
                {HOME.proyectos.cierre.cta.texto}
              </BotonLink>
            }
          />
        </GrillaViva>
      </Ficha>
    </div>
  );
}
