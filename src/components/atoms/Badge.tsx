/**
 * FRONTEND · components/atoms/Badge.tsx — the small coloured chips inside other atoms (ALIGNED, GAP, FACT…).
 */
export const TONE = {
  positive: "bg-[#dcefe4] text-[#2f7a52]",
  caution: "bg-[#f1e6cf] text-[#8a6326]",
  signal: "bg-[#f8dde8] text-[#c2185b]",
  neutral: "bg-[var(--chip)] text-[var(--muted)]",
};
export type Tone = keyof typeof TONE;

export function Badge({ text, tone }: { text: string; tone: Tone }) {
  return <span className={`w-fit rounded px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] uppercase ${TONE[tone]}`}>{text}</span>;
}
