/**
 * FRONTEND · components/atoms/text.tsx — the text atoms.
 *
 * Colours come from CSS variables the frames set (frames/tokens.ts), so the
 * same atom reads well on a light card and on the dark page.
 */
"use client";

import { useContext } from "react";
import { FrameContext } from "@/components/frames/context";

export function Eyebrow({ text }: { text: string }) {
  return <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--eyebrow)] uppercase">{text}</p>;
}

const HEADLINE = {
  panel: "text-[28px] leading-[1.25] font-normal",
  accordion: "text-[17px] leading-snug font-semibold",
  plain: "text-[15px] leading-snug font-semibold",
  page: "text-[17px] leading-snug font-semibold",
};

export function Headline({ text }: { text: string }) {
  const frame = useContext(FrameContext);
  return <p className={`text-[var(--ink)] ${HEADLINE[frame]}`}>{text}</p>;
}

export function Body({ text }: { text: string }) {
  return <p className="text-[13.5px] leading-relaxed text-[var(--ink-2)]">{text}</p>;
}

export function Quote({ text }: { text: string }) {
  return <p className="text-[13.5px] leading-relaxed text-[var(--muted)] italic">{text}</p>;
}

export function BigValue({ text }: { text: string }) {
  return <p className="text-[26px] leading-tight font-light text-[var(--ink)]">{text}</p>;
}

export function Caption({ text }: { text: string }) {
  return <p className="text-[11px] leading-snug text-[var(--muted)]">{text}</p>;
}
