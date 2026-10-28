/**
 * FRONTEND · components/library/styleDemos.tsx — what each slot style means, and a live demo of it.
 *
 * The demos are drawn by the real frame code (SlotRegion, CompositeFrame,
 * Accordion), so they look exactly like the pages the agents build.
 */
"use client";

import type { ReactNode } from "react";
import { Citation, PositionTab, Tag } from "@/components/atoms/chips";
import { Bullet, KeyDate } from "@/components/atoms/lists";
import { FitRow, Requirement } from "@/components/atoms/rows";
import { BigValue, Body, Caption, Eyebrow, Headline } from "@/components/atoms/text";
import { Accordion } from "@/components/frames/Accordion";
import { CompositeFrame } from "@/components/frames/CompositeFrame";
import { FrameContext } from "@/components/frames/context";
import { SlotRegion } from "@/components/frames/SlotRegion";
import { COMPOSITES } from "@/lib/catalog";
import type { SlotRule } from "@/lib/composites";

type Style = SlotRule["style"];
const molecule = (type: string) => COMPOSITES.find((c) => c.type === type);
const region = (style: Style, nodes: ReactNode[]) => <SlotRegion slot="demo" style={style} frame="plain" nodes={nodes} />;

const stat = (label: string, value: string, caption: string) => {
  const def = molecule("Stat");
  const slots = { label: <Eyebrow text={label} />, value: <BigValue text={value} />, caption: <Caption text={caption} /> };
  return def ? <CompositeFrame key={label} def={def} layout={Object.keys(def.layouts)[0]} slots={slots} /> : <BigValue key={label} text={value} />;
};

const position = (label: string, title: string, recommended: boolean, text: string) => {
  const def = molecule("Position");
  if (!def) return <Headline key={label} text={title} />;
  const slots = { tab: <PositionTab label={label} title={title} recommended={recommended} />, body: [<Headline key="h" text={text} />, <Body key="b" text="The panel of the open tab: whatever its body slot holds." />] };
  return <CompositeFrame key={label} def={def} layout={Object.keys(def.layouts)[0]} slots={slots} />;
};

export const STYLE_DEMOS: Record<Style, { about: string; demo: () => ReactNode }> = {
  stack: {
    about: "One under another, full width. The default for text.",
    demo: () => region("stack", [<Eyebrow key="e" text="WHO THEY ARE" />, <Headline key="h" text="A regional outdoor retailer growing online." />, <Body key="b" text="The brief is brand-led, with weighted criteria." />]),
  },
  row: {
    about: "Side by side on one line, centred, wrapping only when out of room.",
    demo: () => region("row", [<Bullet key="b" text="Incumbent is in the review" />, <Tag key="t" label="WHO" value="14 stores" />, <Citation key="c" text="Retail proof" source="brain" />]),
  },
  wrap: {
    about: "Chips that flow like words and wrap onto the next line.",
    demo: () => region("wrap", [["WHERE", "Wisconsin-based"], ["TYPE", "Outdoor retailer"], ["WHO", "14 stores across the Upper Midwest"], ["CONTACT", "Marketing Department"]].map(([l, v]) => <Tag key={l} label={l} value={v} />)),
  },
  columns: {
    about: "Side by side in equal widths, with a line between them. Two per row on small screens.",
    demo: () => region("columns", [stat("RESPOND BY", "Nov 20", "5:00 PM CST"), stat("BUDGET", "$750,000", "fiscal 2027"), stat("REQUIREMENTS", "3 to confirm", "of 8")]),
  },
  grid: {
    about: "Side by side in equal widths, no lines between them.",
    demo: () => region("grid", [["Nov 20, 2026", "Proposal due", true], ["Dec 15, 2026", "Agency selection", false], ["Feb 1, 2027", "Research complete", false]].map(([d, l, c]) => <KeyDate key={String(d)} date={String(d)} label={String(l)} current={Boolean(c)} />)),
  },
  rows: {
    about: "One under another, with a line between each row.",
    demo: () => region("rows", [
      <Requirement key="r1" code="R1" text="Submit the proposal by November 20." kind="disqualifier" status="to-confirm" />,
      <Requirement key="r2" code="R2" text="Agency overview and category experience." kind="process-gate" status="met" />,
      <FitRow key="f" label="Strategic" verdict="aligned" text="Retail identity and younger-audience work." />,
    ]),
  },
  tabs: {
    about: "A tab strip: one item open at a time; the recommended one opens first. Each item shows its own tab slot as the tab.",
    demo: () => region("tabs", [position("PROBLEM FRAMING", "Verify first", false, "Confirm the buyer first."), position("PROOF STRATEGY", "Prove the transfer", true, "Lead with adjacent proof.")]),
  },
  tab: {
    about: "Not in the flow: drawn as an accordion's coloured label, or as an item's tab inside a tab strip. Holds one piece.",
    demo: () => (
      <FrameContext.Provider value="accordion">
        <Accordion tab={[<Eyebrow key="t" text="WHO THEY ARE" />]} parts={[<Headline key="h" text="The label above sits outside the card's flow." />, <Body key="b" text="Everything else follows the layout." />]} />
      </FrameContext.Provider>
    ),
  },
};
