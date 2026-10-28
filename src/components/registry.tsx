/**
 * FRONTEND · components/registry.tsx — HOW each catalog item looks on screen.
 *
 * One entry per catalog component: "Page" -> this JSX, each atom -> its JSX.
 * `props` = the values the AI wrote. `children` = the child elements, already
 * rendered by json-render. Composites have no entry of their own: each gets a
 * <CompositeFrame> drawn from its definition in data/composites.json.
 * Any atom or composite with a `note` is wrapped in a <NoteTarget> (click to open it).
 */
import { defineRegistry, type Components } from "@json-render/react";
import type { ComponentType, ReactNode } from "react";
import { Citation, PositionTab, Tag } from "@/components/atoms/chips";
import { Bullet, KeyDate, NumberedItem } from "@/components/atoms/lists";
import { PageShell } from "@/components/atoms/PageShell";
import { ColumnLabels, Evidence, Finding, FitRow, Requirement } from "@/components/atoms/rows";
import { BigValue, Body, Caption, Eyebrow, Headline, Quote } from "@/components/atoms/text";
import { CompositeFrame } from "@/components/frames/CompositeFrame";
import { NoteTarget } from "@/components/notes/NoteTarget";
import { ATOM_NOTE_KIND, type AtomType } from "@/lib/atoms";
import { baseCatalog, catalog, COMPOSITES } from "@/lib/catalog";
import type { CompositeDef } from "@/lib/composites";
import type { Note } from "@/lib/note";

/** An atom whose `note`, if the AI wrote one, makes it clickable; its type decides the popup. */
function noted<P extends object>(type: AtomType, Atom: ComponentType<P>) {
  return function Noted({ props }: { props: P & { note?: Note } }) {
    return (
      <NoteTarget note={props.note} kind={ATOM_NOTE_KIND[type]}>
        <Atom {...props} />
      </NoteTarget>
    );
  };
}

const components: Components<typeof baseCatalog> = {
  Page: ({ props, children }) => <PageShell title={props.title}>{children}</PageShell>,
  Eyebrow: noted("Eyebrow", Eyebrow),
  Headline: noted("Headline", Headline),
  Body: noted("Body", Body),
  Quote: noted("Quote", Quote),
  BigValue: noted("BigValue", BigValue),
  Caption: noted("Caption", Caption),
  Bullet: noted("Bullet", Bullet),
  NumberedItem: noted("NumberedItem", NumberedItem),
  Tag: noted("Tag", Tag),
  Citation: noted("Citation", Citation),
  PositionTab: ({ props }) => <PositionTab {...props} />, // drawn inside a tab button: not clickable on its own
  KeyDate: noted("KeyDate", KeyDate),
  Requirement: noted("Requirement", Requirement),
  FitRow: noted("FitRow", FitRow),
  ColumnLabels: noted("ColumnLabels", ColumnLabels),
  Evidence: noted("Evidence", Evidence),
  Finding: noted("Finding", Finding),
};

function frameFor(def: CompositeDef) {
  return function Frame({ props, slots }: { props: { layout: string; note?: Note }; slots?: Record<string, ReactNode> }) {
    return (
      <NoteTarget note={props.note} kind={def.noteKind ?? "question"}>
        <CompositeFrame def={def} layout={props.layout} slots={slots} />
      </NoteTarget>
    );
  };
}

const frames = Object.fromEntries(COMPOSITES.map((def) => [def.type, frameFor(def)]));

// Composites come from JSON, so TypeScript can't check `frames` against the catalog.
export const registry = defineRegistry(catalog, { components: { ...components, ...frames } } as never).registry;
