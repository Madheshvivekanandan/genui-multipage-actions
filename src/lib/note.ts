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
  .describe("A popup with your reasoning for this piece: a short title and one or two sentences.");

export type Note = z.infer<typeof NOTE>;

/**
 * Which popup a note opens. Decided by the component, never by the AI:
 * feedback (agree / disagree) on pieces that make a judgment, questions on the rest.
 */
export const NOTE_KINDS = ["question", "feedback"] as const;
export type NoteKind = (typeof NOTE_KINDS)[number];
