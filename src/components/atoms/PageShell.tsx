/**
 * FRONTEND · components/atoms/PageShell.tsx — the root of every page: its sections, one under another.
 */
import type { ReactNode } from "react";

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5" aria-label={title}>
      {children}
    </div>
  );
}
