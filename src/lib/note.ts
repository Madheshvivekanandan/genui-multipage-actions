/**
 * SHARED · lib/note.ts — the optional `note` every atom and composite may carry.
 *
 * The AI's reasoning for one piece. A piece with a note becomes clickable and
 * opens a popup with it (static: no AI call on click).
 */
import { z } from "zod";

export const NOTE = z
  .object({ title: z.string(), text: z.string() })
  .optional()
  .describe("Optional popup explaining your reasoning for this piece. Only where it helps the reader.");

export type Note = z.infer<typeof NOTE>;
