import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Gem,
  Globe,
  Landmark,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { LandingHero } from "@/components/marketing/landing-hero";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { campaigns } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const platformLayers = [
  {
    title: "Physical Luxury Layer",
    description: "以限量文化金章、珠宝首饰与高端礼赠商品承接真实成交与收藏价值。",
  },
  {
    title: "Membership Privilege Layer",
    description: "把消费额度、升级礼遇、私享服务与圈层活动沉淀进长期账户关系。",
  },
  {
    title: "Digital Provenance Layer",
    description: "通过数字证书、编号记录、防伪与 provenance 为未来资产接口打底。",
  },
] as const;

const productLadder = [
  {
    tier: "Entry",
    title: "Heritage Access Pack",
    description: "适合首购、送礼与轻量引流的入门体验套组。",
  },
  {
    tier: "Core",
    title: "Signature Legacy Pack",
    description: "结合金章、珠宝权益值与会员礼遇的主力成交方案。",
  },
  {
    tier: "Premium",
    title: "Family Heritage Pack",
    description: "面向家族纪念、定制铭刻与专属档案的高端传承套组。",
  },
  {
    tier: "Elite",
    title: "Founder Circle / Black Card",
    description: "提供私人珠宝顾问、闭门活动与全球权益的顶层会籍。",
  },
] as const;

const membershipSignals = [
  {
    icon: Sparkles,
    title: "Global Membership Club",
    description: "把新品优先权、线下礼遇、私人定制与全球门店权益连成一个高端俱乐部。",
  },
  {
    icon: WalletCards,
    title: "Privilege Account Logic",
    description: "从一次性零售走向会员账户制，让复购、升级与长期关系变得可经营。",
  },
  {
    icon: ShieldCheck,
    title: "Digital Provenance Certificate",
    description: "每件商品绑定唯一证书，支持确权、防伪、所有权记录与可审计故事链。",
  },
  {
    icon: Gem,
    title: "Luxury Heritage Story",
    description: "不是普通珠宝店，而是文化珠宝品牌、会员生态与数字资产基础设施的结合。",
  },
] as const;

const capitalSignals = [
  {
    icon: Building2,
    title: "Luxury Brand",
    detail: "高毛利、高溢价与强品牌叙事。",
  },
  {
    icon: BriefcaseBusiness,
    title: "Membership Economy",
    detail: "从单次交易走向账户制关系。",
  },
  {
    icon: Landmark,
    title: "Asset Digitization",
    detail: "实物商品与数字权属的映射基础。",
  },
  {
    icon: Globe,
    title: "RWA Optionality",
    detail: "为未来合规资产化接口预留空间。",
  },
] as const;

const luxuryCardClass =
  "rounded-[30px] border border-[rgba(216,177,91,0.14)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(9,8,7,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(216,177,91,0.2)]";

const luxuryCardSoftClass =
  "rounded-[28px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-300 hover:border-[rgba(216,177,91,0.16)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]";

