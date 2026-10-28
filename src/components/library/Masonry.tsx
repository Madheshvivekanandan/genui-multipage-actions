/**
 * FRONTEND · components/library/Masonry.tsx — cards in two columns, each placed under the shorter one.
 *
 * Placement is measured once per width (not on every height change), so opening
 * a card later pushes down only the cards below it: nothing jumps columns.
 */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const GAP = 16; // gap-4

export function Masonry({ keys, render }: { keys: readonly string[]; render: (key: string) => ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  // Before the first measure: alternate, so cards already have their column width.
  const [columns, setColumns] = useState(() => [keys.filter((_, i) => i % 2 === 0), keys.filter((_, i) => i % 2 === 1)]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let width = 0;
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === width) return; // a card opened: keep the placement
      width = el.offsetWidth;
      const heights = new Map([...el.querySelectorAll<HTMLElement>("[data-card]")].map((c) => [c.dataset.card ?? "", c.offsetHeight]));
      const next: string[][] = [[], []];
      const total = [0, 0];
      for (const key of keys) {
        const shorter = total[0] <= total[1] ? 0 : 1;
        next[shorter].push(key);
        total[shorter] += (heights.get(key) ?? 0) + GAP;
      }
      setColumns(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [keys]);

  return (
    <div ref={root} className="grid items-start gap-4 md:grid-cols-2">
      {columns.map((column, i) => (
        <div key={i} className="flex flex-col gap-4">
          {column.map((key) => (
            <div key={key} data-card={key}>
              {render(key)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
