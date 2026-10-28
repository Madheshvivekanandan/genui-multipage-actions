/**
 * ROUTING · app/components/page.tsx — the URL  /components.
 *
 * Only wiring: "when someone opens /components, show the component library".
 */
import type { Metadata } from "next";
import { LibraryScreen } from "@/components/library/LibraryScreen";

export const metadata: Metadata = { title: "Component library · GenUI Multipage Actions" };

export default function Page() {
  return <LibraryScreen />;
}
