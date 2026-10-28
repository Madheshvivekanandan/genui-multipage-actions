/**
 * BACKEND · server/documents.ts — the document page 1 shows and the agents read.
 *
 * A sample RFP brief written from the design screenshots (data/documents/).
 * Read synchronously so the home page can still be prerendered.
 */
import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import type { SourceDocument } from "@/lib/pages";

const NAME = "pinecrest-rfp.md";

export function loadSampleDocument(): SourceDocument {
  return { name: NAME, text: readFileSync(path.join(process.cwd(), "data", "documents", NAME), "utf8") };
}
