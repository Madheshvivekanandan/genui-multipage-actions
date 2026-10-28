/**
 * FRONTEND · components/PageSection.tsx — one agent's page: the rendered JSON, plus building / error states.
 *
 * Above the page: the signal legend (if it has notes), what building it used, and its JSON.
 */
"use client";

import { JsonDrawer } from "@/components/JsonDrawer";
import { SignalLegend } from "@/components/notes/SignalLegend";
import { PageStats } from "@/components/PageStats";
import { PageView } from "@/components/PageView";
import type { PageAgentState } from "@/components/usePageAgent";
import { PAGES } from "@/lib/pages";
import { findProblems } from "@/lib/validate";

export function PageSection({ agent }: { agent: PageAgentState }) {
  const { spec, busy, error, usage } = agent;
  const problems = spec && !busy ? findProblems(spec) : [];
  const hasNotes = !!spec && Object.values(spec.elements).some((el) => el.props?.note);

  return (
    <section className="flex flex-col gap-3">
      {spec && !busy && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          {hasNotes ? <SignalLegend /> : <span />}
          <div className="flex flex-wrap items-center gap-2">
            {usage && <PageStats usage={usage} />}
            <JsonDrawer spec={spec} title={PAGES[agent.page].title} />
          </div>
        </div>
      )}
      {busy && (
        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <span>Building the page…</span>
          <button onClick={agent.stop} className="rounded-md border border-white/20 px-2 py-0.5 text-xs hover:bg-white/10">
            Stop
          </button>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-0.5 text-xs break-words opacity-80">{error.message}</p>
          <button onClick={agent.retry} className="mt-2 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700">
            Try again
          </button>
        </div>
      )}
      {spec && <PageView page={agent.page} spec={spec} streaming={busy} />}
      {problems.length > 0 && (
        <p className="text-xs text-amber-300" title={problems.join("\n")}>
          ⚠ {problems.length} validation issue(s)
        </p>
      )}
    </section>
  );
}
