import type { Metadata } from "next";
import { Suspense } from "react";
import { EncabezadoSeccion, Seccion } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { SinResultados } from "@/components/ui/sin-resultados";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import { FiltrosProyectos } from "@/components/secciones/filtros-proyectos";
import { PROYECTOS_PAGINA as T } from "@/lib/contenido";
import {
  getCooperativas,
  getSectores,
  getServicios,
  getTecnologias,
} from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Proyectos",
  description: T.hero.bajada,
};

const POR_PAGINA = 6;

/**
 * Grilla de proyectos con filtros.
 *
 * Los filtros viven en la URL (`?sector=…&servicio=…`): la página es un
 * componente de servidor que se los pasa a la API tal cual, así que cada
 * combinación es un enlace que se puede compartir. "Ver más" también es un
 * enlace —agranda la página pedida— y no pierde los filtros puestos.
 */
export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const uno = (v: string | string[] | undefined) =>
    typeof v === "string" && v ? v : undefined;

  const filtros = {
    sector: uno(params.sector),
    servicio: uno(params.servicio),
    tecnologia: uno(params.tecnologia),
    cooperativa: uno(params.cooperativa),
  };
  const pagina = Math.max(1, Number(uno(params.pagina)) || 1);

  const [proyectos, ultimos, sectores, servicios, tecnologias, cooperativas] =
    await Promise.all([
      // "Ver más" acumula: se piden todas las páginas hasta la actual.
      getProyectos({ ...filtros, porPagina: POR_PAGINA * pagina }),
      getProyectos({ porPagina: 5 }),
      getSectores(),
      getServicios(),
      getTecnologias(),
      getCooperativas(),
    ]);

  const hayMas = proyectos.items.length < proyectos.total;

  const queryVerMas = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor) queryVerMas.set(clave, valor);
  }
  queryVerMas.set("pagina", String(pagina + 1));

  return (
    <>
      <Seccion className="pt-32 md:pt-40">
        <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
        <p className="text-p1 mt-6 max-w-2xl text-blanco/80">{T.hero.bajada}</p>

        <Suspense>
          <FiltrosProyectos
            sectores={sectores}
            servicios={servicios}
            tecnologias={tecnologias}
            cooperativas={cooperativas}
            className="mt-10 md:mt-14"
          />
        </Suspense>
      </Seccion>

      <Seccion className="pt-0 md:pt-8">
        {proyectos.items.length ? (
          <>
            {/*
              La grilla alterna una tarjeta ancha y una angosta por fila, y la
              fila siguiente lo invierte. En mobile van apiladas a lo ancho.
            */}
            <div className="flex flex-col gap-5 md:grid md:grid-cols-3">
              {proyectos.items.map((proyecto, i) => (
                <CardProyecto
                  key={proyecto.id}
                  proyecto={proyecto}
                  className={cn(esAncha(i) ? "md:col-span-2" : "")}
                />
              ))}
            </div>

            {hayMas ? (
              <div className="mt-10 flex justify-center">
                <BotonLink
                  href={`/proyectos?${queryVerMas}`}
                  scroll={false}
                  className="w-full md:w-auto md:min-w-72"
                >
                  {T.verMas}
                </BotonLink>
              </div>
            ) : null}
          </>
        ) : (
          <SinResultados
            titulo={T.vacio.titulo}
            accion={
              <BotonLink href="/proyectos">{T.filtros.limpiar}</BotonLink>
            }
          >
            {T.vacio.sugerencia}
          </SinResultados>
        )}
      </Seccion>

      {ultimos.items.length ? (
        <Seccion>
          <EncabezadoSeccion titulo={T.ultimos.titulo} tamanoTitulo="h2" />
          <div className="-mt-2">
            {ultimos.items.map((proyecto) => (
              <FilaProyecto
                key={proyecto.id}
                proyecto={proyecto}
                variante="ultimos"
              />
            ))}
          </div>
        </Seccion>
      ) : null}

      {/* Sin banda de cierre: las dos maquetas de esta pantalla terminan en
          "Últimos proyectos" y van directo al pie. */}
    </>
  );
}

/**
 * Ancha, angosta / angosta, ancha: el patrón de la maqueta. Sobre una grilla
 * de tres columnas, la ancha ocupa dos.
 */
function esAncha(i: number): boolean {
  return i % 4 === 0 || i % 4 === 3;
}
