import { NextResponse } from "next/server";
import { getRedFederal } from "@/lib/datos/red";
import { getSectores, getServicios } from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";

/**
 * Los datos de la red, en JSON, para la consola del navegador.
 *
 * Lo que hay acá ya está publicado: es lo mismo que dibujan Nuestra Red y
 * Proyectos. La ruta existe porque el sitio lee la API desde el servidor, y la
 * consola corre en el browser: sin esto habría que pegarle a la API desde el
 * cliente, lo que significa exponer su dirección, depender de su CORS y abrir
 * `connect-src` en la política de contenido. Pidiéndolo acá, es `self`.
 *
 * **Los correos no viajan.** Están a la vista en la ficha de cada cooperativa,
 * pero una lista en JSON es otra cosa: es lo que se descarga de una y termina
 * en una campaña. Quien quiera escribirle a una cooperativa la abre y lo ve.
 *
 * Se cachea una hora, igual que el resto del contenido.
 */

export const revalidate = 3600;

export async function GET() {
  const [red, servicios, sectores, proyectos] = await Promise.all([
    getRedFederal(),
    getServicios(),
    getSectores(),
    getProyectos({ porPagina: 200 }),
  ]);

  return NextResponse.json({
    federacion: {
      nombre:
        "Federación Argentina de Cooperativas de Trabajo de Tecnología, Innovación y Conocimiento",
      sitio: "https://dev.facttic.org.ar",
      codigo: "https://github.com/facttic/web_FACTTIC",
      licencia: "AGPL-3.0-or-later",
    },
    totales: red.totales,
    cooperativas: red.cooperativas.map((coop) => ({
      nombre: coop.nombre,
      provincia: coop.provincia,
      asociados: coop.asociados || null,
      fundacion: coop.fundacion,
      servicios: coop.servicios.map((s) => s.nombre),
      sectores: coop.sectores.map((s) => s.nombre),
      descripcion: coop.descripcion || null,
      sitio: coop.sitio,
    })),
    servicios: servicios.map((s) => ({
      nombre: s.nombre,
      descripcion: s.descripcion,
      subservicios: s.subservicios.map((sub) => sub.nombre),
    })),
    sectores: sectores.map((s) => ({ nombre: s.nombre, slug: s.slug })),
    proyectos: proyectos.items.map((p) => ({
      nombre: p.nombre,
      slug: p.slug,
      sector: p.sector?.nombre ?? null,
      cliente: p.cliente?.nombre ?? null,
      cooperativas: p.cooperativas.map((c) => c.nombre),
      tecnologias: p.tecnologias.map((t) => t.nombre),
    })),
  });
}
