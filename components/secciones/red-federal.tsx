"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Enlace as Link } from "@/components/ui/enlace";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { ChipSector } from "@/components/ui/chip";
import { RedesCooperativa } from "@/components/tarjetas/red";
import { MapaFederal, PROPORCION_MAPA } from "./mapa-federal";
import { contenido } from "@/lib/contenido";
import { useIdioma } from "@/lib/idioma-cliente";
import type { CooperativaEnRed, ProvinciaConRed } from "@/lib/datos/red";

/** Lo que tarda la ficha en replegarse; tiene que coincidir con el CSS. */
const SALIDA = 200;

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
  /* Cuál tiene la ficha abierta. `null` es "ninguna", que es lo que el panel
     usa para cerrarse. */
  const [abierta, setAbierta] = useState<CooperativaEnRed | null>(null);
  // Arranca cerrado: primero se ve el mapa entero y la ficha aparece al tocar.
  const [panelAbierto, setPanelAbierto] = useState(false);
  /*
   * La ficha arranca angosta —cortada donde empieza la provincia— y se puede
   * abrir a todo el ancho cuando lo que hay para leer no entra: una provincia
   * con quince servicios no se cuenta en doscientos píxeles. Abierta sí tapa el
   * mapa, pero ahí ya se está leyendo, no mirando.
   */
  const [fichaAmpliada, setFichaAmpliada] = useState(false);
  /*
   * Al cambiar de provincia la ficha se repliega y vuelve a salir, en vez de
   * cambiarle el contenido por abajo: así se entiende que es otra, y el mapa
   * aprovecha ese momento para viajar hasta ella sin que la ficha se arrastre
   * por el medio.
   */
  const [saliendo, setSaliendo] = useState(false);
  const relevo = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => clearTimeout(relevo.current ?? undefined), []);
  /*
   * Si la elegida ya no está en la lista —cambió el contenido de la API entre
   * dos renders— `findIndex` da -1 y las flechas quedaban habilitadas hacia
   * atrás sobre un índice que no existe. Se vuelve a la primera.
   */
  const encontrada = provincias.findIndex((p) => p.nombre === elegida);
  const indice = encontrada >= 0 ? encontrada : 0;
  const provincia = provincias[indice] ?? null;

  const elegir = (nombre: string) => {
    // Cada provincia abre en chico: lo ampliado valía para la anterior.
    setFichaAmpliada(false);

    const cambiaConLaFichaAbierta =
      panelAbierto && elegida !== null && nombre !== elegida;
    if (!cambiaConLaFichaAbierta) {
      setElegida(nombre);
      setPanelAbierto(true);
      return;
    }

    // Primero se guarda, y recién cuando terminó de irse entra la nueva.
    setSaliendo(true);
    clearTimeout(relevo.current ?? undefined);
    relevo.current = setTimeout(() => {
      setElegida(nombre);
      setSaliendo(false);
    }, SALIDA);
  };

  /* Con un objeto nuevo en cada render, el mapa recalculaba sus trazos y el
     reparto de puntitos cada vez que se tocaba algo de esta pantalla. */
  const cantidades = useMemo(
    () =>
      Object.fromEntries(
        provincias.map((p) => [p.nombre, p.cooperativas.length]),
      ),
    [provincias],
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
          cambiando={saliendo}
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
            /* Una ficha por provincia: al cambiar la clave, React la monta de
               nuevo y la animación de entrada vuelve a correr. */
            key={provincia.nombre}
            saliendo={saliendo}
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
              saliendo ? "se-repliega-al-costado" : "se-despliega-al-costado",
              "absolute top-4 right-3 left-[-2rem] z-20 rounded-l-none",
              /* El relleno de la izquierda compensa lo que queda fuera de la
                 pantalla: sin esto el texto arrancaba cortado. */
              "pl-12",
              "md:inset-x-auto md:top-1/2 md:right-auto md:left-full md:ml-8 md:w-[420px] md:rounded-2xl md:pl-8 md:-translate-y-1/2",
            )}
            style={{ "--desde": "-32px", "--origen": "left" } as CSSProperties}
          />
        ) : (
          /*
            Centrada y por debajo del dibujo: en el flujo se sale de la caja de
            alto fijo y se pisa con las solapas, así que va absoluta y apoyada
            en el aire que queda entre el mapa y ellas.

            Antes iba dentro del mapa, a 32px del pie, y ahí le pasaba por
            encima a las Malvinas: están al este de Santa Cruz, justo a esa
            altura. Ese era el único lugar del dibujo que parecía vacío.
          */
          <p className="text-p2 pointer-events-none absolute inset-x-0 -bottom-12 text-center text-blanco/50 md:-bottom-14">
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
            /* Aire a la derecha para que la última solapa no quede debajo de
               las flechas, que van encima de la línea. Y a la izquierda para
               que la primera no arranque pegada al borde del vidrio, donde el
               nombre toca el canto de la tarjeta y se lee apretado. */
            className="scroll-limpio flex gap-8 overflow-x-auto border-b border-borde pl-3 pr-28 md:pl-5 md:pr-0"
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
              <CardCooperativaRed
                key={coop.id}
                cooperativa={coop}
                alAbrir={() => setAbierta(coop)}
              />
            ))}
          </div>
        ) : null}

        <PanelCooperativa
          cooperativa={abierta}
          alCerrar={() => setAbierta(null)}
        />
      </div>
    </div>
  );
}

