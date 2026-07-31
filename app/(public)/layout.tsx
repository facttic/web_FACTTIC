import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

/** Marco del sitio público: barra de navegación arriba y pie abajo. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
