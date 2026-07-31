import { Boton, BotonFlecha } from '@/components/ui/boton'
import { Chip, ChipSector } from '@/components/ui/chip'
import { Acordeon } from '@/components/ui/acordeon'
import { Tabs } from '@/components/ui/tabs'
import { Campo, CampoTexto, Selector } from '@/components/ui/campo'
import { BandaCta, EncabezadoSeccion, Tarjeta } from '@/components/ui/seccion'

/**
 * Referencia visual del design system, para chequear los tokens contra Figma.
 * No es parte del sitio: sirve de control durante el desarrollo.
 */

const COLORES = [
  { nombre: 'Azul', clase: 'bg-azul', hex: '#0067B2' },
  { nombre: 'Celeste', clase: 'bg-celeste', hex: '#57C3C8' },
  { nombre: 'Lila', clase: 'bg-lila', hex: '#D6BBF2' },
  { nombre: 'Naranja', clase: 'bg-naranja', hex: '#FF522A' },
  { nombre: 'Rojo', clase: 'bg-rojo', hex: '#FF6B7A' },
  { nombre: 'Amarillo', clase: 'bg-amarillo', hex: '#E5F280' },
  { nombre: 'Verde', clase: 'bg-verde', hex: '#8E8001' },
  { nombre: 'Gris oscuro', clase: 'bg-gris-oscuro', hex: '#3C3C3C' },
  { nombre: 'Negro', clase: 'bg-negro', hex: '#222222' },
  { nombre: 'Negro oscuro', clase: 'bg-negro-oscuro', hex: '#101010' },
  { nombre: 'Blanco', clase: 'bg-blanco', hex: '#F2F2F2' },
]

const TIPOGRAFIA = [
  { clase: 'text-display', nombre: 'Display', specs: '40 → 56 · Inter Bold' },
  { clase: 'text-h1', nombre: 'H1', specs: '34/36.3 → 40 · Inter Bold' },
  { clase: 'text-h2', nombre: 'H2', specs: '28 → 30 · Inter Bold' },
  { clase: 'text-h3', nombre: 'H3', specs: '22 · Inter Bold' },
  { clase: 'text-h4', nombre: 'H4', specs: '20 · Inter Bold' },
  { clase: 'text-p1', nombre: 'P1', specs: '18/23.8 · DM Mono' },
  { clase: 'text-p2', nombre: 'P2', specs: '14 · DM Mono' },
  { clase: 'text-p3', nombre: 'P3', specs: '12 · DM Mono' },
  { clase: 'text-eyebrow', nombre: 'Eyebrow', specs: '12 · Inter Bold · mayúsculas' },
]

export default function DesignSystemPage() {
  return (
    <main className="contenedor space-y-16 py-16">
      <header>
        <p className="text-eyebrow text-blanco/40">Design system</p>
        <h1 className="text-display mt-2">Tokens</h1>
        <p className="text-p1 mt-4 text-blanco/60">
          Relevados del archivo de Figma. El corte entre mobile y desktop va en 768px:
          achicá la ventana para ver los cambios.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="text-h2 border-b border-borde pb-3">Tipografía</h2>
        {TIPOGRAFIA.map(({ clase, nombre, specs }) => (
          <div key={clase} className="grid gap-2 md:grid-cols-[10rem_1fr] md:items-baseline">
            <div className="text-p3 text-blanco/40">
              <div className="text-blanco/70">{nombre}</div>
              <div>{specs}</div>
            </div>
            <p className={clase}>Nuestro código es cooperar</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Paleta</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLORES.map(({ nombre, clase, hex }) => (
            <div key={nombre} className="overflow-hidden rounded-lg border border-borde">
              <div className={`h-20 ${clase}`} />
              <div className="p-3">
                <div className="text-p3 text-blanco">{nombre}</div>
                <div className="text-p3 text-blanco/40">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Botones</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Boton>Trabajá con FACTTIC</Boton>
          <Boton variante="solida">Sumate a FACTTIC</Boton>
          <Boton variante="contorno">Ver todos</Boton>
          <Boton variante="sutil">Conocer más</Boton>
          <Boton variante="acento">Escribinos</Boton>
          <Boton disabled>Deshabilitado</Boton>
          <Boton tamano="sm">Chico</Boton>
          <BotonFlecha direccion="anterior" disabled />
          <BotonFlecha direccion="siguiente" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Etiquetas</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ChipSector nombre="Finanzas" />
          <ChipSector nombre="Organizaciones" />
          <ChipSector nombre="Agro" />
          <Chip>Nombre cliente</Chip>
          <Chip tono="lila">Comunicados</Chip>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Solapas y acordeón</h2>
        <Tabs
          solapas={[
            {
              id: 'desarrollo',
              etiqueta: 'Desarrollo',
              contenido: <p className="text-p1 text-blanco/70">Contenido de Desarrollo.</p>,
            },
            {
              id: 'diseno',
              etiqueta: 'Diseño',
              contenido: <p className="text-p1 text-blanco/70">Contenido de Diseño.</p>,
            },
            {
              id: 'ia',
              etiqueta: 'IA y Datos',
              contenido: <p className="text-p1 text-blanco/70">Contenido de IA y Datos.</p>,
            },
          ]}
        />
        <Acordeon
          items={[
            {
              id: 'desafio',
              titulo: 'Desafío',
              contenido: 'Desarrollar un sitio web que transmita confianza.',
            },
            { id: 'solucion', titulo: 'Solución', contenido: 'Plataforma unificada.' },
            { id: 'resultado', titulo: 'Resultado', contenido: 'Reducción del 40%.' },
          ]}
        />
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Formulario</h2>
        <div className="grid gap-5 md:max-w-lg">
          <Campo id="nombre" etiqueta="Nombre completo" placeholder="Ej: Paula Calgaro" />
          <Campo
            id="email"
            etiqueta="Correo electrónico"
            placeholder="paula@facttic.coop"
            error="Ingresá un correo válido"
          />
          <CampoTexto id="mensaje" etiqueta="Tu mensaje" placeholder="Dejanos tu mensaje..." />
          <Selector id="sector" etiqueta="Sectores" defaultValue="">
            <option value="">Sectores</option>
            <option>Agro</option>
            <option>Financiero</option>
          </Selector>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 border-b border-borde pb-3">Bloques</h2>
        <EncabezadoSeccion
          rotulo="Proyectos"
          titulo="Nuestros proyectos destacados"
          accion={<Boton>Ver todos</Boton>}
        />
        <Tarjeta className="p-6">
          <p className="text-h4">Desarrollo de sitio web de Provincia Fondos S.A</p>
        </Tarjeta>
        <BandaCta
          titulo="¿Tenés algún proyecto en mente?"
          accion={<Boton>Trabajá con FACTTIC</Boton>}
        />
      </section>
    </main>
  )
}
