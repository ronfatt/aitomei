import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="max-w-2xl p-8 text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--foreground)]">
          This route is not part of the current member journey
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          The page may have moved, the mission item may no longer exist, or the link was incomplete.
        </p>
        <div className="mt-6">
          <Link href="/" className={cn(buttonVariants())}>
            Return to platform home
          </Link>
        </div>
      </Card>
    </div>
  );
}
