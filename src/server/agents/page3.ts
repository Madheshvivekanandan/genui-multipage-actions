/**
 * BACKEND · server/agents/page3.ts — agent 3: builds the Suggested POV page.
 *
 * Three positions on the leading hypothesis from the Prospect Intelligence
 * page; the real layout rules come with the atoms and composites.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page3Agent: PageAgent = {
  id: "page3",
  system: "You are the Suggested POV agent. You build a page of three strategic positions for answering an RFP, from a fixed component library.",
  rules: ["Build on the leading hypothesis of the Prospect Intelligence page. Offer exactly three positions and recommend one."],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), pageBlock("Prospect Intelligence", previous[1]), "Build the Suggested POV page."]
      .filter(Boolean)
      .join("\n\n"),
};
