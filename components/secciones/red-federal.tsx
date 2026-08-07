"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { Chip, ChipSector } from "@/components/ui/chip";
import { Carrusel } from "@/components/ui/carrusel";
import { MapaFederal } from "./mapa-federal";
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
  const [elegida, setElegida] = useState(provincias[0]?.nombre ?? null);
  const provincia = provincias.find((p) => p.nombre === elegida) ?? null;

  const cantidades = Object.fromEntries(
    provincias.map((p) => [p.nombre, p.cooperativas.length]),
  );

  return (
    <div className={className}>
      {/*
        El panel se apoya sobre el mapa, como en la maqueta: en desktop flota a
        su derecha tapándole la Patagonia, y en mobile queda debajo porque no
        hay lugar para superponerlo sin comerse el dibujo.
      */}
      <div className="relative">
        <MapaFederal
          cantidadPorProvincia={cantidades}
          seleccionada={elegida}
          alElegir={setElegida}
          // El alto manda: así conserva su proporción real sin adueñarse de la
          // pantalla, que es lo que pasaba al fijarle el ancho.
          className="mx-auto h-[420px] w-auto md:h-[700px]"
        />

        {provincia ? (
          <PanelProvincia
            provincia={provincia}
            className="mt-6 md:absolute md:top-1/4 md:right-0 md:mt-0 md:w-[420px]"
          />
        ) : (
          <p className="text-p1 mt-6 text-blanco/60">{T.vacio.sugerencia}</p>
        )}
      </div>

      {/* Las provincias como solapas, para llegar sin usar el mapa. */}
      <div
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
              onClick={() => setElegida(p.nombre)}
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
  className,
}: {
  provincia: ProvinciaConRed;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "borde-degradado textura-ruido rounded-2xl bg-negro/40 p-6 backdrop-blur-2xl md:p-8",
        className,
      )}
    >
      <p className="text-eyebrow text-blanco/40">{T.panel.rotulo}</p>
      <h3 className="text-h2 mt-2">{provincia.nombre}</h3>

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
