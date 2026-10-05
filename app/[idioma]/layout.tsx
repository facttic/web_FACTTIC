import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "../globals.css";
import { IDIOMAS, esIdioma, type Idioma } from "@/lib/idioma";

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

export const metadata: Metadata = {
  title: {
    default:
      "FACTTIC — Federación Argentina de Cooperativas de Trabajo de Tecnología",
    template: "%s · FACTTIC",
  },
  description:
    "Una red federal de cooperativas de tecnología, innovación y conocimiento que diseña, desarrolla e implementa soluciones digitales.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  const lang: Idioma = esIdioma(idioma) ? idioma : "es";

  return (
    <html lang={lang} className={`${inter.variable} ${dmMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
