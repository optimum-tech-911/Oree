import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/78 px-3 py-1.5 text-[11px] font-semibold tracking-[.025em] text-[color:var(--muted)] shadow-[0_8px_28px_rgba(11,18,32,.045)] backdrop-blur-xl", className)} {...props}>
      {children}
    </span>
  );
}
