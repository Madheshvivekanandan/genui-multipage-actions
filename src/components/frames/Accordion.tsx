/**
 * FRONTEND · components/frames/Accordion.tsx — a collapsible card with a coloured tab label.
 *
 * The first part (usually the headline) stays visible next to the toggle; the rest collapses.
 */
"use client";

import { useState, type ReactNode } from "react";
import { CARD_SHADOW, CARD_TOKENS, TAB_TOKENS } from "./tokens";

export function Accordion({ tab, parts }: { tab: ReactNode[]; parts: ReactNode[] }) {
  const [open, setOpen] = useState(true);
  const [head, ...rest] = parts;

  return (
    <div className={tab.length ? "pt-3" : ""}>
      <section style={CARD_TOKENS} className={`relative rounded-2xl bg-[#e9ecef]/[0.97] px-7 pt-6 pb-6 ${CARD_SHADOW}`}>
        {tab.length > 0 && (
          <div
            style={TAB_TOKENS}
            className="absolute top-0 left-7 -translate-y-1/2 rounded-md bg-linear-to-r from-[#e0559b] to-[#8f6fe0] px-2.5 py-1 shadow-[0_8px_24px_-8px_rgba(143,111,224,0.7)]"
          >
            {tab}
          </div>
        )}
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">{head}</div>
          {rest.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Collapse" : "Expand"}
              className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#c9cdd3] text-[#4b5060] transition hover:bg-black/5"
            >
              <svg viewBox="0 0 24 24" className={`size-3.5 transition ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 15 12 9 18 15" />
              </svg>
            </button>
          )}
        </div>
        {open && rest.length > 0 && <div className="mt-4 flex flex-col gap-4">{rest}</div>}
      </section>
    </div>
  );
}
