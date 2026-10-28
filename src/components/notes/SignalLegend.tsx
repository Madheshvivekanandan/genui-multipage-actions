/**
 * FRONTEND · components/notes/SignalLegend.tsx — what the dots beside the cards mean.
 */
import { DOT } from "./NoteTarget";

const ITEMS = [
  { status: "new", label: "Carries a signal, not yet answered" },
  { status: "opened", label: "Opened, not answered" },
  { status: "answered", label: "Answered" },
] as const;

export function SignalLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[var(--muted)]">
      {ITEMS.map(({ status, label }) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-1.5 rounded-full ${DOT[status]}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
