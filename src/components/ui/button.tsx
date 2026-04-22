import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--button-primary-bg,linear-gradient(135deg,var(--gold-strong),var(--gold)))] px-5 py-2.5 text-[var(--button-primary-text,white)] shadow-[var(--button-primary-shadow,0_18px_40px_rgba(143,110,56,0.24))] hover:brightness-105",
        secondary:
          "border px-5 py-2.5 text-[var(--button-secondary-text,var(--foreground))] [border-color:var(--button-secondary-border,var(--border))] [background:var(--button-secondary-bg,rgba(255,255,255,0.7))] hover:[background:var(--button-secondary-hover,white)]",
        ghost:
          "px-4 py-2 text-[var(--button-ghost-text,var(--muted))] hover:[background:var(--button-ghost-hover,rgba(255,255,255,0.8))] hover:text-[var(--foreground)]",
        outline:
          "border bg-transparent px-5 py-2.5 text-[var(--button-outline-text,var(--gold-strong))] [border-color:var(--button-outline-border,var(--gold-soft))] hover:[background:var(--button-outline-hover,rgba(196,168,114,0.08))]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
