"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Logo servido desde la API, con el nombre como respaldo.
 *
 * Las imágenes de tecnologías y aliados vienen cargadas de formas distintas y
 * algunas apuntan a archivos que no existen. Sin esto, el navegador dibuja su
 * ícono de imagen rota, que se lee peor que el nombre escrito.
 */
export function LogoRemoto({
  src,
  nombre,
  className,
}: {
  src: string | null;
  nombre: string;
  className?: string;
}) {
  const [falló, setFalló] = useState(false);

  if (!src || falló) {
    // Sin `nombre` no hay respaldo que mostrar: quien llama ya lo escribe al
    // lado, como en el stack tecnológico.
    if (!nombre) return null;
    return <span className="text-p2 text-center text-blanco/70">{nombre}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={nombre}
      loading="lazy"
      onError={() => setFalló(true)}
      className={cn("w-auto max-w-full object-contain", className)}
    />
  );
}
