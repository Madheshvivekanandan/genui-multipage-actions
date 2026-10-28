/**
 * FRONTEND · components/FlowScreen.tsx — the whole app: three pages, one agent each.
 *
 * Page 1 shows the document; "Process document" runs agent 1. The button under
 * a page builds the NEXT page with its own AI call and goes to it. Back shows
 * a page already built, with no new call; the last page can be re-run.
 * On wide screens a column on the right holds the open note's popup.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { DocumentPanel } from "@/components/DocumentPanel";
import { NotesContext, useNotesState } from "@/components/notes/state";
import { PageButton } from "@/components/PageButton";
import { PageSection } from "@/components/PageSection";
import { usePageAgent } from "@/components/usePageAgent";
import { PAGE_IDS, PAGES, pageAt, type PageId, type SourceDocument } from "@/lib/pages";

export function FlowScreen({ doc }: { doc: SourceDocument }) {
  const [current, setCurrent] = useState<PageId>("page1");
  const agents = { page1: usePageAgent("page1"), page2: usePageAgent("page2"), page3: usePageAgent("page3") };
  const notes = useNotesState();
  const agent = agents[current];
  const back = pageAt(current, -1);
  const next = pageAt(current, 1);

  // One AI call: the agent gets the document and the pages before it.
  // Pages after it were built on the old version, so they are cleared.
  const build = (page: PageId) => {
    const at = PAGE_IDS.indexOf(page);
    PAGE_IDS.slice(at + 1).forEach((p) => agents[p].reset());
    PAGE_IDS.slice(at).forEach((p) => notes.resetPage(p));
    const previous = PAGE_IDS.slice(0, at).map((p) => agents[p].spec).filter((s) => s !== null);
    agents[page].run({ document: doc.text, previous });
    setCurrent(page);
  };
  // The next page is built the first time; after that its button just shows it.
  const open = (page: PageId) => (agents[page].spec || agents[page].busy ? setCurrent(page) : build(page));

  return (
    <NotesContext.Provider value={notes}>
      <main className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-4 py-8 lg:max-w-[1220px] lg:pr-[360px]">
        <Link href="/components" className="self-end text-[12px] text-[var(--muted)] hover:text-[var(--ink)]">
          Component library →
        </Link>
        {current === "page1" && <DocumentPanel name={doc.name} text={doc.text} busy={agent.busy} onProcess={() => build("page1")} />}
        <PageSection agent={agent} />
        <div className="flex flex-wrap items-center gap-3">
          {back && (
            <PageButton variant="secondary" onClick={() => setCurrent(back)}>
              ← Back to {PAGES[back].title}
            </PageButton>
          )}
          {agent.spec && !agent.busy && (
            <PageButton className="ml-auto" onClick={() => (next ? open(next) : build(current))}>
              {next ? `View ${PAGES[next].title} →` : `Re-run ${PAGES[current].title} →`}
            </PageButton>
          )}
        </div>
      </main>
    </NotesContext.Provider>
  );
}
