"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { ChipSector } from "@/components/ui/chip";
import { MapaFederal, PROPORCION_MAPA, centroDe } from "./mapa-federal";
import { NUESTRA_RED as T } from "@/lib/contenido";
import type { CooperativaEnRed, ProvinciaConRed } from "@/lib/datos/red";

/**
 * El bloque interactivo de Nuestra Red: el mapa, el panel de la provincia
 * elegida y sus cooperativas.
 *
 * Arranca con la provincia que más cooperativas tiene, para que la pantalla no
 * abra vacía. El estado vive acá y no en la URL porque es una exploración, no
 * un filtro que se comparta: el mapa se recorre y se vuelve.
 */
export function RedFederal({
  provincias,
  className,
}: {
  provincias: ProvinciaConRed[];
  className?: string;
}) {
  /*
   * Dos estados y no uno: la provincia elegida manda en el mapa, las solapas y
   * las tarjetas de abajo, y el panel es una ventanita que se abre sobre ella.
   * Cerrar el panel no borra la elección —abajo sigue la última provincia—,
   * que era lo que pasaba cuando eran la misma cosa.
   */
  const [elegida, setElegida] = useState(provincias[0]?.nombre ?? null);
  const [panelAbierto, setPanelAbierto] = useState(true);
  const indice = provincias.findIndex((p) => p.nombre === elegida);
  const provincia = provincias[indice] ?? null;

  const elegir = (nombre: string) => {
    setElegida(nombre);
    setPanelAbierto(true);
  };

  const cantidades = Object.fromEntries(
    provincias.map((p) => [p.nombre, p.cooperativas.length]),
  );
  const centro = elegida ? centroDe(elegida) : null;

  /*
   * Al tocar fuera del mapa y del panel, la tarjeta se cierra. Las solapas
   * quedan afuera de esa regla porque su trabajo es justamente elegir otra, y
   * por eso se preguntan acá: no alcanza con frenar la propagación desde su
   * `onClick`. React delega sus eventos en `document`, que es el mismo nodo
   * donde vive este listener, y `stopPropagation()` no impide que corran los
   * demás listeners del mismo nodo. Sin esto, la solapa abría el panel y este
   * listener lo cerraba en el mismo clic.
   */
  const zona = useRef<HTMLDivElement>(null);
  const solapas = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);

  /*
   * La lista de provincias no entra en la pantalla, así que al cambiar de una
   * con las flechas la solapa activa se quedaba fuera de vista y no se veía
   * cuál estaba elegida. Se centra sola; el desplazamiento va sobre la pista y
   * no con `scrollIntoView`, que además movería la página entera.
   */
  useEffect(() => {
    const lista = pista.current;
    if (!lista || !elegida) return;
    const solapa = lista.querySelector<HTMLElement>(
      `[data-provincia="${CSS.escape(elegida)}"]`,
    );
    if (!solapa) return;
    const caja = lista.getBoundingClientRect();
    const suya = solapa.getBoundingClientRect();
    lista.scrollBy({
      left: suya.left - caja.left - (caja.width - suya.width) / 2,
      behavior: "smooth",
    });
  }, [elegida]);
  useEffect(() => {
    const alTocar = (evento: MouseEvent) => {
      const destino = evento.target as Node;
      const adentro =
        zona.current?.contains(destino) || solapas.current?.contains(destino);
      if (!adentro) setPanelAbierto(false);
    };
    document.addEventListener("click", alTocar);
    return () => document.removeEventListener("click", alTocar);
  }, []);

  return (
    <div className={className}>
      {/*
        El panel se abre al lado de la provincia que se toca, no en un lugar
        fijo: se cuelga del centro de su forma, corrido hacia la derecha. Por
        eso el mapa va dentro de una caja de su medida exacta, que es contra la
        que se posiciona. En mobile queda debajo, porque superponerlo ahí se
        comería el dibujo.
      */}
      {/*
        En desktop la caja toma la medida exacta del mapa —de ahí la
        proporción— porque el panel se cuelga del centro de la provincia que se
        tocó. En mobile no: el mapa mide 607 de alto, va centrado, y el panel se
        apoya encima tapándole el tercio de abajo, como en el board. Por eso ahí
        la caja ocupa el ancho del contenedor y crece con su contenido, en vez
        de tener alto fijo: si no, el panel se salía y se pisaba con las
        solapas.
      */}
      <div
        ref={zona}
        className="relative mx-auto md:aspect-[var(--proporcion-mapa)] md:h-[600px]"
        style={{ "--proporcion-mapa": PROPORCION_MAPA } as CSSProperties}
      >
        <MapaFederal
          cantidadPorProvincia={cantidades}
          seleccionada={elegida}
          alElegir={elegir}
          className="mx-auto h-[607px] w-auto md:size-full"
        />

        {provincia && panelAbierto ? (
          <PanelProvincia
            provincia={provincia}
            alCerrar={() => setPanelAbierto(false)}
            /*
              El corrimiento va por variable y no como `left`/`top` directos:
              el panel es `relative` también en mobile —donde va debajo del
              mapa, en el flujo— y ahí un `left: 68%` lo empujaba fuera de la
              pantalla, estirando la página a lo ancho.
            */
            className="relative z-10 -mt-[323px] md:absolute md:top-[var(--py)] md:left-[var(--px)] md:z-auto md:mt-0 md:w-[420px] md:-translate-y-1/3"
            style={
              centro
                ? ({
                    "--px": `${centro.x}%`,
                    "--py": `${centro.y}%`,
                  } as CSSProperties)
                : undefined
            }
          />
        ) : (
          // Centrado sobre el mapa: si va en el flujo se sale de la caja de
          // alto fijo y se pisa con las solapas.
          <p className="text-p2 pointer-events-none absolute inset-x-0 bottom-8 text-center text-blanco/50">
            {T.vacio.sugerencia}
          </p>
        )}
      </div>

      {/* Las provincias como solapas, para llegar sin usar el mapa. En mobile
          el board suma las flechas a la derecha, por encima de la línea. */}
      {/* El ref envuelve también a las flechas: si no, tocarlas cuenta como
          "afuera" y el listener de abajo cierra el panel en el mismo clic que
          lo acaba de abrir. */}
      <div ref={solapas} className="relative mt-12">
        <div
          ref={pista}
          role="tablist"
          aria-label="Provincias con cooperativas"
          // Aire a la derecha para que la última solapa no quede debajo de las
          // flechas, que van encima de la línea.
          className="scroll-limpio flex gap-8 overflow-x-auto border-b border-borde pr-28 md:pr-0"
        >
          {provincias.map((p) => {
            const activa = p.nombre === elegida;
            return (
              <button
                key={p.nombre}
                role="tab"
                type="button"
                data-provincia={p.nombre}
                aria-selected={activa}
                onClick={() => elegir(p.nombre)}
                className={cn(
                  "text-h4 -mb-px shrink-0 cursor-pointer border-b-2 pb-3 transition-colors",
                  FOCO,
                  activa
                    ? "border-lila text-lila"
                    : "border-transparent text-blanco/40 hover:text-blanco/70",
                )}
              >
                {p.nombre}
              </button>
            );
          })}
        </div>

        {/* Con relleno propio: la lista se desplaza por debajo y sin esto las
            provincias del final se leerían a través de las flechas. */}
        <div className="bg-fondo absolute right-0 bottom-2.5 flex items-center gap-2 pl-3 md:hidden">
          <BotonFlecha
            direccion="anterior"
            disabled={indice <= 0}
            onClick={() => elegir(provincias[indice - 1].nombre)}
          />
          <BotonFlecha
            direccion="siguiente"
            variante={indice < provincias.length - 1 ? "solida" : "punteada"}
            disabled={indice >= provincias.length - 1}
            onClick={() => elegir(provincias[indice + 1].nombre)}
          />
        </div>
      </div>

      {provincia ? (
        /* Apiladas a lo ancho en mobile —así las dibuja el board— y en cuatro
           columnas en desktop. */
        <div className="mt-8 flex flex-col gap-5 md:grid md:grid-cols-4">
          {provincia.cooperativas.map((coop) => (
            <CardCooperativaRed key={coop.id} cooperativa={coop} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** La ficha de la provincia elegida, sobre vidrio como en la maqueta. */
function PanelProvincia({
  provincia,
  alCerrar,
  className,
  style,
}: {
  provincia: ProvinciaConRed;
  alCerrar: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "borde-degradado textura-ruido relative rounded-2xl bg-negro/40 p-6 backdrop-blur-2xl md:p-8",
        className,
      )}
    >
      {/* La cruz de cerrar, discreta: el panel también se cierra tocando
          fuera, así que no tiene que pedir atención. */}
      <button
        type="button"
        onClick={alCerrar}
        aria-label="Cerrar"
        className={cn(
          "absolute top-5 right-5 cursor-pointer rounded p-1 text-blanco/40",
          "transition-colors hover:text-blanco",
          FOCO,
        )}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
          className="size-4"
        >
          <path d="m4 4 8 8M12 4l-8 8" />
        </svg>
      </button>

      <p className="text-eyebrow text-blanco/40">{T.panel.rotulo}</p>
      <h3 className="text-h2 mt-2 pr-8">{provincia.nombre}</h3>

      <div className="text-p1 mt-6 flex justify-between gap-4 border-y border-dotted border-punteado py-4">
        <span>{T.panel.cooperativas(provincia.cooperativas.length)}</span>
        <span>{T.panel.asociados(provincia.asociados)}</span>
      </div>

      {provincia.industrias.length ? (
        <div className="mt-6">
          <p className="text-eyebrow text-blanco/40">{T.panel.industrias}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {provincia.industrias.map((nombre) => (
              <ChipSector key={nombre} nombre={nombre} />
            ))}
          </div>
        </div>
      ) : null}

      {provincia.servicios.length ? (
        <div className="mt-6 border-t border-dotted border-punteado pt-6">
          <p className="text-eyebrow text-blanco/40">{T.panel.servicios}</p>
          <p className="text-p2 mt-3 text-blanco/80">
            {provincia.servicios.join("  ·  ")}
          </p>
        </div>
      ) : null}

      {!provincia.industrias.length && !provincia.servicios.length ? (
        <p className="text-p2 mt-6 text-blanco/50">{T.panel.sinDatos}</p>
      ) : null}
    </div>
  );
}

/** Tarjeta de cooperativa: logo, nombre, servicios y el enlace a su sitio. */
function CardCooperativaRed({
  cooperativa,
  className,
}: {
  cooperativa: CooperativaEnRed;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col rounded-xl bg-superficie p-6", className)}
    >
      {/*
        Arriba el logo y debajo el nombre, como en la maqueta. Mientras no haya
        logos cargados el nombre ocupa ese lugar y no se repite abajo, que es
        lo que pasaba: la misma palabra dos veces en la misma tarjeta.
      */}
      <div className="grid h-16 place-items-center">
        {cooperativa.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cooperativa.logo}
            alt={cooperativa.nombre}
            loading="lazy"
            className="max-h-12 w-auto object-contain"
          />
        ) : (
          <span className="text-h4 text-center text-balance">
            {cooperativa.nombre}
          </span>
        )}
      </div>

      {cooperativa.logo ? (
        <h4 className="text-p1-bold mt-6">{cooperativa.nombre}</h4>
      ) : null}

      {cooperativa.servicios.length ? (
        <p className="text-p2 mt-6 text-blanco/60">
          {cooperativa.servicios.map((s) => s.nombre).join("  ·  ")}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-dotted border-punteado pt-4">
        <span className="text-p3 flex items-center gap-2 text-blanco/70">
          <span aria-hidden className="size-1.5 rounded-full bg-blanco/70" />
          {cooperativa.provincia ?? "—"}
        </span>
        {cooperativa.sitio ? (
          <a
            href={cooperativa.sitio}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "text-p3 shrink-0 underline-offset-4 hover:underline",
              FOCO,
            )}
          >
            {T.tarjeta.sitio}
          </a>
        ) : null}
      </div>
    </div>
  );
}
