/**
 * FRONTEND · components/library/StyleCard.tsx — one slot style: what it does, which molecule slots use it, and a live demo.
 */
"use client";

import { STYLE_DEMOS } from "@/components/library/styleDemos";
import { CARD_TOKENS } from "@/components/frames/tokens";
import { COMPOSITES } from "@/lib/catalog";
import type { SlotRule } from "@/lib/composites";

export function StyleCard({ style }: { style: SlotRule["style"] }) {
  const { about, demo } = STYLE_DEMOS[style];
  const usedBy = COMPOSITES.flatMap((def) => Object.entries(def.slots).filter(([, rule]) => rule.style === style).map(([slot]) => ({ type: def.type, slot })));
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="font-mono text-[15px] text-[var(--ink)]">&quot;{style}&quot;</h3>
      <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{about}</p>
      <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--muted)]">
        <span className="mr-1 text-[10px] font-semibold tracking-[0.14em] uppercase">Used by</span>
        {usedBy.length === 0 && <span>no molecule yet</span>}
        {usedBy.map(({ type, slot }) => (
          <a key={`${type}.${slot}`} href={`#${type}`} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[11.5px] text-[var(--ink)] hover:bg-white/15">
            {type}.{slot}
          </a>
        ))}
      </p>
      {/* The accordion draws its own card; every other demo sits on the light card. */}
      {style === "tab" ? (
        <div className="pt-1">{demo()}</div>
      ) : (
        <div style={CARD_TOKENS} className="rounded-xl bg-[#eff2f5]/[0.97] p-5">
          {demo()}
        </div>
      )}
    </article>
  );
}
