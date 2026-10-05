import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "../globals.css";
import { contenido } from "@/lib/contenido";
import {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  esIdioma,
  type Idioma,
} from "@/lib/idioma";

/**
 * Las dos tipografías del diseño. Ambas están en Google Fonts, así que no hay
 * licencias que gestionar ni archivos que hospedar.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

/**
 * Las dos versiones del sitio se generan de antemano. El idioma es el primer
 * segmento de la ruta —el español además va sin prefijo, y de eso se encarga
 * `proxy.ts`—, así que acá llega siempre uno de los dos.
 */
export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

/**
 * Metadatos de base, por idioma.
 *
 * `alternates` es lo que le dice a los buscadores que las dos versiones son la
 * misma pantalla en otro idioma —y no contenido duplicado—. Las rutas de abajo
 * agregan su propio título y su bajada; esto queda como fondo.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  const lang: Idioma = esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;
  const T = contenido(lang);

  return {
    /* Sin esto, `hreflang` y la canónica salen relativas y los buscadores no
       las resuelven. En Vercel la URL del deploy llega por entorno. */
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITIO_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000"),
    ),
    title: {
      default:
        lang === "en"
          ? "FACTTIC — Argentine Federation of Technology Worker Co-operatives"
          : "FACTTIC — Federación Argentina de Cooperativas de Trabajo de Tecnología",
      template: "%s · FACTTIC",
    },
    description: T.HOME.hero.bajada,
    alternates: {
      canonical: lang === "en" ? "/en" : "/",
      languages: { es: "/", en: "/en" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  const lang: Idioma = esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;

  return (
    <html lang={lang} className={`${inter.variable} ${dmMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
