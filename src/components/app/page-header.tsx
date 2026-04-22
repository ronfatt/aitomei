import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.14),transparent_18%),linear-gradient(180deg,rgba(64,18,51,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(7,0,12,0.32)] lg:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_26%,rgba(177,58,134,0.06)_70%,transparent)]" />
      <div className="relative">
        <Badge className="w-fit" variant="default">
          {eyebrow}
        </Badge>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] lg:text-base">{description}</p>
          </div>
          {action ? (
            <Link href={action.href} className={cn(buttonVariants({ size: "lg" }), "shrink-0 px-6")}>
              {action.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
