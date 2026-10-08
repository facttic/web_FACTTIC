import type { Idioma } from "@/lib/idioma";

/**
 * Los comandos de la consola del navegador.
 *
 * Quien abre F12 en un sitio de cooperativas de tecnología probablemente
 * escriba código. Para esa persona: los datos de la red se pueden consultar
 * desde ahí, con `facttic.ayuda()` —o `facttic.help()`— como punto de entrada.
 *
 * **Habla el idioma del navegador, no el de la pantalla.** Los nombres de los
 * comandos también: en inglés son `help`, `province`, `services`. Quien tiene
 * el navegador en inglés escribe `.help` sin pensarlo; obligarlo a adivinar
 * `.ayuda` es el tipo de fricción que arruina un guiño. Las dos entradas
 * existen siempre igual, porque un punto de entrada que falla no es un punto
 * de entrada.
 *
 * Todo sale de `/api/red`, que se pide **una sola vez y recién cuando se
 * escribe el primer comando**: nadie paga 17 KB por una visita en la que no
 * abrió la consola.
 *
 * Cada comando dibuja su resultado con `console.table` —que en el navegador es
 * una tabla de verdad, ordenable— y además devuelve los datos, así se pueden
 * encadenar: `(await facttic.coops()).filter(c => c.asociados > 10)`.
 */

export interface CoopEnConsola {
  nombre: string;
  provincia: string | null;
  asociados: number | null;
  fundacion: number | null;
  servicios: string[];
  sectores: string[];
  descripcion: string | null;
  sitio: string | null;
}

interface ProyectoEnConsola {
  nombre: string;
  slug: string;
  sector: string | null;
  cliente: string | null;
  cooperativas: string[];
  tecnologias: string[];
}

interface Red {
  federacion: Record<string, string>;
  totales: { cooperativas: number; asociados: number; provincias: number };
  cooperativas: CoopEnConsola[];
  servicios: { nombre: string; descripcion: string; subservicios: string[] }[];
  sectores: { nombre: string; slug: string }[];
  proyectos: ProyectoEnConsola[];
}

const LILA = "color:#b99de8;font-weight:bold";
const SUAVE = "color:#8a8a8a";

/** Los nombres de los comandos, que son parte del idioma como cualquier texto. */
const NOMBRES = {
  es: {
    ayuda: "ayuda",
    totales: "totales",
    coops: "coops",
    coop: "coop",
    provincia: "provincia",
    servicios: "servicios",
    proyectos: "proyectos",
  },
  en: {
    ayuda: "help",
    totales: "totals",
    coops: "coops",
    coop: "coop",
    provincia: "province",
    servicios: "services",
    proyectos: "projects",
  },
} as const;

/** La forma de los nombres, para que los textos no dependan de un idioma. */
type Nombres = { [K in keyof (typeof NOMBRES)["es"]]: string };

/** Los encabezados de las tablas: `console.table` los toma de las claves. */
const COLUMNAS = {
  es: {
    nombre: "nombre",
    provincia: "provincia",
    asociadxs: "asociadxs",
    servicios: "servicios",
    incluye: "incluye",
    sector: "sector",
    cliente: "cliente",
    cooperativas: "cooperativas",
  },
  en: {
    nombre: "name",
    provincia: "province",
    asociadxs: "members",
    servicios: "services",
    incluye: "includes",
    sector: "sector",
    cliente: "client",
    cooperativas: "co-ops",
  },
} as const;