export default function LandingPage() {
  return (
    <div className="space-y-10 bg-[linear-gradient(180deg,#030303_0%,#070606_100%)] pb-10 lg:space-y-12">
      <LandingHero />

      <section
        id="platform"
        className="luxury-fade-lift grid gap-7 rounded-[38px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(9,8,7,0.98),rgba(13,11,10,0.96))] px-6 py-9 shadow-[0_28px_90px_rgba(0,0,0,0.32)] lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-11"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">平台定位</p>
            <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.96] tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-7xl">
              Luxury + Heritage + Digital Ownership
            </h2>
            <p className="max-w-3xl text-lg leading-9 text-[rgba(242,227,198,0.72)]">
              Aurex Legacy 不是普通珠宝店，不是普通文创，也不是投机型 Web3 页面。它把高端文化珠宝、会员权益账户与数字确权结构，组合成一个更适合长期复购、品牌资本化与全球扩张的黑金会员生态。
            </p>
          </div>

          <div className="grid gap-4">
            {platformLayers.map((item) => (
              <div
                key={item.title}
                className={cn(luxuryCardSoftClass, "p-5")}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">Platform Layer</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[34px] border border-[rgba(216,177,91,0.12)] bg-[radial-gradient(circle_at_top_right,rgba(216,177,91,0.1),transparent_20%),linear-gradient(180deg,rgba(20,17,14,0.98),rgba(11,10,9,0.98))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.2)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">Problem to Solution</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className={cn(luxuryCardSoftClass, "p-5")}>
                <p className="text-sm uppercase tracking-[0.18em] text-[rgba(242,227,198,0.52)]">行业痛点</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[rgba(242,227,198,0.7)]">
                  <li>高客单、低频复购</li>
                  <li>品牌溢价强、用户沉淀弱</li>
                  <li>线下体验强、资本叙事弱</li>
                  <li>RWA 热，但缺少真实消费场景</li>
                </ul>
              </div>
              <div className={cn(luxuryCardSoftClass, "p-5")}>
                <p className="text-sm uppercase tracking-[0.18em] text-[rgba(242,227,198,0.52)]">解决方案</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[rgba(242,227,198,0.7)]">
                  <li>高端文化金章与珠宝组合成交</li>
                  <li>会员权益账户与圈层礼遇沉淀</li>
                  <li>数字确权证书支撑 provenance</li>
                  <li>为未来 RWA 基础设施打底</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {capitalSignals.map((item) => (
              <div
                key={item.title}
                className={cn(luxuryCardSoftClass, "p-5")}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.16)] text-[var(--gold)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="journey"
        className="luxury-fade-lift-delay-1 rounded-[38px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(8,7,6,0.98),rgba(12,10,9,0.96))] px-6 py-11 shadow-[0_28px_90px_rgba(0,0,0,0.32)] lg:px-10 lg:py-14"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">产品层级</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-7xl">
            从首购体验到黑卡圈层
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(242,227,198,0.7)]">
            用清晰的产品梯度，把引流、成交、升级、定制和会员传承关系串成一个长期 ladder。
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-4">
          {productLadder.map((item) => (
            <Card
              key={item.title}
              className={cn(luxuryCardClass, "p-8")}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(216,177,91,0.16)] bg-[rgba(216,177,91,0.08)] text-lg font-semibold tracking-[0.12em] text-[var(--gold)]">
                {item.tier}
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-[rgba(245,234,214,0.94)]">
                {item.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="ai"
        className="luxury-fade-lift-delay-2 overflow-hidden rounded-[38px] border border-[rgba(216,177,91,0.1)] bg-[radial-gradient(circle_at_top,rgba(216,177,91,0.12),transparent_22%),linear-gradient(180deg,#090807_0%,#0f0d0b_100%)] px-6 py-11 shadow-[0_30px_100px_rgba(0,0,0,0.34)] lg:px-10 lg:py-14"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">会员生态</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-7xl">
            让高端成交走向长期关系
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(242,227,198,0.72)]">
            会员不是附属功能，而是 Aurex Legacy 的商业中轴。它承接消费权益、私享礼遇、活动邀约、顾问服务与未来跨区域门店权益互通。
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {membershipSignals.map((item) => (
            <div
              key={item.title}
              className="rounded-[34px] border border-[rgba(216,177,91,0.14)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(8,7,6,0.98))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.18)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[rgba(216,177,91,0.16)] bg-[rgba(216,177,91,0.08)] text-[var(--gold)]">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                {item.title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-[rgba(242,227,198,0.7)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="luxury-fade-lift-delay-3 rounded-[38px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(8,7,6,0.98),rgba(12,10,9,0.96))] px-6 py-11 shadow-[0_28px_90px_rgba(0,0,0,0.32)] lg:px-10 lg:py-14"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">数字确权</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-7xl">
            为 provenance 与 RWA 打基础，而不是空讲概念
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(242,227,198,0.7)]">
            Aurex Legacy 的数字层先做产品编号、会员账户、消费权益、资产凭证与审计数据，让它先成为资本市场能理解的基础设施，再谈更远的合规资产化接口。
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {[
            {
              title: "唯一编号证书",
              description: "每件商品绑定唯一编号、批次与故事资料，形成可追溯 provenance。",
            },
            {
              title: "会员账户沉淀",
              description: "把权益值、消费记录、升级动作和礼遇状态统一进长期账户结构。",
            },
            {
              title: "审计与资本接口",
              description: "把数据治理、合规记录与未来 RWA 兼容性放进长期路线，而不是 retail promise。",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className={cn(luxuryCardClass, "p-8")}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">Digital Layer</p>
              <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                {item.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="admin" className="luxury-fade-lift-delay-3 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(8,7,6,0.98),rgba(13,11,10,0.96))] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.28)] lg:p-10">
          <Badge className="w-fit">运营后台已就绪</Badge>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-6xl">
            从品牌运营到会员治理，都有一套可执行的后台。
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(242,227,198,0.7)]">
            演示版已经具备会员端、管理端、AI 教练、任务审核、内容中心和活动管理的产品骨架，方便你直接向客户展示黑金品牌世界观与实际系统落地能力。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/api/demo-login?role=member"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 border border-[rgba(216,177,91,0.36)] bg-[linear-gradient(135deg,#f2c86b,#d8b15b_55%,#8f6a2c_100%)] px-8 text-base text-[#140e08] shadow-[0_18px_40px_rgba(216,177,91,0.18)] hover:brightness-[1.04]",
              )}
            >
              进入会员端
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/api/demo-login?role=admin"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 border-[rgba(216,177,91,0.16)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(9,8,7,0.98))] px-8 text-base text-[rgba(245,234,214,0.9)] hover:bg-[linear-gradient(180deg,rgba(24,20,16,0.98),rgba(10,9,8,1))]",
              )}
            >
              进入管理后台
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "当前主题", value: campaigns[0]?.title ?? "Heritage Launch", detail: "用于 demo 的主推活动叙事" },
            { label: "品牌定位", value: "Luxury Heritage", detail: "文化珠宝 + 会员生态 + 数字确权" },
            { label: "治理路线", value: "Phase 1-3", detail: "Revenue foundation to capital readiness" },
            { label: "资本语言", value: "RWA Optionality", detail: "战略方向，不是当前零售承诺" },
          ].map((metric) => (
            <Card
              key={metric.label}
              className={cn(luxuryCardClass, "p-6")}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[rgba(242,227,198,0.5)]">{metric.label}</p>
              <p className="mt-5 font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{metric.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="luxury-fade-lift-delay-3 rounded-[34px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(8,7,6,0.98),rgba(12,10,9,0.96))] px-6 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:px-10">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <div className="space-y-3 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Aurex Legacy Demo</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.05em] text-[rgba(245,234,214,0.96)] lg:text-5xl">
              用黑金品牌叙事，直接带客户走进系统。
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/demo-login?role=member"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 border border-[rgba(216,177,91,0.36)] bg-[linear-gradient(135deg,#f2c86b,#d8b15b_55%,#8f6a2c_100%)] px-8 text-base text-[#140e08] shadow-[0_18px_40px_rgba(216,177,91,0.18)]",
              )}
            >
              会员演示
            </Link>
            <Link
              href="/api/demo-login?role=admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 border-[rgba(216,177,91,0.24)] bg-[rgba(255,255,255,0.02)] px-8 text-base text-[rgba(245,234,214,0.88)] hover:bg-[rgba(216,177,91,0.08)] hover:text-[rgba(245,234,214,0.96)]",
              )}
            >
              管理端演示
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
