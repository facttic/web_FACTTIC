"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { SECCIONES } from "./secciones";

/** Navegación del panel, en la lateral o como tira arriba en pantallas chicas. */

/**
 * Los ABMs se construyen de a uno, en este orden. `listo` marca los que ya
 * existen; el resto se muestra apagado en vez de llevar a una ruta que no
 * está, así se ve el alcance completo del panel desde el primer día.
 */

export function NavegacionAdmin({
  variante = "lateral",
  className,
}: {
  variante?: "lateral" | "tira";
  className?: string;
}) {
  const ruta = usePathname();
  const activo = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  if (variante === "tira") {
    return (
      <nav
        className={cn("scroll-limpio flex gap-2 overflow-x-auto", className)}
      >
        {SECCIONES.flatMap((seccion) => seccion.items)
          .filter((item) => item.listo)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href as "/admin/cooperativas"}
              className={cn(
                "text-p3 shrink-0 rounded-md px-3 py-1.5 transition-colors",
                FOCO,
                activo(item.href)
                  ? "bg-lila text-negro-oscuro"
                  : "bg-superficie text-blanco/60 hover:text-blanco",
              )}
            >
              {item.etiqueta}
            </Link>
          ))}
      </nav>
    );
  }

  return (
    <nav className={className}>
      {SECCIONES.map((seccion) => (
        <div key={seccion.titulo} className="mb-6">
          <p className="text-eyebrow mb-2 px-3 text-blanco/30">
            {seccion.titulo}
          </p>
          <ul className="flex flex-col gap-0.5">
            {seccion.items.map((item) =>
              item.listo ? (
                <li key={item.href}>
                  <Link
                    href={item.href as "/admin/cooperativas"}
                    aria-current={activo(item.href) ? "page" : undefined}
                    className={cn(
                      "text-p2 block rounded-md px-3 py-2 transition-colors",
                      FOCO,
                      activo(item.href)
                        ? "bg-superficie-alta text-blanco"
                        : "text-blanco/60 hover:bg-superficie hover:text-blanco",
                    )}
                  >
                    {item.etiqueta}
                  </Link>
                </li>
              ) : (
                <li
                  key={item.href}
                  className="text-p2 flex items-center justify-between rounded-md px-3 py-2 text-blanco/25"
                >
                  {item.etiqueta}
                  <span className="text-eyebrow">pronto</span>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}
