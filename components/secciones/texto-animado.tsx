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
 * Revelado palabra por palabra atado al scroll, como pide la anotación
 * "Animación: Scroll reveal" sobre el bloque que abre la Home en mobile.
 *
 * A diferencia de `RevelarAlScroll`, que anima el bloque entero una sola vez,
 * acá cada palabra se enciende según cuánto avanzó el texto en la pantalla: al
 * scrollear, el párrafo se va "leyendo" solo.
 *
 * El texto va entero en el DOM y solo cambia su opacidad, así que se selecciona,
 * se busca y lo lee un lector de pantalla como cualquier párrafo. Con
 * `prefers-reduced-motion` aparece completo y no se engancha al scroll.
 */
export function RevelarPalabras({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [avance, setAvance] = useState(1);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const nodo = ref.current;
    if (!nodo) return;

    setAvance(0);
    let pendiente = false;
    const medir = () => {
      pendiente = false;
      const caja = nodo.getBoundingClientRect();
      /*
       * 0 cuando el bloque todavía no llegó al 85% de la pantalla y 1 cuando su
       * tope pasó el 25%: el texto termina de encenderse antes de quedar
       * centrado, no cuando ya se está yendo.
       */
      const inicio = window.innerHeight * 0.85;
      const fin = window.innerHeight * 0.25;
      const p = (inicio - caja.top) / (inicio - fin);
      setAvance(Math.min(1, Math.max(0, p)));
    };
    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  const palabras = texto.split(" ");

  return (
    <p ref={ref} className={className}>
      {palabras.map((palabra, i) => {
        /*
         * Cada palabra se enciende a lo largo de una ventana que se solapa con
         * la de sus vecinas, para que el degradado corra en vez de prenderlas
         * de a una. Las ventanas se reparten de modo que la primera arranque en
         * 0 y la última termine justo en 1: si no, la del final se queda a
         * media luz porque nunca le alcanza el recorrido.
         */
        const ventana = 2 / (palabras.length + 1);
        const desde =
          palabras.length > 1 ? (i * (1 - ventana)) / (palabras.length - 1) : 0;
        const opacidad = Math.min(
          1,
          Math.max(0.15, (avance - desde) / ventana),
        );
        return (
          <span
            key={`${palabra}-${i}`}
            style={{ opacity: opacidad }}
            className="transition-opacity duration-300 motion-reduce:opacity-100"
          >
            {palabra}
            {i < palabras.length - 1 ? " " : ""}
          </span>
        );
      })}
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
