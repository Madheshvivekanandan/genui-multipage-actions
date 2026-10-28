/**
 * FRONTEND · components/PageButton.tsx — the buttons under a page: build the next page, go back, re-run.
 */
import type { ReactNode } from "react";

const STYLE = {
  primary: "bg-linear-to-r from-[#e0559b] to-[#8f6fe0] text-white shadow-[0_10px_30px_-10px_rgba(224,85,155,0.7)] hover:brightness-110",
  secondary: "border border-white/20 text-[var(--ink)] hover:bg-white/10",
};

type Props = { children: ReactNode; onClick: () => void; variant?: keyof typeof STYLE; disabled?: boolean; className?: string };

export function PageButton({ children, onClick, variant = "primary", disabled, className = "" }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition disabled:opacity-50 ${STYLE[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
