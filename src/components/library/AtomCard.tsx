/**
 * FRONTEND · components/library/AtomCard.tsx — one atom: what it is for, its props, a live sample and its JSON.
 */
"use client";

import { Preview } from "@/components/library/Preview";
import { ATOM_NOTE_KIND, ATOMS, type AtomType } from "@/lib/atoms";
import { describeProps } from "@/lib/describe";
import { sampleSpec } from "@/lib/samples";

export function AtomCard({ type }: { type: AtomType }) {
  const { props, description } = ATOMS[type];
  const spec = sampleSpec(type, []);
  return (
    <article id={type} className="flex scroll-mt-6 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <header className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-[15px] text-[var(--ink)]">{type}</h3>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] tracking-[0.1em] text-[var(--muted)] uppercase">
          {ATOM_NOTE_KIND[type]} popup
        </span>
      </header>
      <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{description.replace(" Atom, no children.", "")}</p>
      <ul className="flex flex-col gap-0.5 font-mono text-[11.5px] text-[var(--muted)]">
        {describeProps(props).map((p) => (
          <li key={p.name}>
            <span className="text-[var(--ink)]">{p.name}{p.optional ? "?" : ""}</span>: {p.type}
          </li>
        ))}
      </ul>
      <Preview spec={spec} card />
      <details className="text-[12px] text-[var(--muted)]">
        <summary className="cursor-pointer select-none">JSON the AI writes for it</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] text-[#c3ced8]">{JSON.stringify(spec.elements[spec.root], null, 2)}</pre>
      </details>
    </article>
  );
}
