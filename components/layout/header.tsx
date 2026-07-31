"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MENU } from "@/lib/navegacion";
import { IconoMenu } from "@/components/ui/iconos";
import { BotonIdioma, FOCO } from "@/components/ui/boton";
import { Logo } from "./logo";

/**
 * Barra de navegación.
 *
 * En el diseño no es una barra aparte: va superpuesta sobre el hero, sin fondo
 * propio, separada del contenido por una línea punteada. Al desplazarse toma un
 * fondo con desenfoque —eso no está maquetado, pero sin ello el menú se vuelve
 * ilegible sobre el contenido de abajo.
 *
 * El selector EN/ES sí está en el diseño, así que se muestra, pero el botón de
 * inglés va deshabilitado: la v1 sale solo en español porque el contenido de la
 * API no tiene campos por idioma.
 */
export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);

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

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 8);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  const esActiva = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        desplazado || abierto
          ? "border-b border-borde bg-fondo/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="contenedor flex h-[72px] items-center justify-between gap-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Principal">
            <ul className="flex items-center gap-6">
              {MENU.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    aria-current={esActiva(enlace.href) ? "page" : undefined}
                    className={cn(
                      "text-p3 relative block py-6 transition-colors",
                      FOCO,
                      esActiva(enlace.href)
                        ? "text-blanco"
                        : "text-blanco/70 hover:text-blanco",
                    )}
                  >
                    {enlace.etiqueta}
                    {/* Subrayado grueso de la sección actual, como en el diseño. */}
                    {esActiva(enlace.href) ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blanco" />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <BotonIdioma
              idioma="en"
              activo={false}
              disabled
              title="Próximamente"
            />
            <BotonIdioma idioma="es" activo />
          </div>
        </div>

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

      {/* Separador punteado entre el menú y el contenido, como en el diseño. */}
      <div className="contenedor">
        <div className="border-t border-dashed border-blanco/20" />
      </div>

      {abierto ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-fondo md:hidden"
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
