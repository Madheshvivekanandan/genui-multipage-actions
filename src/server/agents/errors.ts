/**
 * BACKEND · server/agents/errors.ts — turn "the model is slow or overloaded" into
 * one recognisable error, so the browser can ask again once by itself.
 */
import "server-only";

import { APICallError, RetryError, StreamProviderError, type UIMessageChunk } from "ai";
import { MODEL_BUSY } from "@/lib/errors";

/**
 * A timeout ends the stream as an "abort", which the browser shows as an empty
 * answer. Send it as an error instead: the page says what happened, offers
 * Try again, and retries once by itself.
 */
export function timeoutsAsErrors() {
  return new TransformStream<UIMessageChunk, UIMessageChunk>({
    transform(chunk, controller) {
      const timedOut = chunk.type === "abort" && chunk.reason?.includes("timeout");
      controller.enqueue(timedOut ? { type: "error", errorText: `${MODEL_BUSY}: ${chunk.reason?.replace(/^\w*Error: /, "")}.` } : chunk);
    },
  });
}

/**
 * Rate limited (429) or the model's host is down or overloaded (502, 503):
 * worth asking again. Errors before the answer starts were already retried
 * twice by the AI SDK and arrive wrapped in a RetryError.
 */
export function isBusy(error: unknown): boolean {
  const e = RetryError.isInstance(error) ? error.lastError : error;
  return (APICallError.isInstance(e) || StreamProviderError.isInstance(e)) && e.isRetryable;
}

/** The text the browser receives for a failed stream. */
export function errorText(error: unknown): string {
  return (isBusy(error) ? `${MODEL_BUSY}: ` : "") + (error instanceof Error ? error.message : String(error));
}
