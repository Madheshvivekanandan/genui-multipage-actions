/**
 * SHARED · lib/describe.ts — an atom's props as readable rows ("label: string | null"), for /components.
 */
import type { z } from "zod";

type Def = { type: string; innerType?: unknown; entries?: Record<string, string>; element?: unknown; shape?: Record<string, unknown> };
const defOf = (t: unknown) => (t as { def: Def }).def;

function typeName(t: unknown): string {
  const def = defOf(t);
  switch (def.type) {
    case "optional":
      return typeName(def.innerType);
    case "nullable":
      return `${typeName(def.innerType)} | null`;
    case "enum":
      return Object.values(def.entries ?? {}).map((v) => `"${v}"`).join(" | ");
    case "array":
      return `${typeName(def.element)}[]`;
    case "object":
      return `{ ${Object.keys(def.shape ?? {}).join(", ")} }`;
    default:
      return def.type;
  }
}

/** The props of an object schema, without the `note` every piece takes. */
export function describeProps(schema: z.ZodObject): { name: string; type: string; optional: boolean }[] {
  return Object.entries(schema.shape)
    .filter(([name]) => name !== "note")
    .map(([name, t]) => ({ name, type: typeName(t), optional: defOf(t).type === "optional" }));
}
