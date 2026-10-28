/**
 * BACKEND · server/agents/page1.ts — agent 1: reads the RFP brief and builds the RFP Overview page.
 */
import "server-only";

import { documentBlock } from "./prompt";
import type { PageAgent } from "./types";

export const page1Agent: PageAgent = {
  id: "page1",
  system: "You are the RFP Overview agent. You read an RFP brief and build an overview page of it from a fixed component library.",
  rules: [
    "Start with a ScreenHeader: header = Eyebrow 'RFP OVERVIEW · <CLIENT IN CAPS>', a Headline saying what the buyer seeks, a Body listing the work in one sentence; points = 3 Bullets with the most decision-relevant facts; stats = 4 Stats (layout label-first): RESPOND BY, BUDGET (caption with the split), ENGAGEMENT, REQUIREMENTS (value 'N to confirm', caption 'of M').",
    "Then six Sections in this order, each with a tab Eyebrow, a one-sentence Headline stating the takeaway and a one-sentence lead Body:",
    "1. WHO THEY ARE: Chips of Tags labelled WHERE, TYPE, WHO, CONTACT.",
    "2. THEIR STATED GOAL: a Group (label 'FROM THE RFP') with a Quote of their goal, then Chips (label 'STATED OUTCOMES') of Tags with label null.",
    "3. WHAT THEY'RE ASKING FOR: a Group of NumberedItems (the scope), then a Timeline (label 'KEY DATES') with current: true on the first date.",
    "4. THE STATED REQUIREMENTS: Rows of Requirements (met if Part 2 says supported or confirmed, else to-confirm) with a Caption footnote.",
    "5. MONEY & DECISION: a Group with a BigValue (the budget sentence) and a Caption (the split), a Group (label 'HOW THEY WILL EVALUATE') with a Quote of the criteria and weights, and a Body on who decides.",
    "6. IS IT A FIT?: Rows of FitRows, one per fit dimension in Part 2, then Rows of FitRows with verdict 'gap' and label null, one per gap.",
  ],
  prompt: ({ document }) => [documentBlock(document), "Build the RFP Overview page from Parts 1 and 2 of this document."].join("\n\n"),
};
