import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  MessageSquareQuote,
  Play,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import { appConfig } from "@/config/app";
import { campaigns, learningModules, missions } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const valuePillars = [
  { icon: WandSparkles, label: "Personalized Marketing Tools" },
  { icon: Sparkles, label: "AI Coach & Concierge" },
  { icon: Target, label: "Missions & Rewards" },
  { icon: BookOpen, label: "Learning Center" },
  { icon: Bot, label: "Campaign Tracking" },
] as const;

const intelligenceCards = [
  {
    icon: Sparkles,
    label: "AI Coach",
    value: "Daily Guidance",
    note: "Professional, supportive, mentor-like recommendations for products, posts, and campaigns.",
  },
  {
    icon: MessageSquareQuote,
    label: "AI Concierge",
    value: "Proactive Daily Cards",
    note: "Today’s focus, featured product, pending mission reminders, and latest announcements.",
  },
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-[44px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(234,216,183,0.36),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(196,168,114,0.18),transparent_22%),linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,240,232,0.94))] px-6 py-8 shadow-[0_34px_100px_rgba(86,66,39,0.12)] lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_20%,rgba(255,255,255,0.06)_42%,transparent_56%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:items-center">
        <div className="space-y-8 luxury-fade-lift">
          <Badge className="w-fit rounded-full border border-[rgba(196,168,114,0.22)] bg-white/76 px-8 py-3 text-base normal-case tracking-[-0.02em] text-[var(--gold-strong)] shadow-[0_14px_35px_rgba(143,110,56,0.08)]">
            AI-Powered Member Ecosystem
          </Badge>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold-strong)]">
              {appConfig.company} Malaysia
            </p>
            <h1 className="max-w-5xl font-[family-name:var(--font-display)] text-5xl leading-[0.9] tracking-[-0.055em] text-[var(--foreground)] sm:text-6xl lg:text-[6.9rem]">
              Empowering Every Member to Grow with{" "}
              <span className="bg-[linear-gradient(180deg,#d7b02f,#b88b13)] bg-clip-text text-transparent">
                TOMEI
              </span>
            </h1>
            <p className="max-w-3xl text-lg leading-9 text-[var(--muted)] lg:text-[1.9rem] lg:leading-[1.6]">
              The premium AI-powered growth platform designed for modern jewelry members.
              Personalized marketing tools, elegant mission progress, concierge assistance, and
              campaign-ready learning in one refined ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-16 px-9 text-xl")}>
              Request Demo
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <Link
              href="/member/dashboard"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-16 border-[rgba(196,168,114,0.42)] bg-white/80 px-9 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
              )}
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Overview
            </Link>
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[28px] border border-[rgba(196,168,114,0.16)] bg-white/74 p-5 shadow-[0_14px_38px_rgba(94,73,41,0.07)] transition duration-500 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Mission Ladder</p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em] text-[var(--foreground)]">
                {missions.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Progressive missions from onboarding to campaign finale.
              </p>
            </div>
            <div className="rounded-[28px] border border-[rgba(196,168,114,0.16)] bg-white/74 p-5 shadow-[0_14px_38px_rgba(94,73,41,0.07)] transition duration-500 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Learning Modules</p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em] text-[var(--foreground)]">
                {learningModules.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Brand fluency, product education, and guided AI support.
              </p>
            </div>
            <div className="rounded-[28px] border border-[rgba(196,168,114,0.16)] bg-white/74 p-5 shadow-[0_14px_38px_rgba(94,73,41,0.07)] transition duration-500 hover:-translate-y-1 sm:col-span-2 xl:col-span-1">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Live Campaigns</p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em] text-[var(--foreground)]">
                {campaigns.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Brand-approved participation prompts and always-on visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="relative grid gap-5 lg:pl-4">
          <div className="grid gap-5 sm:grid-cols-[1.08fr_0.92fr]">
            <div className="editorial-photo-slot luxury-shimmer min-h-[370px] p-6 lg:min-h-[470px]">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="max-w-[220px] rounded-[24px] border border-white/26 bg-white/16 px-4 py-3 text-white backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/72">Brand Photography Slot</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">Hero campaign portrait</p>
                </div>
                <div className="max-w-[260px] rounded-[24px] border border-white/26 bg-[rgba(73,42,8,0.2)] px-4 py-4 text-white backdrop-blur-sm">
                  <p className="text-sm font-medium text-[#fff0be]">Premium member storytelling</p>
                  <p className="mt-2 text-sm leading-7 text-white/82">
                    Designed to hold official campaign photography, collection portraits, or festive
                    brand-led creative.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="editorial-photo-slot luxury-float min-h-[180px] p-5">
                <div className="relative z-10 flex h-full items-end">
                  <div className="rounded-[22px] border border-white/28 bg-white/18 px-4 py-3 text-white backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/72">Macro Detail Slot</p>
                    <p className="mt-2 text-lg font-semibold">Jewelry close-up frame</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(252,248,242,0.84))] p-5 shadow-[0_32px_90px_rgba(86,66,39,0.16)] backdrop-blur-sm">
                {intelligenceCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-[rgba(196,168,114,0.14)] bg-white/76 px-4 py-4 shadow-[0_14px_40px_rgba(94,73,41,0.08)] first:mb-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#d6af33,#bb8f15)] text-white shadow-[0_18px_35px_rgba(185,140,28,0.28)]">
                        <card.icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <p className="text-base font-medium text-[var(--gold-strong)]">{card.label}</p>
                        <p className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
                          {card.value}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{card.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-10 grid gap-8 border-t border-[rgba(196,168,114,0.14)] pt-8 sm:grid-cols-2 xl:grid-cols-5">
        {valuePillars.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-4 text-center luxury-fade-lift">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(196,168,114,0.16)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.92),rgba(244,236,223,0.84))] text-[var(--gold)] shadow-[0_20px_40px_rgba(143,110,56,0.08)]">
              <item.icon className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium tracking-[-0.02em] text-[var(--muted)]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
