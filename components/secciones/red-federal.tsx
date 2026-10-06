"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Enlace as Link } from "@/components/ui/enlace";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { ChipSector } from "@/components/ui/chip";
import { MapaFederal, PROPORCION_MAPA } from "./mapa-federal";
import { contenido } from "@/lib/contenido";
import { useIdioma } from "@/lib/idioma-cliente";
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
  const T = contenido(useIdioma()).NUESTRA_RED;
  /*
   * Dos estados y no uno: la provincia elegida manda en el mapa, las solapas y
   * las tarjetas de abajo, y el panel es una ventanita que se abre sobre ella.
   * Cerrar el panel no borra la elección —abajo sigue la última provincia—,
   * que era lo que pasaba cuando eran la misma cosa.
   */
  const [elegida, setElegida] = useState(provincias[0]?.nombre ?? null);
  // Arranca cerrado: primero se ve el mapa entero y la ficha aparece al tocar.
  const [panelAbierto, setPanelAbierto] = useState(false);
  /*
   * La ficha arranca angosta —cortada donde empieza la provincia— y se puede
   * abrir a todo el ancho cuando lo que hay para leer no entra: una provincia
   * con quince servicios no se cuenta en doscientos píxeles. Abierta sí tapa el
   * mapa, pero ahí ya se está leyendo, no mirando.
   */
  const [fichaAmpliada, setFichaAmpliada] = useState(false);
  const indice = provincias.findIndex((p) => p.nombre === elegida);
  const provincia = provincias[indice] ?? null;

  const elegir = (nombre: string) => {
    setElegida(nombre);
    setPanelAbierto(true);
    // Cada provincia abre en chico: lo ampliado valía para la anterior.
    setFichaAmpliada(false);
  };

  const cantidades = Object.fromEntries(
    provincias.map((p) => [p.nombre, p.cooperativas.length]),
  );

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
    /* `overflow-x-clip`: la ficha se sale de la pantalla a propósito y sin
       esto la página se estiraría a lo ancho. `clip` y no `hidden`, que
       convertiría esto en un contenedor de scroll y rompería el mapa que se
       derrama por abajo. */
    <div className={cn("relative overflow-x-clip", className)}>
      {/*
        Al elegir una provincia el mapa se acerca a ella y la deja en el tercio
        izquierdo; el panel se abre a la derecha, fijo, sin pisarla. Al cerrarlo
        vuelve el país entero.

        En desktop la caja toma la medida exacta del mapa —de ahí la
        proporción—, que es contra la que se posiciona el panel. En mobile no:
        el mapa mide 607 de alto, va centrado, y el panel se apoya encima; por
        eso ahí la caja ocupa el ancho del contenedor y toma su alto del mapa.
      */}
      <div
        ref={zona}
        className="relative z-0 mx-auto md:aspect-[var(--proporcion-mapa)] md:h-[600px]"
        style={{ "--proporcion-mapa": PROPORCION_MAPA } as CSSProperties}
      >
        <MapaFederal
          cantidadPorProvincia={cantidades}
          seleccionada={elegida}
          alElegir={elegir}
          /* Solo mientras el panel está abierto: al cerrarlo vuelve el país
             entero, que es el estado en el que se elige. */
          acercar={panelAbierto}
          className="mx-auto md:size-full"
        />

        {/*
          Arriba se disuelve. Acercado, el dibujo también se sale por el tope y
          llegaría hasta el menú, que es fijo y transparente mientras la página
          está sin desplazar: ahí el mapa competiría con la navegación. Pasa por
          detrás, como abajo, pero apagándose antes de llegar.
        */}
        <div
          aria-hidden
          className="from-fondo via-fondo/85 pointer-events-none absolute inset-x-0 -top-[460px] z-[1] hidden h-[480px] bg-gradient-to-b to-transparent md:block"
        />

        {provincia && panelAbierto ? (
          <PanelProvincia
            provincia={provincia}
            alCerrar={() => setPanelAbierto(false)}
            ampliada={fichaAmpliada}
            alAmpliar={() => setFichaAmpliada((previa) => !previa)}
            /*
              Un cajón que entra desde la izquierda y se sale de la pantalla por
              ese lado: arranca fuera del borde y pierde ahí su esquina
              redondeada, así se lee como algo que viene de afuera y no como una
              tarjeta apoyada encima del mapa.

              No tapa la provincia porque no se acomoda a ella: es el mapa el
              que, al acercarse, la deja justo debajo de donde la ficha termina.
              Así la ficha puede ocupar todo el ancho, que es lo que necesita
              para contar algo.

              En escritorio nada de esto hace falta: el panel va afuera de la
              caja del mapa, a su derecha, donde sobra lugar.
            */
            className={cn(
              "se-despliega-al-costado absolute top-4 right-3 left-[-2rem] z-20 rounded-l-none",
              /* El relleno de la izquierda compensa lo que queda fuera de la
                 pantalla: sin esto el texto arrancaba cortado. */
              "pl-12",
              "md:inset-x-auto md:top-1/2 md:right-auto md:left-full md:ml-8 md:w-[420px] md:rounded-2xl md:pl-8 md:-translate-y-1/2",
            )}
            style={{ "--desde": "-32px", "--origen": "left" } as CSSProperties}
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
      {/*
        Todo lo que va debajo del mapa, sobre un mismo vidrio.

        Cuando el dibujo se acerca se sale de su caja y sigue por acá abajo: en
        vez de recortarlo, esta capa lo deja pasar desenfocado, igual que el
        panel de la provincia. Va un solo vidrio para las solapas y las
        tarjetas juntas y no uno por tarjeta: varias capas de desenfoque
        apiladas cuestan caro y se ensucian donde se tocan.
      */}
      {/* El relleno es del vidrio, no de las solapas: así el aire de arriba
          separa los nombres de provincia del mapa que pasa por detrás, y el
          vidrio asoma un poco a los costados del contenido. */}
      <div
        ref={solapas}
        className="bg-fondo/30 relative z-10 mt-16 -mx-5 rounded-2xl px-7 pt-7 pb-6 backdrop-blur-[3px] md:-mx-4 md:px-4"
      >
        <div className="relative">
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
    </div>
  );
}

