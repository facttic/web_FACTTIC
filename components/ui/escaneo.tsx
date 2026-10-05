"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Barrido de escaneo sobre una imagen, con la profundidad sacada de la propia
 * foto.
 *
 * Es la idea del "Scanning Effect with Depth Map" de deadrabbbbit (MIT), pero
 * sin lo que lo hace caro: el original arma una escena de Three.js sobre WebGPU
 * y necesita un mapa de profundidad producido aparte por cada imagen. Acá es un
 * shader de WebGL2 en un canvas, sin dependencias —Three.js pesa unos 600 KB— y
 * andando en Firefox, que todavía no tiene WebGPU.
 *
 * La profundidad se aproxima con la luminancia: en una foto de grupo lo que
 * está adelante suele recibir más luz, así que el frente deja de ser recto y
 * se enreda con las figuras. No es profundidad real y no lo pretende; lo que
 * reproduce es la lectura de que el barrido recorre un volumen y no un plano.
 *
 * Por defecto los dos frentes salen juntos del centro y se abren hacia los
 * bordes, que es como se mueve el original.
 *
 * Sin WebGL2 no dibuja nada y queda la imagen de siempre debajo, que es lo que
 * se ve igual mientras la textura carga. Y fuera de pantalla el bucle se
 * detiene: medido en Firefox, con la foto a la vista el costo no se distingue
 * de no tener el efecto, pero pintar para nadie sí se paga.
 */

const VERTICE = `#version 300 es
in vec2 posicion;
out vec2 uv;
void main() {
  uv = posicion * 0.5 + 0.5;
  gl_Position = vec4(posicion, 0.0, 1.0);
}`;

const FRAGMENTO = `#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D imagen;
uniform float avance;      // 0 a 1: dónde está la línea
uniform float ancho;       // grosor de la banda
uniform float relieve;     // cuánto desvía la profundidad a la línea
uniform vec3 tono;
uniform vec2 encuadre;     // recorta igual que object-fit: cover
uniform float apertura;    // 1: dos frentes que salen del centro; 0: uno que cruza
uniform float intensidad;  // cuánto tiñe la banda: 1 es el efecto a pleno

void main() {
  // Sin esto la textura se estira hasta llenar el canvas y la foto queda
  // deformada respecto de la imagen de abajo, que va con cover.
  vec2 coord = vec2(uv.x, 1.0 - uv.y);
  coord = (coord - 0.5) * encuadre + 0.5;
  vec3 base = texture(imagen, coord).rgb;

  // La luminancia hace de profundidad: lo iluminado se lee como más cerca.
  float profundidad = dot(base, vec3(0.2126, 0.7152, 0.0722));

  // El relieve corre el frente según lo que tiene delante, así deja de ser
  // una recta y se enreda con las figuras.
  float desvio = (profundidad - 0.5) * relieve;

  /*
   * Dos recorridos posibles. En apertura los frentes salen juntos del centro
   * y se abren hacia los bordes, que es como se mueve el original; en barrido
   * hay uno solo que cruza de lado a lado.
   */
  float distancia = apertura > 0.5
    ? abs(abs(coord.x - 0.5) - (avance * 0.62 + desvio))
    : abs(coord.x - (avance + desvio));

  float dentro = 1.0 - smoothstep(0.0, ancho, distancia);

  // Franjas finas dentro de la banda, que es lo que la lee como un escaneo.
  float franjas = 0.5 + 0.5 * sin(coord.y * 420.0);
  float brillo = dentro * (0.55 + 0.45 * franjas);

  // El frente de la línea marca más que la cola.
  float frente = 1.0 - smoothstep(0.0, ancho * 0.22, abs(distancia));

  vec3 mezcla = mix(base, tono, brillo * 0.75 * intensidad);
  mezcla += tono * frente * 0.35 * intensidad;

  color = vec4(mezcla, 1.0);
}`;

