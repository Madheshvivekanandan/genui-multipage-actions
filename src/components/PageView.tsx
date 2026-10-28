/**
 * FRONTEND · components/PageView.tsx — turns one page's JSON (a json-render spec) into real components.
 */
"use client";

import { autoFixSpec, type Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { registry } from "@/components/registry";

export function PageView({ spec, streaming }: { spec: Spec; streaming: boolean }) {
  // autoFixSpec repairs small, safe mistakes (e.g. "visible" put inside props).
  const fixed = autoFixSpec(spec).spec;
  return (
    <JSONUIProvider registry={registry} initialState={fixed.state}>
      <Renderer spec={fixed} registry={registry} loading={streaming} />
    </JSONUIProvider>
  );
}
