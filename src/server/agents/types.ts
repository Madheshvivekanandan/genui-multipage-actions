/**
 * BACKEND · server/agents/types.ts — what one page agent is made of.
 */
import type { PageId, PageInput } from "@/lib/pages";

export type PageAgent = {
  id: PageId;
  /** First line of the system prompt: who the agent is. */
  system: string;
  /** This agent's own rules, added after the shared ones (lib/catalog.ts). */
  rules: string[];
  /** The user message: what this agent reads to build its page. */
  prompt: (input: PageInput) => string;
};
