/**
 * BACKEND · server/agents/index.ts — one agent per page.
 */
import "server-only";

import type { PageId } from "@/lib/pages";
import { page1Agent } from "./page1";
import { page2Agent } from "./page2";
import { page3Agent } from "./page3";
import type { PageAgent } from "./types";

export const AGENTS: Record<PageId, PageAgent> = { page1: page1Agent, page2: page2Agent, page3: page3Agent };

export { streamPage } from "./run";
