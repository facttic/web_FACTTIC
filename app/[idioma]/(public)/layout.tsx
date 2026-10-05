import { MarcoPublico } from "@/components/layout/marco";

/** Marco del sitio público. La estructura vive en `MarcoPublico`, que también
 *  usa el 404. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarcoPublico>{children}</MarcoPublico>;
}
