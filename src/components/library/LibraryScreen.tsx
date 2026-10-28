/**
 * FRONTEND · components/library/LibraryScreen.tsx — the /components page: every atom and every molecule.
 *
 * The page calls composites "molecules" (atomic design: molecules are made of atoms).
 * Read-only: atoms are React code, molecules are edited in data/composites.json.
 */
"use client";

import Link from "next/link";
import { AtomCard } from "@/components/library/AtomCard";
import { CompositeCard } from "@/components/library/CompositeCard";
import { Masonry } from "@/components/library/Masonry";
import { ATOM_TYPES, type AtomType } from "@/lib/atoms";
import { COMPOSITES } from "@/lib/catalog";

const H2 = "text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase";

export function LibraryScreen() {
  return (
    <main className="mx-auto flex w-full max-w-[1220px] flex-col gap-8 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-light text-[var(--ink)]">Component library</h1>
          <p className="text-[13px] text-[var(--muted)]">
            {ATOM_TYPES.length} atoms (React code) · {COMPOSITES.length} molecules made of atoms (data/composites.json). Every piece can carry a note that opens a popup.
          </p>
        </div>
        <Link href="/" className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] text-[var(--ink)] hover:bg-white/10">
          ← Back to the app
        </Link>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>Atoms</h2>
        {/* Masonry, not grid rows: no gaps, and opening one card's JSON pushes down only its own column. */}
        <Masonry keys={ATOM_TYPES} render={(type) => <AtomCard type={type as AtomType} />} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>Molecules</h2>
        {COMPOSITES.map((def) => (
          <CompositeCard key={def.type} def={def} />
        ))}
      </section>
    </main>
  );
}
