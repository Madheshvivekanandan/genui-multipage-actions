/**
 * BACKEND · server/agents/run.ts — run one page agent and stream its page to the browser.
 *
 * Shared by all three agents: each brings its own instructions and prompt
 * (page1.ts …); this file asks the model and guards the call.
 */
import "server-only";

import { pipeJsonRender } from "@json-render/core";
import { createUIMessageStreamResponse, streamText, toUIMessageStream, type LanguageModelUsage, type ToolSet } from "ai";
import { buildInstructions } from "@/lib/catalog";
import type { PageInput } from "@/lib/pages";
import type { PageMessage } from "@/lib/usage";
import { MODEL, openrouter, REASONING_EFFORT } from "@/server/openrouter";
import { errorText, timeoutsAsErrors } from "./errors";
import type { PageAgent } from "./types";
import { costOf, toPageUsage, usageLine } from "./usage";

// A model under high demand gets slow, sometimes accepts a request and then
// sends nothing for minutes, or stops halfway with an error. Give up instead
// of hanging: the browser shows the error and asks once more on its own.
// It thinks before it writes the first word: with the full catalog that takes
// 37-56 s (genui-studio needed 45 s), while a stalled call stays silent for minutes.
const FIRST_OUTPUT_MS = 90_000;
const BETWEEN_OUTPUT_MS = 20_000; // once writing, text arrives every second or so

// Without a cap OpenRouter reserves credit for the model's maximum (65,536
// tokens) before it starts. Hidden reasoning and the notes count as output too.
const MAX_OUTPUT_TOKENS = 32_000;

export function streamPage(agent: PageAgent, input: PageInput, abortSignal?: AbortSignal): Response {
  const startedAt = Date.now();
  const elapsed = () => Math.round((Date.now() - startedAt) / 100) / 10;
  const seconds = () => `${elapsed().toFixed(1)}s`;
  const log = `[${agent.id}] ${MODEL} (${REASONING_EFFORT} reasoning)`;
  let firstOutputSeconds: number | null = null; // when the first word arrived
  let cost: number | null = null; // as reported by OpenRouter at the end of the step
  const usageOf = (usage: LanguageModelUsage) =>
    toPageUsage(usage, { model: MODEL, effort: REASONING_EFFORT, cost, seconds: elapsed(), firstOutputSeconds });

  // Watch for the first word from the moment we ask: the AI SDK's own
  // first-chunk timer only starts once OpenRouter has sent the response
  // headers, and a stalled call may never send them.
  const quiet = new AbortController();
  const quietTimer = setTimeout(() => quiet.abort(new Error(`First output timeout of ${FIRST_OUTPUT_MS}ms exceeded`)), FIRST_OUTPUT_MS);

  const result = streamText({
    model: openrouter(MODEL, { reasoning: { effort: REASONING_EFFORT } }),
    instructions: buildInstructions(agent),
    prompt: agent.prompt(input),
    // Stop button or closed tab (abortSignal), or no first word in time (quiet): stop the model call.
    abortSignal: abortSignal ? AbortSignal.any([abortSignal, quiet.signal]) : quiet.signal,
    timeout: { chunkMs: BETWEEN_OUTPUT_MS },
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    onChunk: ({ chunk }) => {
      if (chunk.type !== "text-delta") return;
      clearTimeout(quietTimer);
      firstOutputSeconds ??= elapsed();
    },
    onStepEnd: (step) => void (cost = costOf(step.providerMetadata)),
    onError: ({ error }) => console.error(`${log} failed after ${seconds()}:`, error),
    onAbort: ({ reason }) => console.warn(`${log} stopped after ${seconds()}: ${(reason instanceof Error && reason.message) || "the browser cancelled"}`),
    onEnd: ({ usage, finishReason }) => {
      clearTimeout(quietTimer);
      const first = firstOutputSeconds === null ? "-" : `${firstOutputSeconds.toFixed(1)}s`;
      console.log(`${log}: first output after ${first}, done after ${seconds()} · ${usageLine(usageOf(usage))}`);
      if (finishReason === "length") console.warn(`${log}: hit the ${MAX_OUTPUT_TOKENS}-token output cap, so the page is cut off`);
    },
  });

  // The model writes JSONL patches as plain text. pipeJsonRender() turns them
  // into "data-spec" parts, so the browser receives the page as it streams.
  // The finished message carries what the call used (the page's usage cards).
  return createUIMessageStreamResponse({
    stream: pipeJsonRender(
      toUIMessageStream<ToolSet, PageMessage>({
        stream: result.stream,
        onError: errorText, // real errors while learning; "busy" ones get retried by the browser
        messageMetadata: ({ part }) => (part.type === "finish" ? { usage: usageOf(part.totalUsage) } : undefined),
      }).pipeThrough(timeoutsAsErrors()),
    ),
  });
}
