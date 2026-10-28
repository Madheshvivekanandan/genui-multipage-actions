/**
 * FRONTEND · components/atoms/chips.tsx — chip atoms: tags, citations, and a Position's tab.
 */
"use client";

import { useContext, useEffect } from "react";
import { Badge } from "@/components/atoms/Badge";
import { TabContext } from "@/components/frames/context";

export function Tag({ label, value }: { label: string | null; value: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[var(--chip-line)] bg-[var(--chip)] px-2 py-1">
      {label && <span className="text-[9px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">{label}</span>}
      <span className="text-[12px] text-[var(--ink)]">{value}</span>
    </span>
  );
}

export function Citation({ text, source }: { text: string; source: string }) {
  return (
    <span className="inline-flex w-fit items-baseline gap-1.5 rounded-md border border-[#cfe3d7] bg-[#e5f1ea] px-2 py-1">
      <span className="text-[11.5px] text-[var(--ink-2)]">{text}</span>
      <span className="font-mono text-[9.5px] text-[#2f7a52]">{source}</span>
    </span>
  );
}

/** Drawn inside the tab strip of a Positions composite; the recommended one opens first. */
export function PositionTab({ label, title, recommended }: { label: string; title: string; recommended?: boolean }) {
  const tab = useContext(TabContext);
  const { index, prefer } = tab ?? {};
  useEffect(() => {
    if (recommended && prefer && index !== undefined) prefer(index);
  }, [recommended, prefer, index]);

  return (
    <span className="flex flex-col gap-1">
      <span className="flex items-center justify-between gap-2">
        <span className={`text-[9.5px] font-semibold tracking-[0.12em] uppercase ${tab?.active ? "text-[#d6457f]" : "text-[var(--muted)]"}`}>
          {label}
        </span>
        {recommended && <Badge text="Rec" tone="positive" />}
      </span>
      <span className="text-[13.5px] text-[var(--ink)]">{title}</span>
    </span>
  );
}
