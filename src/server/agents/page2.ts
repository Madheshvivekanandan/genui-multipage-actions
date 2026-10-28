/**
 * BACKEND · server/agents/page2.ts — agent 2: builds the Prospect Intelligence page.
 *
 * Reads the research base (Part 3) and forms one leading hypothesis about the buyer.
 */
import "server-only";

import { documentBlock, pageBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page2Agent: PageAgent = {
  id: "page2",
  system: "You are the Prospect Intelligence agent. You build a page with the strongest hypothesis about the buyer behind an RFP, from a fixed component library.",
  rules: [
    "Ground every claim in Part 3 and cite its source id (research_base.gaps or research_base.signals).",
    "Start with a ScreenHeader: header = Eyebrow 'PROSPECT INTELLIGENCE · <CLIENT IN CAPS>' and a Headline stating the likeliest underlying issue. No points or stats.",
    "Then four Sections in this order, each with a tab Eyebrow and a one-sentence Headline:",
    "1. THE COMPANY IN BRIEF: Headline 'What public research found', then 3-4 Body paragraphs: the strongest fact, why it matters, the possible explanations.",
    "2. OUR HYPOTHESIS: Headline = the hypothesis. Content: Rows (label 'WHAT SUPPORTS IT') with ColumnLabels then 3 Evidence rows; Groups labelled 'WHAT THIS ADDS TO THEIR ASK' (Body), 'WHAT ARGUES AGAINST IT' (Body), 'WHAT HAS TO BE TRUE' (3 NumberedItems), 'HOW TO CONFIRM IT' (Body).",
    "3. ALSO WEIGHED: Headline 'N hypotheses weighed and demoted', then Columns of 2 Groups, each: label (e.g. 'BUYER REALITY'), a Headline with the alternative, a Body on when it would be the better read.",
    "4. OTHER FINDINGS WORTH A LOOK: Headline 'Findings that don't drive the hypothesis, but may be useful.', then Rows of Findings.",
  ],
  prompt: ({ document, previous }) =>
    [documentBlock(document), pageBlock("RFP Overview", previous[0]), "Build the Prospect Intelligence page from Part 3 of this document."]
      .filter(Boolean)
      .join("\n\n"),
};
