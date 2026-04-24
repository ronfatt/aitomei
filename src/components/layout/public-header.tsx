"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { publicNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 lg:px-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex items-center justify-between gap-4 rounded-full border border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(12,10,8,0.78),rgba(8,7,6,0.72))] px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:px-7">
          <BrandMark className="shrink-0" />

          <nav className="hidden items-center gap-7 lg:flex">
            {publicNavigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="relative text-sm tracking-[0.12em] text-[rgba(244,235,221,0.9)] transition duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[linear-gradient(90deg,rgba(214,177,94,0.95),rgba(214,177,94,0.12))] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/api/demo-login?role=member"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] px-5 text-[rgba(244,235,221,0.96)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white",
              )}
            >
              Member Login
            </Link>
            <Link
              href="/api/demo-login?role=admin"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full border border-[rgba(214,177,94,0.26)] bg-[linear-gradient(135deg,#f0d18a_0%,#d6b15e_50%,#a07120_100%)] px-5 text-[#120b05] shadow-[0_16px_36px_rgba(200,155,60,0.22)] hover:shadow-[0_18px_40px_rgba(200,155,60,0.28)]",
              )}
            >
              Admin Demo
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(214,177,94,0.18)] bg-[rgba(255,255,255,0.03)] text-[rgba(244,235,221,0.9)] lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-3 rounded-[28px] border border-[rgba(214,177,94,0.16)] bg-[linear-gradient(180deg,rgba(10,9,7,0.95),rgba(7,6,5,0.94))] p-4 shadow-[0_20px_56px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:hidden">
            <nav className="space-y-2">
              {publicNavigation.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-transparent px-4 py-3 transition duration-200 hover:border-[rgba(214,177,94,0.14)] hover:bg-[rgba(255,255,255,0.03)]"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm tracking-[0.14em] text-[rgba(244,235,221,0.94)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[rgba(169,156,138,0.86)]">{item.description}</p>
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/api/demo-login?role=member"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] text-[rgba(244,235,221,0.96)]",
                )}
                onClick={() => setIsOpen(false)}
              >
                Member Login
              </Link>
              <Link
                href="/api/demo-login?role=admin"
                className={cn(
                  buttonVariants(),
                  "w-full rounded-full border border-[rgba(214,177,94,0.26)] bg-[linear-gradient(135deg,#f0d18a_0%,#d6b15e_50%,#a07120_100%)] text-[#181109]",
                )}
                onClick={() => setIsOpen(false)}
              >
                Admin Demo
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