const TEXTOS = {
  es: {
    entrada: (ayuda: string) => [
      `Escribí %c${ayuda}%c para ver los datos de la red desde acá.`,
    ],
    titulo: "— los datos de la red, desde acá.",
    encadenar:
      "Devuelven los datos además de dibujarlos, así que se pueden encadenar:",
    comandos: (n: Nombres): [string, string][] => [
      [`${n.coops}()`, "todas las cooperativas"],
      [`${n.coops}('agro')`, "las que coinciden con algo"],
      [`${n.coop}('gcoop')`, "la ficha de una"],
      [`${n.provincia}('cordoba')`, "las de una provincia"],
      [`${n.servicios}()`, "qué hace la red"],
      [`${n.proyectos}()`, "los proyectos publicados"],
      [`${n.proyectos}('salud')`, "los que coinciden con algo"],
      [`${n.totales}()`, "cuántas son y dónde están"],
    ],
    totales: (t: Red["totales"]) =>
      `${t.cooperativas} cooperativas · ${t.asociados} asociadxs · ${t.provincias} provincias`,
    sinCoop: (q: string, cmd: string) =>
      `No encontré "${q}". Probá con facttic.${cmd}().`,
    sinCoincidencias: (q: string) => `Nada coincide con "${q}".`,
    sinDatos: "Sin datos.",
    sinProvincia: (q: string, cmd: string) =>
      `No hay cooperativas en "${q}". Las provincias con red salen en facttic.${cmd}().`,
    ficha: {
      donde: "Dónde",
      asociadxs: "Asociadxs",
      desde: "Desde",
      servicios: "Servicios",
      sectores: "Sectores",
      sitio: "Sitio",
    },
  },
  en: {
    entrada: (ayuda: string) => [
      `Type %c${ayuda}%c to explore the network from here.`,
    ],
    titulo: "— the network's data, from here.",
    encadenar: "They return the data as well as printing it, so you can chain:",
    comandos: (n: Nombres): [string, string][] => [
      [`${n.coops}()`, "every co-op"],
      [`${n.coops}('agro')`, "the ones matching something"],
      [`${n.coop}('gcoop')`, "one co-op's profile"],
      [`${n.provincia}('cordoba')`, "the ones in a province"],
      [`${n.servicios}()`, "what the network does"],
      [`${n.proyectos}()`, "the published projects"],
      [`${n.proyectos}('health')`, "the ones matching something"],
      [`${n.totales}()`, "how many and where"],
    ],
    totales: (t: Red["totales"]) =>
      `${t.cooperativas} co-ops · ${t.asociados} members · ${t.provincias} provinces`,
    sinCoop: (q: string, cmd: string) =>
      `No match for "${q}". Try facttic.${cmd}().`,
    sinCoincidencias: (q: string) => `Nothing matches "${q}".`,
    sinDatos: "No data.",
    sinProvincia: (q: string, cmd: string) =>
      `No co-ops in "${q}". The provinces with co-ops show up in facttic.${cmd}().`,
    ficha: {
      donde: "Where",
      asociadxs: "Members",
      desde: "Since",
      servicios: "Services",
      sectores: "Sectors",
      sitio: "Site",
    },
  },
} as const;

