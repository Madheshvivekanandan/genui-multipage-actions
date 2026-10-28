/**
 * FRONTEND · components/JsonDrawer.tsx — a side panel with the exact JSON (json-render spec) that drew the page.
 *
 * Closed until the "JSON" button is pressed; Escape or × closes it.
 */
"use client";

import type { Spec } from "@json-render/core";
import { useEffect, useState } from "react";

export function JsonDrawer({ spec, title }: { spec: Spec; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(spec, null, 2);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const copy = () => void navigator.clipboard.writeText(json).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1500)));

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[12px] text-[var(--ink)] hover:bg-white/10" aria-expanded={open}>
        {"{ }"} JSON
      </button>
      {open && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/40" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-label={`JSON for ${title}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-[#0c1720] text-[#e6edf3] shadow-2xl"
          >
            <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex-1">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-[#9fb0bd] uppercase">Page JSON</p>
                <h2 className="text-[15px]">
                  {title} · {Object.keys(spec.elements).length} elements
                </h2>
              </div>
              <button onClick={copy} className="rounded-md border border-white/15 px-2.5 py-1 text-[12px] hover:bg-white/10">
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close" className="flex size-8 items-center justify-center rounded-full border border-white/25 hover:bg-white/10">
                ×
              </button>
            </header>
            <pre className="flex-1 overflow-auto p-5 font-mono text-[11.5px] leading-relaxed text-[#c3ced8]">{json}</pre>
          </aside>
        </div>
      )}
    </>
  );
}
