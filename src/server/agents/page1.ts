/**
 * BACKEND · server/agents/page1.ts — agent 1: reads the RFP and builds the RFP Overview page.
 *
 * Placeholder instructions: the real ones come with the atoms and composites.
 */
import "server-only";

import { documentBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page1Agent: PageAgent = {
  id: "page1",
  system: "You are the RFP Overview agent. You read an RFP document and build an overview page of it from a fixed component library.",
  rules: [],
  prompt: ({ document }) => [documentBlock(document), "Build the RFP Overview page for this document."].join("\n\n"),
};
