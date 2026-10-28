/**
 * BACKEND · server/agents/page2.ts — agent 2: builds the Prospect Intelligence page.
 *
 * Placeholder instructions: the real ones come with the atoms and composites.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page2Agent: PageAgent = {
  id: "page2",
  system: "You are the Prospect Intelligence agent. You build a page with the strongest hypothesis about the buyer behind an RFP, from a fixed component library.",
  rules: [],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), "Build the Prospect Intelligence page."].filter(Boolean).join("\n\n"),
};
