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
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(196,168,114,0.32)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(250,241,226,0.96))] shadow-[0_18px_40px_rgba(143,110,56,0.12)]">
        <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--gold-strong)]">
          T
        </span>
      </div>
      {!compact ? (
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-[0.08em] text-[var(--foreground)]">
            TOMEI
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Member Growth Platform
          </p>
        </div>
      ) : null}
    </Link>
  );
}
