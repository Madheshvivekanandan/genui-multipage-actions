/**
 * FRONTEND · components/PageView.tsx — turns one page's JSON (a json-render spec) into real components.
 *
 * Also the anchor for that page's note popup, which opens beside the page.
 */
"use client";

import { autoFixSpec, type Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { NotePopup } from "@/components/notes/NotePopup";
import { NotePageContext } from "@/components/notes/state";
import { registry } from "@/components/registry";

export function PageView({ page, spec, streaming }: { page: string; spec: Spec; streaming: boolean }) {
  // autoFixSpec repairs small, safe mistakes (e.g. "visible" put inside props).
  const fixed = autoFixSpec(spec).spec;
  return (
    <NotePageContext.Provider value={page}>
      <div data-note-root className="relative">
        <JSONUIProvider registry={registry} initialState={fixed.state}>
          <Renderer spec={fixed} registry={registry} loading={streaming} />
        </JSONUIProvider>
        <NotePopup page={page} />
      </div>
    </NotePageContext.Provider>
  );
}
