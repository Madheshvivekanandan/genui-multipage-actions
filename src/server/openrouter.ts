/**
 * BACKEND · server/openrouter.ts — which model the agents call.
 *
 * Every model goes through OpenRouter: one key (OPENROUTER_API_KEY, read from
 * .env.local by the provider), any vendor. The model id is "vendor/model",
 * see openrouter.ai/models.
 */
import "server-only"; // build fails if any browser file ever imports this one

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({ compatibility: "strict", appName: "GenUI Doc Flow" });
export const MODEL = process.env.OPENROUTER_MODEL ?? "google/gemini-3.5-flash";
