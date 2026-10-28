/**
 * SHARED · lib/pages.ts — the three pages of the flow, and what each agent receives.
 *
 * Page 1 is built from the document; its bottom control leads to page 2, which
 * leads to page 3. Each page is ONE separate AI call to its own agent
 * (server/agents/page1.ts …), and each returns a complete json-render spec.
 */
import type { Spec } from "@json-render/core";
import { z } from "zod";

export const PAGE_IDS = ["page1", "page2", "page3"] as const;
export type PageId = (typeof PAGE_IDS)[number];

// Names from the design screenshots. Page 3 (Suggested POVs) has no screenshot yet.
export const PAGES: Record<PageId, { title: string; next: PageId | null }> = {
  page1: { title: "RFP Overview", next: "page2" },
  page2: { title: "Prospect Intelligence", next: "page3" },
  page3: { title: "Suggested POVs", next: null },
};

export const isPageId = (value: string): value is PageId => (PAGE_IDS as readonly string[]).includes(value);

const specShape = z.object({ root: z.string(), elements: z.record(z.string(), z.unknown()) }).loose();

/**
 * What the browser sends to an agent. TBD with the user: does an agent get
 * only the document, or the document plus the earlier pages' JSON?
 * For now both are sent and each agent's prompt() decides what to use.
 */
export const pageInputSchema = z.object({
  document: z.string().trim().min(1, "the document is empty").max(200_000, "the document is too long"),
  previous: z.array(specShape).max(PAGE_IDS.length - 1),
});
export type PageInput = { document: string; previous: Spec[] };
