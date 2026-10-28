/**
 * FRONTEND · components/atoms/lists.tsx — list items: bullets, numbered items, timeline dates.
 */
export function Bullet({ text }: { text: string }) {
  return (
    <p className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--ink-2)]">
      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-[#3d9b6c]" />
      {text}
    </p>
  );
}

export function NumberedItem({ number, text }: { number: number; text: string }) {
  return (
    <p className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--ink)]">
      <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[10px] font-semibold text-[var(--muted)]">
        {number}
      </span>
      {text}
    </p>
  );
}

export function KeyDate({ date, label, current }: { date: string; label: string; current?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 border-t-2 pt-2 ${current ? "border-[#3d9b6c]" : "border-[var(--line)]"}`}>
      <p className={`text-[9.5px] font-semibold tracking-[0.12em] uppercase ${current ? "text-[#2f7a52]" : "text-[var(--muted)]"}`}>{date}</p>
      <p className="text-[12.5px] text-[var(--ink)]">{label}</p>
    </div>
  );
}
