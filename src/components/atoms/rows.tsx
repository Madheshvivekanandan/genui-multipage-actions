/**
 * FRONTEND · components/atoms/rows.tsx — row atoms: requirements, fit rows, evidence, findings.
 *
 * A Rows composite draws them one under another with a line between.
 */
import { Badge, type Tone } from "@/components/atoms/Badge";

export function Requirement({ code, text, kind, status }: { code: string; text: string; kind: "disqualifier" | "process-gate"; status: "met" | "to-confirm" }) {
  const met = status === "met";
  return (
    <div className="flex items-center gap-3">
      <span
        aria-label={met ? "Met" : "To confirm"}
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${met ? "bg-[#dcefe4] text-[#2f7a52]" : "bg-[#f1e6cf] text-[#8a6326]"}`}
      >
        {met ? "✓" : "?"}
      </span>
      <p className="flex-1 text-[13px] text-[var(--ink)]">{text}</p>
      <p className="shrink-0 text-[9.5px] tracking-[0.12em] text-[var(--muted)] uppercase">
        {code} · <span className={kind === "disqualifier" ? "font-bold text-[#c2185b]" : ""}>{kind === "disqualifier" ? "Disqualifier" : "Process gate"}</span>
      </p>
    </div>
  );
}

const VERDICT: Record<"aligned" | "partial" | "gap", Tone> = { aligned: "positive", partial: "caution", gap: "signal" };

export function FitRow({ label, verdict, text }: { label: string | null; verdict: "aligned" | "partial" | "gap"; text: string }) {
  return (
    <div className={`grid items-start gap-3 ${label ? "grid-cols-[minmax(0,8rem)_4.5rem_minmax(0,1fr)]" : "grid-cols-[3rem_minmax(0,1fr)]"}`}>
      {label && <p className="text-[13px] font-semibold text-[var(--ink)]">{label}</p>}
      <Badge text={verdict} tone={VERDICT[verdict]} />
      <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{text}</p>
    </div>
  );
}

// Column headings and evidence rows share one grid, so the columns line up.
const EVIDENCE_GRID = "grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] gap-4";

export function ColumnLabels({ labels }: { labels: string[] }) {
  return (
    <div className={EVIDENCE_GRID}>
      {labels.map((l) => (
        <p key={l} className="text-[9.5px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
          {l}
        </p>
      ))}
    </div>
  );
}

export function Evidence({ finding, quote, kind, source }: { finding: string; quote: string; kind: "fact" | "signal"; source: string }) {
  return (
    <div className={EVIDENCE_GRID}>
      <p className="text-[13px] font-semibold text-[var(--ink)]">{finding}</p>
      <p className="text-[12.5px] leading-relaxed text-[var(--muted)] italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge text={kind} tone={kind === "fact" ? "positive" : "signal"} />
        <span className="font-mono text-[9.5px] text-[var(--muted)]">{source}</span>
      </div>
    </div>
  );
}

export function Finding({ text, source }: { text: string; source: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{text}</p>
      <p className="shrink-0 pt-0.5 text-right font-mono text-[9.5px] text-[var(--muted)]">{source}</p>
    </div>
  );
}
