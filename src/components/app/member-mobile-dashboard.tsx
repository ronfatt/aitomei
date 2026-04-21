"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  FileImage,
  Gift,
  MessageSquareQuote,
  PlayCircle,
  Sparkles,
  Target,
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
  "我今天适合发什么内容？",
  "帮我写一段文案",
  "显示我的下一个任务",
  "解释今天的活动重点",
] as const;

const quickActions = [
  { title: "生成海报", href: "/member/content-studio/poster-generator", icon: FileImage },
  { title: "生成文案", href: "/member/content-studio/caption-generator", icon: WandSparkles },
  { title: "生成短视频", href: "/member/content-studio/short-video-requests", icon: PlayCircle },
  { title: "提交证明", href: "/member/missions/submit-first-post", icon: MessageSquareQuote },
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
      return 18;
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

function getTodayBrief(
  mission: Mission | undefined,
  campaigns: Campaign[],
  learningModules: LearningModule[],
) {
  return [
    {
      label: "今日重点",
      value: "主打节庆送礼内容",
      detail: "用精致产品故事搭配温和而有质感的行动引导。",
    },
    {
      label: "待完成任务",
      value: mission?.title ?? "继续完成下一个任务",
      detail: mission?.status === "submitted" ? "等待审核中" : "现在可以继续推进",
    },
    {
      label: "最新活动",
      value: campaigns[0]?.title ?? "精选活动",
      detail: campaigns[0]?.activePeriod ?? "进行中",
    },
    {
      label: "主推产品",
      value: "传承金镯系列",
      detail: "很适合今天用于家庭氛围与节庆主题内容。",
    },
    {
      label: "品牌更新",
      value: learningModules[0]?.title ?? "品牌学习内容已更新",
      detail: "如果你有 8 分钟，现在就可以快速学习一次。",
    },
  ];
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
  const todayBrief = useMemo(
    () => getTodayBrief(currentMission, campaigns, learningModules),
    [campaigns, currentMission, learningModules],
  );
  const missionProgress = getMissionProgress(currentMission?.status ?? "locked");
  const unlockedReward = rewardOverview.milestones.find((reward) => reward.status === "unlocked");

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
    <div className="mx-auto max-w-md space-y-4 pb-4 lg:max-w-none">
      <section className="panel rounded-[32px] px-5 py-5">
        <p className="text-[13px] font-medium text-[var(--muted)]">你好，{firstName}</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-[2.1rem] leading-none tracking-[-0.04em] text-[var(--foreground)]">
          欢迎回到你的成长首页
        </h1>
      </section>

      <section className="panel overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(235,219,190,0.45),transparent_34%),linear-gradient(180deg,rgba(255,252,247,0.98),rgba(248,242,233,0.95))] p-5 shadow-[0_22px_60px_rgba(88,68,40,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="w-fit" variant="default">
              AI 教练
            </Badge>
            <h2 className="mt-4 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[var(--foreground)]">
              你的专属成长导师
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              你可以直接询问产品、发帖建议、任务进度或最新活动，并立即进入 AI 对话。
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#d9b235,#c09517)] text-white shadow-[0_18px_40px_rgba(185,140,28,0.22)]">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[24px] border border-[rgba(196,168,114,0.16)] bg-white/82 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
          <Input
            value={coachPrompt}
            onChange={(event) => setCoachPrompt(event.target.value)}
            placeholder="询问产品、发帖灵感、任务安排或活动重点……"
            className="h-12 border-0 bg-transparent px-1 shadow-none focus:ring-0"
          />
          <Button className="h-11 rounded-2xl px-4" onClick={() => openCoach()} type="button">
            进入
          </Button>
        </div>

        <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setCoachPrompt(prompt);
                openCoach(prompt);
              }}
              className="snap-start whitespace-nowrap rounded-full border border-[rgba(196,168,114,0.18)] bg-white/78 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            今日简报
          </h2>
          <Link href="/member/ai-concierge" className="text-sm font-semibold text-[var(--gold-strong)]">
            打开 AI 礼宾
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {todayBrief.map((item) => (
            <Card key={item.label} className="rounded-[28px] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
              <p className="mt-3 text-base font-semibold leading-6 tracking-[-0.02em] text-[var(--foreground)]">
                {item.value}
              </p>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {currentMission ? (
        <section className="panel rounded-[30px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="neutral">任务 {currentMission.sequence}</Badge>
              <h2 className="mt-3 text-[1.45rem] font-semibold leading-7 tracking-[-0.03em] text-[var(--foreground)]">
                {currentMission.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{currentMission.description}</p>
            </div>
            <Target className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>进度</span>
              <span>{missionProgress}%</span>
            </div>
            <Progress value={missionProgress} className="h-3" />
          </div>

          <div className="mt-5 rounded-[22px] border border-[rgba(196,168,114,0.14)] bg-white/72 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">下一项奖励</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {currentMission.rewardPoints} 积分 · {currentMission.rewardItem}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <Link
              href={`/member/missions/${currentMission.id}`}
              className={cn(buttonVariants(), "min-w-0 flex-1 justify-center")}
            >
              继续任务
            </Link>
            {missionNeedsProof(currentMission.proofRequirement) ? (
              <Link
                href={`/member/missions/${currentMission.id}`}
                className={cn(buttonVariants({ variant: "secondary" }), "min-w-0 flex-1 justify-center")}
              >
                提交证明
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            快捷操作
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="rounded-[28px] p-4 transition hover:-translate-y-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(217,178,53,0.18),rgba(192,149,23,0.14))] text-[var(--gold-strong)]">
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-semibold leading-6 text-[var(--foreground)]">
                  {action.title}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            进行中的活动
          </h2>
          <Link href="/member/campaigns" className="text-sm font-semibold text-[var(--gold-strong)]">
            查看全部
          </Link>
        </div>
        <div className="flex snap-x gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="min-w-[265px] snap-start rounded-[30px] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,240,232,0.95))] p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                {campaign.activePeriod}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {campaign.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-[var(--muted)]">{campaign.theme}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{campaign.summary}</p>
              <Link
                href="/member/campaigns"
                className={cn(buttonVariants({ variant: "secondary" }), "mt-5 inline-flex h-11 px-4")}
              >
                {campaign.cta}
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            学习中心
          </h2>
          <Link href="/member/learning" className="text-sm font-semibold text-[var(--gold-strong)]">
            继续学习
          </Link>
        </div>
        <div className="space-y-3">
          {learningModules.slice(0, 3).map((lesson, index) => (
            <Card key={lesson.id} className="rounded-[28px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {index === 0 ? "继续课程" : lesson.category}
                  </p>
                  <h3 className="mt-2 text-base font-semibold leading-6 text-[var(--foreground)]">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{lesson.summary}</p>
                </div>
                <BookOpen className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{lesson.duration}</span>
                <span>完成度 {lesson.completionRate}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="panel rounded-[30px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="default">奖励与徽章</Badge>
            <h2 className="mt-3 text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {rewardOverview.currentPoints.toLocaleString()} 积分
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {rewardOverview.nextMilestonePoints
                ? `距离下一个里程碑还差 ${Math.max(rewardOverview.nextMilestonePoints - rewardOverview.currentPoints, 0)} 积分。`
                : "当前最高里程碑已解锁。"}
            </p>
          </div>
          <Gift className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <span>距离下一级奖励</span>
            <span>{rewardOverview.progressPercent}%</span>
          </div>
          <Progress value={rewardOverview.progressPercent} className="h-3" />
        </div>

        <div className="mt-5 grid gap-3">
          {rewardOverview.milestones.slice(0, 3).map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between rounded-[22px] border border-[rgba(196,168,114,0.14)] bg-white/74 px-4 py-3"
            >
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
          ))}
        </div>

        {unlockedReward ? (
          <div className="mt-5 rounded-[22px] border border-[rgba(196,168,114,0.14)] bg-[linear-gradient(180deg,rgba(255,248,237,0.9),rgba(250,242,228,0.82))] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">已解锁奖励</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{unlockedReward.title}</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            最近生成的素材
          </h2>
          <Link href="/member/asset-library" className="text-sm font-semibold text-[var(--gold-strong)]">
            素材库
          </Link>
        </div>
        <div className="space-y-3">
          {recentAssets.map((asset) => (
            <Card key={asset.id} className="rounded-[28px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{asset.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{asset.detail}</p>
                </div>
                <Badge variant="neutral">{asset.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Link
        href="/member/ai-coach"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex h-14 w-full items-center justify-between rounded-[24px] border-[rgba(196,168,114,0.2)] bg-white/84 px-5",
        )}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(217,178,53,0.14)] text-[var(--gold-strong)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">继续使用 AI 教练</span>
        </span>
        <ChevronRight className="h-4 w-4 text-[var(--gold-strong)]" />
      </Link>
    </div>
  );
}
