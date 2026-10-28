/**
 * BACKEND · server/agents/prompt.ts — pieces the agents' user messages share.
 */
import "server-only";

import type { Spec } from "@json-render/core";

/** The document, fenced so the model can tell it apart from our instructions. */
export const documentBlock = (document: string) => `<document>\n${document}\n</document>`;

/** An earlier page's JSON, for agents that build on it (TBD: confirm with the user). */
export const pageBlock = (name: string, spec: Spec | undefined) => (spec ? `<page name="${name}">\n${JSON.stringify(spec)}\n</page>` : "");
