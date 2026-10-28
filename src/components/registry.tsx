/**
 * FRONTEND · components/registry.tsx — HOW each catalog item looks on screen.
 *
 * One entry per catalog component: "Page" -> this JSX, each atom -> its JSX.
 * `props` = the values the AI wrote. `children` = the child elements, already
 * rendered by json-render. Composites have no entry of their own: each gets a
 * <CompositeFrame> drawn from its definition in data/composites.json.
 */
import { defineRegistry, type Components } from "@json-render/react";
import type { ReactNode } from "react";
import { PageShell } from "@/components/atoms";
import { CompositeFrame } from "@/components/CompositeFrame";
import { baseCatalog, catalog, COMPOSITES } from "@/lib/catalog";
import type { CompositeDef } from "@/lib/composites";

const components: Components<typeof baseCatalog> = {
  Page: ({ props, children }) => <PageShell title={props.title}>{children}</PageShell>,
};

function frameFor(def: CompositeDef) {
  return function Frame({ props, slots }: { props: { layout: string }; slots?: Record<string, ReactNode> }) {
    return <CompositeFrame def={def} layout={props.layout} slots={slots} />;
  };
}

const frames = Object.fromEntries(COMPOSITES.map((def) => [def.type, frameFor(def)]));

// Composites come from JSON, so TypeScript can't check `frames` against the catalog.
export const registry = defineRegistry(catalog, { components: { ...components, ...frames } } as never).registry;
