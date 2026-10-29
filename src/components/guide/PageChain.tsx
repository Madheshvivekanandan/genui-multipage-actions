/**
 * FRONTEND · components/guide/PageChain.tsx — the document and the three pages, each page its own AI call.
 */
import { Fragment } from "react";
import { FileLink } from "./FileLink";
import { CHAIN } from "./flow";

const LABEL = "text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase";

export function PageChain() {
  return (
    <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      {CHAIN.map((step, i) => (
        <Fragment key={step.title}>
          {i > 0 && (
            <div aria-hidden className="self-center justify-self-center text-[18px] text-[var(--muted)]">
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </div>
          )}
          <article className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-[15px] text-[var(--ink)]">{step.title}</h3>
            <div className="flex flex-col items-start gap-1">
              <span className={LABEL}>{i === 0 ? "File" : "Agent"}</span>
              <FileLink path={step.file} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={LABEL}>{i === 0 ? "What happens" : "The AI is sent"}</span>
              <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{step.sends}</p>
            </div>
            <span className="mt-auto self-start rounded-lg bg-white/90 px-2.5 py-1 text-[12px] font-medium text-[#12303f]">{step.button}</span>
          </article>
        </Fragment>
      ))}
    </div>
  );
}
