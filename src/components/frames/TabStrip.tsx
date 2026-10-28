/**
 * FRONTEND · components/frames/TabStrip.tsx — a "tabs" slot: one tab per item, one item open.
 *
 * Each item is drawn twice: as its tab (only its tab slot, TabHeadContext) and,
 * when open, as its panel. The recommended item asks to be open first.
 */
"use client";

import { useState, type ReactNode } from "react";
import { TabContext, TabHeadContext } from "./context";

export function TabStrip({ nodes }: { nodes: ReactNode[] }) {
  const [picked, setPicked] = useState<number | null>(null); // the reader's choice
  const [preferred, setPreferred] = useState(0); // the recommended item
  const active = picked ?? preferred;

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="grid border-b border-[var(--line)]" style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}>
        {nodes.map((node, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            onClick={() => setPicked(i)}
            className={`-mb-px border-b-2 px-1 pt-1 pb-3 text-left transition ${i === active ? "border-[#8f6fe0]" : "border-transparent hover:border-[var(--line)]"}`}
          >
            <TabContext.Provider value={{ index: i, active: i === active, prefer: setPreferred }}>
              <TabHeadContext.Provider value={true}>{node}</TabHeadContext.Provider>
            </TabContext.Provider>
          </button>
        ))}
      </div>
      <div role="tabpanel">{nodes[active]}</div>
    </div>
  );
}