/** Sin acentos y en minúscula: buscar "cordoba" tiene que encontrar Córdoba. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const contiene = (donde: string, que: string) =>
  normalizar(donde).includes(normalizar(que));

export function construirConsola(idioma: Idioma) {
  const n = NOMBRES[idioma];
  const C = COLUMNAS[idioma];
  const T = TEXTOS[idioma];

  /* Una sola promesa compartida: diez comandos seguidos no son diez pedidos. */
  let pedido: Promise<Red> | null = null;
  const traer = () =>
    (pedido ??= fetch("/api/red").then((r) => r.json() as Promise<Red>));

  function dibujar<T>(filas: T[], vacio: string): T[] {
    if (!filas.length) console.log(`%c${vacio}`, SUAVE);
    else console.table(filas);
    return filas;
  }

  const comandos = {
    ayuda() {
      console.log(`%cfacttic%c ${T.titulo}\n`, LILA, "");
      /* Las columnas se alinean solas: contando espacios a mano, cambiar el
         nombre de un comando —o traducirlo— desacomoda la lista entera. */
      const filas = T.comandos(n);
      const ancho = Math.max(...filas.map(([cmd]) => cmd.length));
      console.log(
        filas
          .map(([cmd, que]) => `  facttic.${cmd.padEnd(ancho)}  ${que}`)
          .join("\n"),
      );
      console.log(
        `\n%c${T.encadenar}\n  (await facttic.${n.coops}()).filter(c => c.asociados > 10)`,
        SUAVE,
      );
    },

    async totales() {
      const red = await traer();
      console.log(`%c${T.totales(red.totales)}`, LILA);
      return red.totales;
    },

    async coops(busca?: string) {
      const red = await traer();
      const filas = busca
        ? red.cooperativas.filter((c) =>
            contiene(
              [c.nombre, c.provincia, ...c.servicios, ...c.sectores].join(" "),
              busca,
            ),
          )
        : red.cooperativas;
      return dibujar(
        filas.map((c) => ({
          [C.nombre]: c.nombre,
          [C.provincia]: c.provincia,
          [C.asociadxs]: c.asociados,
          [C.servicios]: c.servicios.join(" · "),
        })),
        busca ? T.sinCoincidencias(busca) : T.sinDatos,
      );
    },

    async coop(nombre: string) {
      const red = await traer();
      const coop = red.cooperativas.find((c) => contiene(c.nombre, nombre));
      if (!coop) {
        console.log(`%c${T.sinCoop(nombre, n.coops)}`, SUAVE);
        return null;
      }

      console.log(`%c${coop.nombre}`, LILA);
      if (coop.descripcion) console.log(coop.descripcion);
      const campos: [string, string | number | null][] = [
        [T.ficha.donde, coop.provincia],
        [T.ficha.asociadxs, coop.asociados],
        [T.ficha.desde, coop.fundacion],
        [T.ficha.servicios, coop.servicios.join(" · ")],
        [T.ficha.sectores, coop.sectores.join(" · ")],
        [T.ficha.sitio, coop.sitio],
      ];
      console.log(
        campos
          .filter(([, valor]) => valor)
          .map(([clave, valor]) => `  ${clave}: ${valor}`)
          .join("\n"),
      );
      return coop;
    },

    async provincia(nombre: string) {
      const red = await traer();
      const filas = red.cooperativas.filter(
        (c) => c.provincia && contiene(c.provincia, nombre),
      );
      return dibujar(
        filas.map((c) => ({
          [C.nombre]: c.nombre,
          [C.asociadxs]: c.asociados,
          [C.servicios]: c.servicios.join(" · "),
        })),
        T.sinProvincia(nombre, n.coops),
      );
    },

    async servicios() {
      const red = await traer();
      return dibujar(
        red.servicios.map((s) => ({
          [C.nombre]: s.nombre,
          [C.incluye]: s.subservicios.join(" · "),
        })),
        T.sinDatos,
      );
    },

    async proyectos(busca?: string) {
      const red = await traer();
      const filas = busca
        ? red.proyectos.filter((p) =>
            contiene(
              [
                p.nombre,
                p.sector ?? "",
                p.cliente ?? "",
                ...p.cooperativas,
                ...p.tecnologias,
              ].join(" "),
              busca,
            ),
          )
        : red.proyectos;
      return dibujar(
        filas.map((p) => ({
          [C.nombre]: p.nombre,
          [C.sector]: p.sector,
          [C.cliente]: p.cliente,
          [C.cooperativas]: p.cooperativas.join(" · "),
        })),
        busca ? T.sinCoincidencias(busca) : T.sinDatos,
      );
    },
  };

  return {
    [n.ayuda]: comandos.ayuda,
    [n.totales]: comandos.totales,
    [n.coops]: comandos.coops,
    [n.coop]: comandos.coop,
    [n.provincia]: comandos.provincia,
    [n.servicios]: comandos.servicios,
    [n.proyectos]: comandos.proyectos,
    /* Las dos puertas, siempre. Quien llega con el navegador en un idioma y la
       cabeza en el otro no tiene por qué quedarse afuera en el primer intento. */
    ayuda: comandos.ayuda,
    help: comandos.ayuda,
  };
}

/** El renglón que invita, en el idioma del navegador. */
export function invitacion(idioma: Idioma) {
  return {
    texto: TEXTOS[idioma].entrada(`facttic.${NOMBRES[idioma].ayuda}()`)[0],
    comando: `facttic.${NOMBRES[idioma].ayuda}()`,
  };
}
