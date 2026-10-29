/**
 * FRONTEND · components/guide/JsonToScreen.tsx — a real example: the lines the model writes,
 * the page JSON they build, and what the registry draws from it. Then how one element is drawn.
 */
import type { Spec } from "@json-render/core";
import { Preview } from "@/components/library/Preview";
import { COMPOSITES } from "@/lib/catalog";
import { sampleSpec } from "@/lib/samples";
import { FileLink } from "./FileLink";
import { DRAWING } from "./flow";

const LABEL = "mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase";
const CODE = "overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-[#c3ced8]";

/** The sample with its root element first, the order the model writes them in. */
function rootFirst(spec: Spec): Spec {
  const keys = [spec.root, ...Object.keys(spec.elements).filter((key) => key !== spec.root)];
  return { ...spec, elements: Object.fromEntries(keys.map((key) => [key, spec.elements[key]])) };
}

/** The patches that build this spec, as the model streams them: one per line. */
const patchLines = (spec: Spec) =>
  [{ op: "add", path: "/root", value: spec.root }, ...Object.entries(spec.elements).map(([key, value]) => ({ op: "add", path: `/elements/${key}`, value }))]
    .map((patch) => JSON.stringify(patch))
    .join("\n");

export function JsonToScreen() {
  const spec = rootFirst(sampleSpec("Stat", COMPOSITES));
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:grid-cols-2">
        <div className="min-w-0 lg:col-span-2">
          <p className={LABEL}>1 · What the model writes (one line at a time)</p>
          <pre className={`${CODE} whitespace-pre`}>{patchLines(spec)}</pre>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>2 · The page JSON the lines build (the spec)</p>
          <pre className={`${CODE} max-h-[320px]`}>{JSON.stringify(spec, null, 2)}</pre>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>3 · What the registry draws from it</p>
          <Preview spec={spec} card />
        </div>
      </div>
      {DRAWING.map((row) => (
        <div key={row.label} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className={LABEL}>{row.label}</p>
          <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[var(--ink-2)]">
            {row.chain.map((part, i) => (
              <li key={part} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="text-[var(--muted)]">→</span>}
                <span className={i === 0 ? "font-mono text-[var(--ink)]" : ""}>{part}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-1.5">
            {row.files.map((file) => (
              <FileLink key={file} path={file} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
