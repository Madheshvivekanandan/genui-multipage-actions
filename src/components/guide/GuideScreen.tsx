/**
 * FRONTEND · components/guide/GuideScreen.tsx — the /how-it-works page: the app's flow from a high level.
 *
 * Read-only: the pages and their AI calls, one call step by step, and how the JSON becomes the page.
 */
import Link from "next/link";
import { CallSteps } from "./CallSteps";
import { LANES } from "./flow";
import { JsonToScreen } from "./JsonToScreen";
import { PageChain } from "./PageChain";

const H2 = "text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase";
const NOTE = "text-[13px] text-[var(--muted)]";
const NAV = "rounded-lg border border-white/15 px-3 py-1.5 text-[13px] text-[var(--ink)] hover:bg-white/10";

export function GuideScreen() {
  return (
    <main className="mx-auto flex w-full max-w-[1220px] flex-col gap-8 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-light text-[var(--ink)]">How it works</h1>
          <p className={NOTE}>Three pages, each built by its own AI agent from the same document. The AI writes JSON; the browser draws it.</p>
        </div>
        <nav className="flex gap-2">
          <Link href="/" className={NAV}>
            ← Back to the app
          </Link>
          <Link href="/components" className={NAV}>
            Component library
          </Link>
        </nav>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>Three pages, three AI calls</h2>
        <PageChain />
        <p className={NOTE}>Back shows a page already built, with no new call. Building a page again clears the pages after it, since they were built on the old one.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>One AI call, step by step</h2>
        <p className={`flex flex-wrap items-center gap-2 ${NOTE}`}>
          Where each step runs:
          {Object.values(LANES).map((lane) => (
            <span key={lane.name} className={`rounded-full border px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase ${lane.tone}`}>
              {lane.name}
            </span>
          ))}
        </p>
        <CallSteps />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>From JSON to the screen</h2>
        <p className={NOTE}>A real example: one Stat molecule. Every page is the same thing at a larger size.</p>
        <JsonToScreen />
      </section>
    </main>
  );
}
