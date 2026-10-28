/**
 * FRONTEND · components/usePageAgent.ts — one page's agent, as the browser sees it.
 *
 * Wraps useChat for ONE call: run(input) asks the page's agent (POST
 * /api/pages/<page>) and the page streams in. A "model is busy" error is
 * retried once automatically; any error can be retried by hand.
 */
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useRef } from "react";
import { MODEL_BUSY } from "@/lib/errors";
import type { PageId, PageInput } from "@/lib/pages";
import { specFromMessage } from "@/lib/spec";

export function usePageAgent(page: PageId) {
  const input = useRef<PageInput | null>(null);
  const retried = useRef(false); // asked again by ourselves after the model went quiet or was overloaded (once per run)

  // The agent needs only the input (sent as the request body), not the chat history.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/pages/${page}`,
        prepareSendMessagesRequest: ({ id, body }) => ({ body: { ...body, id } }),
      }),
    [page],
  );

  const { messages, sendMessage, setMessages, status, error, stop, regenerate } = useChat({
    id: page,
    transport,
    onError: (e) => {
      if (!e.message.startsWith(MODEL_BUSY) || retried.current) return;
      retried.current = true;
      setTimeout(() => retry(), 0); // after useChat has finished with the failed request
    },
  });

  const retry = () => void regenerate({ body: { input: input.current } });

  const answer = messages.findLast((m) => m.role === "assistant");
  const spec = useMemo(() => specFromMessage(answer), [answer]);

  return {
    spec,
    busy: status === "submitted" || status === "streaming",
    error,
    stop,
    retry,
    /** Forget the page (and stop it if it is still building). */
    reset: () => {
      void stop();
      setMessages([]);
    },
    run: (next: PageInput) => {
      input.current = next;
      retried.current = false;
      setMessages([]); // every run builds the page from scratch
      void sendMessage({ text: `Build ${page}` }, { body: { input: next } });
    },
  };
}

export type PageAgentState = ReturnType<typeof usePageAgent>;
