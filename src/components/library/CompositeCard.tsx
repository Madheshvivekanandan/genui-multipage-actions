/**
 * FRONTEND · components/library/CompositeCard.tsx — one molecule (a composite): the atoms and molecules
 * it is built from, and a live sample beside its stored JSON definition.
 */
"use client";

import { Preview } from "@/components/library/Preview";
import { ATOM_TYPES } from "@/lib/atoms";
import { COMPOSITES } from "@/lib/catalog";
import type { CompositeDef } from "@/lib/composites";
import { sampleSpec } from "@/lib/samples";
import { findProblems } from "@/lib/validate";

export function CompositeCard({ def }: { def: CompositeDef }) {
  const spec = sampleSpec(def.type, COMPOSITES);
  // Page-level rules (root must be a Page) don't apply to a lone sample.
  const problems = findProblems(spec).filter((p) => !p.startsWith("Root element"));
  // Everything its slots may hold, in slot order: atoms, and other molecules it can contain.
  const parts = [...new Set(Object.values(def.slots).flatMap((slot) => slot.allow))];
  const builtFrom = [
    { label: "Atoms used", types: parts.filter((t) => ATOM_TYPES.includes(t)) },
    { label: "Molecules inside", types: parts.filter((t) => !ATOM_TYPES.includes(t)) },
  ].filter((row) => row.types.length > 0);
  return (
    <article id={def.type} className="flex scroll-mt-6 flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="mr-auto font-mono text-[15px] text-[var(--ink)]">{def.type}</h3>
        {[`${def.frame} frame`, `${Object.keys(def.slots).length} slots`, `${def.noteKind ?? "question"} popup`].map((t) => (
          <span key={t} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] tracking-[0.1em] text-[var(--muted)] uppercase">
            {t}
          </span>
        ))}
      </header>
      <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{def.description}</p>
      <dl className="flex flex-col gap-2">
        {builtFrom.map((row) => (
          <div key={row.label} className="flex flex-wrap items-center gap-1.5">
            <dt className="mr-1 w-[120px] text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">{row.label}</dt>
            {row.types.map((t) => (
              <dd key={t}>
                <a href={`#${t}`} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[11.5px] text-[var(--ink)] hover:bg-white/15">
                  {t}
                </a>
              </dd>
            ))}
          </div>
        ))}
      </dl>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="min-w-0">
          <Preview spec={spec} card={def.frame === "plain"} />
          {problems.length > 0 && <p className="mt-2 text-[11px] text-amber-300">⚠ sample: {problems.join(" · ")}</p>}
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">Stored in data/composites.json</p>
          <pre className="max-h-[460px] overflow-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-[#c3ced8]">{JSON.stringify(def, null, 2)}</pre>
        </div>
      </div>
    </article>
  );
}
