import { cn } from "@/lib/cn";

/**
 * Pasos numerados de la metodología intercoop: número grande y tenue, línea
 * divisoria y el texto debajo, tal como en la Home.
 */
export function Pasos({
  pasos,
  className,
}: {
  pasos: readonly { titulo: string; descripcion: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-10 md:grid-cols-3 md:gap-8", className)}>
      {pasos.map((paso, i) => (
        <li key={paso.titulo}>
          <p className="text-h1 text-blanco/20">
            {String(i + 1).padStart(2, "0")}.
          </p>
          <div className="mt-4 border-t border-borde" />
          <h3 className="text-h4 mt-5">{paso.titulo}</h3>
          <p className="text-p2 mt-3 text-blanco/60">{paso.descripcion}</p>
        </li>
      ))}
    </ol>
  );
}
