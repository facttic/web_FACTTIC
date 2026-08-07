import { requerirSesion } from "@/lib/api/guardia";
import { getCooperativas, getAutoridades } from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";
import { getNovedades } from "@/lib/datos/novedades";
import { SECCIONES } from "@/components/admin/secciones";
import { cn } from "@/lib/cn";

export const metadata = { title: "Inicio" };

/**
 * Tablero del panel: cuánto hay cargado de cada cosa.
 *
 * No es decorativo: el sitio está publicado con varios recursos a medio
 * cargar, así que lo primero que conviene ver al entrar es qué falta.
 */
export default async function AdminPage() {
  const sesion = await requerirSesion();

  const [cooperativas, autoridades, proyectos, novedades] = await Promise.all([
    getCooperativas(),
    getAutoridades(),
    getProyectos({ porPagina: 1 }),
    getNovedades(1),
  ]);

  const fichas = [
    {
      href: "/admin/cooperativas",
      etiqueta: "Cooperativas",
      valor: cooperativas.length,
    },
    { href: "/admin/consejo", etiqueta: "Consejo", valor: autoridades.length },
    { href: "/admin/novedades", etiqueta: "Novedades", valor: novedades.total },
    { href: "/admin/proyectos", etiqueta: "Proyectos", valor: proyectos.total },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-h2">Hola, {sesion.usuario}</h1>
      <p className="text-p2 mt-2 text-blanco/60">
        Esto es lo que hay cargado hoy en el sitio.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fichas.map((ficha) => (
          <div
            key={ficha.etiqueta}
            className="rounded-xl border border-borde bg-superficie p-5"
          >
            <p className="text-eyebrow text-blanco/40">{ficha.etiqueta}</p>
            <p className="text-h1 mt-3">{ficha.valor}</p>
          </div>
        ))}
      </div>

      <h2 className="text-h4 mt-12">Todo lo que se puede editar</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {SECCIONES.map((seccion) => (
          <div
            key={seccion.titulo}
            className="rounded-xl border border-borde p-5"
          >
            <p className="text-eyebrow text-blanco/40">{seccion.titulo}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {seccion.items.map((item) => (
                <li
                  key={item.href}
                  className={cn(
                    "text-p3 rounded-md px-3 py-1.5",
                    item.listo
                      ? "bg-superficie text-blanco/70"
                      : "text-blanco/25",
                  )}
                >
                  {item.etiqueta}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
