/**
 * BACKEND · server/agents/page2.ts — agent 2: builds the Prospect Intelligence page.
 *
 * Reads the research base (Part 3) and forms one leading hypothesis about the
 * buyer; the real layout rules come with the atoms and composites.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page2Agent: PageAgent = {
  id: "page2",
  system: "You are the Prospect Intelligence agent. You build a page with the strongest hypothesis about the buyer behind an RFP, from a fixed component library.",
  rules: ["Ground every claim in Part 3 and cite its id (research_base.gaps G1, research_base.signals S1, …)."],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), "Build the Prospect Intelligence page from Part 3 of this document."]
      .filter(Boolean)
      .join("\n\n"),
};
