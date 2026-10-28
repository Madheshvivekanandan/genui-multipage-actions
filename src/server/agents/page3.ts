/**
 * BACKEND · server/agents/page3.ts — agent 3: builds the Suggested POVs page.
 *
 * Placeholder instructions: the real ones come with the atoms and composites.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page3Agent: PageAgent = {
  id: "page3",
  system: "You are the Suggested POVs agent. You build a page of strategic points of view for answering an RFP, from a fixed component library.",
  rules: [],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), pageBlock("Prospect Intelligence", previous[1]), "Build the Suggested POVs page."]
      .filter(Boolean)
      .join("\n\n"),
};
