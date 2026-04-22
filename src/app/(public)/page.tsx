import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
  FileImage,
  LayoutTemplate,
  MessageSquareQuote,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import { LandingHero } from "@/components/marketing/landing-hero";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { campaigns, newsItems, rewardMilestones } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const journeySteps = [
  {
    step: "01",
    title: "进入平台",
    description: "会员注册后进入一个围绕清晰引导与持续动能而设计的高端工作台。",
  },
  {
    step: "02",
    title: "完善资料",
    description: "上传个人照片并补充资料，解锁个性化且品牌安全的内容创作流程。",
  },
  {
    step: "03",
    title: "创作内容",
    description: "通过官方活动模板生成海报、文案与短视频请求。",
  },
  {
    step: "04",
    title: "成长互动",
    description: "完成任务、提交证明、解锁奖励，并在 AI 引导下持续学习与参与。",
  },
] as const;

const capabilityCards = [
  {
    icon: LayoutTemplate,
    title: "个性化海报生成器",
    description: "基于官方模板完成会员照片、活动主题与素材历史沉淀的海报个性化流程。",
  },
  {
    icon: WandSparkles,
    title: "AI 文案生成器",
    description: "按不同社媒平台生成优雅、节庆、教育型或推广型文案。",
  },
  {
    icon: PlayCircle,
    title: "短视频生成器",
    description: "提交带有会员姓名、行动引导与未来可扩展渲染架构的品牌短视频请求。",
  },
  {
    icon: Target,
    title: "任务与奖励",
    description: "通过递进式任务、优雅的里程碑语言、可视化追踪与高端奖励解锁形成成长动力。",
  },
  {
    icon: BookOpen,
    title: "学习中心",
    description: "以品牌故事、产品教育与测验逐步增强会员表达信心。",
  },
  {
    icon: ShieldCheck,
    title: "证明提交与审核",
    description: "支持提交链接、附上截图、保留审计轨迹，并对接清晰的管理端审核流程。",
  },
] as const;

const aiCards = [
  {
    icon: Sparkles,
    title: "AI 教练",
    subtitle: "你的成长导师",
    description:
      "围绕产品知识、发帖方向、活动话术与更专业的推广方式，获得个性化引导。",
    bullets: [
      "提供每日内容方向建议提示",
      "支持更符合高端品牌语境的产品与活动解释",
      "通过教练分类推动任务持续完成",
    ],
  },
  {
    icon: MessageSquareQuote,
    title: "AI 礼宾",
    subtitle: "你的每日助理",
    description:
      "在聊天开始前，就先把活动更新、主推产品、待完成任务与主动式会员洞察卡展示给你。",
    bullets: [
      "每日汇总品牌活动与最新通知",
      "待完成任务提醒与进度摘要",
      "主推产品与公告驱动的洞察卡片",
    ],
  },
] as const;

const platformSignals = [
  { label: "企业级架构", icon: CheckCircle2 },
  { label: "AI 驱动", icon: Sparkles },
  { label: "高端设计", icon: Crown },
] as const;

