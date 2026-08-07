import Link from "next/link";
import { cerrarSesion } from "@/lib/api/session";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { NavegacionAdmin } from "./navegacion";

/**
 * Marco del panel: barra lateral fija con la navegación y el contenido al lado.
 *
 * Toma la paleta y las tipografías del sitio —el mismo negro, la misma mono,
 * el mismo lila— pero se comporta como un panel y no como una página: la
 * lateral no se mueve, la densidad es mayor y no hay animaciones ni
 * decoración. Quien carga contenido pasa horas acá.
 */
export async function MarcoAdmin({
  usuario,
  children,
}: {
  usuario: string;
  children: React.ReactNode;
}) {
  async function salir() {
    "use server";
    await cerrarSesion();
    redirect("/admin/ingresar");
  }

  return (
    <div className="flex min-h-svh">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-borde bg-negro-oscuro md:flex">
        <div className="border-b border-borde px-6 py-5">
          <Logo href="/admin" />
          <p className="text-eyebrow mt-2 text-blanco/40">Panel de contenido</p>
        </div>

        <NavegacionAdmin className="flex-1 overflow-y-auto p-4" />

        <div className="border-t border-borde p-4">
          <p className="text-p3 truncate text-blanco/50">{usuario}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-p3 text-blanco/50 underline-offset-4 hover:text-blanco hover:underline"
            >
              Ver el sitio
            </Link>
            <form action={salir}>
              <button
                type="submit"
                className="text-p3 cursor-pointer text-blanco/50 underline-offset-4 hover:text-blanco hover:underline"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* En pantallas chicas la navegación va arriba, en una tira que se
          desplaza: el panel se usa sobre todo en escritorio, pero tiene que
          poder abrirse desde el teléfono para una corrección rápida. */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 border-b border-borde bg-negro-oscuro/90 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo href="/admin" />
            <form action={salir}>
              <button
                type="submit"
                className="text-p3 cursor-pointer text-blanco/50"
              >
                Salir
              </button>
            </form>
          </div>
          <NavegacionAdmin variante="tira" className="px-4 pb-3" />
        </header>

        {/* El espacio de abajo es para la barra de acciones de los
            formularios, que va fija al pie y si no taparía el final. */}
        <main className="min-w-0 flex-1 p-4 pb-28 md:p-8 md:pb-28">
          {children}
        </main>
      </div>
    </div>
  );
}
