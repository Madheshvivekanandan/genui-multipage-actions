/**
 * FRONTEND · components/NextCard.tsx — the control at the bottom of a page that leads to another page.
 *
 * App chrome for now (TBD with the user: chrome, or an element the AI places).
 */
export function NextCard({ label, action, onClick, disabled }: { label: string; action: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <p className="text-sm font-semibold">{label}</p>
      <button
        onClick={onClick}
        disabled={disabled}
        className="shrink-0 rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
      >
        {action}
      </button>
    </div>
  );
}
