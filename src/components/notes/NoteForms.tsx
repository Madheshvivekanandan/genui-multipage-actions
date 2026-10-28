/**
 * FRONTEND · components/notes/NoteForms.tsx — the bottom half of a note popup.
 *
 *   QuestionForm : "Comments or questions" — a text box and Send
 *   FeedbackForm : "Feedback" — agree or disagree, an optional comment, and Send
 *
 * Which one a piece gets is decided by its component (lib/atoms, data/composites.json).
 * Sent text stays in the browser for now; what Send should do is not decided yet.
 */
"use client";

import { useState } from "react";

const LABEL = "text-[10.5px] font-semibold tracking-[0.14em] text-[#9fb0bd] uppercase";
const BOX = "resize-y rounded-xl border border-white/15 bg-transparent p-3 text-[13.5px] outline-none placeholder:text-white/35 focus:border-[#2a9d84]";
const SEND = "self-end rounded-full bg-[#1f7a6c] px-6 py-2.5 text-[13.5px] font-medium text-white transition hover:bg-[#238a7a] disabled:opacity-50";

type FormProps = { sent: string[]; onSend: (text: string) => void };

function Sent({ items }: { items: string[] }) {
  return items.map((c, i) => (
    <span key={i} className="rounded-lg bg-[#2a9d84]/15 px-3 py-2 text-[13px] text-[#c3ced8]">
      {c}
    </span>
  ));
}

export function QuestionForm({ sent, onSend }: FormProps) {
  const [draft, setDraft] = useState("");
  return (
    <>
      <label className="flex flex-col gap-2.5">
        <span className={LABEL}>Comments or questions</span>
        <Sent items={sent} />
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Ask about this read, or add context the brain should know." className={BOX} />
      </label>
      <button onClick={() => (onSend(draft.trim()), setDraft(""))} disabled={!draft.trim()} className={SEND}>
        Send
      </button>
    </>
  );
}

const CHOICES = [
  { id: "agree", label: "Agree", mark: "✓" },
  { id: "disagree", label: "Disagree", mark: "✕" },
] as const;

export function FeedbackForm({ sent, onSend }: FormProps) {
  const [choice, setChoice] = useState<(typeof CHOICES)[number] | null>(null);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!choice) return;
    onSend(draft.trim() ? `${choice.label}: ${draft.trim()}` : choice.label);
    setChoice(null);
    setDraft("");
  };
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <span className={LABEL}>Feedback · is this read right?</span>
        <Sent items={sent} />
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Feedback">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              role="radio"
              aria-checked={choice?.id === c.id}
              onClick={() => setChoice(c)}
              className={`rounded-xl border px-3 py-2 text-[13px] transition ${choice?.id === c.id ? "border-[#2a9d84] bg-[#2a9d84]/20 text-white" : "border-white/15 text-[#c3ced8] hover:bg-white/5"}`}
            >
              {c.mark} {c.label}
            </button>
          ))}
        </div>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="What should change? (optional)" aria-label="Feedback comment" className={BOX} />
      </div>
      <button onClick={send} disabled={!choice} className={SEND}>
        Send
      </button>
    </>
  );
}
