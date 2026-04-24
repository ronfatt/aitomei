import Link from "next/link";
import { ArrowRight, BookOpen, Gem, ShieldCheck, Star, Users } from "lucide-react";

import { appConfig } from "@/config/app";
import { campaigns, learningModules, missions } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const platformTiles = [
  {
    title: "Heritage Gold Plaque",
    detail: "限量编号、定制故事与高端礼赠价值。",
    accent: "High Jewelry",
  },
  {
    title: "Privilege Account",
    detail: "把会员权益、消费额度与升级礼遇沉淀成长期关系。",
    accent: "Membership",
  },
  {
    title: "Digital Provenance",
    detail: "绑定唯一编号证书，支撑溯源、防伪与未来资产接口。",
    accent: "Provenance",
  },
  {
    title: "Global Club",
    detail: "连到活动邀请、私享服务、优先购买与跨区域权益网络。",
    accent: "Maison",
  },
] as const;

const trustSignals = [
  { icon: Gem, title: "文化珠宝资产", detail: "高端收藏、礼赠与传承叙事。" },
  { icon: Users, title: "会员权益账户", detail: "从单次成交升级为账户制关系。" },
  { icon: ShieldCheck, title: "数字确权体系", detail: "记录 provenance、编号与审计基础。" },
  { icon: BookOpen, title: "资本故事接口", detail: "为未来 RWA 与国际治理预留基础设施。" },
] as const;

