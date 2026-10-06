import type { Metadata } from "next";
import { Suspense } from "react";
import { EncabezadoSeccion, Seccion } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { SinResultados } from "@/components/ui/sin-resultados";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import { FiltrosProyectos } from "@/components/secciones/filtros-proyectos";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import {
  getCooperativas,
  getSectores,
  getServicios,
  getTecnologias,
} from "@/lib/datos/catalogos";
import { SECTOR_OTROS, getProyectos } from "@/lib/datos/proyectos";
import { cn } from "@/lib/cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}): Promise<Metadata> {
  const T = contenido((await params).idioma).PROYECTOS_PAGINA;
  return { title: T.hero.titulo, description: T.hero.bajada };
}

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
  params: rutaParams,
  searchParams,
}: {
  params: Promise<{ idioma: Idioma }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { idioma } = await rutaParams;
  const T = contenido(idioma).PROYECTOS_PAGINA;
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

  /*
   * Solo los catálogos de los filtros se esperan acá: son listas chicas y
   * cacheadas, y sin ellas no se puede dibujar la barra de arriba. Los
   * proyectos —que es la consulta grande y la que cambia con cada filtro— van
   * en sus propios componentes, detrás de un `Suspense`: la pantalla aparece
   * con su título y sus filtros mientras la grilla todavía viaja, en vez de
   * quedarse en blanco esperando a todo junto.
   */
  const [sectores, servicios, tecnologias, cooperativas] = await Promise.all([
    getSectores(idioma),
    getServicios(idioma),
    getTecnologias(),
    getCooperativas(idioma),
  ]);

  return (
    <>
      <Seccion className="pt-24 md:pt-40">
        <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
        <p className="text-p1-bold md:text-p1 mt-6 max-w-2xl text-blanco/80">
          {T.hero.bajada}
        </p>

        <Suspense>
          <FiltrosProyectos
            sectores={[
              ...sectores,
              { id: SECTOR_OTROS, nombre: T.filtros.sectorOtros },
            ]}
            servicios={servicios}
            tecnologias={tecnologias}
            cooperativas={cooperativas}
            className="mt-10 md:mt-14"
          />
        </Suspense>
      </Seccion>

      <Seccion className="pt-0 md:pt-8">
        <Suspense fallback={<GrillaEnCamino />}>
          <Grilla filtros={filtros} pagina={pagina} idioma={idioma} />
        </Suspense>
      </Seccion>

      <Suspense fallback={null}>
        <Ultimos idioma={idioma} />
      </Suspense>

      {/* Sin banda de cierre: las dos maquetas de esta pantalla terminan en
          "Últimos proyectos" y van directo al pie. */}
    </>
  );
}

/** La grilla de proyectos, que es la consulta que hace esperar la pantalla. */
async function Grilla({
  filtros,
  pagina,
  idioma,
}: {
  filtros: NonNullable<Parameters<typeof getProyectos>[0]>;
  pagina: number;
  idioma: Idioma;
}) {
  const T = contenido(idioma).PROYECTOS_PAGINA;
  // "Ver más" acumula: se piden todas las páginas hasta la actual.
  const proyectos = await getProyectos(
    { ...filtros, porPagina: POR_PAGINA * pagina },
    idioma,
  );
  const hayMas = proyectos.items.length < proyectos.total;

  const queryVerMas = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor) queryVerMas.set(clave, String(valor));
  }
  queryVerMas.set("pagina", String(pagina + 1));

  return (
    <>
      {proyectos.items.length ? (
        <>
          {/*
              La grilla alterna una tarjeta ancha y una angosta por fila, y la
              fila siguiente lo invierte. En mobile van apiladas a lo ancho.
            */}
          <div className="flex flex-col gap-5 md:grid md:grid-cols-3">
            {proyectos.items.map((proyecto, i) => (
              <CardProyecto
                indice={i}
                key={proyecto.id}
                proyecto={proyecto}
                caraMobile="listado"
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
          accion={<BotonLink href="/proyectos">{T.filtros.limpiar}</BotonLink>}
        >
          {T.vacio.sugerencia}
        </SinResultados>
      )}
    </>
  );
}

/** El lugar que va a ocupar la grilla, para que la página no salte al llegar. */
function GrillaEnCamino() {
  return (
    <div
      aria-hidden
      className="flex animate-pulse flex-col gap-5 md:grid md:grid-cols-3"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "h-[420px] rounded-2xl bg-superficie",
            esAncha(i) ? "md:col-span-2" : "",
          )}
        />
      ))}
    </div>
  );
}

/** Los últimos cargados, al pie. Es otra consulta: no frena a la grilla. */
async function Ultimos({ idioma }: { idioma: Idioma }) {
  const T = contenido(idioma).PROYECTOS_PAGINA;
  const ultimos = await getProyectos({ porPagina: 5 }, idioma);
  if (!ultimos.items.length) return null;

  return (
    <Seccion>
      <EncabezadoSeccion titulo={T.ultimos.titulo} tamanoTitulo="h2" />
      <div className="border-t border-dotted border-punteado">
        {ultimos.items.map((proyecto) => (
          <FilaProyecto
            key={proyecto.id}
            proyecto={proyecto}
            variante="ultimos"
          />
        ))}
      </div>
    </Seccion>
  );
}

/**
 * Ancha, angosta / angosta, ancha: el patrón de la maqueta. Sobre una grilla
 * de tres columnas, la ancha ocupa dos.
 */
function esAncha(i: number): boolean {
  return i % 4 === 0 || i % 4 === 3;
}
