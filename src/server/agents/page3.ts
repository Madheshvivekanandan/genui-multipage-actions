/**
 * BACKEND · server/agents/page3.ts — agent 3: builds the Suggested POV page.
 *
 * Three positions on the leading hypothesis from the Prospect Intelligence page.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page3Agent: PageAgent = {
  id: "page3",
  system: "You are the Suggested POV agent. You build a page of three strategic positions for answering an RFP, from a fixed component library.",
  rules: [
    "Build on the leading hypothesis of the Prospect Intelligence page.",
    "Start with a ScreenHeader: header = Eyebrow 'SUGGESTED POV · <CLIENT IN CAPS>' and a Headline saying the brief builds on the position the reader chooses. No points or stats.",
    "Then four Sections in this order, each with a tab Eyebrow and a one-sentence Headline:",
    "1. WHAT THEY ASKED FOR: Headline 'N parts to the work', then a Group of NumberedItems (the scope).",
    "2. THE HYPOTHESIS THIS IS BUILT ON: Headline = the hypothesis, then a Quote of it and a Body saying each position stays contingent on it.",
    "3. THE POSITIONS: Headline on what separates the positions, then Positions with exactly 3 Position. Tabs: labels PROBLEM FRAMING, BUYER MOTIVATION, PROOF STRATEGY, a 2-4 word title, recommended: true on one.",
    "Each Position body: a Headline stating the position, 2 Bodies, a Quote 'Builds on the hypothesis: …', Groups labelled 'THE INSIGHT', 'ASKS THE BUYER TO RECONSIDER', 'WHY IT IS RECOMMENDED' or 'WHY NOT FIRST' (a Body each), 'WHAT COULD BE WRONG' and 'WHAT HAS TO BE TRUE' (3 Bullets each), then Chips (label 'WHAT IT RESTS ON') of Citations with source ids (rfp_overview.fit, brain, research_base.gaps …).",
    "4. GAPS: Headline 'What we couldn't confirm', then a Group of Bullets: the gaps from our Brain and the research.",
  ],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), pageBlock("Prospect Intelligence", previous[1]), "Build the Suggested POV page."]
      .filter(Boolean)
      .join("\n\n"),
};
