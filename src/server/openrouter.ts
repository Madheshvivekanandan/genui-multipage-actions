/**
 * BACKEND · server/openrouter.ts — which model the agents call, and how hard it thinks.
 *
 * Every model goes through OpenRouter: one key (OPENROUTER_API_KEY, read from
 * .env.local by the provider), any vendor. The model id is "vendor/model",
 * see openrouter.ai/models.
 */
import "server-only"; // build fails if any browser file ever imports this one

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const EFFORTS = ["xhigh", "high", "medium", "low", "minimal", "none"] as const;
type Effort = (typeof EFFORTS)[number];

export const openrouter = createOpenRouter({ compatibility: "strict", appName: "GenUI Multipage Actions" });
export const MODEL = process.env.OPENROUTER_MODEL ?? "google/gemini-3.5-flash";

// The model's hidden thinking is billed as output and delays the first word.
// Lower is cheaper and faster, but possibly less careful.
const effort = process.env.OPENROUTER_REASONING_EFFORT ?? "low";
export const REASONING_EFFORT: Effort = (EFFORTS as readonly string[]).includes(effort) ? (effort as Effort) : "low";
