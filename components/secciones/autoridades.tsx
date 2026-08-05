import { Tabs, type Solapa } from "@/components/ui/tabs";
import { CardAutoridad } from "@/components/tarjetas/red";
import type { Autoridad } from "@/lib/dominio/tipos";

/**
 * Los dos órganos de la Federación, en solapas: el Consejo de administración y
 * la Sindicatura.
 *
 * La API guarda a todo el mundo en el mismo recurso, sin decir a qué órgano
 * pertenece, así que se reparten por el cargo: quien es síndico o síndica va a
 * Sindicatura y el resto al Consejo. Cuando el backend agregue el campo, este
 * reparto se reemplaza por una lectura directa.
 *
 * Si un órgano queda vacío no se muestra su solapa, y si no hay nadie cargado
 * la sección entera desaparece en vez de dejar el hueco.
 */
export function Autoridades({
  autoridades,
  etiquetas,
  className,
}: {
  autoridades: Autoridad[];
  etiquetas: { consejo: string; sindicatura: string };
  className?: string;
}) {
  const esSindicatura = (autoridad: Autoridad) =>
    /s[ií]ndic/i.test(autoridad.cargo);

  const grupos: Array<{ id: string; etiqueta: string; miembros: Autoridad[] }> =
    [
      {
        id: "consejo",
        etiqueta: etiquetas.consejo,
        miembros: autoridades.filter((a) => !esSindicatura(a)),
      },
      {
        id: "sindicatura",
        etiqueta: etiquetas.sindicatura,
        miembros: autoridades.filter(esSindicatura),
      },
    ].filter((grupo) => grupo.miembros.length > 0);

  if (!grupos.length) return null;

  const solapas: Solapa[] = grupos.map((grupo) => ({
    id: grupo.id,
    etiqueta: grupo.etiqueta,
    contenido: (
      <div className="grid gap-5 pt-8 md:grid-cols-3">
        {grupo.miembros.map((autoridad) => (
          <CardAutoridad key={autoridad.id} autoridad={autoridad} />
        ))}
      </div>
    ),
  }));

  return <Tabs solapas={solapas} className={className} />;
}
