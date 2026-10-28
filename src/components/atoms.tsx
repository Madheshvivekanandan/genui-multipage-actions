/**
 * FRONTEND · components/atoms.tsx — the smallest pieces of the design, as React code.
 *
 * Only the Page shell for now. The atoms (and their note popups) are built
 * from the design screenshots in the next step, and registered in registry.tsx.
 */
import type { ReactNode } from "react";

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4" aria-label={title}>
      {children}
    </div>
  );
}
