"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  FileImage,
  Flame,
  Gift,
  Medal,
  MessageSquareQuote,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { RewardOverview } from "@/lib/supabase/repositories";
import type { Campaign, LearningModule, Mission } from "@/types/domain";

interface AssetPreview {
  id: string;
  title: string;
  detail: string;
  status: string;
}

const suggestedPrompts = [
  { label: "生成今日宣传文案", value: "帮我生成今天最适合发布的宣传文案" },
  { label: "做一张专属海报", value: "帮我做一张今天可直接用的专属海报" },
  { label: "给我最优先任务", value: "告诉我今天最优先要完成的任务" },
  { label: "帮我写客户跟进话术", value: "帮我写一段客户跟进话术" },
] as const;

const quickActions = [
  {
    title: "生成海报",
    detail: "一键生成带头像宣传海报",
    href: "/member/content-studio/poster-generator",
    icon: FileImage,
  },
  {
    title: "生成文案",
    detail: "30 秒生成社媒文案",
    href: "/member/content-studio/caption-generator",
    icon: WandSparkles,
  },
  {
    title: "生成短视频",
    detail: "套用模板生成短视频",
    href: "/member/content-studio/short-video-requests",
    icon: PlayCircle,
  },
  {
    title: "提交证明",
    detail: "上传截图领取任务奖励",
    href: "/member/missions/submit-first-post",
    icon: MessageSquareQuote,
  },
] as const;

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] ?? displayName;
}

function getMissionProgress(status: Mission["status"]) {
  switch (status) {
    case "completed":
      return 100;
    case "submitted":
      return 88;
    case "in_progress":
      return 62;
    case "available":
      return 24;
    default:
      return 0;
  }
}

function missionNeedsProof(proofRequirement: string) {
  return !/^(No proof required|无需提交证明)$/i.test(proofRequirement.trim());
}

function getRewardStatusLabel(status: RewardOverview["milestones"][number]["status"]) {
  switch (status) {
    case "unlocked":
      return "已解锁";
    case "current":
      return "进行中";
    default:
      return "未解锁";
  }
}

function getMissionStatusLabel(status: Mission["status"]) {
  switch (status) {
    case "completed":
      return "已完成";
    case "submitted":
      return "已提交";
    case "in_progress":
      return "进行中";
    case "available":
      return "可开始";
    default:
      return "未解锁";
  }
}

function getCurrentTier(rewardOverview: RewardOverview) {
  return (
    rewardOverview.milestones.find((reward) => reward.status === "current") ??
    [...rewardOverview.milestones].reverse().find((reward) => reward.status === "unlocked") ??
    rewardOverview.milestones[0]
  );
}

