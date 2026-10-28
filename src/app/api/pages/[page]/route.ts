/**
 * ROUTING · app/api/pages/[page]/route.ts — the URLs  POST /api/pages/page1 … page3.
 *
 * Only wiring: check the request, hand it to that page's agent, stream the answer.
 */
import type { NextRequest } from "next/server";
import { isPageId, pageInputSchema, type PageInput } from "@/lib/pages";
import { AGENTS, streamPage } from "@/server/agents";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/pages/[page]">) {
  const { page } = await ctx.params;
  if (!isPageId(page)) return Response.json({ error: `Unknown page "${page}"` }, { status: 404 });

  const body: { input?: unknown } = await req.json().catch(() => ({}));
  const parsed = pageInputSchema.safeParse(body.input);
  if (!parsed.success) return Response.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });

  // req.signal: the browser pressed Stop or went away, so the model call stops too.
  return streamPage(AGENTS[page], parsed.data as PageInput, req.signal);
}
