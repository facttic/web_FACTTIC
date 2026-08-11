import type { Metadata } from "next";
import { Grupo, Muestra } from "@/components/catalogo/muestra";
import { Boton, BotonFlecha } from "@/components/ui/boton";
import { Chip, ChipCliente, ChipSector } from "@/components/ui/chip";
import { Acordeon } from "@/components/ui/acordeon";
import { Tabs } from "@/components/ui/tabs";
import { Campo, CampoTexto, Selector } from "@/components/ui/campo";
import { Aviso } from "@/components/ui/aviso";
import { SinResultados } from "@/components/ui/sin-resultados";
import { BandaCta, EncabezadoSeccion, Tarjeta } from "@/components/ui/seccion";
import { CardSector, CardSectorDetalle } from "@/components/tarjetas/sector";
import {
  CardProyecto,
  CardProyectoDetalle,
  FilaProyecto,
} from "@/components/tarjetas/proyecto";
import {
  CardBeneficio,
  CardMetrica,
  CardOportunidad,
} from "@/components/tarjetas/bloques";
import {
  CardMetodologia,
  CardRequisito,
  CardServicio,
} from "@/components/tarjetas/servicios";
import {
  CardAutoridad,
  CardCooperativa,
  CardLogo,
  GrillaLogos,
} from "@/components/tarjetas/red";
import { BotonIdioma, BotonTexto } from "@/components/ui/boton";
import { ChipUbicacion } from "@/components/ui/chip";
import {
  getAutoridades,
  getCooperativas,
  getOrganizaciones,
  getSectores,
  getServicios,
} from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";

export const metadata: Metadata = {
  title: "Catálogo de componentes",
  robots: { index: false, follow: false },
};

const SECCIONES = [
  { id: "tipografia", titulo: "Tipografía" },
  { id: "paleta", titulo: "Paleta" },
  { id: "botones", titulo: "Botones" },
  { id: "etiquetas", titulo: "Etiquetas" },
  { id: "formulario", titulo: "Formulario" },
  { id: "navegacion", titulo: "Navegación" },
  { id: "sectores", titulo: "Sectores" },
  { id: "servicios", titulo: "Servicios" },
  { id: "red", titulo: "Red" },
  { id: "proyectos", titulo: "Proyectos" },
  { id: "bloques", titulo: "Bloques" },
  { id: "secciones", titulo: "Secciones" },
  { id: "estados", titulo: "Estados" },
];

const COLORES = [
  { nombre: "Azul", clase: "bg-azul", hex: "#0067B2" },
  { nombre: "Celeste", clase: "bg-celeste", hex: "#57C3C8" },
  { nombre: "Lila", clase: "bg-lila", hex: "#D6BBF2" },
  { nombre: "Naranja", clase: "bg-naranja", hex: "#FF522A" },
  { nombre: "Rojo", clase: "bg-rojo", hex: "#FF6B7A" },
  { nombre: "Amarillo", clase: "bg-amarillo", hex: "#E5F280" },
  { nombre: "Verde", clase: "bg-verde", hex: "#8E8001" },
  { nombre: "Gris oscuro", clase: "bg-gris-oscuro", hex: "#3C3C3C" },
  { nombre: "Negro", clase: "bg-negro", hex: "#222222" },
  { nombre: "Negro oscuro", clase: "bg-negro-oscuro", hex: "#101010" },
  { nombre: "Blanco", clase: "bg-blanco", hex: "#F2F2F2" },
];

const TIPOGRAFIA = [
  { clase: "text-display", nombre: "Display", specs: "40 → 56 · Inter Bold" },
  { clase: "text-h1", nombre: "H1", specs: "34/36.3 → 40 · Inter Bold" },
  { clase: "text-h2", nombre: "H2", specs: "28 → 30 · Inter Bold" },
  { clase: "text-h3", nombre: "H3", specs: "22 · Inter Bold" },
  { clase: "text-h4", nombre: "H4", specs: "20 · Inter Bold" },
  { clase: "text-p1", nombre: "P1", specs: "18/23.8 · DM Mono" },
  { clase: "text-p2", nombre: "P2", specs: "14 · DM Mono" },
  { clase: "text-p3", nombre: "P3", specs: "12 · DM Mono" },
  {
    clase: "text-eyebrow",
    nombre: "Eyebrow",
    specs: "12 · Inter Bold · mayúsculas",
  },
];

