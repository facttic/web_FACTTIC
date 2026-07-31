import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/** Marco del sitio público: barra de navegación arriba y pie abajo. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
