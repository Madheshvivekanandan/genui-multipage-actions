/**
 * FRONTEND · components/PageStats.tsx — small cards: which model built this page, and what it used.
 */
import type { PageUsage } from "@/lib/usage";

const n = (v: number) => v.toLocaleString("en-US");

export function PageStats({ usage }: { usage: PageUsage }) {
  const cards = [
    { label: "Model", value: usage.model.replace(/^[^/]+\//, ""), note: `${usage.model} · ${usage.effort} reasoning effort` },
    { label: "Tokens", value: `${n(usage.inputTokens + usage.outputTokens)}`, note: `${n(usage.inputTokens)} in · ${n(usage.outputTokens)} out (${n(usage.reasoningTokens)} thinking)` },
    { label: "Cost", value: usage.cost != null ? `$${usage.cost.toFixed(4)}` : "—", note: "as reported by OpenRouter" },
    { label: "Time", value: `${usage.seconds.toFixed(1)} s`, note: usage.firstOutputSeconds != null ? `first output after ${usage.firstOutputSeconds.toFixed(1)} s` : "no output" },
  ];
  return (
    <dl className="flex flex-wrap gap-2">
      {cards.map((c) => (
        <div key={c.label} title={c.note} className="min-w-[88px] rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5">
          <dt className="text-[9px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">{c.label}</dt>
          <dd className="text-[14px] font-medium text-[var(--ink)]">{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}
