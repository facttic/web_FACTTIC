import type { MetadataRoute } from "next";
import { rutaEn } from "@/lib/idioma";
import { sitioUrl } from "@/lib/seo";
import { getSectoresDestacados } from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";
import { getNovedades } from "@/lib/datos/novedades";

/**
 * `sitemap.xml`.
 *
 * No existía —daba 500, como `robots.txt`—, así que los buscadores tenían que
 * descubrir el sitio siguiendo enlaces. Acá va la lista completa y, de cada
 * pantalla, sus dos direcciones: la española sin prefijo y la inglesa con su
 * propio nombre de sección. Eso es lo que le dice a Google que `/proyectos` y
 * `/en/projects` son la misma pantalla en dos idiomas y no contenido repetido.
 *
 * Las pantallas de trabajo —el catálogo de componentes y el laboratorio— no
 * entran, igual que en `robots.txt`.
 *
 * Si la API no responde, el sitemap sale igual con las pantallas fijas: es
 * preferible uno incompleto a un 500, que es lo que había.
 */

/** Las pantallas que no dependen de la API, con su importancia relativa. */
const FIJAS: { ruta: string; prioridad: number }[] = [
  { ruta: "/", prioridad: 1 },
  { ruta: "/nuestros-servicios", prioridad: 0.9 },
  { ruta: "/proyectos", prioridad: 0.9 },
  { ruta: "/nuestra-red", prioridad: 0.8 },
  { ruta: "/sobre-facttic", prioridad: 0.8 },
  { ruta: "/suma-tu-coop", prioridad: 0.8 },
  { ruta: "/novedades", prioridad: 0.7 },
  { ruta: "/contacto", prioridad: 0.6 },
];

/** Una entrada con sus dos idiomas, que es lo que pide `hreflang`. */
function entrada(
  ruta: string,
  prioridad: number,
  modificado?: string | null,
): MetadataRoute.Sitemap[number] {
  const raiz = sitioUrl();
  const es = `${raiz}${rutaEn("es", ruta)}`;
  const en = `${raiz}${rutaEn("en", ruta)}`;
  return {
    url: es,
    priority: prioridad,
    ...(modificado ? { lastModified: new Date(modificado) } : {}),
    alternates: { languages: { es, en, "x-default": es } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Cada consulta por su cuenta: que falte una no tiene por qué dejar el
     sitemap sin las otras. */
  const [sectores, proyectos, novedades] = await Promise.all([
    getSectoresDestacados().catch(() => []),
    getProyectos({ porPagina: 200 }).catch(() => ({ items: [] })),
    getNovedades(200).catch(() => ({ items: [] })),
  ]);

  return [
    ...FIJAS.map(({ ruta, prioridad }) => entrada(ruta, prioridad)),
    ...sectores.map((sector) =>
      entrada(`/nuestros-servicios/${sector.slug}`, 0.8),
    ),
    ...proyectos.items.map((proyecto) =>
      entrada(`/proyectos/${proyecto.slug}`, 0.7),
    ),
    ...novedades.items.map((novedad) =>
      entrada(`/novedades/${novedad.slug}`, 0.6, novedad.fecha),
    ),
  ];
}
