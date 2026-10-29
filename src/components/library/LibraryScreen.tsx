/**
 * FRONTEND · components/library/LibraryScreen.tsx — the /components page: every atom and every molecule.
 *
 * The page calls composites "molecules" (atomic design: molecules are made of atoms).
 * Read-only: atoms are React code, molecules are edited in data/composites.json.
 * At the bottom: the slot styles a molecule's slots can use, each with a live demo.
 */
"use client";

import Link from "next/link";
import { AtomCard } from "@/components/library/AtomCard";
import { CompositeCard } from "@/components/library/CompositeCard";
import { Masonry } from "@/components/library/Masonry";
import { StyleCard } from "@/components/library/StyleCard";
import { ATOM_TYPES, type AtomType } from "@/lib/atoms";
import { COMPOSITES } from "@/lib/catalog";
import { SLOT_STYLES } from "@/lib/composites";

const H2 = "text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase";
const NAV = "rounded-lg border border-white/15 px-3 py-1.5 text-[13px] text-[var(--ink)] hover:bg-white/10";

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
        <nav className="flex gap-2">
          <Link href="/" className={NAV}>
            ← Back to the app
          </Link>
          <Link href="/how-it-works" className={NAV}>
            How it works
          </Link>
        </nav>
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

      <section className="flex flex-col gap-3">
        <h2 className={H2}>Slot styles</h2>
        <p className="text-[13px] text-[var(--muted)]">Every slot in data/composites.json picks one style: how the pieces in it are arranged.</p>
        <Masonry keys={SLOT_STYLES} render={(style) => <StyleCard style={style as (typeof SLOT_STYLES)[number]} />} />
      </section>
    </main>
  );
}
