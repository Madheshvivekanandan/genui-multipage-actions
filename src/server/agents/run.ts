/**
 * BACKEND · server/agents/run.ts — run one page agent and stream its page to the browser.
 *
 * Shared by all three agents: each brings its own instructions and prompt
 * (page1.ts …); this file asks the model and guards the call.
 */
import "server-only";

import { pipeJsonRender } from "@json-render/core";
import { createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import { buildInstructions } from "@/lib/catalog";
import type { PageInput } from "@/lib/pages";
import { MODEL, openrouter } from "@/server/openrouter";
import { errorText, timeoutsAsErrors } from "./errors";
import type { PageAgent } from "./types";

// A model under high demand gets slow, sometimes accepts a request and then
// sends nothing for minutes, or stops halfway with an error. Give up instead
// of hanging: the browser shows the error and asks once more on its own.
// It thinks before it writes the first word: with the full catalog that takes
// 37-56 s (genui-studio needed 45 s), while a stalled call stays silent for minutes.
const FIRST_OUTPUT_MS = 90_000;
const BETWEEN_OUTPUT_MS = 20_000; // once writing, text arrives every second or so

export function streamPage(agent: PageAgent, input: PageInput, abortSignal?: AbortSignal): Response {
  const startedAt = Date.now();
  const seconds = () => `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
  const log = `[${agent.id}] ${MODEL}`;
  let firstOutput = ""; // when the first word arrived, for the server log

  // Watch for the first word from the moment we ask: the AI SDK's own
  // first-chunk timer only starts once OpenRouter has sent the response
  // headers, and a stalled call may never send them.
  const quiet = new AbortController();
  const quietTimer = setTimeout(() => quiet.abort(new Error(`First output timeout of ${FIRST_OUTPUT_MS}ms exceeded`)), FIRST_OUTPUT_MS);

  const result = streamText({
    model: openrouter(MODEL),
    instructions: buildInstructions(agent),
    prompt: agent.prompt(input),
    // Stop button or closed tab (abortSignal), or no first word in time (quiet): stop the model call.
    abortSignal: abortSignal ? AbortSignal.any([abortSignal, quiet.signal]) : quiet.signal,
    timeout: { chunkMs: BETWEEN_OUTPUT_MS },
    onChunk: ({ chunk }) => {
      if (chunk.type !== "text-delta") return;
      clearTimeout(quietTimer);
      firstOutput ||= seconds();
    },
    onError: ({ error }) => console.error(`${log} failed after ${seconds()}:`, error),
    onAbort: ({ reason }) => console.warn(`${log} stopped after ${seconds()}: ${(reason instanceof Error && reason.message) || "the browser cancelled"}`),
    onEnd: () => {
      clearTimeout(quietTimer);
      console.log(`${log}: first output after ${firstOutput || "-"}, done after ${seconds()}`);
    },
  });

  // The model writes JSONL patches as plain text. pipeJsonRender() turns them
  // into "data-spec" parts, so the browser receives the page as it streams.
  return createUIMessageStreamResponse({
    stream: pipeJsonRender(
      toUIMessageStream({
        stream: result.stream,
        onError: errorText, // real errors while learning; "busy" ones get retried by the browser
      }).pipeThrough(timeoutsAsErrors()),
    ),
  });
}
