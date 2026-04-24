import Link from "next/link";

import { publicNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-[rgba(216,177,91,0.14)] bg-[rgba(8,7,6,0.82)] px-6 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-6 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-[rgba(228,216,197,0.66)] transition hover:text-[var(--gold)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/api/demo-login?role=member"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-full border border-[rgba(216,177,91,0.14)] bg-[rgba(255,255,255,0.03)] text-[rgba(244,233,214,0.9)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white",
            )}
          >
            会员端
          </Link>
          <Link
            href="/api/demo-login?role=admin"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full border-[rgba(216,177,91,0.4)] bg-[linear-gradient(135deg,#f2c86b,#d8b15b_55%,#8f6a2c_100%)] text-[#130d07] shadow-[0_16px_35px_rgba(216,177,91,0.18)]",
            )}
          >
            管理端
          </Link>
        </div>
      </div>
    </header>
  );
}
