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
  getSectoresDestacados,
  getServiciosDestacados,
  getTecnologias,
} from "@/lib/datos/catalogos";
import { SECTOR_OTROS, getProyectos } from "@/lib/datos/proyectos";
import { cn } from "@/lib/cn";
import { metadatosDe } from "@/lib/seo";

/** El primer valor de un parámetro de la URL, ignorando los repetidos. */
const uno = (v: string | string[] | undefined) =>
  typeof v === "string" && v ? v : undefined;

/*
 * El número de página entra en el título y en la canónica: sin eso, las seis
 * páginas del listado se publican con el mismo `<title>` y la misma dirección
 * canónica, y Google las lee como una sola repetida.
 *
 * Los filtros, en cambio, **no** entran: cada combinación de sector, servicio,
 * tecnología y cooperativa sería una canónica distinta y son cientos. Las
 * vistas filtradas apuntan al listado, que es lo que corresponde indexar.
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ idioma: Idioma }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { idioma } = await params;
  const T = contenido(idioma).PROYECTOS_PAGINA;
  const pagina = Math.max(1, Number(uno((await searchParams).pagina)) || 1);
  const sufijo =
    pagina > 1 ? ` — ${idioma === "en" ? "page" : "página"} ${pagina}` : "";

  return metadatosDe({
    idioma,
    ruta: pagina > 1 ? `/proyectos?pagina=${pagina}` : "/proyectos",
    titulo: `${T.hero.titulo}${sufijo}`,
    descripcion: T.hero.bajada,
  });
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
  /*
   * Sectores y servicios: solo los destacados, que son el catálogo de la
   * Federación. Cada cooperativa puede dar de alta los suyos desde su ficha, y
   * si entraran acá la barra se llenaría de variantes del mismo nombre a
   * medida que se sumen cooperativas.
   *
   * Queda un hueco conocido: "Otros" son los proyectos **sin** sector, así que
   * uno cargado con un sector de cooperativa no cae en ninguna opción de este
   * filtro —se lo encuentra por cooperativa, por búsqueda o en la lista
   * completa—. Para cerrarlo hace falta que la API sepa filtrar por "sector no
   * destacado"; está anotado en PENDIENTES.
   */
  const [sectores, servicios, tecnologias, cooperativas] = await Promise.all([
    getSectoresDestacados(idioma),
    getServiciosDestacados(idioma),
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
