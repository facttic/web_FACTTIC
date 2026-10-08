/**
 * Los comandos de la consola del navegador.
 *
 * Quien abre F12 en un sitio de cooperativas de tecnología probablemente
 * escriba código. Para esa persona: los datos de la red se pueden consultar
 * desde ahí, con `facttic.ayuda()` como punto de entrada.
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

export function construirConsola() {
  /* Una sola promesa compartida: diez comandos seguidos no son diez pedidos. */
  let pedido: Promise<Red> | null = null;
  const traer = () =>
    (pedido ??= fetch("/api/red").then((r) => r.json() as Promise<Red>));

  function dibujar<T>(filas: T[], vacio: string): T[] {
    if (!filas.length) console.log(`%c${vacio}`, SUAVE);
    else console.table(filas);
    return filas;
  }

  return {
    ayuda() {
      console.log(
        "%cfacttic%c — los datos de la red, desde acá.\n",
        LILA,
        "",
      );
      console.log(
        [
          "  facttic.coops()              todas las cooperativas",
          "  facttic.coops('agro')        las que coinciden con algo",
          "  facttic.coop('gcoop')        la ficha de una",
          "  facttic.provincia('cordoba') las de una provincia",
          "  facttic.servicios()          qué hace la red",
          "  facttic.proyectos()          los proyectos publicados",
          "  facttic.proyectos('salud')   los que coinciden con algo",
          "  facttic.totales()            cuántas son y dónde están",
        ].join("\n"),
      );
      console.log(
        "\n%cDevuelven los datos además de dibujarlos, así que se pueden encadenar:\n" +
          "  (await facttic.coops()).filter(c => c.asociados > 10)",
        SUAVE,
      );
    },

    async totales() {
      const red = await traer();
      console.log(
        `%c${red.totales.cooperativas} cooperativas · ${red.totales.asociados} asociadxs · ${red.totales.provincias} provincias`,
        LILA,
      );
      return red.totales;
    },

    async coops(busca?: string) {
      const red = await traer();
      const todas = red.cooperativas;
      const filas = busca
        ? todas.filter((c) =>
            contiene(
              [c.nombre, c.provincia, ...c.servicios, ...c.sectores].join(" "),
              busca,
            ),
          )
        : todas;
      return dibujar(
        filas.map((c) => ({
          nombre: c.nombre,
          provincia: c.provincia,
          asociadxs: c.asociados,
          servicios: c.servicios.join(" · "),
        })),
        busca ? `Ninguna cooperativa coincide con "${busca}".` : "Sin datos.",
      );
    },

    async coop(nombre: string) {
      const red = await traer();
      const coop = red.cooperativas.find((c) => contiene(c.nombre, nombre));
      if (!coop) {
        console.log(
          `%cNo encontré "${nombre}". Probá con facttic.coops().`,
          SUAVE,
        );
        return null;
      }

      console.log(`%c${coop.nombre}`, LILA);
      if (coop.descripcion) console.log(coop.descripcion);
      const campos = [
        ["Dónde", coop.provincia],
        ["Asociadxs", coop.asociados],
        ["Desde", coop.fundacion],
        ["Servicios", coop.servicios.join(" · ")],
        ["Sectores", coop.sectores.join(" · ")],
        ["Sitio", coop.sitio],
      ].filter(([, valor]) => valor);
      console.log(
        campos.map(([clave, valor]) => `  ${clave}: ${valor}`).join("\n"),
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
          nombre: c.nombre,
          asociadxs: c.asociados,
          servicios: c.servicios.join(" · "),
        })),
        `No hay cooperativas en "${nombre}". Las provincias con red salen en facttic.coops().`,
      );
    },

    async servicios() {
      const red = await traer();
      return dibujar(
        red.servicios.map((s) => ({
          nombre: s.nombre,
          incluye: s.subservicios.join(" · "),
        })),
        "Sin datos.",
      );
    },

    async proyectos(busca?: string) {
      const red = await traer();
      const todos = red.proyectos;
      const filas = busca
        ? todos.filter((p) =>
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
        : todos;
      return dibujar(
        filas.map((p) => ({
          nombre: p.nombre,
          sector: p.sector,
          cliente: p.cliente,
          cooperativas: p.cooperativas.join(" · "),
        })),
        busca ? `Ningún proyecto coincide con "${busca}".` : "Sin datos.",
      );
    },
  };
}
