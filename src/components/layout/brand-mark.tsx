import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.28)] bg-[linear-gradient(180deg,rgba(16,12,9,0.98),rgba(30,23,18,0.92))] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        <div className="absolute h-[18px] w-[18px] rotate-45 rounded-[4px] border border-[rgba(242,200,107,0.95)]" />
        <div className="absolute h-[10px] w-[10px] rotate-45 rounded-[2px] border border-[rgba(242,200,107,0.9)]" />
      </div>
      {!compact ? (
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-[0.08em] text-[rgba(244,235,221,0.98)]">
            AUREX LEGACY
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(244,235,221,0.74)]">
            Luxury Heritage Member Platform
          </p>
        </div>
      ) : null}
    </Link>
  );
}
