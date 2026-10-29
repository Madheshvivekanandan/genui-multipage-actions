/**
 * FRONTEND · components/guide/CallSteps.tsx — one AI call, step by step, with where each step runs and its files.
 */
import { FileLink } from "./FileLink";
import { LANES, STEPS } from "./flow";

export function CallSteps() {
  return (
    <ol className="flex flex-col gap-2">
      {STEPS.map((step, i) => (
        <li key={step.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-[12px] text-[var(--ink)]">{i + 1}</span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase ${LANES[step.lane].tone}`}>{LANES[step.lane].name}</span>
              <h3 className="text-[15px] text-[var(--ink)]">{step.title}</h3>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--ink-2)]">{step.text}</p>
            <div className="flex flex-wrap gap-1.5">
              {step.files.map((file) => (
                <FileLink key={file} path={file} />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
