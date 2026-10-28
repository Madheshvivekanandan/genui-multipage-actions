/**
 * FRONTEND · components/DocumentPanel.tsx — the document at the top of page 1, and the button that processes it.
 */
import { PageButton } from "@/components/PageButton";
import { CARD_TOKENS } from "@/components/frames/tokens";

type Props = { name: string; text: string; busy: boolean; onProcess: () => void };

export function DocumentPanel({ name, text, busy, onProcess }: Props) {
  return (
    <section style={CARD_TOKENS} className="rounded-2xl bg-[#eff2f5]/[0.97] p-6 text-[var(--ink)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">Document</p>
          <h2 className="font-mono text-[13px]">{name}</h2>
        </div>
        <PageButton onClick={onProcess} disabled={busy}>
          {busy ? "Processing…" : "Process document"}
        </PageButton>
      </div>
      <pre className="mt-4 max-h-56 overflow-y-auto border-t border-[var(--line)] pt-4 font-sans text-[12.5px] leading-relaxed whitespace-pre-wrap text-[var(--ink-2)]">
        {text}
      </pre>
    </section>
  );
}
