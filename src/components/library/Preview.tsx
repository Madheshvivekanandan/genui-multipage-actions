/**
 * FRONTEND · components/library/Preview.tsx — draws a sample spec with the real registry.
 *
 * `card`: put it on a light card first (atoms and plain composites; panels and accordions draw their own).
 */
"use client";

import type { Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { CARD_TOKENS } from "@/components/frames/tokens";
import { registry } from "@/components/registry";

export function Preview({ spec, card }: { spec: Spec; card: boolean }) {
  const view = (
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
  if (!card) return view;
  return (
    <div style={CARD_TOKENS} className="rounded-xl bg-[#eff2f5]/[0.97] p-5">
      {view}
    </div>
  );
}
