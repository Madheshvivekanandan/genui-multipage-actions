/**
 * ROUTING · app/how-it-works/page.tsx — the URL  /how-it-works.
 *
 * Only wiring: "when someone opens /how-it-works, show the flow guide".
 */
import type { Metadata } from "next";
import { GuideScreen } from "@/components/guide/GuideScreen";

export const metadata: Metadata = { title: "How it works · GenUI Multipage Actions" };

export default function Page() {
  return <GuideScreen />;
}
