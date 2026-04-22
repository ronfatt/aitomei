"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  House,
  Search,
  Sparkles,
  Target,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthenticatedUser, NavItem, UserRole } from "@/types/domain";

const memberBottomNavigation = [
  { title: "首页", href: "/member/dashboard", icon: House },
  { title: "任务", href: "/member/missions", icon: Target },
  { title: "创作", href: "/member/content-studio", icon: WandSparkles },
  { title: "学习", href: "/member/learning", icon: BookOpen },
  { title: "我的", href: "/member/profile", icon: UserRound },
] as const;

const memberNavigationIcons = {
  "/member/dashboard": House,
  "/member/missions": Target,
  "/member/content-studio": WandSparkles,
  "/member/learning": BookOpen,
  "/member/profile": UserRound,
} as const;

const memberShellStyle = {
  "--background": "#12070F",
  "--foreground": "#F7F4F8",
  "--surface": "rgba(35,13,30,0.88)",
  "--muted": "#CDBFD0",
  "--border": "rgba(255,255,255,0.08)",
  "--gold": "#F2C86B",
  "--gold-soft": "rgba(242,200,107,0.26)",
  "--gold-strong": "#D8B15B",
  "--ring": "rgba(177,58,134,0.42)",
  "--success": "#7FE2AB",
  "--warning": "#F2C86B",
  "--panel-border": "rgba(255,255,255,0.08)",
  "--panel-bg":
    "linear-gradient(180deg,rgba(73,17,56,0.76),rgba(28,10,26,0.92))",
  "--panel-muted-border": "rgba(255,255,255,0.06)",
  "--panel-muted-bg": "rgba(255,255,255,0.04)",
  "--panel-shadow":
    "0 28px 90px rgba(5,0,9,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
  "--button-primary-bg": "linear-gradient(135deg,#F2C86B,#D8B15B 38%,#B13A86 100%)",
  "--button-primary-text": "#1D0C19",
  "--button-primary-shadow": "0 18px 48px rgba(177,58,134,0.35)",
  "--button-secondary-bg": "rgba(255,255,255,0.05)",
  "--button-secondary-hover": "rgba(255,255,255,0.09)",
  "--button-secondary-border": "rgba(255,255,255,0.08)",
  "--button-secondary-text": "#F7F4F8",
  "--button-ghost-text": "#CDBFD0",
  "--button-ghost-hover": "rgba(255,255,255,0.06)",
  "--button-outline-text": "#F2C86B",
  "--button-outline-border": "rgba(242,200,107,0.32)",
  "--button-outline-hover": "rgba(242,200,107,0.08)",
  "--badge-default-bg": "rgba(242,200,107,0.12)",
  "--badge-default-text": "#F2C86B",
  "--badge-neutral-bg": "rgba(255,255,255,0.06)",
  "--badge-neutral-text": "#CDBFD0",
  "--badge-success-bg": "rgba(127,226,171,0.12)",
  "--badge-success-text": "#7FE2AB",
  "--badge-warning-bg": "rgba(242,200,107,0.14)",
  "--badge-warning-text": "#F2C86B",
  "--input-bg": "rgba(255,255,255,0.05)",
  "--input-border": "rgba(255,255,255,0.08)",
  "--input-shadow": "inset 0 1px 0 rgba(255,255,255,0.04)",
  "--input-ring": "rgba(177,58,134,0.18)",
  "--progress-bg": "rgba(255,255,255,0.08)",
  "--progress-fill": "linear-gradient(90deg,#F2C86B,#D8B15B 38%,#B13A86 100%)",
} as CSSProperties;

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
  const isMember = role === "member";

  return (
    <div
      className={cn(
        "min-h-screen",
        isMember
          ? "bg-[radial-gradient(circle_at_top_left,rgba(177,58,134,0.22),transparent_24%),radial-gradient(circle_at_86%_12%,rgba(216,177,91,0.14),transparent_22%),linear-gradient(180deg,#12070F_0%,#160914_42%,#0D050C_100%)]"
          : "bg-[radial-gradient(circle_at_top,_rgba(237,223,198,0.45),transparent_36%),linear-gradient(180deg,#f8f3ec_0%,#f5efe8_48%,#f4eee7_100%)]",
      )}
      style={isMember ? memberShellStyle : undefined}
    >
      <div className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-4 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:px-6">
        <aside
          className={cn(
            "relative hidden overflow-hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)]",
            isMember ? "rounded-[34px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-5 backdrop-blur-xl" : "panel p-5",
          )}
        >
          <div
            className={cn(
              "absolute inset-x-6 top-0 h-px",
              isMember
                ? "bg-[linear-gradient(90deg,transparent,rgba(242,200,107,0.6),transparent)]"
                : "bg-[linear-gradient(90deg,transparent,rgba(196,168,114,0.55),transparent)]",
            )}
          />

          <BrandMark href={role === "admin" ? "/admin/dashboard" : "/member/dashboard"} />

          <div
            className={cn(
              "mt-8 flex items-center gap-3 rounded-[28px] px-4 py-4",
              isMember
                ? "border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))]"
                : "border border-[rgba(196,168,114,0.22)] bg-[rgba(255,255,255,0.6)]",
            )}
          >
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl",
                isMember
                  ? "bg-[linear-gradient(135deg,rgba(242,200,107,0.16),rgba(177,58,134,0.22))] text-[var(--gold)]"
                  : "bg-[rgba(196,168,114,0.12)] text-[var(--gold-strong)]",
              )}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {isMember ? "当前会员状态" : "当前身份"}
              </p>
              <p className="font-semibold text-[var(--foreground)]">{currentUser.displayName}</p>
              <p className="text-xs text-[var(--muted)]">{currentUser.email}</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = isMember
                ? memberNavigationIcons[item.href as keyof typeof memberNavigationIcons] ?? House
                : null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-[28px] px-4 py-4 transition",
                    isMember
                      ? active
                        ? "border border-[rgba(242,200,107,0.18)] bg-[linear-gradient(135deg,rgba(177,58,134,0.18),rgba(255,255,255,0.07))] shadow-[0_16px_40px_rgba(5,0,9,0.22)]"
                        : "border border-transparent bg-transparent hover:border-white/6 hover:bg-white/4"
                      : active
                        ? "bg-[linear-gradient(135deg,rgba(196,168,114,0.17),rgba(255,255,255,0.92))] shadow-[inset_0_0_0_1px_rgba(196,168,114,0.22)]"
                        : "hover:bg-white/70",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {Icon ? (
                      <div
                        className={cn(
                          "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl",
                          active
                            ? "bg-[linear-gradient(135deg,rgba(242,200,107,0.18),rgba(177,58,134,0.26))] text-[var(--gold)]"
                            : "bg-white/5 text-[var(--muted)]",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-6 rounded-[30px] p-5",
              isMember
                ? "border border-[rgba(242,200,107,0.12)] bg-[linear-gradient(180deg,rgba(76,17,56,0.6),rgba(21,8,20,0.92))] text-white shadow-[0_20px_50px_rgba(7,0,12,0.36)]"
                : "border border-[rgba(196,168,114,0.2)] bg-[linear-gradient(180deg,rgba(32,28,24,0.96),rgba(43,37,31,0.98))] text-white",
            )}
          >
            <Badge className="mb-3 w-fit" variant="default">
              {isMember ? "AI 助理入口" : "AI 架构就绪"}
            </Badge>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none">
              {isMember ? "让 AI 帮你先决定今天最该做什么" : "后续接入依然保持清晰"}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              {isMember
                ? "今天要发什么、先做哪一个任务、文案怎么写、客户跟进怎么讲，都可以直接交给 AI 增长助理。"
                : "Supabase、AI 教练、AI 礼宾、海报生成与任务证明审核，已经通过清晰的类型化服务层隔离，方便后续继续扩展。"}
            </p>
            <Link
              href={isMember ? "/member/ai-coach" : "/admin/ai-knowledge"}
              className={cn(buttonVariants({ variant: "secondary" }), "mt-5 w-full justify-center")}
            >
              {isMember ? "打开 AI 增长助理" : "查看 AI 知识库"}
            </Link>
          </div>
        </aside>

        <main className="space-y-4 pb-24 lg:space-y-6 lg:pb-10">
          <div
            className={cn(
              "flex items-center justify-between px-4 py-3 lg:hidden",
              isMember ? "rounded-[26px] border border-white/8 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl" : "panel",
            )}
          >
            <BrandMark compact href={role === "admin" ? "/admin/dashboard" : "/member/dashboard"} />
            <div className="flex items-center gap-2">
              <Link
                href={role === "admin" ? "/admin/proof-review" : "/member/notifications"}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--foreground)] shadow-sm",
                  isMember
                    ? "border border-white/8 bg-[rgba(255,255,255,0.05)]"
                    : "border border-[rgba(196,168,114,0.18)] bg-white/78",
                )}
              >
                <Bell className="h-5 w-5" />
              </Link>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--button-primary-bg,linear-gradient(135deg,#d9b235,#c09517))] text-sm font-semibold text-[var(--button-primary-text,white)] shadow-[var(--button-primary-shadow,0_14px_30px_rgba(185,140,28,0.22))]">
                {initials}
              </div>
            </div>
          </div>

          <header
            className={cn(
              "hidden flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between lg:flex",
              isMember
                ? "rounded-[30px] border border-white/8 bg-[rgba(255,255,255,0.035)] backdrop-blur-xl"
                : "panel",
            )}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {role === "admin" ? "管理工作台" : "会员工作台"}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--foreground)]">
                {role === "admin" ? "平台运营总览" : "每日成长首页"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isMember ? (
                <Link
                  href="/member/content-studio"
                  className="flex h-11 min-w-[220px] items-center gap-3 rounded-full border border-white/8 bg-white/5 px-4 text-sm text-[var(--muted)] transition hover:bg-white/8"
                >
                  <Search className="h-4 w-4 text-[var(--gold)]" />
                  快速进入任务、模板或创作工具
                </Link>
              ) : null}

              <Link
                href={role === "admin" ? "/admin/proof-review" : "/member/notifications"}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Bell className="mr-2 h-4 w-4" />
                {role === "admin" ? "打开审核队列" : "查看通知"}
              </Link>

              {isMember ? (
                <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/5 px-2 py-2">
                  <Badge variant="success">正常活跃</Badge>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[image:var(--button-primary-bg)] text-sm font-semibold text-[var(--button-primary-text)]">
                    {initials}
                  </div>
                </div>
              ) : (
                <Badge variant="neutral">{role === "admin" ? "角色：管理员" : "角色：会员"}</Badge>
              )}
            </div>
          </header>

          {children}
        </main>
      </div>

      {role === "member" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[rgba(18,7,15,0.92)] px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-2">
            {memberBottomNavigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                    active ? "bg-white/8 text-[var(--foreground)]" : "text-[var(--muted)]",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active ? "text-[var(--gold)]" : "text-[var(--muted)]")} />
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
