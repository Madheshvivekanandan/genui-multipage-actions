/**
 * FRONTEND · components/DocumentPanel.tsx — the document at the top of page 1, and the button that processes it.
 */
export function DocumentPanel({ title, text, busy, onProcess }: { title: string; text: string; busy: boolean; onProcess: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">{title}</h2>
        <button
          onClick={onProcess}
          disabled={busy}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {busy ? "Processing…" : "Process document"}
        </button>
      </div>
      <pre className="mt-3 max-h-60 overflow-y-auto font-sans text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-300">{text}</pre>
    </section>
  );
}
