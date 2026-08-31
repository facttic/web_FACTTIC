import { ViewTransition } from "react";
import { GrillaDeFondo } from "@/components/ui/grilla-viva";
import { RevelarSinTimeline } from "@/components/ui/revelar-sin-timeline";
import { Header } from "./header";
import { Footer } from "./footer";

/**
 * Marco del sitio público: barra de navegación arriba y pie abajo.
 *
 * Vive aparte del layout porque el 404 también lo necesita y no puede usarlo:
 * `not-found.tsx` tiene que estar en la raíz de `app/` para atender cualquier
 * URL que no exista, así que queda fuera del grupo `(public)` y de su layout.
 */
export function MarcoPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* La grilla de puntos que se enciende alrededor del cursor, detrás de
          todo el sitio. Solo en desktop: sin mouse no tiene nada que seguir. */}
      <GrillaDeFondo />
      {/* Las entradas del sitio van con `animation-timeline: view()`, que
          Firefox todavía no tiene: esto las cubre ahí y no hace nada donde ya
          funcionan. */}
      <RevelarSinTimeline />
      <Header />
      {/*
        El encabezado es fijo, así que el contenido arranca debajo. El hero se
        mete por detrás con un margen negativo, para que el video llegue hasta
        el borde superior como en el diseño.
      */}
      {/*
        El contenido va envuelto para que el cambio de pantalla se anime. React
        solo dispara la transición si hay un `ViewTransition` en juego: sin
        esto, la única navegación que se animaba era la que abre un proyecto,
        que es donde estaba el morph de la portada.

        La animación en sí —cuánto dura y cómo entra— vive en `globals.css`.
      */}
      <ViewTransition>
        <main className="flex-1 pt-[72px]">{children}</main>
      </ViewTransition>
      <Footer />
    </>
  );
}
