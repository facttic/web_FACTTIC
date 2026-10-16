"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Animaciones de texto pedidas en los comentarios del diseño.
 *
 * Las dos respetan `prefers-reduced-motion`: si la persona pidió menos
 * movimiento, el texto aparece completo de entrada. Y en ambos casos el texto
 * está siempre entero en el DOM —expuesto con `aria-label` o sin ocultar— para
 * que un lector de pantalla y los buscadores lo lean completo desde el inicio,
 * sin importar la animación.
 */

function prefiereMenosMovimiento(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Efecto máquina de escribir. Arranca después de `retrasoMs`, que en la Home
 * sirve para que el título entre unos segundos más tarde que el video.
 */
export function Typewriter({
  texto: textoAncho,
  textoAngosto,
  retrasoMs = 0,
  velocidadMs = 45,
  className,
}: {
  texto: string;
  /**
   * Variante para pantallas chicas. El hero de la Home la usa porque en mobile
   * el diseño suma una línea ("tu proyecto tecnológico"). No se puede resolver
   * con CSS: el efecto escribe un string, así que la elección va en JS.
   */
  textoAngosto?: string;
  retrasoMs?: number;
  velocidadMs?: number;
  className?: string;
}) {
  const [visibles, setVisibles] = useState(0);
  const [animar, setAnimar] = useState(false);
  const [angosto, setAngosto] = useState(false);

  /*
   * El ancho se resuelve recién en el cliente. No hay salto visible porque el
   * título arranca vacío y espera `retrasoMs` antes de escribir.
   */
  useEffect(() => {
    if (!textoAngosto) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const aplicar = () => setAngosto(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [textoAngosto]);

  const texto = angosto && textoAngosto ? textoAngosto : textoAncho;

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      setVisibles(texto.length);
      return;
    }

    setAnimar(true);
    setVisibles(0);
    const inicio = window.setTimeout(() => {
      const paso = window.setInterval(() => {
        setVisibles((n) => {
          if (n >= texto.length) {
            window.clearInterval(paso);
            return n;
          }
          return n + 1;
        });
      }, velocidadMs);
    }, retrasoMs);

    return () => window.clearTimeout(inicio);
  }, [texto, retrasoMs, velocidadMs]);

  // Sin JS o con menos movimiento, se ve el texto completo desde el principio.
  const mostrado = animar ? texto.slice(0, visibles) : texto;
  const terminado = !animar || visibles >= texto.length;

  /*
   * Las dos capas van superpuestas en la misma celda de la grilla: la de abajo
   * es el texto completo invisible, que reserva desde el inicio la altura de
   * las tres líneas finales. Sin eso el título crece mientras se escribe y
   * empuja al resto del hero.
   */
  return (
    <span
      aria-label={texto}
      className={cn("grid whitespace-pre-line", className)}
    >
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {texto}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden>
        {mostrado}
        {!terminado ? (
          <span className="animate-latido ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.05em] bg-current align-baseline" />
        ) : null}
      </span>
    </span>
  );
}

/**
 * Revelado palabra por palabra, como pide la anotación "Animación: Scroll
 * reveal" que el archivo tiene puesta sobre la bajada del hero en mobile: el
 * párrafo se va "leyendo" solo, encendiéndose de izquierda a derecha.
 *
 * **No va atado al scroll, aunque la anotación lo llame así.** En mobile esta
 * bajada está arriba del pliegue: se ve entera apenas carga la página. Atar el
 * encendido a cuánto subió el párrafo por la pantalla dejaba dos finales
 * malos, y no hay ventana que los evite: o el recorrido termina antes de
 * empezar a scrollear —y entonces no hay revelado—, o se completa recién
 * después de scrollear media pantalla, cuando el hero ya se fue y nadie lo
 * está mirando. Era lo segundo: arrancaba al 24% encendido y necesitaba 410 px
 * de scroll. Así que corre por tiempo, cuando el párrafo entra en pantalla.
 *
 * Lo mueve el CSS y no JavaScript: cada palabra lleva su propio
 * `transition-delay` y todo el efecto es un booleano que se da vuelta una vez.
 * Medir el scroll cuadro a cuadro para reescribir trece opacidades es trabajo
 * en el hilo principal justo mientras se scrollea, que es cuando menos sobra.
 *
 * El texto va entero en el DOM y solo cambia su opacidad, así que se selecciona,
 * se busca y lo lee un lector de pantalla como cualquier párrafo. Con
 * `prefers-reduced-motion` aparece completo y no se anima.
 */

/** Lo que tarda el barrido entero, repartido entre las palabras. */
const BARRIDO_MS = 1400;
/** Con cuánta luz esperan las que todavía no se encendieron. */
const APAGADA = 0.25;

export function RevelarPalabras({
  texto,
  retrasoMs = 0,
  className,
}: {
  texto: string;
  /** Para esperar a que el bloque termine de aparecer antes de encenderse. */
  retrasoMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [encendido, setEncendido] = useState(true);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const nodo = ref.current;
    if (!nodo) return;

    setEncendido(false);
    let espera = 0;

    /* Si alguien llega con la página ya scrolleada, el párrafo no "entra" en
       pantalla nunca y sin esto se quedaría apagado para siempre. */
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        espera = window.setTimeout(() => setEncendido(true), retrasoMs);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      window.clearTimeout(espera);
    };
  }, [retrasoMs]);

  /*
   * Palabras y separadores alternados. Se parte así, y no por espacios, porque
   * algunos textos del board traen cortes de línea propios —la bajada del hero
   * de la Home— y hay que devolverlos tal cual, no convertidos en espacio.
   */
  const trozos = texto.split(/(\s+)/);
  const palabras = trozos.filter((_, i) => i % 2 === 0);
  /* El barrido se reparte entre todas: la última arranca cuando termina el
     recorrido, no antes, así el degradado corre parejo sea cual sea el largo. */
  const paso = palabras.length > 1 ? BARRIDO_MS / (palabras.length - 1) : 0;

  return (
    <p ref={ref} className={cn("whitespace-pre-line", className)}>
      {palabras.map((palabra, i) => (
        <span
          key={`${palabra}-${i}`}
          style={{
            opacity: encendido ? 1 : APAGADA,
            transitionDelay: encendido ? `${Math.round(i * paso)}ms` : "0ms",
          }}
          className="transition-opacity duration-500 motion-reduce:opacity-100"
        >
          {palabra}
          {trozos[i * 2 + 1] ?? ""}
        </span>
      ))}
    </p>
  );
}

/**
 * Revelado al entrar en pantalla: el contenido sube y toma nitidez.
 *
 * Se dispara una sola vez, cuando el bloque asoma en el viewport.
 */
export function RevelarAlScroll({
  children,
  retrasoMs = 0,
  className,
}: {
  children: ReactNode;
  retrasoMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      setVisible(true);
      return;
    }

    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${retrasoMs}ms` }}
      className={cn(
        "transition-[opacity,filter,transform] duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100 blur-none"
          : "translate-y-4 opacity-0 blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