function SectionTitle({
  title,
  actionLabel,
  href,
}: {
  title: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]/85">重点模块</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{title}</h2>
      </div>
      {actionLabel && href ? (
        <Link href={href} className="text-sm font-semibold text-[var(--gold)]/92">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function MemberMobileDashboard({
  displayName,
  missions,
  rewardOverview,
  campaigns,
  learningModules,
  recentAssets,
}: {
  displayName: string;
  missions: Mission[];
  rewardOverview: RewardOverview;
  campaigns: Campaign[];
  learningModules: LearningModule[];
  recentAssets: AssetPreview[];
}) {
  const router = useRouter();
  const [coachPrompt, setCoachPrompt] = useState("");
  const firstName = getFirstName(displayName);
  const currentMission =
    missions.find((mission) => mission.status === "in_progress") ??
    missions.find((mission) => mission.status === "submitted") ??
    missions.find((mission) => mission.status === "available") ??
    missions[0];
  const missionProgress = getMissionProgress(currentMission?.status ?? "locked");
  const currentTier = getCurrentTier(rewardOverview);
  const nextGap = rewardOverview.nextMilestonePoints
    ? Math.max(rewardOverview.nextMilestonePoints - rewardOverview.currentPoints, 0)
    : 0;
  const completedCount = missions.filter((mission) => mission.status === "completed").length;
  const streakDays = Math.max(3, Math.min(14, completedCount + 3));
  const todayRewardPoints = currentMission?.rewardPoints ?? 150;
  const progressGain = Math.max(6, Math.round((100 - rewardOverview.progressPercent) / 7));

  const todayMustDo = useMemo(
    () => [
      {
        title: campaigns[0]?.title ? `发布 ${campaigns[0].title} 主题内容` : "发布主打节庆内容",
        detail: "优先分发高转化机会内容",
      },
      {
        title: currentMission?.title ?? "生成一张专属海报",
        detail: "完成后可直接进入发布",
      },
      {
        title: missionNeedsProof(currentMission?.proofRequirement ?? "") ? "提交任务证明" : "查看任务说明",
        detail: missionNeedsProof(currentMission?.proofRequirement ?? "")
          ? "上传截图后进入奖励结算"
          : "先确认目标再推进",
      },
    ],
    [campaigns, currentMission],
  );

  const todayCanGet = useMemo(
    () => [
      {
        title: `${todayRewardPoints} 积分`,
        detail: "完成后立即计入成长进度",
      },
      {
        title: currentMission?.rewardItem ?? "创作起步奖励",
        detail: "本轮可直接解锁的奖励",
      },
      {
        title: `升级进度 +${progressGain}%`,
        detail: "今天这轮动作会明显推进等级",
      },
      {
        title: "19:30 - 21:00",
        detail: "AI 推荐今晚更适合发布",
      },
    ],
    [currentMission, progressGain, todayRewardPoints],
  );

  function openCoach(prompt?: string) {
    const resolvedPrompt = prompt ?? coachPrompt;
    startTransition(() => {
      router.push(
        resolvedPrompt
          ? `/member/ai-coach?prompt=${encodeURIComponent(resolvedPrompt)}`
          : "/member/ai-coach",
      );
    });
  }

  return (
    <div className="space-y-6 pb-6">
      <section className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="relative overflow-hidden rounded-[38px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(242,200,107,0.14),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,rgba(18,15,12,0.98),rgba(8,7,6,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_30%,rgba(255,255,255,0.02)_60%,transparent_100%)]" />
            <div className="relative space-y-6">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.58fr)_minmax(240px,0.92fr)] xl:items-start">
                <div className="max-w-[760px]">
                  <Badge variant="default">Aurex 今日增长概览</Badge>
                  <p className="mt-6 text-sm font-medium text-[var(--muted)]">早安，{firstName}</p>
                  <div className="mt-4 max-w-[22ch] space-y-3">
                    <h1
                      className="text-balance font-[family-name:var(--font-display)] font-semibold leading-[0.94] tracking-[-0.045em] text-[var(--foreground)]"
                      style={{ fontSize: "clamp(2.55rem, 4.8vw, 4.4rem)" }}
                    >
                      先把今天最重要的三件事做了
                    </h1>
                    <p className="max-w-[52ch] text-sm leading-7 text-[var(--muted)] md:text-base">
                      先推进主任务、拿到奖励，再让 AI 帮你排好接下来的客户与内容节奏。
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:pt-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/6 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">当前等级</p>
                    <p className="mt-2.5 text-[1.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--foreground)]">
                      {currentTier?.title ?? "Legacy Signature"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      距离下一等级还差 {nextGap.toLocaleString()} 积分
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/6 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">今日可得奖励</p>
                    <p className="mt-2.5 text-[1.75rem] font-semibold leading-none tracking-[-0.045em] text-[var(--gold)]">
                      {todayRewardPoints} 分
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{currentMission?.rewardItem ?? "成长奖励"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">今日主任务</p>
                    <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.045em] text-[var(--foreground)]">
                      {currentMission?.title ?? "生成第一张专属海报"}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      做完后拿到 {todayRewardPoints} 积分，并继续推进你的 Aurex Legacy 会籍进度。
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link href={`/member/missions/${currentMission?.id ?? "generate-first-poster"}`} className={cn(buttonVariants({ size: "lg" }), "px-7 whitespace-nowrap")}>
                      继续今日任务
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link href="/member/rewards" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "px-6 whitespace-nowrap !text-white")}>
                      查看奖励
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {[
                  {
                    label: "今日任务进度",
                    value: `${missionProgress}%`,
                    detail: currentMission ? getMissionStatusLabel(currentMission.status) : "待开始",
                    icon: Target,
                  },
                  {
                    label: "当前积分",
                    value: rewardOverview.currentPoints.toLocaleString(),
                    detail: "再完成一点就能升级",
                    icon: Gift,
                  },
                  {
                    label: "连续打卡",
                    value: `${streakDays} 天`,
                    detail: "保持节奏最重要",
                    icon: Flame,
                  },
                  {
                    label: "今日优先级",
                    value: "01",
                    detail: currentMission?.title ?? "继续任务",
                    icon: Medal,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex min-h-[156px] flex-col rounded-[26px] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</p>
                      <item.icon className="h-4 w-4 text-[var(--gold)]" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{item.value}</p>
                    <p className="mt-auto pt-3 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="relative overflow-hidden rounded-[38px] border border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.14),transparent_18%),linear-gradient(180deg,rgba(17,14,11,0.98),rgba(8,7,6,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%,rgba(242,200,107,0.04))]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-lg">
                  <Badge variant="default">Aurex AI Concierge</Badge>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["已连接品牌知识库", "已载入今日任务上下文", "可生成海报 / 文案 / 话术"].map((item) => (
                      <span key={item} className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)]">
                        {item}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)] md:text-4xl">
                    AI 正在协助你推进今天的 Aurex Legacy 动作
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    直接发起一句指令，AI 会帮你安排优先级、生成内容，或给出更适合高端客户沟通的跟进建议。
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(242,200,107,0.16),rgba(255,255,255,0.04))] text-[var(--gold)] shadow-[0_16px_40px_rgba(216,177,91,0.12)]">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 rounded-[30px] border border-white/8 bg-white/[0.05] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={coachPrompt}
                      onChange={(event) => setCoachPrompt(event.target.value)}
                      placeholder="问我今天先做什么，或直接让我生成文案、海报、客户跟进话术"
                      className="h-14 rounded-[22px] text-base"
                    />
                  <Button className="h-14 rounded-[22px] px-6 text-white" onClick={() => openCoach()} type="button">
                    开始协助
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => {
                        setCoachPrompt(prompt.value);
                        openCoach(prompt.value);
                      }}
                      className="group rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-left transition hover:border-[rgba(242,200,107,0.16)] hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--foreground)]">{prompt.label}</p>
                        <Zap className="h-4 w-4 text-[var(--gold)] transition group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-2 text-xs leading-6 text-[var(--muted)]">点一下，直接进入 AI 工作流</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                  { label: "AI 推荐", value: "内容加速：海报 / 文案 / 视频" },
                  { label: "AI 推荐", value: "任务建议：先做最容易形成成交势能的一项" },
                  { label: "AI 推荐", value: "客户应对：立即生成高净值跟进话术" },
                ].map((item) => (
                  <div key={item.value} className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-5 rounded-[34px] border-white/8 bg-[linear-gradient(180deg,rgba(17,14,11,0.94),rgba(8,7,6,0.98))] p-6">
          <SectionTitle title="今日行动面板" />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(242,200,107,0.12)] text-[var(--foreground)]">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">今天先做什么</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">先把关键动作排顺</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {todayMustDo.map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(242,200,107,0.18)] text-[var(--gold)]">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">今天能获得</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">看清回报，再开始执行</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {todayCanGet.map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-base font-semibold text-[var(--gold)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {currentMission ? (
          <Card className="relative overflow-hidden rounded-[34px] border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.12),transparent_22%),linear-gradient(180deg,rgba(20,17,14,0.98),rgba(8,7,6,0.98))] p-6 xl:col-span-7">
            <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_center,rgba(242,200,107,0.08),transparent_62%)] lg:block" />
            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default">重点任务</Badge>
                    <Badge variant="neutral">任务 {currentMission.sequence}</Badge>
                    <Badge variant="warning">{getMissionStatusLabel(currentMission.status)}</Badge>
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)] md:text-4xl">
                    {currentMission.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
                    这是今天最直接影响进度与奖励的一步。先把它做完，后面的成交、跟进与会员升级动作会更顺。
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-white/5 px-5 py-4 lg:min-w-[240px]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">做完你会得到</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--gold)]">
                    {currentMission.rewardPoints} 分
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">{currentMission.rewardItem}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-white/8 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>当前进度</span>
                    <span>{missionProgress}%</span>
                  </div>
                  <Progress value={missionProgress} className="mt-3 h-3" />
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">解锁条件</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{currentMission.unlockCondition}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">提交要求</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{currentMission.proofRequirement}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">现在就执行</p>
                  <div className="mt-4 space-y-3">
                    <Link
                      href={`/member/missions/${currentMission.id}`}
                      className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
                    >
                      立即执行
                    </Link>
                    <Link
                      href={`/member/missions/${currentMission.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
                    >
                      {missionNeedsProof(currentMission.proofRequirement) ? "提交证明" : "查看说明"}
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                    主按钮直接推进进度，辅助按钮补充说明或提交证明。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="rounded-[34px] border-white/8 bg-[linear-gradient(180deg,rgba(17,14,11,0.94),rgba(8,7,6,0.98))] p-6 xl:col-span-5">
          <SectionTitle title="快捷操作" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-[28px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-5 transition hover:-translate-y-1 hover:border-[rgba(242,200,107,0.14)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(242,200,107,0.14),rgba(255,255,255,0.05))] text-[var(--gold)]">
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{action.detail}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
                  立即打开
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="rounded-[34px] border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.1),transparent_20%),linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))] p-6 xl:col-span-7">
          <SectionTitle title="积分 / 等级 / 奖励" actionLabel="查看完整奖励" href="/member/rewards" />

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-white/8 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">当前积分</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                    {rewardOverview.currentPoints.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(242,200,107,0.16),rgba(255,255,255,0.04))] text-[var(--gold)]">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>距离下一等级</span>
                  <span>{rewardOverview.progressPercent}%</span>
                </div>
                <Progress value={rewardOverview.progressPercent} className="h-3" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">下一等级差距</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--gold)]">
                    {nextGap.toLocaleString()} 分
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">下一阶段权益</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {rewardOverview.milestones.find((reward) => reward.status === "current")?.badge ?? "高级奖励资格"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {rewardOverview.milestones.slice(0, 3).map((reward, index) => (
                <div
                  key={reward.id}
                  className={cn(
                    "relative rounded-[26px] border p-4",
                    reward.status === "current"
                      ? "border-[rgba(242,200,107,0.18)] bg-[linear-gradient(135deg,rgba(242,200,107,0.08),rgba(255,255,255,0.04))]"
                      : reward.status === "unlocked"
                        ? "border-white/8 bg-[rgba(255,255,255,0.05)]"
                        : "border-white/8 bg-[rgba(255,255,255,0.03)]",
                  )}
                >
                  <div className="absolute left-4 top-5 h-3 w-3 rounded-full bg-[var(--gold)] shadow-[0_0_20px_rgba(242,200,107,0.55)]" />
                  {index < 2 ? (
                    <div className="absolute bottom-[-18px] left-[21px] top-[34px] w-px bg-[linear-gradient(180deg,rgba(242,200,107,0.35),rgba(255,255,255,0.02))]" />
                  ) : null}
                  <div className="pl-7">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{reward.title}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{reward.badge}</p>
                      </div>
                      <Badge
                        variant={
                          reward.status === "unlocked"
                            ? "success"
                            : reward.status === "current"
                              ? "default"
                              : "warning"
                        }
                      >
                        {getRewardStatusLabel(reward.status)}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{reward.description}</p>
                    <p className="mt-3 text-sm font-semibold text-[var(--gold)]">
                      {reward.requiredPoints.toLocaleString()} 分解锁
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionTitle title="进行中的活动" actionLabel="查看全部活动" href="/member/campaigns" />
        <div className="grid gap-4 xl:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <Card
              key={campaign.id}
              className={cn(
                "rounded-[32px] border-white/8 p-5",
                index === 0
                  ? "bg-[linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))]"
                  : "bg-[linear-gradient(180deg,rgba(16,14,11,0.94),rgba(8,7,6,0.96))]",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <Badge variant={index === 0 ? "default" : "neutral"}>
                    {index === 0 ? "主推活动" : "进行中"}
                  </Badge>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                      {campaign.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{campaign.summary}</p>
                  </div>
                </div>
                <CalendarClock className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <div className="mt-5 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{campaign.theme}</span>
                <span>{campaign.activePeriod}</span>
              </div>
              <Link href="/member/campaigns" className={cn(buttonVariants({ variant: index === 0 ? "default" : "secondary" }), "mt-5 inline-flex h-11 px-5")}>
                {campaign.cta}
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="rounded-[34px] border-white/8 bg-[linear-gradient(180deg,rgba(17,14,11,0.94),rgba(8,7,6,0.98))] p-6 xl:col-span-6">
          <SectionTitle title="学习中心" actionLabel="进入学习中心" href="/member/learning" />
          <div className="mt-6 space-y-4">
            {learningModules.slice(0, 3).map((lesson, index) => (
              <div
                key={lesson.id}
                className={cn(
                  "rounded-[28px] border border-white/8 p-5",
                  index === 0
                    ? "bg-[linear-gradient(135deg,rgba(242,200,107,0.08),rgba(255,255,255,0.04))]"
                    : "bg-[rgba(255,255,255,0.04)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "neutral"}>{index === 0 ? "继续学习" : lesson.category}</Badge>
                      <span className="text-sm text-[var(--muted)]">{lesson.duration}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{lesson.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{lesson.summary}</p>
                  </div>
                  <BookOpen className="mt-1 h-5 w-5 text-[var(--gold)]" />
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>完成进度</span>
                    <span>{lesson.completionRate}</span>
                  </div>
                  <Progress value={Number.parseInt(lesson.completionRate, 10) || 0} />
                </div>
                <Link
                  href={`/member/learning/quizzes/${lesson.quizId}`}
                  className={cn(buttonVariants({ variant: index === 0 ? "default" : "secondary" }), "mt-5 inline-flex h-11 px-5")}
                >
                  继续学习
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[34px] border-white/8 bg-[linear-gradient(180deg,rgba(17,14,11,0.94),rgba(8,7,6,0.98))] p-6 xl:col-span-6">
          <SectionTitle title="最近生成的素材" actionLabel="打开素材库" href="/member/asset-library" />
          <div className="mt-6 space-y-4">
            {recentAssets.map((asset, index) => (
              <div
                key={asset.id}
                className={cn(
                  "rounded-[28px] border border-white/8 p-5",
                  index === 0 ? "bg-[linear-gradient(135deg,rgba(242,200,107,0.08),rgba(255,255,255,0.04))]" : "bg-[rgba(255,255,255,0.04)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="neutral">{asset.status}</Badge>
                      <span className="text-sm text-[var(--muted)]">最近生成成果</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{asset.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{asset.detail}</p>
                  </div>
                  <Star className="mt-1 h-5 w-5 text-[var(--gold)]" />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/member/asset-library" className={cn(buttonVariants({ variant: index === 0 ? "default" : "secondary" }), "h-11 px-5")}>
                    查看内容
                  </Link>
                  <Link href="/member/content-studio" className={cn(buttonVariants({ variant: "ghost" }), "h-11 px-2 text-[var(--gold)]")}>
                    继续创作
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(43,16,37,0.88),rgba(18,8,18,0.96))] px-5 py-4 shadow-[0_18px_60px_rgba(7,0,12,0.3)] lg:hidden">
        <Link href="/member/ai-coach" className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(242,200,107,0.16),rgba(177,58,134,0.24))] text-[var(--gold)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--foreground)]">继续使用 AI 增长助理</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">让 AI 帮你把今天最重要的一步先定下来</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-[var(--gold)]" />
        </Link>
      </div>
    </div>
  );
}
