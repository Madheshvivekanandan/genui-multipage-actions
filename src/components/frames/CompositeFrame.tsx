/**
 * FRONTEND · components/frames/CompositeFrame.tsx — draws ANY composite from its definition.
 *
 * Composites are not code: their entries in data/composites.json say which
 * slots exist and the approved layouts. This frame places the filled slots in
 * the order of the layout the AI picked (DOM order = visual order, so screen
 * readers and Tab follow it) and wraps them in the composite's frame.
 */
"use client";

import { Children, useContext, type ReactNode } from "react";
import { DIVIDER, type CompositeDef } from "@/lib/composites";
import { Accordion } from "./Accordion";
import { FrameContext, TabHeadContext } from "./context";
import { Panel } from "./Panel";
import { SlotRegion } from "./SlotRegion";

type Props = { def: CompositeDef; layout: string; slots?: Record<string, ReactNode> };

export function CompositeFrame({ def, layout, slots }: Props) {
  const asTab = useContext(TabHeadContext);
  const nodes = (slot: string) => Children.toArray(slots?.[slot]);
  const tabSlot = Object.keys(def.slots).find((s) => def.slots[s].style === "tab");

  // Drawn as one tab of a tab strip: only the tab slot.
  if (asTab) return <TabHeadContext.Provider value={false}>{tabSlot ? nodes(tabSlot) : null}</TabHeadContext.Provider>;

  const parts = placeSlots(def, layout, nodes).map((entry, i) =>
    entry === DIVIDER ? (
      <hr key={i} className="border-[var(--line)]" />
    ) : (
      <SlotRegion key={i} slot={entry} style={def.slots[entry].style} frame={def.frame} nodes={nodes(entry)} />
    ),
  );

  let body: ReactNode = <div className="flex flex-col gap-2">{parts}</div>;
  if (def.frame === "panel") body = <Panel>{parts}</Panel>;
  if (def.frame === "accordion") body = <Accordion tab={tabSlot ? nodes(tabSlot) : []} parts={parts} />;
  return <FrameContext.Provider value={def.frame}>{body}</FrameContext.Provider>;
}

/** The layout's order without the empty slots; a divider only between two filled slots. */
function placeSlots(def: CompositeDef, layout: string, nodes: (slot: string) => ReactNode[]): string[] {
  const out: string[] = [];
  for (const entry of def.layouts[layout] ?? Object.values(def.layouts)[0] ?? []) {
    if (entry === DIVIDER) {
      if (out.length > 0 && out.at(-1) !== DIVIDER) out.push(entry);
    } else if (nodes(entry).length > 0) out.push(entry);
  }
  if (out.at(-1) === DIVIDER) out.pop();
  return out;
}