/** La ficha de la provincia elegida, sobre vidrio como en la maqueta. */
function PanelProvincia({
  provincia,
  alCerrar,
  saliendo = false,
  ampliada = false,
  alAmpliar,
  className,
  style,
}: {
  provincia: ProvinciaConRed;
  alCerrar: () => void;
  /** Yéndose, mientras entra la de otra provincia. */
  saliendo?: boolean;
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
      {hayDeSobra && alAmpliar && !saliendo ? (
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
 * Tarjeta de cooperativa en la grilla.
 *
 * Muestra poco a propósito: logo, nombre, qué hace y dónde está. Antes traía
 * también la descripción, y alcanzó con que una cooperativa escribiera siete
 * renglones para que su tarjeta estirara toda la fila y las otras tres
 * quedaran con medio metro de vacío adentro. Como el sitio no tiene pantalla
 * por cooperativa, esa tarjeta se había vuelto la ficha, y una ficha no entra
 * en una grilla de cuatro columnas.
 *
 * Así que ahora es un botón: abre el panel, que es donde está todo.
 *
 * Por eso tampoco lleva enlaces adentro. Un `<a>` dentro de un `<button>` no
 * es HTML válido, y de paso el clic deja de ser ambiguo: toda la tarjeta hace
 * una sola cosa.
 */
function CardCooperativaRed({
  cooperativa,
  alAbrir,
  className,
}: {
  cooperativa: CooperativaEnRed;
  alAbrir: () => void;
  className?: string;
}) {
  const T = contenido(useIdioma()).NUESTRA_RED;
  return (
    <button
      type="button"
      onClick={alAbrir}
      aria-label={`${T.tarjeta.abrir}: ${cooperativa.nombre}`}
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-xl bg-superficie text-left",
        /* Ahora sí se levanta al pasar el mouse prometiendo un clic, porque el
           clic existe. Antes era al revés: la tarjeta no era enlace y el hover
           no podía prometer nada. */
        "borde-degradado-hover transition-transform duration-300 hover:-translate-y-1",
        FOCO,
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
      <div className="grid h-[85px] w-full shrink-0 place-items-center bg-blanco px-6">
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

        {/* Cortado a dos renglones: son hasta cinco servicios y con los nombres
            largos —"Datos e inteligencia artificial"— volvía a desparejar. */}
        {cooperativa.servicios.length ? (
          <p className="text-p2 mt-4 line-clamp-2 text-blanco/60">
            {cooperativa.servicios.map((s) => s.nombre).join("  ·  ")}
          </p>
        ) : null}

        {/* El pie va abajo de todo: así la línea punteada cae a la misma altura
            en todas las tarjetas de la fila. */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-dotted border-punteado pt-4">
          <span className="text-p3 flex items-center gap-2 text-blanco/70">
            <span aria-hidden className="size-1.5 rounded-full bg-blanco/70" />
            {cooperativa.provincia ?? "—"}
          </span>
          {/* No es un enlace ni se comporta como tal: es la pista de que la
              tarjeta se abre, que si no el clic no se adivina. */}
          <span aria-hidden className="text-p3 text-blanco/45">
            {T.tarjeta.abrir}
          </span>
        </div>
      </div>
    </button>
  );
}

/**
 * El panel con la ficha completa de una cooperativa.
 *
 * Va en un `<dialog>` nativo y no en un `div` con posición fija: `showModal()`
 * trae el cierre con Escape, el foco encerrado adentro, el resto de la página
 * inerte para el lector de pantalla y el fondo oscurecido. Todo eso escrito a
 * mano son cien líneas que además siempre quedan a medias.
 *
 * En mobile ocupa la pantalla entera. Un panel centrado en un teléfono deja
 * dos dedos de alto para el texto, que es justo lo que venimos a mostrar.
 */
function PanelCooperativa({
  cooperativa,
  alCerrar,
}: {
  cooperativa: CooperativaEnRed | null;
  alCerrar: () => void;
}) {
  const T = contenido(useIdioma()).NUESTRA_RED;
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    if (cooperativa && !nodo.open) nodo.showModal();
    if (!cooperativa && nodo.open) nodo.close();
  }, [cooperativa]);

  /* El `close` del propio diálogo: lo dispara Escape, que no pasa por el botón
     de cerrar y dejaría el estado creyendo que sigue abierto. */
  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    nodo.addEventListener("close", alCerrar);
    return () => nodo.removeEventListener("close", alCerrar);
  }, [alCerrar]);

  return (
    <dialog
      ref={dialogo}
      /* Clic en el fondo para cerrar: el `<dialog>` recibe el evento cuando se
         toca fuera de su contenido, porque el contenido vive en el hijo. */
      onClick={(e) => {
        if (e.target === dialogo.current) alCerrar();
      }}
      className={cn(
        "m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-blanco",
        "md:m-auto md:h-auto md:max-h-[85vh] md:w-[min(36rem,calc(100vw-3rem))]",
        "backdrop:bg-negro-oscuro/80 backdrop:backdrop-blur-sm",
      )}
    >
      {cooperativa ? (
        /* `h-full` solo en mobile, donde el panel ocupa la pantalla: en desktop
           mide lo que mida su contenido y recién ahí topea en 85vh. Con
           `h-full` también en desktop, una cooperativa sin descripción abría un
           panel enorme con el pie flotando abajo de todo. */
        <div className="flex h-full flex-col overflow-hidden bg-fondo md:h-auto md:max-h-[85vh] md:rounded-2xl md:border md:border-borde">
          {/* La franja blanca del logo, igual que en la tarjeta: es lo que hace
              que el panel se lea como la misma pieza, agrandada. */}
          <div className="relative grid h-[120px] shrink-0 place-items-center bg-blanco px-16">
            {cooperativa.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cooperativa.logo}
                alt={cooperativa.nombre}
                className="max-h-20 w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-h3 text-center text-balance text-negro-oscuro">
                {cooperativa.nombre}
              </span>
            )}
            <button
              type="button"
              onClick={alCerrar}
              aria-label={T.tarjeta.cerrar}
              className={cn(
                "absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full",
                "bg-negro-oscuro/10 text-negro-oscuro transition-colors hover:bg-negro-oscuro/20",
                FOCO,
              )}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden
                className="size-4"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>

          {/* Lo que scrollea es esto y no la página: con una descripción de
              setecientos caracteres en un teléfono, es la diferencia entre
              poder leerla y no. */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <h3 className="text-h4">{cooperativa.nombre}</h3>

            {cooperativa.descripcion ? (
              <p className="text-p2 mt-4 text-blanco/80">
                {cooperativa.descripcion}
              </p>
            ) : null}

            {cooperativa.servicios.length ? (
              <p className="text-p2 mt-5 text-blanco/60">
                {cooperativa.servicios.map((s) => s.nombre).join("  ·  ")}
              </p>
            ) : null}

            {cooperativa.sectores.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {cooperativa.sectores.map((sector) => (
                  <ChipSector key={sector.id} nombre={sector.nombre} />
                ))}
              </div>
            ) : null}

            <RedesCooperativa cooperativa={cooperativa} className="mt-5" />
          </div>

          <div className="shrink-0 border-t border-dotted border-punteado p-6 md:px-8">
            <span className="text-p3 flex items-center gap-2 text-blanco/70">
              <span aria-hidden className="size-1.5 rounded-full bg-blanco/70" />
              {cooperativa.provincia ?? "—"}
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              {/* Los proyectos de la cooperativa son el filtro que ya existe en
                  Proyectos: no hace falta una pantalla nueva para llegar. */}
              <Link
                href={`/proyectos?cooperativa=${cooperativa.id}`}
                className={cn(
                  "text-p3 underline-offset-4 hover:underline",
                  FOCO,
                )}
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
      ) : null}
    </dialog>
  );
}
