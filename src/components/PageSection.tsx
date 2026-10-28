/**
 * FRONTEND · components/PageSection.tsx — one agent's page: the rendered JSON, plus building / error states.
 */
"use client";

import { PageView } from "@/components/PageView";
import type { PageAgentState } from "@/components/usePageAgent";
import { findProblems } from "@/lib/validate";

export function PageSection({ agent }: { agent: PageAgentState }) {
  const { spec, busy, error } = agent;
  const problems = spec && !busy ? findProblems(spec) : [];

  return (
    <section className="flex flex-col gap-3">
      {busy && (
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>Building the page…</span>
          <button onClick={agent.stop} className="rounded-md border border-slate-300 px-2 py-0.5 text-xs dark:border-white/15">
            Stop
          </button>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-0.5 text-xs break-words opacity-80">{error.message}</p>
          <button onClick={agent.retry} className="mt-2 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700">
            Try again
          </button>
        </div>
      )}
      {spec && <PageView spec={spec} streaming={busy} />}
      {problems.length > 0 && <p className="text-xs text-amber-600" title={problems.join("\n")}>⚠ {problems.length} validation issue(s)</p>}
    </section>
  );
}
