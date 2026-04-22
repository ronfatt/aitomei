import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "[background:var(--badge-default-bg,rgba(196,168,114,0.16))] [color:var(--badge-default-text,var(--gold-strong))]",
        neutral: "[background:var(--badge-neutral-bg,rgba(43,37,31,0.08))] [color:var(--badge-neutral-text,var(--muted))]",
        success: "[background:var(--badge-success-bg,rgba(50,97,71,0.12))] [color:var(--badge-success-text,var(--success))]",
        warning: "[background:var(--badge-warning-bg,rgba(165,113,52,0.14))] [color:var(--badge-warning-text,var(--warning))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  children,
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)}>{children}</div>;
}
