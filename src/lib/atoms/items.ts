/**
 * SHARED · lib/atoms/items.ts — chips and rows: atoms with several fields.
 */
import { z } from "zod";
import { NOTE } from "../note";

const atom = <T extends z.ZodRawShape>(shape: T, description: string) => ({
  props: z.object({ ...shape, note: NOTE }),
  description: `${description} Atom, no children.`,
});

export const ITEM_ATOMS = {
  /* ---------- chips ---------- */
  Tag: atom(
    { label: z.string().nullable(), value: z.string() },
    "A chip: optional small uppercase label + value, e.g. label 'WHERE' value 'Wisconsin-based'; label null for a plain chip. Goes in Chips.",
  ),
  Citation: atom(
    { text: z.string(), source: z.string() },
    "A chip naming what a claim rests on and its source id, e.g. text 'Credible integrated retail fit' source 'rfp_overview.fit'. Goes in Chips.",
  ),
  PositionTab: atom(
    { label: z.string(), title: z.string(), recommended: z.boolean().optional() },
    "The tab of a Position: small label ('PROOF STRATEGY'), short title ('Prove the transfer'), recommended: true on exactly one. Goes in Position's tab slot.",
  ),

  /* ---------- rows ---------- */
  KeyDate: atom(
    { date: z.string(), label: z.string(), current: z.boolean().optional() },
    "One date on a timeline, e.g. date 'November 20, 2026, 5:00 PM CST' label 'Proposal due'; current: true on the next deadline. Goes in Timeline.",
  ),
  Requirement: atom(
    { code: z.string(), text: z.string(), kind: z.enum(["disqualifier", "process-gate"]), status: z.enum(["met", "to-confirm"]) },
    "One stated requirement as a checklist row: code 'R1', the requirement, its kind, and met (we can meet it) or to-confirm. Goes in Rows.",
  ),
  FitRow: atom(
    { label: z.string().nullable(), verdict: z.enum(["aligned", "partial", "gap"]), text: z.string() },
    "One row of a fit assessment: a dimension ('Strategic'), a verdict and why. For a gap use verdict 'gap' and label null. Goes in Rows.",
  ),
  ColumnLabels: atom(
    { labels: z.array(z.string()).min(3).max(3) },
    "Column headings for the Evidence rows after it: ['WHAT WE FOUND', 'IN THEIR WORDS', 'WHAT IT RESTS ON']. First item in Rows.",
  ),
  Evidence: atom(
    { finding: z.string(), quote: z.string(), kind: z.enum(["fact", "signal"]), source: z.string() },
    "One evidence row: what we found, the source's own words, and what it rests on (kind + source id, e.g. 'research_base.gaps'). Goes in Rows.",
  ),
  Finding: atom({ text: z.string(), source: z.string() }, "A finding with its source id on the right, e.g. 'research_base.gaps'. Goes in Rows."),
};
