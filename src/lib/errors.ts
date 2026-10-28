/**
 * SHARED · lib/errors.ts — the "model is busy" marker.
 *
 * The server starts its error text with it when the model went quiet or is
 * overloaded (server/agents/errors.ts); the browser retries those once.
 */
export const MODEL_BUSY = "The model is busy";
