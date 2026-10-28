/**
 * FRONTEND · components/frames/Panel.tsx — the light card at the top of a page.
 */
import type { ReactNode } from "react";
import { CARD_SHADOW, CARD_TOKENS } from "./tokens";

export function Panel({ children }: { children: ReactNode }) {
  return (
    <section style={CARD_TOKENS} className={`relative flex flex-col gap-4 rounded-2xl bg-[#eff2f5]/[0.97] px-7 py-7 ${CARD_SHADOW}`}>
      {children}
    </section>
  );
}