/** La ficha de la provincia elegida, sobre vidrio como en la maqueta. */
function PanelProvincia({
  provincia,
  alCerrar,
  ampliada = false,
  alAmpliar,
  className,
  style,
}: {
  provincia: ProvinciaConRed;
  alCerrar: () => void;
  /** En el teléfono la ficha arranca angosta y se puede abrir a todo el ancho. */
  ampliada?: boolean;
  alAmpliar?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const T = contenido(useIdioma()).NUESTRA_RED;
  // Con esto no entra en el ancho corto: vale la pena ofrecer abrirla.
  const hayDeSobra =
    provincia.servicios.length > 2 || provincia.industrias.length > 3;
  return (
    <div
      style={style}
      className={cn(
        "borde-degradado textura-ruido relative rounded-2xl bg-negro/40 p-4 backdrop-blur-2xl md:p-8",
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
          "absolute top-3 right-3 cursor-pointer rounded p-1 text-blanco/40 md:top-5 md:right-5",
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

      {/* El rótulo solo en desktop: en el teléfono la solapa activa ya dice
          qué provincia es y el panel entero tiene que entrar en pantalla. */}
      <p className="text-eyebrow hidden text-blanco/40 md:block">
        {T.panel.rotulo}
      </p>
      <h3 className="text-p1-bold md:text-h2 pr-7 md:mt-2">
        {provincia.nombre}
      </h3>

      {/* Apiladas en el teléfono: la ficha mide unos 230 y las dos cifras en
          una línea se cortaban. */}
      <div className="text-p3 md:text-p1 mt-2 flex flex-wrap gap-x-5 gap-y-1 border-y border-dotted border-punteado py-2.5 md:mt-6 md:justify-between md:gap-4 md:py-4">
        <span>{T.panel.cooperativas(provincia.cooperativas.length)}</span>
        <span>{T.panel.asociados(provincia.asociados)}</span>
      </div>

      {/* Los rótulos de las dos listas, solo en escritorio: en un cajón de
          doscientos y pico "INDUSTRIAS ESPECIALIZADAS" se parte en dos
          renglones y ocupa más que lo que nombra. Los chips y los servicios se
          entienden solos. */}
      {provincia.industrias.length ? (
        <div className="mt-3 md:mt-6">
          <p className="text-eyebrow hidden text-blanco/40 md:block">
            {T.panel.industrias}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 md:mt-3 md:gap-2">
            {provincia.industrias.map((nombre) => (
              <ChipSector key={nombre} nombre={nombre} />
            ))}
          </div>
        </div>
      ) : null}

      {provincia.servicios.length ? (
        <div className="mt-3 border-t border-dotted border-punteado pt-3 md:mt-6 md:pt-6">
          <p className="text-eyebrow hidden text-blanco/40 md:block">
            {T.panel.servicios}
          </p>
          <p
            className={cn(
              "text-p3 md:text-p2 text-blanco/80 md:mt-3",
              !ampliada && "line-clamp-2 md:line-clamp-none",
            )}
          >
            {provincia.servicios.join("  ·  ")}
          </p>
        </div>
      ) : null}

      {!provincia.industrias.length && !provincia.servicios.length ? (
        <p className="text-p2 mt-6 text-blanco/50">{T.panel.sinDatos}</p>
      ) : null}

      {/* Solo en el teléfono: en escritorio la ficha ya entra entera. */}
      {hayDeSobra && alAmpliar ? (
        <button
          type="button"
          onClick={alAmpliar}
          className={cn(
            "text-p3 mt-3 cursor-pointer rounded text-blanco/60 underline-offset-4 transition-colors hover:text-blanco hover:underline md:hidden",
            FOCO,
          )}
        >
          {ampliada ? T.panel.verMenos : T.panel.verTodo}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Tarjeta de cooperativa: quién es, qué hace y por dónde seguir.
 *
 * Es lo más parecido a una ficha que tiene el sitio —no hay pantalla propia por
 * cooperativa—, así que es acá donde tiene que verse lo que cada una carga: su
 * descripción, sus servicios, sus redes y el camino a sus proyectos.
 */
function CardCooperativaRed({
  cooperativa,
  className,
}: {
  cooperativa: CooperativaEnRed;
  className?: string;
}) {
  const T = contenido(useIdioma()).NUESTRA_RED;
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-superficie",
        className,
      )}
    >
      {/*
        El logo va en un header propio: una franja blanca a lo ancho de la
        tarjeta, pegada al borde de arriba, de 85px como en el archivo. El
        `overflow-hidden` de la tarjeta es lo que le redondea las dos esquinas
        de arriba sin tener que repetir el radio acá.

        Mientras no haya logo cargado el nombre ocupa ese lugar y no se repite
        abajo, que es lo que pasaba: la misma palabra dos veces en la tarjeta.
      */}
      <div className="grid h-[85px] shrink-0 place-items-center bg-blanco px-6">
        {cooperativa.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cooperativa.logo}
            alt={cooperativa.nombre}
            loading="lazy"
            className="max-h-14 w-auto max-w-full object-contain"
          />
        ) : (
          <span className="text-h4 text-center text-balance text-negro-oscuro">
            {cooperativa.nombre}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {cooperativa.logo ? (
          <h4 className="text-p1-bold">{cooperativa.nombre}</h4>
        ) : null}

        {cooperativa.descripcion ? (
          <p className="text-p2 mt-4 text-blanco/80">
            {cooperativa.descripcion}
          </p>
        ) : null}

        {cooperativa.servicios.length ? (
          <p className="text-p2 mt-4 text-blanco/60">
            {cooperativa.servicios.map((s) => s.nombre).join("  ·  ")}
          </p>
        ) : null}

        <Redes cooperativa={cooperativa} />

        {/* El pie va abajo de todo: con tarjetas de distinto largo en la misma
            fila, la línea punteada queda a la misma altura en todas. */}
        {/* En columna y no en una sola línea: la tarjeta mide unos 290px y
            con la provincia más los dos enlaces al lado el último se cortaba. */}
        <div className="mt-auto flex flex-col gap-2 border-t border-dotted border-punteado pt-4">
          <span className="text-p3 flex items-center gap-2 text-blanco/70">
            <span aria-hidden className="size-1.5 rounded-full bg-blanco/70" />
            {cooperativa.provincia ?? "—"}
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {/* Los proyectos de la cooperativa son el filtro que ya existe en
                Proyectos: no hace falta una pantalla nueva para llegar. */}
            <Link
              href={`/proyectos?cooperativa=${cooperativa.id}`}
              className={cn("text-p3 underline-offset-4 hover:underline", FOCO)}
            >
              {T.tarjeta.proyectos}
            </Link>
            {cooperativa.sitio ? (
              <a
                href={cooperativa.sitio}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  "text-p3 underline-offset-4 hover:underline",
                  FOCO,
                )}
              >
                {T.tarjeta.sitio}
              </a>
            ) : null}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Las redes y el contacto de la cooperativa, si cargó alguno.
 *
 * Van como texto y no como íconos: son tres o cuatro enlaces que aparecen de a
 * ratos, y un juego de íconos para eso pesa más de lo que aclara.
 */
function Redes({ cooperativa }: { cooperativa: CooperativaEnRed }) {
  const enlaces = [
    { texto: "LinkedIn", href: cooperativa.redes.linkedin },
    { texto: "Instagram", href: cooperativa.redes.instagram },
    { texto: "GitHub", href: cooperativa.redes.github },
    {
      texto: cooperativa.email,
      href: cooperativa.email ? `mailto:${cooperativa.email}` : null,
    },
  ].filter((enlace): enlace is { texto: string; href: string } =>
    Boolean(enlace.href && enlace.texto),
  );

  if (!enlaces.length) return null;

  return (
    <p className="text-p3 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-blanco/50">
      {enlaces.map((enlace) => (
        <a
          key={enlace.href}
          href={enlace.href}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "underline-offset-4 hover:text-blanco hover:underline",
            FOCO,
          )}
        >
          {enlace.texto}
        </a>
      ))}
    </p>
  );
}
