# GenUI Multipage Actions

A GenUI proof of concept where each action builds the next page. Three AI
agents each build one page as [json-render](https://github.com/vercel-labs/json-render)
JSON, streamed to the browser and rendered from a fixed component catalog.

1. **RFP Overview**: page 1 shows the document; "Process document" runs agent 1.
2. **Prospect Intelligence**: the button under page 1 runs agent 2 and opens page 2.
3. **Suggested POV**: the button under page 2 runs agent 3 and opens page 3, which can be re-run.

Each agent gets the document plus the pages before it. Back shows a page
already built, with no new AI call. Patterns come from `../genui-studio` (frozen reference).

## Setup

```bash
cp .env.example .env.local   # then paste your OpenRouter key
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Where things are

| Path | What |
| --- | --- |
| `data/documents/pinecrest-rfp.md` | The sample document: the RFP, what our Brain holds, the research base |
| `data/composites.json` | Composite components, written by hand (slots + approved layouts) |
| `src/lib/catalog.ts` | Page + atoms + composites → json-render catalog and agent prompt |
| `src/lib/composites.ts` | The composite schema and its checks |
| `src/lib/pages.ts` | The three pages and what each agent receives |
| `src/lib/validate.ts` | Checks a built page: structure, props, slot rules |
| `src/server/agents/` | One module per agent (`page1.ts` …), the shared runner (`run.ts`) |
| `src/app/api/pages/[page]/route.ts` | `POST /api/pages/page1` … `page3` |
| `src/lib/atoms/` | Each atom's props (Zod) and description, for the AI |
| `src/components/atoms/` | Each atom's React code (text, lists, chips, rows) |
| `src/components/frames/` | The frames (panel, accordion, tab strip) that draw any composite from its definition |
| `src/components/notes/` | Click-to-open note popups: question or feedback form (chosen by component), status dots, legend |
| `src/components/PageStats.tsx`, `JsonDrawer.tsx` | Above each page: the model, tokens, cost and time of its AI call, and the JSON that drew it |
| `src/components/usePageAgent.ts` | One page's AI call in the browser (stream, stop, retry) |
| `src/components/FlowScreen.tsx` | The app screen and its page buttons |

## Robustness (ported from genui-studio)

- No first output within 90 s, or a 20 s gap while streaming: the call stops.
- Stop, or closing the tab, cancels the model call (`req.signal`).
- Timeouts and 429/502/503 come back as "The model is busy…", and the browser retries once.
- The server logs `first output after …, done after …` plus tokens and cost for every call.

## Cost

- Output is capped at 32,000 tokens per call. Without a cap OpenRouter reserves credit for the model's
  maximum (65,536 tokens) before it starts, and refuses the call if the balance can't cover it.
- `OPENROUTER_REASONING_EFFORT` (default `low`) sets how hard the model thinks before writing. Thinking is
  billed as output: on page 1, `low` cut cost from $0.157 to $0.103 and time from 91 s to 51 s.
