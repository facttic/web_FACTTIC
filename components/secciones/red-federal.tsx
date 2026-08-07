"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { ChipSector } from "@/components/ui/chip";
import { Carrusel } from "@/components/ui/carrusel";
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
  const provincia = provincias.find((p) => p.nombre === elegida) ?? null;

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
      <div
        ref={zona}
        className="relative mx-auto h-[380px] md:h-[600px]"
        style={{ aspectRatio: PROPORCION_MAPA }}
      >
        <MapaFederal
          cantidadPorProvincia={cantidades}
          seleccionada={elegida}
          alElegir={elegir}
          className="size-full"
        />

        {provincia && panelAbierto ? (
          <PanelProvincia
            provincia={provincia}
            alCerrar={() => setPanelAbierto(false)}
            className="mt-6 md:absolute md:mt-0 md:w-[420px] md:-translate-y-1/3"
            style={
              centro ? { left: `${centro.x}%`, top: `${centro.y}%` } : undefined
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

      {/* Las provincias como solapas, para llegar sin usar el mapa. */}
      <div
        ref={solapas}
        role="tablist"
        aria-label="Provincias con cooperativas"
        className="scroll-limpio mt-12 flex gap-8 overflow-x-auto border-b border-borde"
      >
        {provincias.map((p) => {
          const activa = p.nombre === elegida;
          return (
            <button
              key={p.nombre}
              role="tab"
              type="button"
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

      {provincia ? (
        <Carrusel grilla="md:grid-cols-4" gap="gap-5" className="mt-8">
          {provincia.cooperativas.map((coop) => (
            <CardCooperativaRed
              key={coop.id}
              cooperativa={coop}
              className="w-[280px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </Carrusel>
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
