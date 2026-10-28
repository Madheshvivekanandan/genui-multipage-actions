/**
 * FRONTEND · components/frames/SlotRegion.tsx — draws one slot's items in the slot's style.
 */
"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CompositeDef, SlotRule } from "@/lib/composites";
import { TabStrip } from "./TabStrip";

const STACK_GAP = { panel: "gap-2", accordion: "gap-4", plain: "gap-2" };
const FLAT = { row: "flex flex-wrap items-center gap-4", wrap: "flex flex-wrap gap-2" };
// Side by side; "columns" also draws a line between them (the header stats).
const SIDE = "grid grid-cols-2 gap-5 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]";
const COLUMN_LINE = "min-w-0 border-[var(--line)] sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-5";

type Props = { slot: string; style: SlotRule["style"]; frame: CompositeDef["frame"]; nodes: ReactNode[] };

export function SlotRegion({ slot, style, frame, nodes }: Props) {
  if (style === "tabs") return <TabStrip nodes={nodes} />;
  if (style === "row" || style === "wrap") return <div data-slot={slot} className={FLAT[style]}>{nodes}</div>;
  if (style === "columns" || style === "grid") {
    return (
      <div data-slot={slot} style={{ "--cols": nodes.length } as CSSProperties} className={SIDE}>
        {nodes.map((n, i) => (
          <div key={i} className={style === "columns" ? COLUMN_LINE : "min-w-0"}>
            {n}
          </div>
        ))}
      </div>
    );
  }
  if (style === "rows") {
    return (
      <div data-slot={slot} className="flex flex-col divide-y divide-[var(--line)]">
        {nodes.map((n, i) => (
          <div key={i} className="py-2.5 first:pt-0 last:pb-0">
            {n}
          </div>
        ))}
      </div>
    );
  }
  return <div data-slot={slot} className={`flex flex-col ${STACK_GAP[frame]}`}>{nodes}</div>;
}