const storytellingLayers = [
  {
    title: "活动主视觉舞台",
    detail:
      "用于承接官方节庆活动、系列叙事与面向会员的品牌主视觉大片。",
  },
  {
    title: "珠宝微距细节位",
    detail:
      "用于强调材质细节、工艺质感与高端系列特写的近景摄影区域。",
  },
  {
    title: "门店体验叙事位",
    detail:
      "通过生活方式或门店画面强化信任感、服务体验与品牌氛围。",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-8 lg:space-y-10">
      <LandingHero />

      <section
        id="platform"
        className="grid gap-8 rounded-[38px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(246,238,228,0.92))] px-6 py-8 shadow-[0_26px_80px_rgba(88,68,40,0.08)] lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-10"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">平台愿景</p>
            <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.96] tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
              为每一位会员打造完整的成长生态
            </h2>
            <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
              TOMEI 会员成长平台把高端珠宝品牌叙事、AI 引导、活动参与与任务驱动式互动整合在一起，
              让会员在每日使用中感受到被引导、被奖励、被教育，也更有信心持续为品牌发声。
            </p>
            <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
              整体体验通过官方模板、清晰学习路径与每日辅助界面维持结构化与品牌安全，
              更像一个高端品牌随行伙伴，而不是普通的 SaaS 仪表板。
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {platformSignals.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-lg text-[var(--muted)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(196,168,114,0.28)] bg-white/80 text-[var(--gold)]">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(196,168,114,0.2)] bg-[radial-gradient(circle_at_20%_20%,rgba(255,228,155,0.42),transparent_24%),radial-gradient(circle_at_74%_34%,rgba(255,214,110,0.28),transparent_18%),linear-gradient(145deg,#8d5d16_0%,#c49128_16%,#f1d08f_34%,#7b4d0f_58%,#d6ae4f_78%,#8d5d16_100%)] p-5 shadow-[0_24px_70px_rgba(122,78,17,0.28)] luxury-shimmer lg:p-7">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_18%,rgba(81,45,10,0.22))]" />
          <div className="relative h-full min-h-[420px] rounded-[28px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,247,228,0.18),rgba(125,77,13,0.22))] p-5 backdrop-blur-[1px] lg:p-7">
            <div className="grid h-full gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/30 bg-[rgba(255,247,228,0.38)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/80">精选活动</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {campaigns[0]?.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/80">{campaigns[0]?.summary}</p>
                </div>
                <div className="rounded-[26px] border border-white/30 bg-[rgba(77,45,9,0.34)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">奖励里程碑</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {rewardMilestones[1]?.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {rewardMilestones[1]?.description}
                  </p>
                </div>
              </div>

              <div className="grid flex-1 items-end gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[30px] border border-white/26 bg-[rgba(255,251,241,0.18)] p-5 shadow-[0_20px_55px_rgba(88,54,10,0.18)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">品牌可控内容中心</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <FileImage className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">海报模板</p>
                    </div>
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <WandSparkles className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">文案风格</p>
                    </div>
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <PlayCircle className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">视频请求</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/26 bg-[rgba(255,250,241,0.72)] p-5 shadow-[0_20px_55px_rgba(88,54,10,0.2)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                    每日品牌陪伴
                  </p>
                  <div className="mt-4 space-y-3">
                    {["今日重点", "待完成任务提醒", "主推产品卡片"].map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-[rgba(196,168,114,0.18)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--foreground)]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 rounded-[38px] border border-white/60 bg-[linear-gradient(180deg,rgba(248,243,236,0.94),rgba(243,235,223,0.9))] px-6 py-10 shadow-[0_24px_80px_rgba(88,68,40,0.08)] lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-12">
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">活动叙事层次</p>
          <h2 className="font-[family-name:var(--font-display)] text-5xl leading-[0.96] tracking-[-0.05em] text-[var(--foreground)] lg:text-6xl">
            以摄影驱动的高端珠宝官网感版块
          </h2>
          <p className="text-lg leading-9 text-[var(--muted)]">
            首页现在预留了大面积编辑感摄影位，用来承接真实活动主视觉、系列近景特写与更完整的品牌世界观画面，
            而不是停留在普通 dashboard 式装饰层级。
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="editorial-photo-slot min-h-[260px] p-5">
              <div className="relative z-10 flex h-full items-end">
                <div className="rounded-[24px] border border-white/26 bg-white/16 px-4 py-3 text-white backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/72">摄影展示位</p>
                  <p className="mt-2 text-xl font-semibold">活动主视觉图片</p>
                </div>
              </div>
            </div>
            <div className="editorial-photo-slot luxury-float min-h-[220px] p-5">
              <div className="relative z-10 flex h-full items-end justify-end">
                <div className="rounded-[24px] border border-white/26 bg-white/16 px-4 py-3 text-white backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/72">摄影展示位</p>
                  <p className="mt-2 text-xl font-semibold">珠宝微距细节图</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {storytellingLayers.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-5 rounded-[32px] border border-[rgba(224,210,191,0.8)] bg-white/82 p-6 shadow-[0_18px_60px_rgba(93,74,44,0.08)] transition duration-500 hover:-translate-y-1 lg:grid-cols-[110px_minmax(0,1fr)]"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d9b235,#c09517)] text-4xl font-semibold tracking-[-0.04em] text-white shadow-[0_18px_40px_rgba(185,140,28,0.2)]">
                0{index + 1}
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                  编辑式版位
                </p>
                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="text-lg leading-9 text-[var(--muted)]">{item.detail}</p>
              </div>
            </div>
          ))}

          <div className="rounded-[32px] border border-[rgba(196,168,114,0.2)] bg-[linear-gradient(180deg,rgba(45,35,23,0.98),rgba(58,45,31,0.98))] p-7 text-white shadow-[0_24px_70px_rgba(40,28,17,0.18)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#e0bc54]">高端体验原则</p>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-[-0.05em]">
              强视觉层次、轻动效、零杂乱感。
            </h3>
            <p className="mt-4 text-lg leading-9 text-[rgba(246,236,219,0.8)]">
              最终效果更接近国际珠宝品牌活动官网，同时在底层叠加产品系统与会员运营逻辑，
              而不是一页普通的 B2B 软件首页。
            </p>
          </div>
        </div>
      </section>

      <section
        id="journey"
        className="rounded-[38px] border border-white/60 bg-[linear-gradient(180deg,rgba(248,243,236,0.95),rgba(245,237,226,0.92))] px-6 py-10 shadow-[0_24px_80px_rgba(88,68,40,0.08)] lg:px-10 lg:py-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">会员旅程</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
            如何运作
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            以简洁、优雅与高频回访价值为核心设计的一套顺畅启用与持续成长体验。
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-[12%] right-[12%] top-28 hidden h-px bg-[linear-gradient(90deg,rgba(212,179,95,0.2),rgba(212,179,95,0.7),rgba(212,179,95,0.2))] lg:block" />
          <div className="grid gap-6 xl:grid-cols-4">
            {journeySteps.map((item) => (
              <Card
                key={item.step}
                className="rounded-[32px] border border-[rgba(224,210,191,0.85)] bg-white/86 p-8 text-center shadow-[0_18px_60px_rgba(93,74,44,0.1)] transition duration-500 hover:-translate-y-1"
              >
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d9b235,#c09517)] text-5xl font-semibold tracking-[-0.04em] text-white shadow-[0_22px_50px_rgba(185,140,28,0.24)]">
                  {item.step}
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-6 text-lg leading-9 text-[var(--muted)]">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ai"
        className="overflow-hidden rounded-[38px] border border-[rgba(85,67,42,0.48)] bg-[radial-gradient(circle_at_top,rgba(215,176,47,0.14),transparent_24%),linear-gradient(180deg,#31271d_0%,#433524_100%)] px-6 py-10 shadow-[0_30px_100px_rgba(40,28,17,0.26)] lg:px-10 lg:py-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#e0bc54]">智能辅助</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-white lg:text-7xl">
            你的专属 AI 团队
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(246,236,219,0.78)]">
            以导师式支持、主动礼宾卡片与高端日常引导，帮助会员持续活跃，同时避免机械感。
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {aiCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[34px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#d9b235,#c09517)] text-white shadow-[0_20px_45px_rgba(185,140,28,0.22)]">
                  <card.icon className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-semibold tracking-[-0.04em] text-white">{card.title}</h3>
                  <p className="text-2xl font-medium text-[#e0bc54]">{card.subtitle}</p>
                </div>
              </div>
              <p className="mt-8 text-lg leading-9 text-[rgba(246,236,219,0.86)]">{card.description}</p>
              <div className="mt-8 space-y-4">
                {card.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-center gap-4 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.06)] px-5 py-4 text-lg text-[rgba(255,242,224,0.92)]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7b02f]/60 text-[#d7b02f]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="rounded-[38px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,245,0.96),rgba(246,238,229,0.92))] px-6 py-10 shadow-[0_24px_80px_rgba(88,68,40,0.08)] lg:px-10 lg:py-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">核心能力</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
            会员成长所需的一切能力
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            一套覆盖会员启用、品牌学习、活动参与、AI 支持与管理治理的高端运营底座。
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {capabilityCards.map((card) => (
            <Card
              key={card.title}
              className="rounded-[32px] border border-[rgba(224,210,191,0.82)] bg-white/88 p-8 shadow-[0_18px_60px_rgba(93,74,44,0.08)] transition duration-500 hover:-translate-y-1"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#d9b235,#c09517)] text-white shadow-[0_18px_42px_rgba(185,140,28,0.22)]">
                <card.icon className="h-10 w-10" />
              </div>
              <h3 className="mt-8 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                {card.title}
              </h3>
              <p className="mt-5 text-lg leading-9 text-[var(--muted)]">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="admin" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,239,230,0.92))] p-8 shadow-[0_22px_70px_rgba(93,74,44,0.08)] lg:p-10">
          <Badge className="w-fit">已具备管理端 MVP</Badge>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-6xl">
            管理效率清晰，不显繁杂。
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            可在一个为日常运营而设计的实用管理后台中，统一管理会员、任务、奖励、模板、
            学习模块、证明审核与活动曝光内容。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/member/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base")}>
              查看会员端
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/admin/dashboard"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-base")}
            >
              查看管理后台
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "进行中活动", value: `${campaigns.length}`, detail: campaigns[0]?.title },
            { label: "最新通知", value: newsItems[0]?.category ?? "活动", detail: newsItems[0]?.title },
            { label: "当前里程碑", value: rewardMilestones[1]?.title ?? "标志影响力", detail: "奖励阶梯管理" },
            { label: "品牌安全", value: "模板驱动", detail: "可控的内容生成流程" },
          ].map((metric) => (
            <Card
              key={metric.label}
              className="rounded-[30px] border border-[rgba(224,210,191,0.82)] bg-white/88 p-6 shadow-[0_18px_55px_rgba(93,74,44,0.08)] transition duration-500 hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{metric.label}</p>
              <p className="mt-5 font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{metric.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-[rgba(215,176,47,0.16)] bg-[linear-gradient(180deg,rgba(255,250,243,0.94),rgba(248,241,231,0.92))] px-6 py-7 text-center shadow-[0_20px_60px_rgba(93,74,44,0.06)] lg:px-10">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <div className="space-y-3 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">高端会员激活</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.05em] text-[var(--foreground)] lg:text-5xl">
              高端品牌互动体验，为规模化运营而设计。
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base")}>
              从引导开始
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-base")}
            >
              会员登录
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
