/**
 * SHARED · lib/pages.ts — the three pages of the flow, and what each agent receives.
 *
 * Page 1 is built from the document; the button under it builds page 2, whose
 * button builds page 3. Each page is ONE separate AI call to its own agent
 * (server/agents/page1.ts …), and each returns a complete json-render spec.
 */
import type { Spec } from "@json-render/core";
import { z } from "zod";

export const PAGE_IDS = ["page1", "page2", "page3"] as const;
export type PageId = (typeof PAGE_IDS)[number];

// Names from the design screenshots.
export const PAGES: Record<PageId, { title: string }> = {
  page1: { title: "RFP Overview" },
  page2: { title: "Prospect Intelligence" },
  page3: { title: "Suggested POV" },
};

export const isPageId = (value: string): value is PageId => (PAGE_IDS as readonly string[]).includes(value);

/** The page before / after this one (null at either end). */
export const pageAt = (page: PageId, step: -1 | 1): PageId | null => PAGE_IDS[PAGE_IDS.indexOf(page) + step] ?? null;

/** The document the flow starts from (server/documents.ts). */
export type SourceDocument = { name: string; text: string };

const specShape = z.object({ root: z.string(), elements: z.record(z.string(), z.unknown()) }).loose();

/**
 * What the browser sends to an agent: the document plus the earlier pages'
 * JSON (page 3 builds on page 2's hypothesis). Each agent's prompt() picks what it uses.
 */
export const pageInputSchema = z.object({
  document: z.string().trim().min(1, "the document is empty").max(200_000, "the document is too long"),
  previous: z.array(specShape).max(PAGE_IDS.length - 1),
});
export type PageInput = { document: string; previous: Spec[] };
