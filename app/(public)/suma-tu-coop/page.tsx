import type { Metadata } from "next";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import {
  CardMetodologia,
  CardRequisito,
} from "@/components/tarjetas/servicios";
import { HOME, SUMA_TU_COOP as T } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Sumá tu coop",
  description: T.hero.bajada,
};

/**
 * Sumá tu coop.
 *
 * No consulta la API: es la pantalla institucional para cooperativas que
 * quieren federarse, toda de contenido fijo. La estructura repite el patrón de
 * la columna de 352px con el contenido a la derecha que usan Servicios y las
 * verticales.
 */
export default function SumaTuCoopPage() {
  // Los mismos beneficios de la Home, en el orden propio de esta pantalla.
  const oportunidades = T.oportunidades.orden
    .map((titulo) =>
      HOME.beneficios.items.find((item) => item.titulo === titulo),
    )
    .filter((item) => item !== undefined);

  // La maqueta muestra cuatro tarjetas repitiendo los dos textos que define.
  const compromisos = [...T.compromisos.items, ...T.compromisos.items];

  return (
    <>
      {/* El sol con su órbita punteada, arriba a la derecha del hero. Es Verde
          (#8E8001), medido sobre el archivo, no el amarillo lima. El fondo
          animado de esta página no vino en la entrega: mientras tanto va esta
          versión propia con las formas de la identidad. */}
      <section className="relative isolate overflow-hidden">
        <SolConOrbita className="pointer-events-none absolute -top-4 right-16 -z-10 hidden w-[500px] text-verde md:block" />
        <Seccion className="pt-32 md:pt-40">
          <h1 className="text-display whitespace-pre-line">{T.hero.titulo}</h1>
          <p className="text-p1 mt-6 max-w-2xl text-blanco/80">
            {T.hero.bajada}
          </p>
        </Seccion>
      </section>

      <Seccion>
        <div className="grid gap-8 md:grid-cols-[352px_1fr] md:gap-16">
          <h2 className="text-h2">
            <span className="text-eyebrow mb-3 block text-blanco/40">
              {T.sumate.rotulo}
            </span>
            {T.sumate.titulo}
          </h2>
          <div>
            <p className="text-p1 text-blanco/80">{T.sumate.texto}</p>
            <BotonLink
              href={T.sumate.cta.href}
              className="mt-8 w-full md:w-auto"
            >
              {T.sumate.cta.texto}
            </BotonLink>
          </div>
        </div>
      </Seccion>

      <Seccion>
        <BloqueDesplegable
          rotulo={T.oportunidades.rotulo}
          titulo={T.oportunidades.titulo}
          tamano="h2"
          items={oportunidades.map((item) => ({
            id: item.titulo,
            titulo: item.titulo,
            descripcion: item.descripcion,
          }))}
        />
      </Seccion>

      <Seccion>
        <EncabezadoSeccion
          rotulo={T.compromisos.rotulo}
          titulo={T.compromisos.titulo}
          tamanoTitulo="h2"
        />
        {/* Cuatro en fila en desktop; en mobile se desplazan de costado. */}
        <Carrusel grilla="md:grid-cols-4" gap="gap-5">
          {compromisos.map((titulo, i) => (
            <CardRequisito
              key={`${titulo}-${i}`}
              titulo={<span className="whitespace-pre-line">{titulo}</span>}
              className="h-[135px] w-[287px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </Carrusel>
      </Seccion>

      <Seccion>
        <div className="grid gap-8 md:grid-cols-[352px_1fr] md:gap-16">
          <h2 className="text-h2 whitespace-pre-line">{T.codigo.titulo}</h2>
          <div>
            <p className="text-p1 max-w-2xl text-blanco/80">{T.codigo.texto}</p>
            <BotonLink
              href={T.codigo.cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full md:w-auto"
            >
              {T.codigo.cta.texto}
            </BotonLink>
          </div>
        </div>
      </Seccion>

      <Seccion>
        <EncabezadoSeccion titulo={T.camino.titulo} tamanoTitulo="h2" />
        <div className="grid gap-5 md:grid-cols-3">
          {T.camino.items.map((item, i) => (
            <CardMetodologia
              key={item.pregunta}
              numero={`${String(i + 1).padStart(2, "0")}.`}
              nombre={item.pregunta}
              acento={item.acento}
              className="h-[315px] md:h-[260px]"
            />
          ))}
        </div>
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

/**
 * El sol de rayos con su órbita punteada, como en el archivo: el sol gira
 * despacio sobre sí mismo y los dos puntos recorren la órbita en sentido
 * contrario. Con `prefers-reduced-motion` queda quieto.
 *
 * Los grupos giran con `transform-box: view-box`, que hace que la rotación
 * tome el centro del viewBox y no el de cada figura.
 */
function SolConOrbita({ className }: { className?: string }) {
  const rayos = Array.from({ length: 40 });
  const giro = {
    transformOrigin: "260px 260px",
    transformBox: "view-box",
  } as const;

  return (
    <svg viewBox="0 0 520 520" fill="none" aria-hidden className={className}>
      <g
        className="animate-girar-lento motion-reduce:animate-none"
        style={giro}
      >
        <circle
          cx="260"
          cy="260"
          r="250"
          stroke="var(--color-blanco)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeDasharray="1.5 7"
        />
        <circle
          cx="35"
          cy="185"
          r="6"
          fill="var(--color-blanco)"
          fillOpacity="0.5"
        />
        <circle
          cx="428"
          cy="455"
          r="6"
          fill="var(--color-blanco)"
          fillOpacity="0.5"
        />
      </g>

      <g
        className="animate-girar-medio motion-reduce:animate-none"
        style={giro}
      >
        {rayos.map((_, i) => {
          const angulo = (i / rayos.length) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={260 + Math.cos(angulo) * 60}
              y1={260 + Math.sin(angulo) * 60}
              x2={260 + Math.cos(angulo) * 145}
              y2={260 + Math.sin(angulo) * 145}
              stroke="currentColor"
              strokeWidth="7"
            />
          );
        })}
        <circle cx="260" cy="260" r="62" fill="currentColor" />
      </g>
    </svg>
  );
}
