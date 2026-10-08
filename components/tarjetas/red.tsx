import { cn } from "@/lib/cn";
import { Tarjeta } from "@/components/ui/seccion";
import { Chip } from "@/components/ui/chip";
import { FOCO } from "@/components/ui/boton";
import { TextoRecortado } from "@/components/ui/texto-recortado";
import type { Autoridad, Cooperativa, Organizacion } from "@/lib/dominio/tipos";

/**
 * Piezas de la red: autoridades del consejo, cooperativas asociadas y logos de
 * organizaciones aliadas.
 */

/** Miembro del consejo de administración, para Sobre FACTTIC. */
export function CardAutoridad({
  autoridad,
  className,
}: {
  autoridad: Autoridad;
  className?: string;
}) {
  return (
    /*
     * El cargo arriba como rótulo, el nombre en el medio y la cooperativa
     * abajo como chip: es la forma de la maqueta, con el nombre separado del
     * rótulo por el aire y no pegado a él.
     *
     * Al pasar el mouse no se rellena: se le enciende el borde violeta, el
     * mismo degradado que llevan las tarjetas de vidrio.
     */
    <Tarjeta
      className={cn(
        "borde-degradado-hover flex flex-col justify-between gap-8 p-5",
        className,
      )}
    >
      <p className="text-eyebrow text-blanco/40">{autoridad.cargo}</p>
      <div>
        <h3 className="text-p2 text-balance">{autoridad.nombre}</h3>
        {autoridad.cooperativa ? (
          <Chip className="mt-4">Coop. {autoridad.cooperativa.nombre}</Chip>
        ) : null}
      </div>
    </Tarjeta>
  );
}

/**
 * Logo de una organización aliada o de una cooperativa. Cuando no hay imagen
 * cargada —hoy es el caso de todas— se muestra el nombre, que es mejor que un
 * hueco vacío.
 */
export function CardLogo({
  nombre,
  logo,
  className,
}: {
  nombre: string;
  logo: string | null;
  className?: string;
}) {
  return (
    <Tarjeta className={cn("grid h-24 place-items-center p-6", className)}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={nombre}
          className="max-h-12 w-auto object-contain opacity-80"
          loading="lazy"
        />
      ) : (
        <span className="text-p3 text-center text-blanco/50">{nombre}</span>
      )}
    </Tarjeta>
  );
}

/**
 * Cooperativa de la red, como en el listado de "Nuestra red": el logo arriba y
 * los servicios que ofrece debajo.
 */
export function CardCooperativa({
  cooperativa,
  className,
}: {
  cooperativa: Cooperativa;
  className?: string;
}) {
  return (
    <Tarjeta className={cn("p-6", className)}>
      <div className="grid h-20 place-items-center">
        {cooperativa.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cooperativa.logo}
            alt={cooperativa.nombre}
            className="max-h-12 w-auto object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-h4 text-center">{cooperativa.nombre}</span>
        )}
      </div>

      <h3 className="text-p2 mt-6">{cooperativa.nombre}</h3>

      {cooperativa.servicios.length ? (
        <p className="text-p3 mt-3 text-blanco/50">
          {cooperativa.servicios.map((servicio) => servicio.nombre).join(" · ")}
        </p>
      ) : null}

      {cooperativa.asociados > 0 ? (
        <p className="text-p3 mt-4 text-blanco/40">
          {cooperativa.asociados} asociadxs
        </p>
      ) : null}
    </Tarjeta>
  );
}

/**
 * Las redes y el contacto de la cooperativa, si cargó alguno.
 *
 * Van como texto y no como íconos: son tres o cuatro enlaces que aparecen de a
 * ratos, y un juego de íconos para eso pesa más de lo que aclara.
 *
 * Vivía dentro de Nuestra Red; está acá desde que la ficha de Proyectos la
 * necesita también.
 */
export function RedesCooperativa({
  cooperativa,
  className,
}: {
  cooperativa: Cooperativa;
  className?: string;
}) {
  const enlaces = [
    { texto: "LinkedIn", href: cooperativa.redes.linkedin },
    { texto: "Instagram", href: cooperativa.redes.instagram },
    { texto: "GitHub", href: cooperativa.redes.github },
    {
      texto: cooperativa.email,
      href: cooperativa.email ? `mailto:${cooperativa.email}` : null,
    },
  ].filter((enlace): enlace is { texto: string; href: string } =>
    Boolean(enlace.href && enlace.texto),
  );

  if (!enlaces.length) return null;

  return (
    <p
      className={cn(
        "text-p3 flex flex-wrap gap-x-4 gap-y-1 text-blanco/50",
        className,
      )}
    >
      {enlaces.map((enlace) => (
        <a
          key={enlace.href}
          href={enlace.href}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "underline-offset-4 hover:text-blanco hover:underline",
            FOCO,
          )}
        >
          {enlace.texto}
        </a>
      ))}
    </p>
  );
}

