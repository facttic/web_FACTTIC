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
      <Header />
      {/*
        El encabezado es fijo, así que el contenido arranca debajo. El hero se
        mete por detrás con un margen negativo, para que el video llegue hasta
        el borde superior como en el diseño.
      */}
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
