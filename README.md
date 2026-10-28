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
| `src/components/atoms.tsx` | Atoms (React code) |
| `src/components/CompositeFrame.tsx` | Draws any composite from its definition |
| `src/components/usePageAgent.ts` | One page's AI call in the browser (stream, stop, retry) |
| `src/components/FlowScreen.tsx` | The app screen and its page buttons |

## Robustness (ported from genui-studio)

- No first output within 45 s, or a 20 s gap while streaming: the call stops.
- Stop, or closing the tab, cancels the model call (`req.signal`).
- Timeouts and 429/502/503 come back as "The model is busy…", and the browser retries once.
- The server logs `first output after …, done after …` for every call.
