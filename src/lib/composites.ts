/**
 * SHARED · lib/composites.ts — components made of atoms, defined as DATA.
 *
 * Atoms are React code (components/atoms.tsx). Composites are entries in
 * data/composites.json, written by hand by the team: the named slots, which
 * atoms each slot may hold, and the designer-approved layouts. One generic
 * frame (components/CompositeFrame.tsx) draws every composite from its entry.
 * There is no page or API to create or edit them: change the JSON file.
 *
 * The AI picks one of the approved layouts and fills the named slots;
 * validation (lib/validate.ts) enforces the slot rules.
 *
 * Rule for lib/: no secrets, no React, no AI calls.
 */
import type { UIElement } from "@json-render/core";
import { z } from "zod";

// What the frame draws around the slots: panel = the header card · accordion = a
// collapsible card with a coloured tab label · plain = nothing.
export const FRAMES = ["panel", "accordion", "plain"] as const;
// stack = one under another · row = side by side · wrap = chips that wrap
// columns = side by side with lines between (stats) · grid = side by side (dates)
// rows = one under another with lines between · tabs = a tab strip, one item open
// tab = drawn outside the flow: the accordion's label, or the item's tab in a tab strip
export const SLOT_STYLES = ["stack", "row", "wrap", "columns", "grid", "rows", "tabs", "tab"] as const;
export const DIVIDER = "divider";

export const compositeSchema = z.object({
  type: z.string().regex(/^[A-Z][A-Za-z0-9]*$/, "type must be PascalCase, e.g. RiskPanel"),
  description: z.string().trim().min(10, "description tells the AI when to use it (10+ characters)"),
  frame: z.enum(FRAMES),
  slots: z.record(
    z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "slot names must be camelCase"),
    z.object({
      allow: z.array(z.string()).min(1, "each slot must allow at least one component"),
      min: z.number().int().min(0),
      max: z.number().int().min(1).max(12),
      style: z.enum(SLOT_STYLES),
    }),
  ),
  // Each layout is the order of the slots, top to bottom; "divider" draws a line. Tab slots are not placed.
  layouts: z.record(z.string().regex(/^[a-z][a-z0-9-]*$/, "layout names must be kebab-case"), z.array(z.string())),
});
export type CompositeDef = z.infer<typeof compositeSchema>;
export type SlotRule = CompositeDef["slots"][string];

/** Child keys of an element in a named slot. */
export const slotKeys = (el: UIElement, slot: string): string[] => el.slots?.[slot] ?? [];

/** The text json-render shows the AI for this composite (the catalog "description"). */
export function describeComposite(def: CompositeDef): string {
  const layouts = Object.entries(def.layouts).map(([name, order]) => `${name} = ${order.join(" → ")}`);
  const slots = Object.entries(def.slots).map(([slot, r]) => `${slot} ${r.min}-${r.max} of ${r.allow.join("/")}${r.style === "tab" ? " (tab)" : ""}`);
  return `${def.description} layout (pick one): ${layouts.join("; ")}. Slots: ${slots.join("; ")}.`;
}

/**
 * Checks the hand-written list in data/composites.json. `atoms` and `reserved`
 * come from lib/catalog.ts, which refuses to start with a broken file.
 */
export function checkComposites(input: unknown, { atoms, reserved }: { atoms: readonly string[]; reserved: readonly string[] }): {
  composites: CompositeDef[];
  problems: string[];
} {
  const parsed = compositeSchema.array().safeParse(input);
  if (!parsed.success) {
    return { composites: [], problems: parsed.error.issues.map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message)) };
  }
  const composites = parsed.data;
  const known = new Set([...atoms, ...composites.map((c) => c.type)]);
  const problems: string[] = [];

  for (const def of composites) {
    const at = (msg: string) => problems.push(`${def.type}: ${msg}`);
    if (reserved.includes(def.type)) at("is a built-in component name");
    if (composites.filter((c) => c.type === def.type).length > 1) at("is defined more than once");
    const slotNames = Object.keys(def.slots);
    if (slotNames.length === 0) at("add at least one slot");
    for (const [slot, rule] of Object.entries(def.slots)) {
      if (rule.min > rule.max) at(`${slot}: min (${rule.min}) is larger than max (${rule.max})`);
      if (rule.style === "tab" && rule.max !== 1) at(`${slot}: a tab slot holds one item (max 1)`);
      for (const t of rule.allow) {
        if (t === def.type) at(`${slot}: a component can't contain itself`);
        else if (!known.has(t)) at(`${slot}: unknown component "${t}"`);
      }
    }
    if (slotNames.filter((s) => def.slots[s].style === "tab").length > 1) at("only one tab slot is allowed");

    const placed = slotNames.filter((s) => def.slots[s].style !== "tab"); // the tab sits outside the flow
    if (Object.keys(def.layouts).length === 0) at("add at least one layout");
    for (const [name, order] of Object.entries(def.layouts)) {
      for (const entry of order) {
        if (entry !== DIVIDER && !placed.includes(entry)) at(`layout ${name}: "${entry}" is not a placeable slot`);
      }
      for (const slot of placed) {
        const n = order.filter((e) => e === slot).length;
        if (n !== 1) at(`layout ${name}: must place "${slot}" exactly once (found ${n})`);
      }
      if (order[0] === DIVIDER || order.at(-1) === DIVIDER || order.some((e, i) => e === DIVIDER && order[i + 1] === DIVIDER)) {
        at(`layout ${name}: dividers go between slots`);
      }
    }
  }
  return { composites, problems };
}
