/**
 * FRONTEND · components/notes/state.ts — which note is open, and each note's signal status.
 *
 * A note is identified by its page, title and text ("page1/This looks marketing-led|The brief is…").
 * Status: no entry = carries a signal, not yet opened · opened · answered (a comment or feedback was sent).
 * Comments stay in the browser for now: what Send should do is not decided yet.
 */
"use client";

import { createContext, useContext, useState } from "react";
import type { Note, NoteKind } from "@/lib/note";

export type NoteData = NonNullable<Note>;
export type NoteStatus = "new" | "opened" | "answered";
type OpenNote = { id: string; note: NoteData; kind: NoteKind; anchorY: number };

export function useNotesState() {
  const [open, setOpen] = useState<OpenNote | null>(null);
  const [statuses, setStatuses] = useState<Record<string, "opened" | "answered">>({});
  const [comments, setComments] = useState<Record<string, string[]>>({});

  return {
    open,
    status: (id: string): NoteStatus => statuses[id] ?? "new",
    comments: (id: string) => comments[id] ?? [],
    show: (id: string, note: NoteData, kind: NoteKind, anchorY: number) => {
      setOpen({ id, note, kind, anchorY });
      setStatuses((s) => (s[id] ? s : { ...s, [id]: "opened" }));
    },
    close: () => setOpen(null),
    send: (id: string, text: string) => {
      setComments((c) => ({ ...c, [id]: [...(c[id] ?? []), text] }));
      setStatuses((s) => ({ ...s, [id]: "answered" }));
    },
    /** A page was rebuilt: its notes are new. */
    resetPage: (page: string) => {
      const keep = <T,>(record: Record<string, T>) => Object.fromEntries(Object.entries(record).filter(([id]) => !id.startsWith(`${page}/`)));
      setStatuses(keep);
      setComments(keep);
      setOpen((o) => (o?.id.startsWith(`${page}/`) ? null : o));
    },
  };
}

export type Notes = ReturnType<typeof useNotesState>;

export const NotesContext = createContext<Notes | null>(null);
export const useNotes = () => useContext(NotesContext);

/** The page a note belongs to (set by PageView). */
export const NotePageContext = createContext("page");
