import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const demoCopy = {
  login: {
    eyebrow: "演示入口",
    title: "直接进入平台演示",
    description:
      "为了方便你直接向客户演示，现在登录页已临时切换为一键进入模式，不显示账号与密码输入。",
  },
  signup: {
    eyebrow: "快速演示",
    title: "选择要展示的版本",
    description:
      "你可以直接进入会员首页或管理员后台，无需注册流程，适合现场演示整个平台体验。",
  },
  forgot: {
    eyebrow: "演示模式",
    title: "当前无需密码恢复",
    description:
      "演示期间可直接进入系统查看完整流程，后续若恢复真实账号机制，再切回正式登录即可。",
  },
} as const;

export function DemoAccessCard({ variant }: { variant: keyof typeof demoCopy }) {
  const copy = demoCopy[variant];

  return (
    <Card className="w-full max-w-xl p-8 lg:p-10">
      <BrandMark />
      <div className="mt-8 space-y-3">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-none text-[var(--foreground)]">
          {copy.title}
        </h1>
        <p className="max-w-lg text-sm leading-7 text-[var(--muted)]">{copy.description}</p>
      </div>

      <div className="mt-8 grid gap-4">
        <Link
          href="/api/demo-login?role=member"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-14 justify-between rounded-[24px] px-5 text-base",
          )}
        >
          <span className="flex items-center gap-3">
            <Sparkles className="h-4 w-4" />
            进入会员端演示
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/api/demo-login?role=admin"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "h-14 justify-between rounded-[24px] px-5 text-base",
          )}
        >
          <span className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" />
            进入管理后台演示
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 rounded-[24px] border border-[rgba(196,168,114,0.18)] bg-white/72 p-4">
        <Badge variant="neutral">当前模式</Badge>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          这是临时演示模式入口。点击后会直接进入对应角色页面，方便你快速展示 AI
          Coach、任务系统、内容工具与管理流程。
        </p>
      </div>
    </Card>
  );
}
