"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MENU } from "@/lib/navegacion";
import { IconoMenu } from "@/components/ui/iconos";
import { FOCO } from "@/components/ui/boton";
import { Logo } from "./logo";

/**
 * Barra de navegación.
 *
 * En desktop muestra el menú completo con la sección actual subrayada; en mobile
 * se reduce al logo y un botón que despliega el menú a pantalla completa.
 *
 * El selector EN/ES del diseño no se incluye todavía: la v1 sale solo en
 * español y el contenido de la API no tiene campos por idioma.
 */
export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // Cierra el menú al navegar, para que no quede tapando la página nueva.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // Con el menú desplegado, la página de atrás no debe desplazarse.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const esActiva = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-fondo/80 backdrop-blur-md">
      <div className="contenedor flex h-16 items-center justify-between gap-8">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {MENU.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  aria-current={esActiva(enlace.href) ? "page" : undefined}
                  className={cn(
                    "text-p3 border-b-2 pb-1 transition-colors",
                    esActiva(enlace.href)
                      ? "border-blanco text-blanco"
                      : "border-transparent text-blanco/60 hover:text-blanco",
                  )}
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-mobile"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className={cn(
            "-mr-2 grid size-10 cursor-pointer place-items-center md:hidden",
            FOCO,
          )}
        >
          <IconoMenu abierto={abierto} />
        </button>
      </div>

      {abierto ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-fondo md:hidden"
        >
          <nav aria-label="Principal" className="contenedor py-8">
            <ul className="flex flex-col">
              {MENU.map((enlace) => (
                <li key={enlace.href} className="border-b border-borde">
                  <Link
                    href={enlace.href}
                    aria-current={esActiva(enlace.href) ? "page" : undefined}
                    className={cn(
                      "text-h3 block py-5 transition-colors",
                      esActiva(enlace.href) ? "text-blanco" : "text-blanco/60",
                    )}
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