function compilar(gl: WebGL2RenderingContext, tipo: number, fuente: string) {
  const sh = gl.createShader(tipo);
  if (!sh) return null;
  gl.shaderSource(sh, fuente);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("[escaneo]", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function Escaneo({
  src,
  alt,
  className,
  /** Segundos que tarda el barrido en cruzar la imagen. */
  duracion = 6,
  /** Grosor de la banda, en fracción del ancho. */
  ancho = 0.06,
  /** Cuánto desvía el frente la profundidad. En 0 el recorrido es recto. */
  relieve = 0.05,
  /** Dos frentes que salen del centro y se abren, en vez de uno que cruza. */
  desdeElCentro = true,
  /**
   * Cuánto tiñe la banda, de 0 a 1. En 1 el barrido pinta a pleno; por debajo
   * se insinúa sobre la foto, que es como va en Sobre Facttic.
   */
  intensidad = 1,
  /**
   * `cover` llena la caja recortando lo que sobra —con una panorámica se come
   * los costados—; `contain` muestra la foto entera y deja aire.
   */
  ajuste = "cover" as "cover" | "contain",
  tono = [0.84, 0.73, 0.95] as [number, number, number],
}: {
  src: string;
  alt: string;
  className?: string;
  duracion?: number;
  ancho?: number;
  relieve?: number;
  desdeElCentro?: boolean;
  intensidad?: number;
  ajuste?: "cover" | "contain";
  tono?: [number, number, number];
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false });
    if (!gl) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO);
    if (!vs || !fs) return;

    const programa = gl.createProgram();
    if (!programa) return;
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
      console.error("[escaneo]", gl.getProgramInfoLog(programa));
      return;
    }
    gl.useProgram(programa);

    // Un rectángulo que tapa la pantalla, que es todo lo que hace falta.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const posicion = gl.getAttribLocation(programa, "posicion");
    gl.enableVertexAttribArray(posicion);
    gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0);

    const u = {
      avance: gl.getUniformLocation(programa, "avance"),
      ancho: gl.getUniformLocation(programa, "ancho"),
      relieve: gl.getUniformLocation(programa, "relieve"),
      tono: gl.getUniformLocation(programa, "tono"),
      imagen: gl.getUniformLocation(programa, "imagen"),
      encuadre: gl.getUniformLocation(programa, "encuadre"),
      apertura: gl.getUniformLocation(programa, "apertura"),
      intensidad: gl.getUniformLocation(programa, "intensidad"),
    };
    gl.uniform1f(u.ancho, ancho);
    gl.uniform1f(u.relieve, relieve);
    gl.uniform3fv(u.tono, tono);
    gl.uniform1i(u.imagen, 0);
    gl.uniform1f(u.apertura, desdeElCentro ? 1 : 0);
    gl.uniform1f(u.intensidad, intensidad);

    const textura = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textura);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let cuadro = 0;
    let vivo = true;
    let inicio = 0;
    let transcurrido = 0;
    let aLaVista = false;
    let listo = false;
    const imagen = new Image();

    const medir = () => {
      const r = canvas.getBoundingClientRect();
      const escala = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * escala);
      canvas.height = Math.round(r.height * escala);
      gl.viewport(0, 0, canvas.width, canvas.height);

      /*
       * `cover` recorta el eje que sobra y deja el otro entero; `contain` hace
       * lo contrario, mostrando la foto completa y sobrando caja. Con una
       * panorámica muy ancha la diferencia es grande: `cover` se lleva puestas
       * a las personas de los extremos.
       */
      const dePantalla = canvas.width / canvas.height;
      const deImagen = imagen.naturalWidth / imagen.naturalHeight;
      if (!deImagen || !dePantalla) return;
      const masAncha = deImagen > dePantalla;
      const recorta = ajuste === "cover" ? masAncha : !masAncha;
      gl.uniform2f(
        u.encuadre,
        recorta ? dePantalla / deImagen : 1,
        recorta ? 1 : deImagen / dePantalla,
      );
    };

    const pintar = (ahora: number) => {
      cuadro = 0;
      if (!vivo || !aLaVista) return;
      // Al volver se retoma desde donde quedó, no desde el principio.
      if (!inicio) inicio = ahora - transcurrido;
      transcurrido = ahora - inicio;
      const t = ((ahora - inicio) / 1000 / duracion) % 1;
      /*
       * Abriéndose va de cero —los dos frentes juntos en el centro— hasta
       * pasarse del borde. Cruzando entra y sale del cuadro por los costados.
       */
      const recorrido = desdeElCentro ? t : t * 1.4 - 0.2;
      gl.uniform1f(u.avance, quieto ? (desdeElCentro ? 0.35 : 0.5) : recorrido);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      cuadro = requestAnimationFrame(pintar);
    };

    const arrancar = () => {
      if (!cuadro && vivo && aLaVista && listo) {
        cuadro = requestAnimationFrame(pintar);
      }
    };

    /*
     * Fuera de pantalla no se dibuja: la foto está a media página y el bucle
     * estaría pintando sesenta veces por segundo para nadie.
     */
    const enPantalla = new IntersectionObserver(
      ([e]) => {
        aLaVista = e.isIntersecting;
        if (aLaVista) {
          inicio = 0;
          arrancar();
        } else if (cuadro) {
          cancelAnimationFrame(cuadro);
          cuadro = 0;
        }
      },
      { rootMargin: "100px" },
    );
    enPantalla.observe(canvas);

    imagen.crossOrigin = "anonymous";
    imagen.src = src;
    imagen.onload = () => {
      if (!vivo) return;
      gl.bindTexture(gl.TEXTURE_2D, textura);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imagen,
      );
      canvas.dataset.listo = "";
      listo = true;
      medir();
      arrancar();
    };

    window.addEventListener("resize", medir);
    return () => {
      vivo = false;
      enPantalla.disconnect();
      if (cuadro) cancelAnimationFrame(cuadro);
      window.removeEventListener("resize", medir);
      gl.deleteProgram(programa);
      gl.deleteTexture(textura);
      gl.deleteBuffer(buffer);
    };
  }, [src, duracion, ancho, relieve, desdeElCentro, intensidad, ajuste, tono]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Debajo va la imagen de siempre: es lo que se ve mientras la textura
          carga y lo único que queda si no hay WebGL2. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "size-full",
          ajuste === "cover" ? "object-cover" : "object-contain",
        )}
      />
      <canvas
        ref={lienzo}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 data-[listo]:opacity-100"
      />
    </div>
  );
}
