import Link from "next/link";

import { publicNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/70 bg-[rgba(248,243,236,0.82)] px-6 py-4 shadow-[0_18px_50px_rgba(86,66,39,0.08)] backdrop-blur-xl lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-6 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/api/demo-login?role=member"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}
          >
            Member
          </Link>
          <Link
            href="/api/demo-login?role=admin"
            className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