/**
 * Catálogo de componentes del sitio.
 *
 * Es el equivalente del board "Componentes" de Figma, pero renderizado con los
 * componentes reales y con datos reales de la API, para poder contrastar el
 * código contra el diseño de un vistazo.
 */
export default async function CatalogoPage() {
  const [
    sectores,
    servicios,
    proyectos,
    cooperativas,
    autoridades,
    organizaciones,
  ] = await Promise.all([
    getSectores(),
    getServicios(),
    getProyectos({ porPagina: 3 }),
    getCooperativas(),
    getAutoridades(),
    getOrganizaciones(),
  ]);

  return (
    <div className="contenedor py-16">
      <header className="mb-14">
        <p className="text-eyebrow text-blanco/40">Documentación interna</p>
        <h1 className="text-display mt-2">Componentes</h1>
        <p className="text-p1 mt-4 max-w-2xl text-blanco/60">
          Todos los componentes del sitio, con datos reales de la API. Achicá la
          ventana para ver el comportamiento responsive: el corte va en 768px.
        </p>
        <nav aria-label="Secciones" className="mt-8 flex flex-wrap gap-2">
          {SECCIONES.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              className="text-p3 rounded-lg border border-borde px-3 py-1.5 text-blanco/60 transition-colors hover:border-blanco/40 hover:text-blanco"
            >
              {seccion.titulo}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-20">
        <Grupo id="tipografia" titulo="Tipografía">
          {TIPOGRAFIA.map(({ clase, nombre, specs }) => (
            <Muestra key={clase} nombre={nombre} usoEn={specs}>
              <p className={clase}>Nuestro código es cooperar</p>
            </Muestra>
          ))}
        </Grupo>

        <Grupo id="paleta" titulo="Paleta">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {COLORES.map(({ nombre, clase, hex }) => (
              <div
                key={nombre}
                className="overflow-hidden rounded-lg border border-borde"
              >
                <div className={`h-20 ${clase}`} />
                <div className="p-3">
                  <div className="text-p3 text-blanco">{nombre}</div>
                  <div className="text-p3 text-blanco/40">{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Grupo>

        <Grupo id="botones" titulo="Botones">
          <Muestra
            nombre="Variantes"
            usoEn="la punteada es el CTA principal del sitio"
          >
            <div className="flex flex-wrap items-center gap-4">
              <Boton>Trabajá con FACTTIC</Boton>
              <Boton variante="solida">Sumate a FACTTIC</Boton>
              <Boton variante="contorno">Ver todos</Boton>
              <Boton variante="sutil">Conocer más</Boton>
              <Boton variante="acento">Escribinos</Boton>
            </div>
          </Muestra>
          <Muestra nombre="Tamaños y estados">
            <div className="flex flex-wrap items-center gap-4">
              <Boton tamano="sm">Chico</Boton>
              <Boton tamano="md">Mediano</Boton>
              <Boton disabled>Deshabilitado</Boton>
            </div>
          </Muestra>
          <Muestra
            nombre="Botón texto"
            usoEn="Figma: Botón texto — enlaces dentro de tarjetas"
          >
            <div className="flex flex-wrap items-center gap-6">
              <BotonTexto href="/proyectos">Ver más</BotonTexto>
              <BotonTexto href="/contacto" conFlecha={false}>
                Ir a Semillero
              </BotonTexto>
            </div>
          </Muestra>
          <Muestra
            nombre="Botón idioma"
            usoEn="Figma: Botón Idioma — sin uso hasta que haya contenido en inglés"
          >
            <div className="flex items-center gap-2">
              <BotonIdioma idioma="es" activo />
              <BotonIdioma idioma="en" activo={false} />
            </div>
          </Muestra>
          <Muestra
            nombre="Flechas de carrusel"
            usoEn="Novedades, proyectos destacados"
          >
            <div className="flex items-center gap-3">
              <BotonFlecha direccion="anterior" disabled />
              <BotonFlecha direccion="siguiente" />
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="etiquetas" titulo="Etiquetas">
          <Muestra
            nombre="Chip de sector"
            usoEn="se pinta según el nombre que devuelve la API"
          >
            <div className="flex flex-wrap items-center gap-3">
              {sectores.map((sector) => (
                <ChipSector key={sector.id} nombre={sector.nombre} />
              ))}
              <ChipSector nombre="Finanzas" />
              <ChipSector nombre="Sector nuevo sin color" />
            </div>
          </Muestra>
          <Muestra nombre="Chip de cliente y de categoría">
            <div className="flex flex-wrap items-center gap-3">
              <ChipCliente>Nombre cliente</ChipCliente>
              <Chip tono="lila">Comunicados</Chip>
              <Chip tono="celeste">Novedades</Chip>
              <Chip tono="naranja">Agenda</Chip>
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="formulario" titulo="Formulario">
          <Muestra nombre="Campos" usoEn="pantalla de Contacto">
            <div className="grid gap-5 md:max-w-lg">
              <Campo
                id="c-nombre"
                etiqueta="Nombre completo"
                placeholder="Ej: Paula Calgaro"
              />
              <Campo
                id="c-email"
                etiqueta="Correo electrónico"
                placeholder="paula@facttic.coop"
                error="Ingresá un correo válido"
              />
              <CampoTexto
                id="c-mensaje"
                etiqueta="Tu mensaje"
                placeholder="Dejanos tu mensaje..."
              />
            </div>
          </Muestra>
          <Muestra nombre="Selector de filtro" usoEn="grilla de Proyectos">
            <div className="grid gap-4 sm:grid-cols-3">
              <Selector id="f-sector" etiqueta="Sectores" defaultValue="">
                <option value="">Sectores</option>
                {sectores.map((s) => (
                  <option key={s.id}>{s.nombre}</option>
                ))}
              </Selector>
              <Selector id="f-servicio" etiqueta="Servicios" defaultValue="">
                <option value="">Servicios</option>
                {servicios.map((s) => (
                  <option key={s.id}>{s.nombre}</option>
                ))}
              </Selector>
              <Selector id="f-tec" etiqueta="Tecnologías" defaultValue="">
                <option value="">Tecnologías</option>
              </Selector>
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="navegacion" titulo="Navegación">
          <Muestra nombre="Solapas" usoEn="Nuestros servicios, Novedades">
            <Tabs
              solapas={servicios.slice(0, 4).map((servicio) => ({
                id: servicio.id,
                etiqueta: servicio.nombre,
                contenido: (
                  <p className="text-p1 text-blanco/70">
                    {servicio.subservicios?.map((s) => s.nombre).join(" · ") ||
                      "Sin subservicios cargados."}
                  </p>
                ),
              }))}
            />
          </Muestra>
          <Muestra nombre="Acordeón" usoEn="soluciones, detalle de proyecto">
            <Acordeon
              items={[
                {
                  id: "desafio",
                  titulo: "Desafío",
                  contenido:
                    "Desarrollar un sitio web que transmita confianza.",
                },
                {
                  id: "solucion",
                  titulo: "Solución",
                  contenido: "Una plataforma unificada con API REST.",
                },
                {
                  id: "resultado",
                  titulo: "Resultado",
                  contenido: "Reducción del 40% en tiempo de gestión.",
                },
              ]}
            />
          </Muestra>
        </Grupo>

        <Grupo id="sectores" titulo="Sectores">
          <Muestra nombre="Tarjeta de sector" usoEn="Home, Nuestros servicios">
            <div className="grid gap-6 md:grid-cols-3">
              {sectores.map((sector, i) => (
                <CardSector key={sector.id} sector={sector} indice={i} />
              ))}
            </div>
          </Muestra>
          <Muestra nombre="Tarjeta de vertical" usoEn="grilla de verticales">
            <div className="grid gap-6 md:grid-cols-3">
              <CardSectorDetalle
                titulo="Hacemos tecnología para organizaciones que trabajan por el bien común"
                href="/nuestros-servicios"
              />
              <CardSectorDetalle
                titulo="Creamos sensores, análisis de datos y visión artificial para el sector agropecuario"
                href="/nuestros-servicios"
              />
              <CardSectorDetalle
                titulo="Desarrollamos soluciones para el sector bancario y fintech"
                href="/nuestros-servicios"
              />
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="proyectos" titulo="Proyectos">
          {proyectos.items.length ? (
            <>
              <Muestra
                nombre="Tarjeta de proyecto"
                usoEn="grilla de Proyectos, destacados"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {proyectos.items.map((proyecto) => (
                    <CardProyecto key={proyecto.id} proyecto={proyecto} />
                  ))}
                </div>
              </Muestra>
              <Muestra
                nombre="Tarjeta extendida"
                usoEn="proyecto destacado a ancho completo"
              >
                <CardProyectoDetalle proyecto={proyectos.items[0]} />
              </Muestra>
              <Muestra
                nombre="Fila de proyecto"
                usoEn="tabla Últimos proyectos"
              >
                <div>
                  {proyectos.items.map((proyecto) => (
                    <FilaProyecto key={proyecto.id} proyecto={proyecto} />
                  ))}
                </div>
              </Muestra>
            </>
          ) : (
            <p className="text-p2 text-blanco/50">
              No hay proyectos cargados en la API todavía.
            </p>
          )}
        </Grupo>

        <Grupo id="bloques" titulo="Bloques">
          <Muestra nombre="Beneficio" usoEn="Home, Sumá tu coop">
            <div className="grid gap-6 md:grid-cols-4">
              <CardBeneficio titulo="Continuidad de trabajo" />
              <CardBeneficio titulo="Colaboración real, no competencia" />
              <CardBeneficio
                titulo="Autonomía con respaldo colectivo"
                descripcion="Mantenés tu independencia como cooperativa, pero con capacidad de red"
                acento="verde"
              />
              <CardBeneficio
                titulo="Trabajo con impacto y propósito"
                descripcion="Colaborás con otras cooperativas, compartís conocimiento y armás equipos"
                acento="azul"
              />
            </div>
          </Muestra>
          <Muestra nombre="Métrica" usoEn="bloque Nuestra red en Home">
            <div className="grid gap-6 md:grid-cols-3">
              <CardMetrica rotulo="Profesionales" valor="+500" />
              <CardMetrica
                rotulo="Cooperativas"
                valor="+30"
                acento="amarillo"
              />
              <CardMetrica rotulo="Provincias" valor="+10" acento="naranja" />
            </div>
          </Muestra>
          {/* Pasando el mouse se vuelven grises y muestran la explicación. */}
          <Muestra nombre="Oportunidad" usoEn="Sumá tu coop">
            <div className="grid items-start gap-6 md:grid-cols-3">
              <CardOportunidad
                indice={0}
                acento="lila"
                pregunta="¿Querés sumarte a una coope?"
                descripcion="Semillero es la plataforma de FACTTIC que conecta a personas interesadas en el trabajo cooperativo con cooperativas que están buscando nuevos socios y socias."
                enlace={{ texto: "Ir a Semillero", href: "/contacto" }}
              />
              <CardOportunidad
                indice={1}
                acento="celeste"
                pregunta="¿Querés armar tu propia cooperativa?"
                descripcion="Acompañamos a proyectos cooperativos en sus primeros pasos de la creación."
                enlace={{ texto: "Contactanos", href: "/contacto" }}
              />
              <CardOportunidad
                indice={2}
                acento="naranja"
                pregunta="¿Querés formarte en cooperativismo?"
                descripcion="El Club de Formación Cooperativa es una plataforma educativa de FACTTIC donde podés realizar cursos sobre cooperativismo y tecnología."
                enlace={{ texto: "Ir al club", href: "/contacto" }}
              />
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="servicios" titulo="Servicios y verticales">
          <Muestra
            nombre="Card servicio"
            usoEn="Figma: Card servicio DS / Diseño / IA — reposo y desplegada"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <CardServicio titulo="Desarrollo de software" />
              <CardServicio
                titulo="Desarrollo de software"
                acento="azul"
                descripcion="La tecnología puede ayudarte a realizar tu idea. Desarrollamos el sistema, la app o la plataforma que tu organización necesita."
              />
              <CardServicio titulo="Diseño y comunicación digital" />
              <CardServicio
                titulo="Diseño y comunicación digital"
                acento="celeste"
                descripcion="Que algo funcione no alcanza si nadie lo entiende. Diseñamos interfaces, identidades visuales y estrategias de comunicación."
              />
            </div>
          </Muestra>

          <Muestra
            nombre="Card por qué elegirnos"
            usoEn="Figma: Card por qué elegirnos 01-03"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <CardServicio titulo="Todas las especialidades TIC en un solo lugar" />
              <CardServicio
                titulo="Todas las especialidades TIC en un solo lugar"
                acento="naranja"
                rotulo="Especialidades TIC"
                descripcion="Armamos equipos con personas especializadas en diferentes áreas, ideales para abordar proyectos complejos y de gran alcance."
              />
            </div>
          </Muestra>

          <Muestra nombre="Card metodologías" usoEn="Figma: Card metodologías">
            <div className="grid gap-6 md:grid-cols-3">
              <CardMetodologia nombre="Proyectos a medida" acento="lila" />
              <CardMetodologia nombre="Managed Services" acento="verde" />
              <CardMetodologia nombre="Staff Augmentation" acento="naranja" />
            </div>
          </Muestra>

          <Muestra
            nombre="Card obligaciones"
            usoEn="Figma: Card obligaciones — Sumá tu coop"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <CardRequisito titulo="Ser una cooperativa o precooperativa" />
              <CardRequisito
                titulo="Participar en espacios colectivos"
                variante="contorno"
              />
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="red" titulo="Red">
          <Muestra
            nombre="Card autoridades"
            usoEn="Figma: Card autoridades — Sobre FACTTIC"
          >
            {autoridades.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {autoridades.map((autoridad) => (
                  <CardAutoridad key={autoridad.id} autoridad={autoridad} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <CardAutoridad
                  autoridad={{
                    id: "ejemplo",
                    nombre: "Sin autoridades cargadas",
                    cargo: "Presidencia",
                    cooperativa: null,
                  }}
                />
              </div>
            )}
          </Muestra>

          <Muestra nombre="Card cooperativa" usoEn="listado de Nuestra red">
            <div className="grid gap-6 md:grid-cols-3">
              {cooperativas.slice(0, 3).map((cooperativa) => (
                <CardCooperativa
                  key={cooperativa.id}
                  cooperativa={cooperativa}
                />
              ))}
            </div>
          </Muestra>

          <Muestra
            nombre="Card logo"
            usoEn="Figma: Card logo — Eligen soluciones cooperativas"
          >
            {organizaciones.length ? (
              <GrillaLogos organizaciones={organizaciones} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <CardLogo nombre="Abuelas de Plaza de Mayo" logo={null} />
                <CardLogo nombre="Cooperativa Obrera" logo={null} />
                <CardLogo nombre="Banco Credicoop" logo={null} />
              </div>
            )}
          </Muestra>

          <Muestra
            nombre="Tag ubicación"
            usoEn="Figma: Tag ubicación — mapa federal"
          >
            <div className="flex flex-wrap gap-3">
              <ChipUbicacion lugar="Buenos Aires" />
              <ChipUbicacion lugar="Tucumán" />
            </div>
          </Muestra>
        </Grupo>

        <Grupo id="secciones" titulo="Secciones">
          <Muestra nombre="Encabezado de sección" usoEn="todas las páginas">
            <EncabezadoSeccion
              rotulo="Proyectos"
              titulo="Nuestros proyectos destacados"
              accion={<Boton>Ver todos</Boton>}
            />
          </Muestra>
          <Muestra nombre="Tarjeta">
            <Tarjeta className="p-6">
              <p className="text-h4">
                Desarrollo de sitio web de Provincia Fondos S.A
              </p>
            </Tarjeta>
          </Muestra>
          <Muestra
            nombre="Banda de conversión"
            usoEn="cierre de casi todas las páginas"
          >
            <BandaCta
              titulo="¿Tenés algún proyecto en mente?"
              accion={<Boton>Trabajá con FACTTIC</Boton>}
            />
          </Muestra>
        </Grupo>

        <Grupo id="estados" titulo="Estados">
          <Muestra
            nombre="Envío correcto"
            usoEn="contacto, después de mandar el formulario"
          >
            <Aviso titulo="Recibimos tu mensaje">
              Te vamos a responder a la brevedad al correo que dejaste.
            </Aviso>
          </Muestra>
          <Muestra nombre="Envío con error" usoEn="contacto">
            <Aviso tono="error" titulo="No pudimos enviar tu mensaje">
              Probá de nuevo en unos minutos o escribinos a hola@facttic.org.ar
            </Aviso>
          </Muestra>
          <Muestra nombre="Campo con error" usoEn="contacto">
            <Campo
              id="demo-error"
              etiqueta="Correo electrónico"
              defaultValue="no-es-un-correo"
              error="Revisá el correo: parece que le falta el @"
            />
          </Muestra>
          <Muestra
            nombre="Sin resultados"
            usoEn="proyectos, cuando los filtros no devuelven nada"
          >
            <SinResultados accion={<Boton>Limpiar filtros</Boton>}>
              Probá con menos filtros o mirá todos los proyectos.
            </SinResultados>
          </Muestra>
        </Grupo>
      </div>
    </div>
  );
}
