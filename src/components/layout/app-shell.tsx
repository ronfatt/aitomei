"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, House, Sparkles, Target, UserRound, WandSparkles } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthenticatedUser, NavItem, UserRole } from "@/types/domain";

const memberBottomNavigation = [
  { title: "首页", href: "/member/dashboard", icon: House },
  { title: "任务", href: "/member/missions", icon: Target },
  { title: "创作", href: "/member/content-studio", icon: WandSparkles },
  { title: "AI 教练", href: "/member/ai-coach", icon: Sparkles },
  { title: "我的", href: "/member/profile", icon: UserRound },
] as const;

function getInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "TM";
}

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
  const initials = getInitials(currentUser.displayName);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(237,223,198,0.45),transparent_36%),linear-gradient(180deg,#f8f3ec_0%,#f5efe8_48%,#f4eee7_100%)]">
      <div className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-4 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:px-6">
        <aside className="panel relative hidden overflow-hidden p-5 lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)]">
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(196,168,114,0.55),transparent)]" />
          <BrandMark href={role === "admin" ? "/admin/dashboard" : "/member/dashboard"} />
          <div className="mt-8 flex items-center gap-3 rounded-3xl border border-[rgba(196,168,114,0.22)] bg-[rgba(255,255,255,0.6)] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(196,168,114,0.12)] text-[var(--gold-strong)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">当前身份</p>
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
              AI 架构就绪
            </Badge>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none">后续接入依然保持清晰</p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Supabase、AI 教练、AI 礼宾、海报生成与任务证明审核，已经通过清晰的类型化服务层隔离，方便后续继续扩展。
            </p>
          </div>
        </aside>

        <main className="space-y-4 pb-24 lg:space-y-6 lg:pb-10">
          <div className="panel flex items-center justify-between px-4 py-3 lg:hidden">
            <BrandMark compact href={role === "admin" ? "/admin/dashboard" : "/member/dashboard"} />
            <div className="flex items-center gap-2">
              <Link
                href={role === "admin" ? "/admin/proof-review" : "/member/notifications"}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(196,168,114,0.18)] bg-white/78 text-[var(--foreground)] shadow-sm"
              >
                <Bell className="h-5 w-5" />
              </Link>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d9b235,#c09517)] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(185,140,28,0.22)]">
                {initials}
              </div>
            </div>
          </div>

          <header className="panel hidden flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between lg:flex">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {role === "admin" ? "管理工作台" : "会员工作台"}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--foreground)]">
                {role === "admin" ? "平台运营总览" : "每日成长首页"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={role === "admin" ? "/admin/proof-review" : "/member/notifications"}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Bell className="mr-2 h-4 w-4" />
                {role === "admin" ? "打开审核队列" : "查看通知"}
              </Link>
              <Badge variant="neutral">{role === "admin" ? "角色：管理员" : "角色：会员"}</Badge>
            </div>
          </header>

          {children}
        </main>
      </div>

      {role === "member" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(196,168,114,0.14)] bg-[rgba(248,243,236,0.92)] px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-2">
            {memberBottomNavigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                    active
                      ? "bg-[rgba(196,168,114,0.14)] text-[var(--foreground)]"
                      : "text-[var(--muted)]",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active ? "text-[var(--gold-strong)]" : "text-[var(--muted)]")} />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
