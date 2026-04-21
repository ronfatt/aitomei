"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthenticatedUser, NavItem, UserRole } from "@/types/domain";

export function AppShell({
  role,
  navigation,
  currentUser,
  children,
}: {
  role: UserRole;
  navigation: NavItem[];
  currentUser: AuthenticatedUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(237,223,198,0.45),transparent_36%),linear-gradient(180deg,#f8f3ec_0%,#f5efe8_48%,#f4eee7_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="panel relative overflow-hidden p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(196,168,114,0.55),transparent)]" />
          <BrandMark href={role === "admin" ? "/admin/dashboard" : "/member/dashboard"} />
          <div className="mt-8 flex items-center gap-3 rounded-3xl border border-[rgba(196,168,114,0.22)] bg-[rgba(255,255,255,0.6)] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(196,168,114,0.12)] text-[var(--gold-strong)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Signed in as</p>
              <p className="font-semibold text-[var(--foreground)]">{currentUser.displayName}</p>
              <p className="text-xs text-[var(--muted)]">{currentUser.email}</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-3xl px-4 py-3 transition",
                    active
                      ? "bg-[linear-gradient(135deg,rgba(196,168,114,0.17),rgba(255,255,255,0.92))] shadow-[inset_0_0_0_1px_rgba(196,168,114,0.22)]"
                      : "hover:bg-white/70",
                  )}
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.description}</p>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[28px] border border-[rgba(196,168,114,0.2)] bg-[linear-gradient(180deg,rgba(32,28,24,0.96),rgba(43,37,31,0.98))] p-5 text-white">
            <Badge className="mb-3 w-fit" variant="default">
              AI-Ready Foundation
            </Badge>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none">Future integrations stay clean</p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Supabase, AI Coach, concierge, poster generation, and proof validation are all separated behind typed service layers.
            </p>
          </div>
        </aside>

        <main className="space-y-6 pb-10">
          <header className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {role === "admin" ? "Admin Workspace" : "Member Workspace"}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--foreground)]">
                {role === "admin" ? "Operational control" : "Daily growth dashboard"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={role === "admin" ? "/admin/proof-review" : "/member/notifications"} className={cn(buttonVariants({ variant: "secondary" }))}>
                <Bell className="mr-2 h-4 w-4" />
                {role === "admin" ? "Open review queue" : "View notifications"}
              </Link>
              <Badge variant="neutral">{role === "admin" ? "Role: admin" : "Role: member"}</Badge>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
