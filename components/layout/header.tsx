"use client";

import { Enlace as Link } from "@/components/ui/enlace";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MENU } from "@/lib/navegacion";
import { IDIOMAS, rutaEn } from "@/lib/idioma";
import { useIdioma } from "@/lib/idioma-cliente";
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
 * En las verticales el hero arranca con un bloque pintado que pasa por detrás
 * de la barra, así que ahí el menú se lee en negro hasta que se desplaza. Es
 * lo que pide la anotación "cambié la diagramación del header" del archivo.
 *
 * El selector EN/ES cambia de idioma sin moverse de pantalla: cada botón es un
 * enlace a la misma ruta en el otro idioma. Lo que todavía no esté traducido se
 * muestra en español.
 */
export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const idioma = useIdioma();
  /* La misma pantalla en el otro idioma: se le saca el prefijo y se le pone
     el que corresponde. */
  const sinIdioma = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

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

  /*
    Sobre el bloque de color de una vertical —y solo mientras no se haya
    desplazado ni abierto el menú, que traen fondo oscuro propio—.
  */
  const sobreColor =
    /^\/nuestros-servicios\/[^/]+$/.test(pathname) && !desplazado && !abierto;

  return (
    /*
      El vidrio va en la barra y no en el <header>: `backdrop-filter` convierte
      al elemento en el bloque contenedor de sus descendientes `fixed`, así que
      con el desenfoque acá arriba el panel del menú se posicionaba contra la
      barra —69px de alto— en vez de contra la ventana, y quedaba de alto cero.
    */
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-colors duration-300",
          desplazado || abierto
            ? "border-b border-borde bg-fondo/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="contenedor flex h-[68px] items-center justify-between gap-8 md:h-[90px]">
          {/* El wordmark es un PNG blanco, así que sobre el color se invierte.
              Cuando diseño entregue el SVG conviene pasarlo a `currentColor`. */}
          <Logo className={sobreColor ? "invert" : undefined} />

          <div className="hidden items-center gap-8 md:flex">
            <nav aria-label="Principal">
              <ul className="flex items-center gap-6">
                {MENU.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      aria-current={esActiva(enlace.href) ? "page" : undefined}
                      className={cn(
                        "text-p3-bold group/item relative block py-6 transition-colors",
                        FOCO,
                        esActiva(enlace.href)
                          ? sobreColor
                            ? "text-negro-oscuro"
                            : "text-blanco"
                          : sobreColor
                            ? "text-negro-oscuro/70 hover:text-negro-oscuro"
                            : "text-blanco/70 hover:text-blanco",
                      )}
                    >
                      {enlace.etiqueta}
                      {/*
                      Subrayado de la sección actual. El mismo trazo aparece al
                      pasar el mouse, más tenue: el componente del diseño tiene
                      una segunda variante sin usar en la maqueta, que por
                      contexto es el hover.
                    */}
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-0.5 transition-colors",
                          esActiva(enlace.href)
                            ? "bg-blanco"
                            : "bg-transparent group-hover/item:bg-blanco/40",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              {IDIOMAS.map((cual) => (
                <BotonIdioma
                  key={cual}
                  idioma={cual}
                  activo={cual === idioma}
                  href={rutaEn(cual, sinIdioma)}
                  sobreColor={sobreColor}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-mobile"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className={cn(
              "grid h-10 w-[42px] cursor-pointer place-items-center md:hidden",
              FOCO,
              sobreColor ? "text-negro-oscuro" : null,
            )}
          >
            <IconoMenu abierto={abierto} />
          </button>
        </div>

        {/*
        Separador punteado entre el menú y el contenido. Va de borde a borde,
        no acotado al contenedor: en el diseño cruza todo el ancho del frame.
        Solo en desktop: en mobile el board deja la barra suelta sobre el hero,
        sin línea.
      */}
        <div
          className={cn(
            "hidden border-t border-dashed md:block",
            sobreColor ? "border-negro-oscuro/20" : "border-blanco/20",
          )}
        />
      </div>

      {abierto ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-fondo md:top-[90px] md:hidden"
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

            {/* El board mobile cierra el desplegable con el selector de idioma,
                a la derecha. Va en el mismo estado que en desktop: el inglés
                todavía no existe porque la API no tiene campos por idioma. */}
            <div className="mt-8 flex items-center justify-end gap-1">
              {IDIOMAS.map((cual) => (
                <BotonIdioma
                  key={cual}
                  idioma={cual}
                  activo={cual === idioma}
                  href={rutaEn(cual, sinIdioma)}
                />
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
