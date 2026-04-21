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
    <div className="panel p-6 lg:p-8">
      <Badge className="w-fit" variant="default">
        {eyebrow}
      </Badge>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--foreground)] lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] lg:text-base">{description}</p>
        </div>
        {action ? (
          <Link href={action.href} className={cn(buttonVariants())}>
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
