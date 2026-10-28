/**
 * SHARED · lib/usage.ts — what one agent call used. The server sends it with the
 * finished page (message metadata); the page shows it in small cards.
 */
import type { UIMessage } from "ai";

export type PageUsage = {
  model: string;
  effort: string;
  inputTokens: number;
  outputTokens: number;
  /** hidden thinking, already counted in outputTokens */
  reasoningTokens: number;
  /** as reported by OpenRouter (null if it did not say) */
  cost: number | null;
  seconds: number;
  firstOutputSeconds: number | null;
};

/** An agent's answer: a normal AI SDK message whose metadata carries its usage when done. */
export type PageMessage = UIMessage<{ usage?: PageUsage }>;
