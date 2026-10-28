/**
 * FRONTEND · components/notes/NoteTarget.tsx — makes a piece with a note clickable.
 *
 * Click (or Enter) highlights the piece and opens its popup beside the page.
 * The status dot is absolutely positioned with no top/left, so it sits at the
 * piece's height but against the card's right edge (the nearest positioned box).
 */
"use client";

import { useContext, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { Note, NoteKind } from "@/lib/note";
import { NotePageContext, useNotes, type NoteStatus } from "./state";

export const DOT: Record<NoteStatus, string> = { new: "bg-[#e0559b]", opened: "bg-[#9aa3ad]", answered: "bg-[#3d9b6c]" };

export function NoteTarget({ note, kind, children }: { note: Note; kind: NoteKind; children: ReactNode }) {
  const notes = useNotes();
  const page = useContext(NotePageContext);
  if (!note || !notes) return children;

  const id = `${page}/${note.title}|${note.text}`; // title and text: a page has many notes, titles may repeat
  const active = notes.open?.id === id;
  const toggle = (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    e.stopPropagation(); // a noted piece inside another one opens only its own note
    if (active) return notes.close();
    const el = e.currentTarget.getBoundingClientRect();
    const root = e.currentTarget.closest("[data-note-root]")?.getBoundingClientRect();
    notes.show(id, note, kind, el.top + el.height / 2 - (root?.top ?? 0));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={`${note.title} (note)`}
      onClick={toggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(e))}
      className={`cursor-pointer rounded-md transition outline-none focus-visible:ring-2 focus-visible:ring-[#3d9b6c] ${active ? "bg-[#d5ebe3] shadow-[0_0_0_6px_#d5ebe3]" : "hover:bg-black/[0.04] hover:shadow-[0_0_0_6px_rgba(0,0,0,0.04)]"}`}
    >
      <span aria-hidden className={`absolute right-3 mt-[0.55em] size-2 rounded-full ${DOT[notes.status(id)]}`} />
      {children}
    </div>
  );
}
