/**
 * SHARED · lib/samples.ts — sample content, so every atom and composite can be previewed
 * on /components without an AI call.
 *
 * Composite samples are built from the definition: one of each allowed piece in a
 * slot (up to 3), so a composite added to data/composites.json previews by itself.
 */
import type { Spec } from "@json-render/core";
import type { CompositeDef, SlotRule } from "./composites";

// Up to three variants per atom; the n-th sample of a type uses variant n.
const SAMPLES: Record<string, Record<string, unknown>[]> = {
  Eyebrow: [{ text: "WHO THEY ARE" }, { text: "KEY DATES" }, { text: "BUDGET" }],
  Headline: [{ text: "This is a regional outdoor retailer balancing growth in e-commerce with rising competition." }],
  Body: [{ text: "The document names a marketing department contact and uses a brand-led brief with weighted criteria." }],
  Quote: [{ text: "Refresh the brand identity to appeal to younger outdoor enthusiasts without alienating our loyal family base." }],
  BigValue: [{ text: "$750,000" }, { text: "Nov 20, 2026" }, { text: "3 to confirm" }],
  Caption: [{ text: "$450,000 working media; agency fees capped at $300,000" }],
  Bullet: [{ text: "The incumbent agency is participating in the review." }, { text: "The buyer wants to reach 22–35 year olds." }],
  NumberedItem: [
    { number: 1, text: "Brand strategy and positioning research." },
    { number: 2, text: "Visual identity refresh and brand guidelines." },
    { number: 3, text: "Campaign creative concept, with three initial directions." },
  ],
  Tag: [{ label: "WHERE", value: "Wisconsin-based" }, { label: "WHO", value: "14 stores" }, { label: null, value: "Grow loyalty to 120,000 members" }],
  Citation: [{ text: "Retail and commerce proof", source: "brain" }, { text: "Relevant experience weighs 20%", source: "rfp_overview.decision" }],
  PositionTab: [
    { label: "PROBLEM FRAMING", title: "Verify first", recommended: true },
    { label: "BUYER MOTIVATION", title: "Work the mask" },
    { label: "PROOF STRATEGY", title: "Prove the transfer" },
  ],
  KeyDate: [
    { date: "November 20, 2026", label: "Proposal due", current: true },
    { date: "December 15, 2026", label: "Agency selection" },
    { date: "February 1, 2027", label: "Brand research complete" },
  ],
  Requirement: [
    { code: "R1", text: "Submit the proposal by November 20, 2026.", kind: "disqualifier", status: "to-confirm" },
    { code: "R2", text: "Agency overview and relevant category experience.", kind: "process-gate", status: "met" },
  ],
  FitRow: [
    { label: "Strategic", verdict: "aligned", text: "Retail identity and younger-audience campaign work." },
    { label: "Team", verdict: "partial", text: "Availability for this pursuit is not confirmed." },
    { label: null, verdict: "gap", text: "No completed in-store signage work." },
  ],
  ColumnLabels: [{ labels: ["WHAT WE FOUND", "IN THEIR WORDS", "WHAT IT RESTS ON"] }],
  Evidence: [{ finding: "The company could not be independently verified.", quote: "No public record was found.", kind: "fact", source: "research_base.gaps" }],
  Finding: [{ text: "No public incumbent or prior agency trail was found.", source: "research_base.gaps" }],
};

export const sampleProps = (type: string, n = 0): Record<string, unknown> => {
  const variants = SAMPLES[type] ?? [{}];
  return variants[n % variants.length];
};

const REPEATING = new Set(["columns", "grid", "rows", "wrap", "tabs"]);

/** Which pieces fill a slot in the sample: repeating slots up to 3, others one of each allowed type. */
function slotTypes(rule: SlotRule): string[] {
  if (rule.style === "tab") return [rule.allow[0]];
  const count = REPEATING.has(rule.style) ? Math.min(rule.max, 3) : rule.allow.length === 1 ? 1 : Math.min(rule.max, rule.allow.length, 3);
  return Array.from({ length: Math.max(count, rule.min) }, (_, i) => rule.allow[i % rule.allow.length]);
}

/** A spec whose root is one sample of `type` (an atom, or a composite filled with samples). */
export function sampleSpec(type: string, composites: CompositeDef[]): Spec {
  const elements: Spec["elements"] = {};
  const seen: Record<string, number> = {};
  const build = (t: string, depth: number): string | null => {
    const n = (seen[t] = (seen[t] ?? -1) + 1);
    const key = `${t.toLowerCase()}-${n}`;
    const def = composites.find((c) => c.type === t);
    if (!def) {
      elements[key] = { type: t, props: sampleProps(t, n), children: [] };
      return key;
    }
    if (depth > 2) return null;
    const slots = Object.fromEntries(
      Object.entries(def.slots).map(([slot, rule]) => [slot, slotTypes(rule).flatMap((st) => build(st, depth + 1) ?? [])]),
    );
    elements[key] = { type: t, props: { layout: Object.keys(def.layouts)[0] }, children: [], slots };
    return key;
  };
  return { root: build(type, 0) ?? "", elements };
}
