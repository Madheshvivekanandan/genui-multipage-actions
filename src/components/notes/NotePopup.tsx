/**
 * FRONTEND · components/notes/NotePopup.tsx — the open note, beside the page (a sheet at the bottom on small screens).
 *
 * Title, the AI's reasoning, then a question or a feedback form (NoteForms.tsx).
 */
"use client";

import { useEffect, type CSSProperties } from "react";
import type { NoteKind } from "@/lib/note";
import { FeedbackForm, QuestionForm } from "./NoteForms";
import { useNotes, type NoteData, type Notes } from "./state";

export function NotePopup({ page }: { page: string }) {
  const notes = useNotes();
  const open = notes?.open;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && notes?.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notes]);
  if (!notes || !open || !open.id.startsWith(`${page}/`)) return null;

  const top = Math.max(0, open.anchorY - 140);
  return (
    <aside
      role="dialog"
      aria-label={open.note.title}
      style={{ "--top": `${top}px`, "--pointer": `${open.anchorY - top}px` } as CSSProperties}
      className="fixed inset-x-4 bottom-4 z-20 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#13222f]/95 p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur lg:absolute lg:inset-x-auto lg:bottom-auto lg:left-[calc(100%+24px)] lg:top-[var(--top)] lg:max-h-none lg:w-[300px] lg:overflow-visible"
    >
      <span aria-hidden className="absolute top-[var(--pointer)] -left-[9px] hidden -translate-y-1/2 border-y-[9px] border-r-[9px] border-y-transparent border-r-[#2a9d84] lg:block" />
      <PopupBody key={open.id} id={open.id} note={open.note} kind={open.kind} notes={notes} />
    </aside>
  );
}

function PopupBody({ id, note, kind, notes }: { id: string; note: NoteData; kind: NoteKind; notes: Notes }) {
  const Form = kind === "feedback" ? FeedbackForm : QuestionForm;
  return (
    <div className="flex flex-col gap-5 text-[#e6edf3]">
      <div className="flex items-start gap-3">
        <h3 className="flex-1 text-[20px] leading-snug font-light">{note.title}</h3>
        <button onClick={notes.close} aria-label="Close" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-sm hover:bg-white/10">
          ×
        </button>
      </div>
      <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13.5px] leading-relaxed text-[#c3ced8]">{note.text}</p>
      <hr className="border-white/10" />
      <Form sent={notes.comments(id)} onSend={(text) => notes.send(id, text)} />
    </div>
  );
}
