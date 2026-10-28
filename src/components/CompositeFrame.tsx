/**
 * FRONTEND · components/CompositeFrame.tsx — draws ANY composite from its definition.
 *
 * Composites are not code: their entries in data/composites.json say which
 * slots exist and the approved layouts. This frame places the named slots in
 * the order of the layout the AI picked, writing them into the DOM in that
 * order, so screen readers and Tab follow the visual order.
 * The frame styles (card, accordion, …) come from the design screenshots.
 */
import { Children, type ReactNode } from "react";
import { DIVIDER, type CompositeDef } from "@/lib/composites";

const SLOT_CLASS = {
  stack: "flex flex-col gap-3",
  row: "flex flex-wrap items-center gap-4",
  wrap: "flex flex-wrap gap-2",
};

export function CompositeFrame({ def, layout, slots }: { def: CompositeDef; layout: string; slots?: Record<string, ReactNode> }) {
  const order = def.layouts[layout] ?? Object.values(def.layouts)[0] ?? [];
  return (
    <div className="flex flex-col gap-4">
      {order.map((entry, i) => {
        if (entry === DIVIDER) return <hr key={i} className="border-current/15" />;
        const nodes = Children.toArray(slots?.[entry]);
        if (nodes.length === 0) return null;
        return (
          <div key={i} data-slot={entry} className={SLOT_CLASS[def.slots[entry]?.style ?? "stack"]}>
            {nodes}
          </div>
        );
      })}
    </div>
  );
}