/**
 * La cooperativa a la cabeza de sus propios proyectos.
 *
 * Al filtrar Proyectos por cooperativa —que es a donde lleva "Ver sus
 * proyectos" desde el mapa— la grilla quedaba sin decir de quién eran: se
 * llegaba desde Nuestra Red y la pantalla no mencionaba la cooperativa en
 * ninguna parte.
 *
 * Es la misma ficha de la tarjeta del mapa pero acostada, porque acá hay ancho
 * de sobra y no tiene que competir con otras doce al lado.
 *
 * No la dibuja ninguna maqueta: no hay pantalla de cooperativa en el diseño, y
 * esto es lo más cerca que está el sitio de tener una.
 */
export function FichaCooperativa({
  cooperativa,
  rotulo,
  textoSitio,
  textoMas,
  textoMenos,
  className,
}: {
  cooperativa: Cooperativa;
  /** Lo que va chiquito arriba del nombre. */
  rotulo: string;
  textoSitio: string;
  textoMas: string;
  textoMenos: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-superficie md:flex-row",
        className,
      )}
    >
      {/*
        El logo va sobre blanco, como en la tarjeta del mapa: los logos vienen
        pensados para fondo claro y varios desaparecen sobre el violeta. Sin
        logo cargado no hay franja: el nombre ya está al lado, y repetirlo era
        lo que pasaba antes en la tarjeta del mapa.
      */}
      {cooperativa.logo ? (
        <div className="grid h-[85px] shrink-0 place-items-center bg-blanco px-6 md:h-auto md:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cooperativa.logo}
            alt={cooperativa.nombre}
            className="max-h-14 w-auto max-w-full object-contain md:max-h-20"
          />
        </div>
      ) : null}

      <div className="flex-1 p-6 md:p-8">
        <p className="text-p3 text-blanco/40">{rotulo}</p>
        <h2 className="text-h4 md:text-h3 mt-1">{cooperativa.nombre}</h2>

        {/* Recortada: una cooperativa escribió 688 caracteres y la ficha se
            comía la pantalla entera antes de que apareciera un solo proyecto,
            que es a lo que se vino. El "Leer más" sale solo si el texto de
            verdad se corta. */}
        {cooperativa.descripcion ? (
          <TextoRecortado
            lineas={4}
            mas={textoMas}
            menos={textoMenos}
            className="text-p2 mt-4 max-w-3xl text-blanco/80"
          >
            {cooperativa.descripcion}
          </TextoRecortado>
        ) : null}

        {cooperativa.servicios.length ? (
          <p className="text-p2 mt-4 text-blanco/60">
            {cooperativa.servicios.map((s) => s.nombre).join("  ·  ")}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-dotted border-punteado pt-4">
          {cooperativa.provincia ? (
            <span className="text-p3 flex items-center gap-2 text-blanco/70">
              <span aria-hidden className="size-1.5 rounded-full bg-blanco/70" />
              {cooperativa.provincia}
            </span>
          ) : null}

          {cooperativa.sitio ? (
            <a
              href={cooperativa.sitio}
              target="_blank"
              rel="noreferrer noopener"
              className={cn("text-p3 underline-offset-4 hover:underline", FOCO)}
            >
              {textoSitio}
            </a>
          ) : null}

          <RedesCooperativa cooperativa={cooperativa} />
        </div>
      </div>
    </div>
  );
}

/** Grilla de logos de aliados, como en "Eligen soluciones cooperativas". */
export function GrillaLogos({
  organizaciones,
  className,
}: {
  organizaciones: Organizacion[];
  className?: string;
}) {
  if (!organizaciones.length) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6",
        className,
      )}
    >
      {organizaciones.map((organizacion) => (
        <CardLogo
          key={organizacion.id}
          nombre={organizacion.nombre}
          logo={organizacion.logo}
        />
      ))}
    </div>
  );
}
