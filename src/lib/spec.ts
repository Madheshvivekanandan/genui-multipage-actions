/**
 * SHARED · lib/spec.ts — rebuild a page from an agent's answer.
 *
 * The agent streams the page as PATCHES ("add this element", "set the root").
 * Replaying them in order gives the page so far, so it renders while it streams.
 */
import { applySpecPatch, nestedToFlat, SPEC_DATA_PART_TYPE, type Spec, type SpecDataPart } from "@json-render/core";
import type { UIMessage } from "ai";

/** The page described by one assistant message (null = nothing yet). */
export function specFromMessage(message: UIMessage | undefined): Spec | null {
  let spec: Spec | null = null;
  for (const part of message?.parts ?? []) {
    if (part.type !== SPEC_DATA_PART_TYPE) continue;
    const data = (part as { data: SpecDataPart }).data;
    if (data.type === "patch") {
      spec ??= { root: "", elements: {} };
      applySpecPatch(spec, data.patch);
    } else if (data.type === "flat") {
      spec = structuredClone(data.spec);
    } else {
      spec = nestedToFlat(data.spec);
    }
  }
  return spec;
}

/** All child keys of an element: its children plus everything in its named slots. */
export const childKeys = (el: Spec["elements"][string]): string[] => [...(el.children ?? []), ...Object.values(el.slots ?? {}).flat()];