export function LandingHero() {
  return (
    <section className="gold-sweep relative overflow-hidden rounded-[44px] border border-[rgba(216,177,91,0.12)] bg-[radial-gradient(circle_at_18%_18%,rgba(216,177,91,0.12),transparent_18%),linear-gradient(180deg,#050505_0%,#080706_46%,#0b0908_100%)] px-6 py-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] lg:px-7 lg:py-7">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_16%,rgba(216,177,91,0.04)_48%,transparent_62%)]" />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="luxury-fade-lift flex min-h-[720px] flex-col rounded-[34px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(13,11,9,0.96),rgba(7,6,5,0.94))] px-8 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] lg:px-10 lg:py-10">
          <div className="flex items-center gap-4 text-[rgba(242,227,198,0.62)]">
            <div className="space-y-2 pr-2">
              <p className="text-sm tracking-[0.28em] text-[var(--gold)]">01</p>
              <div className="space-y-2 py-2">
                <span className="block h-2 w-2 rounded-full bg-[var(--gold)]" />
                <span className="block h-2 w-2 rounded-full bg-white/18" />
                <span className="block h-2 w-2 rounded-full bg-white/18" />
                <span className="block h-2 w-2 rounded-full bg-white/18" />
                <span className="block h-2 w-2 rounded-full bg-white/18" />
              </div>
              <p className="text-sm tracking-[0.28em] text-[rgba(242,227,198,0.54)]">05</p>
            </div>

            <div className="space-y-8">
              <Badge className="luxury-fade-lift-delay-1 w-fit rounded-full border border-[rgba(216,177,91,0.18)] bg-[rgba(216,177,91,0.08)] px-6 py-2 text-sm normal-case tracking-[0.02em] text-[var(--gold)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                Global Luxury Heritage Assets Platform
              </Badge>

              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.38em] text-[rgba(242,227,198,0.58)]">
                  {appConfig.company}
                </p>
                <h1 className="luxury-fade-lift-delay-1 max-w-[10ch] font-[family-name:var(--font-display)] text-[clamp(3.9rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.062em] text-[rgba(233,194,117,0.98)]">
                  TIMELESS
                  <br />
                  HERITAGE
                  <br />
                  ASSET VALUE
                </h1>
                <div className="flex items-center gap-4 text-[rgba(242,227,198,0.56)]">
                  <span className="h-px w-20 bg-[linear-gradient(90deg,rgba(216,177,91,0.95),rgba(216,177,91,0.1))]" />
                  <Star className="h-3.5 w-3.5 text-[var(--gold)]" />
                </div>
                <p className="luxury-fade-lift-delay-2 max-w-[33rem] text-[1.02rem] leading-9 text-[rgba(242,227,198,0.72)]">
                  以高端文化金章、珠宝消费权益、数字确权证书与全球会员网络，重新定义奢侈消费品的长期资产关系。
                </p>
              </div>

              <div className="luxury-fade-lift-delay-2 flex flex-wrap gap-4">
                <Link
                  href="/api/demo-login?role=member"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-14 rounded-none border border-[rgba(216,177,91,0.42)] bg-transparent px-8 text-[0.95rem] font-medium tracking-[0.2em] text-[var(--gold)] shadow-none hover:bg-[rgba(216,177,91,0.08)] hover:text-[rgba(245,234,214,0.96)]",
                  )}
                >
                  DISCOVER MEMBER
                </Link>
                <Link
                  href="/member/dashboard"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "h-14 rounded-none border border-white/10 bg-[rgba(255,255,255,0.03)] px-8 text-[0.95rem] font-medium tracking-[0.18em] text-[rgba(245,234,214,0.88)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white",
                  )}
                >
                  VIEW DASHBOARD
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>

              <div className="luxury-fade-lift-delay-3 grid gap-4 pt-6 sm:grid-cols-3">
                {[
                  { label: "任务路径", value: `${missions.length}`, detail: "从启用到黑卡成长闭环" },
                  { label: "活跃模块", value: `${learningModules.length}`, detail: "知识、AI 与会员礼遇协同" },
                  { label: "当前主题", value: `${campaigns.length}`, detail: "围绕活动与收藏叙事持续更新" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[rgba(216,177,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(242,227,198,0.48)]">
                      {item.label}
                    </p>
                    <p className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-[-0.05em] text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[rgba(242,227,198,0.6)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="luxury-fade-lift-delay-2 relative min-h-[720px] overflow-hidden rounded-[34px] border border-[rgba(216,177,91,0.12)] bg-[radial-gradient(circle_at_76%_34%,rgba(216,177,91,0.14),transparent_12%),radial-gradient(circle_at_68%_42%,rgba(255,255,255,0.06),transparent_10%),linear-gradient(180deg,#050505_0%,#080706_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18)_18%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.1)_100%)]" />
            <div className="absolute left-6 right-6 top-6 flex items-center justify-center gap-9 text-[12px] uppercase tracking-[0.28em] text-[rgba(245,234,214,0.26)]">
              <span>Collections</span>
              <span>Jewelry</span>
              <span>Maison</span>
              <span>Services</span>
            </div>

            <div className="gold-breathe absolute inset-y-[10%] right-[10%] w-[42%] rounded-[46%] border border-[rgba(216,177,91,0.14)] bg-[radial-gradient(circle_at_50%_44%,rgba(216,177,91,0.18),rgba(216,177,91,0.02)_34%,transparent_62%)] blur-[1px]" />
            <div className="gold-breathe absolute right-[12%] top-[16%] h-[380px] w-[380px] rounded-full border border-[rgba(216,177,91,0.12)] bg-[radial-gradient(circle_at_52%_48%,rgba(255,255,255,0.04),transparent_32%),radial-gradient(circle_at_50%_50%,rgba(216,177,91,0.12),transparent_56%)]" />
            <div className="absolute right-[15%] top-[22%] h-[270px] w-[270px] rounded-full border border-[rgba(216,177,91,0.16)]" />
            <div className="absolute right-[26%] top-[27%] h-[150px] w-[150px] rotate-45 rounded-[28px] border border-[rgba(216,177,91,0.16)] bg-[linear-gradient(180deg,rgba(22,19,16,0.82),rgba(10,9,8,0.96))] shadow-[0_20px_80px_rgba(0,0,0,0.36)]" />
            <div className="gold-breathe absolute right-[17%] top-[30%] h-[110px] w-[110px] rotate-45 rounded-[24px] border border-[rgba(216,177,91,0.22)] bg-[radial-gradient(circle,rgba(216,177,91,0.26),rgba(216,177,91,0.04)_62%,transparent_78%)] shadow-[0_0_50px_rgba(216,177,91,0.12)]" />

            <div className="absolute bottom-[20%] left-[10%] rounded-[26px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(11,10,9,0.88),rgba(8,7,6,0.82))] px-5 py-4 backdrop-blur-sm shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--gold)]">Signature Scene</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[1.8rem] tracking-[-0.04em] text-[rgba(245,234,214,0.9)]">
                Rare Elegance
              </p>
              <p className="mt-2 max-w-[15rem] text-sm leading-7 text-[rgba(242,227,198,0.62)]">
                以黑金光影、陈列层次与产品细节，建立高端珠宝品牌的第一眼气场。
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 grid gap-px bg-[rgba(216,177,91,0.14)] md:grid-cols-4">
              {platformTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="bg-[linear-gradient(180deg,rgba(8,7,6,0.94),rgba(8,7,6,0.88))] p-5 backdrop-blur-sm transition duration-300 hover:bg-[linear-gradient(180deg,rgba(16,13,11,0.96),rgba(10,9,8,0.9))]"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--gold)]">{tile.accent}</p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-[1.6rem] tracking-[-0.04em] text-[rgba(245,234,214,0.94)]">
                    {tile.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[rgba(242,227,198,0.66)]">{tile.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid gap-4 border-t border-[rgba(216,177,91,0.1)] pt-6 xl:grid-cols-4">
        {trustSignals.map((item) => (
          <div
            key={item.title}
            className="luxury-fade-lift-delay-3 flex items-start gap-4 rounded-[24px] border border-[rgba(216,177,91,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(216,177,91,0.18)] text-[var(--gold)]">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[rgba(245,234,214,0.82)]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[rgba(242,227,198,0.58)]">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
