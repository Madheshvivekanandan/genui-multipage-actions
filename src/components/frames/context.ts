/**
 * FRONTEND · components/frames/context.ts — what a piece knows about where it is drawn.
 */
"use client";

import { createContext } from "react";
import type { CompositeDef } from "@/lib/composites";

/** The frame around a piece: a Headline is big on a panel, smaller in an accordion. */
export const FrameContext = createContext<CompositeDef["frame"] | "page">("page");

/** true while a tab strip draws a composite as its tab: then only the tab slot is drawn. */
export const TabHeadContext = createContext(false);

/** The tab a PositionTab is drawn in: is it open, and how to make it the one open by default. */
export const TabContext = createContext<{ index: number; active: boolean; prefer: (index: number) => void } | null>(null);
