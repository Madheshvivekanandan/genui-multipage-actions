/**
 * FRONTEND · components/PageButton.tsx — the buttons under a page: build the next page, go back, re-run.
 */
import type { ReactNode } from "react";

const STYLE = {
  primary: "bg-pink-600 text-white hover:bg-pink-700",
  secondary: "border border-slate-300 hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/5",
};

type Props = { children: ReactNode; onClick: () => void; variant?: keyof typeof STYLE; className?: string };

export function PageButton({ children, onClick, variant = "primary", className = "" }: Props) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${STYLE[variant]} ${className}`}>
      {children}
    </button>
  );
}
