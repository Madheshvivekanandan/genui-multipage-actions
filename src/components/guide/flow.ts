/**
 * FRONTEND · components/guide/flow.ts — what the /how-it-works page says: the pages, and the steps of one AI call.
 *
 * Plain data, so the wording can change without touching the layout.
 */

export type Lane = "browser" | "server" | "model";

export const LANES: Record<Lane, { name: string; tone: string }> = {
  browser: { name: "Browser", tone: "border-teal-300/30 bg-teal-300/10 text-teal-200" },
  server: { name: "Server", tone: "border-amber-300/30 bg-amber-300/10 text-amber-200" },
  model: { name: "Model · OpenRouter", tone: "border-violet-300/30 bg-violet-300/10 text-violet-200" },
};

/** The document, then the three pages. Each page is one AI call; its button builds the next one. */
export const CHAIN = [
  { title: "The document", file: "data/documents/pinecrest-rfp.md", sends: "Read on the server and shown on the first screen.", button: "Process document" },
  { title: "1 · RFP Overview", file: "src/server/agents/page1.ts", sends: "The document (Parts 1 and 2).", button: "View Prospect Intelligence" },
  { title: "2 · Prospect Intelligence", file: "src/server/agents/page2.ts", sends: "The document (Part 3) + page 1's JSON.", button: "View Suggested POV" },
  { title: "3 · Suggested POV", file: "src/server/agents/page3.ts", sends: "The document + the JSON of pages 1 and 2.", button: "↻ Re-run Suggested POV" },
];

/** How the registry draws one element of the spec, for an atom and for a molecule. */
export const DRAWING = [
  {
    label: "An atom",
    chain: ['"type": "BigValue"', "registry", "its React component", "on screen"],
    files: ["src/components/registry.tsx", "src/components/atoms/text.tsx"],
  },
  {
    label: "A molecule",
    chain: ['"type": "Stat"', "registry", "CompositeFrame reads its entry", "the layout orders the slots", "each slot drawn in its style", "wrapped in its frame"],
    files: ["data/composites.json", "src/components/frames/CompositeFrame.tsx", "src/components/frames/SlotRegion.tsx", "src/components/frames/Panel.tsx", "src/components/frames/Accordion.tsx"],
  },
];

/** One button press, from the click to the drawn page. */
export const STEPS: { lane: Lane; title: string; text: string; files: string[] }[] = [
  {
    lane: "browser",
    title: "The button asks the page's agent",
    text: "It sends the document and the earlier pages' JSON to POST /api/pages/page1 (or page2, page3).",
    files: ["src/components/FlowScreen.tsx", "src/components/usePageAgent.ts"],
  },
  {
    lane: "server",
    title: "The route checks the request",
    text: "A known page and a document that isn't empty; then it hands the request to that page's agent.",
    files: ["src/app/api/pages/[page]/route.ts", "src/server/agents/index.ts"],
  },
  {
    lane: "server",
    title: "The instructions and the prompt are put together",
    text: "Instructions: who the agent is, the shared rules (the components, the molecules, the notes rule) and the page's own section rules. Prompt: the document plus the earlier pages' JSON.",
    files: ["src/lib/catalog.ts", "data/composites.json", "src/server/agents/page1.ts", "src/server/agents/prompt.ts"],
  },
  {
    lane: "model",
    title: "The model writes the page as JSON lines",
    text: "It thinks first, then writes one patch per line: “add this element”. The call stops if no word comes in 90 s, if it goes quiet for 20 s, or at 32,000 output tokens.",
    files: ["src/server/agents/run.ts", "src/server/openrouter.ts"],
  },
  {
    lane: "server",
    title: "Each line streams to the browser as it arrives",
    text: "pipeJsonRender turns the lines into page parts. The last message adds the tokens, cost and time shown in the usage cards.",
    files: ["src/server/agents/run.ts", "src/server/agents/usage.ts"],
  },
  {
    lane: "browser",
    title: "The lines are replayed into the page's JSON",
    text: "Replaying the patches in order gives the page so far (the spec), so the page grows while it streams. If the model stalled or was busy, the browser asks once more by itself.",
    files: ["src/lib/spec.ts", "src/components/usePageAgent.ts"],
  },
  {
    lane: "browser",
    title: "The JSON is drawn with real components",
    text: "The Renderer walks the spec, and the registry gives each type its React: an atom gets its component, a molecule the generic CompositeFrame.",
    files: ["src/components/PageView.tsx", "src/components/registry.tsx"],
  },
  {
    lane: "browser",
    title: "Notes open a popup",
    text: "A piece the AI gave a note is highlighted; clicking it opens a question or a feedback popup. The kind of piece decides which, not the AI.",
    files: ["src/components/notes/NoteTarget.tsx", "src/components/notes/NotePopup.tsx"],
  },
];
