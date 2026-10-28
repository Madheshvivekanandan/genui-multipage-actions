/**
 * SHARED · lib/atoms/text.ts — the text atoms: what the AI may write and how to use each.
 */
import { z } from "zod";
import { NOTE } from "../note";

const text = (description: string) => ({ props: z.object({ text: z.string(), note: NOTE }), description: `${description} Atom, no children.` });

export const TEXT_ATOMS = {
  Eyebrow: text("Short uppercase label: a section name ('WHO THEY ARE'), a group label ('KEY DATES') or a stat label ('BUDGET')."),
  Headline: text("One sentence that states the takeaway. Big in a ScreenHeader, smaller in a Section, Group or Position."),
  Body: text("A sentence or short paragraph."),
  Quote: text("Italic wording taken from a source, e.g. the RFP's own words."),
  BigValue: text("A large figure or statement, e.g. a stat value ('$750,000') or a headline number."),
  Caption: text("A short muted note under a value, or a footnote."),
  Bullet: text("One point of a bulleted list."),
  NumberedItem: {
    props: z.object({ number: z.number().int().min(1), text: z.string(), note: NOTE }),
    description: "One item of a numbered list, e.g. a scope item. Atom, no children.",
  },
};
