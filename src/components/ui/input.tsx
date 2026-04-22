import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border px-4 text-sm text-[var(--foreground)] shadow-[var(--input-shadow,0_1px_2px_rgba(0,0,0,0.04))] outline-none transition placeholder:text-[var(--muted)] [border-color:var(--input-border,var(--border))] [background:var(--input-bg,rgba(255,255,255,0.7))] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--input-ring,rgba(180,146,86,0.18))]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
