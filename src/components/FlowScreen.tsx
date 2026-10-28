/**
 * FRONTEND · components/FlowScreen.tsx — the whole app: three pages, one agent each.
 *
 * Page 1 shows the document; "Process document" runs agent 1. The control at
 * the bottom of each page runs the NEXT page's agent (its own AI call) and
 * shows that page. Pages already built can be revisited without a new call.
 */
"use client";

import { useState } from "react";
import { DocumentPanel } from "@/components/DocumentPanel";
import { NextCard } from "@/components/NextCard";
import { PageSection } from "@/components/PageSection";
import { usePageAgent } from "@/components/usePageAgent";
import { SAMPLE_DOCUMENT } from "@/lib/document";
import { PAGE_IDS, PAGES, type PageId } from "@/lib/pages";

export function FlowScreen() {
  const [current, setCurrent] = useState<PageId>("page1");
  const agents = { page1: usePageAgent("page1"), page2: usePageAgent("page2"), page3: usePageAgent("page3") };
  const agent = agents[current];
  const next = PAGES[current].next;

  // Each agent gets the document and the pages before it (TBD: confirm what each agent needs).
  const open = (page: PageId) => {
    const before = PAGE_IDS.slice(0, PAGE_IDS.indexOf(page));
    const previous = before.map((p) => agents[p].spec).filter((s) => s !== null);
    agents[page].run({ document: SAMPLE_DOCUMENT.text, previous });
    setCurrent(page);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <nav className="flex gap-2 text-sm">
        {PAGE_IDS.map((p) => (
          <button
            key={p}
            onClick={() => setCurrent(p)}
            disabled={p !== "page1" && !agents[p].spec && !agents[p].busy}
            className={`rounded-full px-3 py-1 disabled:opacity-40 ${p === current ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 dark:border-white/15"}`}
          >
            {PAGES[p].title}
          </button>
        ))}
      </nav>

      {current === "page1" && (
        <DocumentPanel title={SAMPLE_DOCUMENT.title} text={SAMPLE_DOCUMENT.text} busy={agent.busy} onProcess={() => open("page1")} />
      )}
      <PageSection agent={agent} />
      {next && agent.spec && !agent.busy && (
        <NextCard label={`Next · ${PAGES[next].title}`} action={`View ${PAGES[next].title} →`} onClick={() => open(next)} />
      )}
    </main>
  );
}
