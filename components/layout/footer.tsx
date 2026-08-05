import Link from "next/link";
import { COLUMNAS_PIE, REDES } from "@/lib/navegacion";
import { Logo } from "./logo";

/**
 * Pie de página. En desktop, cinco columnas de navegación con el logo, redes y
 * el crédito. En mobile las maquetas lo dejan compacto: copyright, redes y
 * crédito, sin logo ni columnas —así aparece en Proyectos y Para
 * cooperativas—.
 *
 * No lleva ninguna línea: ni sobre el pie ni separando el crédito. Se verificó
 * barriendo la maqueta fila por fila y no hay una sola horizontal; lo que
 * separa es el aire.
 */

const ICONOS: Record<string, string> = {
  // Trazos simples en una grilla de 24, para no depender de una librería de iconos.
  LinkedIn:
    "M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z",
  Instagram:
    "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 01-1.38-.9 3.8 3.8 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 3.05a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zm0 11.13a4.38 4.38 0 110-8.76 4.38 4.38 0 010 8.76zm8.6-11.4a1.58 1.58 0 11-3.15 0 1.58 1.58 0 013.15 0z",
  YouTube:
    "M23 12s0-3.2-.4-4.74a2.51 2.51 0 00-1.77-1.77C19.29 5.1 12 5.1 12 5.1s-7.29 0-8.83.39c-.85.23-1.52.9-1.75 1.77C1 8.8 1 12 1 12s0 3.2.42 4.74c.23.86.9 1.53 1.75 1.76 1.54.4 8.83.4 8.83.4s7.29 0 8.83-.4a2.51 2.51 0 001.77-1.76C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12z",
};

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="contenedor py-8 md:py-14">
        <div className="hidden gap-10 md:grid md:grid-cols-[210px_1fr]">
          <Logo />

          <nav aria-label="Pie de página">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-8">
              {COLUMNAS_PIE.map((columna) => (
                <div key={columna.titulo}>
                  <Link
                    href={columna.href}
                    className="text-p2-bold text-blanco transition-opacity hover:opacity-70"
                  >
                    {columna.titulo}
                  </Link>
                  <ul className="mt-2 space-y-1">
                    {columna.enlaces.map((enlace) => (
                      <li key={enlace.href + enlace.etiqueta}>
                        <Link
                          href={enlace.href}
                          className="text-p3 block font-sans text-blanco/50 transition-colors hover:text-blanco"
                        >
                          {enlace.etiqueta}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-6 md:mt-24 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <p className="text-p3 font-sans text-blanco/40">
              © {new Date().getFullYear()} FACTTIC
            </p>
            <ul className="flex items-center gap-4">
              {REDES.map((red) => (
                <li key={red.href}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={red.etiqueta}
                    className="block text-blanco/50 transition-colors hover:text-blanco"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                      className="size-4"
                    >
                      <path d={ICONOS[red.etiqueta]} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-p3 font-sans text-blanco/40">
            Trabajo intercoop entre{" "}
            <span className="text-blanco/70">El Maizal</span> +{" "}
            <span className="text-blanco/70">IT10</span> +{" "}
            <span className="text-blanco/70">Lawal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
