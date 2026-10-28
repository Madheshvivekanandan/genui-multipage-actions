/**
 * SHARED · lib/atoms — every atom's props (Zod) and description, for the catalog.
 * The React side of each atom lives in components/atoms/.
 */
import type { NoteKind } from "../note";
import { ITEM_ATOMS } from "./items";
import { TEXT_ATOMS } from "./text";

export const ATOMS = { ...TEXT_ATOMS, ...ITEM_ATOMS };
export const ATOM_TYPES = Object.keys(ATOMS);
export type AtomType = keyof typeof ATOMS;

/** The atoms by kind, e.g. for the two columns of /components. */
export const ATOM_GROUPS: { title: string; types: AtomType[] }[] = [
  { title: "Text", types: Object.keys(TEXT_ATOMS) as AtomType[] },
  { title: "Chips and rows", types: Object.keys(ITEM_ATOMS) as AtomType[] },
];

/** The content pieces the AI should give notes to (labels, tabs and composites get none). */
export const NOTE_TARGETS: AtomType[] = [
  "Headline", "Body", "Quote", "BigValue", "Bullet", "NumberedItem", "Tag", "KeyDate",
  "Requirement", "FitRow", "Evidence", "Finding", "Citation",
];

/** The popup a note on each atom opens (composites set theirs in data/composites.json). */
export const ATOM_NOTE_KIND: Record<AtomType, NoteKind> = {
  Eyebrow: "question",
  Headline: "question",
  Body: "question",
  Quote: "question",
  BigValue: "question",
  Caption: "question",
  Bullet: "question",
  NumberedItem: "question",
  Tag: "question",
  KeyDate: "question",
  ColumnLabels: "question",
  PositionTab: "question",
  Citation: "feedback",
  Requirement: "feedback",
  FitRow: "feedback",
  Evidence: "feedback",
  Finding: "feedback",
};
