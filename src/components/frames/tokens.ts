/**
 * FRONTEND · components/frames/tokens.ts — the colours of the cards. Atoms read them as CSS variables.
 */
import type { CSSProperties } from "react";

export const CARD_TOKENS = {
  "--ink": "#1e2235",
  "--ink-2": "#4b5060",
  "--muted": "#7c818d",
  "--eyebrow": "#7c818d",
  "--line": "#d6dae0",
  "--chip": "#e2e5e9",
  "--chip-line": "#d0d4d9",
} as CSSProperties;

/** The coloured label on top of an accordion: white text. */
export const TAB_TOKENS = { "--eyebrow": "#ffffff" } as CSSProperties;

export const CARD_SHADOW = "shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]";
