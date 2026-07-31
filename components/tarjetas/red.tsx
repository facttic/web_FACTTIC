import { cn } from "@/lib/cn";
import { Tarjeta } from "@/components/ui/seccion";
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
    <Tarjeta className={cn("p-6", className)}>
      <p className="text-eyebrow text-blanco/40">{autoridad.cargo}</p>
      <h3 className="text-h4 mt-3">{autoridad.nombre}</h3>
      {autoridad.cooperativa ? (
        <p className="text-p3 mt-2 text-blanco/50">
          {autoridad.cooperativa.nombre}
        </p>
      ) : null}
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
