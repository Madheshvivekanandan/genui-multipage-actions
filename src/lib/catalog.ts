/**
 * SHARED · lib/catalog.ts — WHAT the AI is allowed to build.
 *
 * The "menu" of components, used on BOTH sides:
 *   - SERVER (server/agents/): catalog.prompt() turns this menu into
 *     instructions for each agent.
 *   - BROWSER (components/registry.tsx): defineRegistry() makes us build a
 *     real React component for every item on the menu.
 *
 * Three groups:
 *   PAGE       — the root of every page the agents build
 *   ATOMS      — the smallest pieces of the design (React code, components/atoms.tsx)
 *   COMPOSITES — built from atoms, written by hand in data/composites.json
 *
 * Any atom or composite may carry a `note` ({ title, text }): the AI's
 * reasoning for that piece. A piece with a note becomes clickable and opens a
 * popup with it (static: no AI call on click).
 *
 * Rule for lib/: no secrets, no React, no AI calls.
 */
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";
import compositesFile from "../../data/composites.json";
import { checkComposites, describeComposite, type CompositeDef } from "./composites";

/** Why the AI built a piece this way. Optional on every atom and composite. */
export const NOTE = z
  .object({ title: z.string(), text: z.string() })
  .optional()
  .describe("Optional popup explaining your reasoning for this piece. Only where it helps the reader.");
export type Note = z.infer<typeof NOTE>;

/** Components written in code. The composites from data/composites.json are added on top. */
const BASE_COMPONENTS = {
  /* ---------- PAGE ---------- */
  Page: {
    props: z.object({ title: z.string() }),
    description: "ALWAYS the root element. Holds the page title. Children stack vertically.",
  },

  /* ---------- ATOMS ---------- */
  // Built from the design screenshots (next step). Each atom's props include `note: NOTE`.
};

export const ATOM_TYPES: readonly string[] = [];

/** Only the code components: gives the React registry its prop types. */
export const baseCatalog = defineCatalog(schema, { components: BASE_COMPONENTS, actions: {} });

/** The hand-written composites, checked once when the app starts. */
export const COMPOSITES: CompositeDef[] = (() => {
  const { composites, problems } = checkComposites(compositesFile, { atoms: ATOM_TYPES, reserved: Object.keys(BASE_COMPONENTS) });
  if (problems.length) throw new Error(`data/composites.json is invalid:\n- ${problems.join("\n- ")}`);
  return composites;
})();

/** The full menu: code components + composites. Each composite gets one prop (which approved layout), a note and its named slots. */
function buildCatalog(composites: CompositeDef[]) {
  const entries = composites.map((def) => {
    const layouts = Object.keys(def.layouts) as [string, ...string[]];
    return [def.type, { props: z.object({ layout: z.enum(layouts), note: NOTE }), slots: Object.keys(def.slots), description: describeComposite(def) }];
  });
  return defineCatalog(schema, { components: { ...BASE_COMPONENTS, ...Object.fromEntries(entries) }, actions: {} });
}

export const catalog = buildCatalog(COMPOSITES);

/** Rules every agent gets, appended to json-render's generated prompt. */
export const RULES = [
  "The root element MUST be a Page. Put everything else inside it.",
  "Build the COMPLETE page in one answer.",
  "Write literal prop values. Do NOT use $state, $item, $bindState or repeat: write every element explicitly.",
  "Use only facts from the document you are given. Never invent names, numbers or dates, and never use lorem ipsum.",
  'Add a "note" ({ "title", "text" }) only where your reasoning helps the reader, at most 4 notes per page. Keep each note to one or two sentences.',
];

/** How to fill a composite's named slots: json-render's prompt lists slot names but never shows the format. */
function compositeRules(composites: CompositeDef[]): string[] {
  const example = composites[0];
  if (!example) return [];
  const slots = Object.fromEntries(Object.keys(example.slots).map((s) => [s, [`${s}-1`]]));
  const element = { type: example.type, props: { layout: Object.keys(example.layouts)[0] }, children: [], slots };
  return [
    `Composite components (${composites.map((c) => c.type).join(", ")}) take content ONLY through a top-level "slots" field, a sibling of children (NOT inside props), and always have "children": []. Example: ${JSON.stringify(element)}`,
    "Respect each slot's min-max and allowed components. Every key listed in a slot must be output as its own element.",
    "Pick each composite's layout from its listed layouts. Never invent a layout.",
  ];
}

/**
 * One agent's system prompt: json-render writes it from the catalog, then the
 * shared rules, then that agent's own rules (server/agents/page1.ts …).
 */
export function buildInstructions({ system, rules }: { system: string; rules: string[] }): string {
  return catalog.prompt({
    mode: "standalone", // JSONL patches only: no chat, the page is the whole answer
    system,
    customRules: [...RULES, ...compositeRules(COMPOSITES), ...rules],
  });
}
