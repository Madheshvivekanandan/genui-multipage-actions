/**
 * BACKEND · server/agents/usage.ts — what one agent call used, for the browser and the server log.
 */
import "server-only";

import type { LanguageModelUsage, ProviderMetadata } from "ai";
import type { PageUsage } from "@/lib/usage";

/** The cost OpenRouter reported for the call, if any. */
export const costOf = (providerMetadata: ProviderMetadata | undefined): number | null =>
  (providerMetadata?.openrouter?.usage as { cost?: number } | undefined)?.cost ?? null;

export function toPageUsage(
  usage: LanguageModelUsage,
  call: Pick<PageUsage, "model" | "effort" | "cost" | "seconds" | "firstOutputSeconds">,
): PageUsage {
  return {
    ...call,
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    reasoningTokens: usage.outputTokenDetails?.reasoningTokens ?? 0,
  };
}

const count = (n: number) => n.toLocaleString("en-US");

/** e.g. "in 7,812 tokens · out 18,430 (reasoning 9,120) · $0.1776". */
export function usageLine(u: PageUsage): string {
  return [
    `in ${count(u.inputTokens)} tokens`,
    `out ${count(u.outputTokens)}${u.reasoningTokens ? ` (reasoning ${count(u.reasoningTokens)})` : ""}`,
    ...(u.cost != null ? [`$${u.cost.toFixed(4)}`] : []),
  ].join(" · ");
}
