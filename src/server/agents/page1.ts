/**
 * BACKEND · server/agents/page1.ts — agent 1: reads the RFP brief and builds the RFP Overview page.
 *
 * The page's sections follow the document's Part 1 headings; the real layout
 * rules come with the atoms and composites.
 */
import "server-only";

import { documentBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page1Agent: PageAgent = {
  id: "page1",
  system: "You are the RFP Overview agent. You read an RFP brief and build an overview page of it from a fixed component library.",
  rules: ["Build one section per heading of Part 1, in the same order. Use Part 2 for what our Brain supports and for the fit."],
  prompt: ({ document }) => [documentBlock(document), "Build the RFP Overview page from Parts 1 and 2 of this document."].join("\n\n"),
};
