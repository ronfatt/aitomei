import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Crown,
  FileImage,
  LayoutTemplate,
  MessageSquareQuote,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
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
    title: "Join Platform",
    description: "Members sign up and enter a premium dashboard designed around clarity and momentum.",
  },
  {
    step: "02",
    title: "Upload Profile",
    description: "Add a personal photo and profile details to unlock personalized brand-safe content flows.",
  },
  {
    step: "03",
    title: "Create Content",
    description: "Generate posters, captions, and short-video requests using official campaign templates.",
  },
  {
    step: "04",
    title: "Grow & Engage",
    description: "Complete missions, submit proof, unlock rewards, and learn with AI-powered guidance.",
  },
] as const;

const capabilityCards = [
  {
    icon: LayoutTemplate,
    title: "Personalized Poster Generator",
    description: "Official template-based poster personalization with member photos, campaign themes, and saved asset history.",
  },
  {
    icon: WandSparkles,
    title: "AI Caption Generator",
    description: "Generate elegant, festive, educational, or promotional captions tuned to each social platform.",
  },
  {
    icon: PlayCircle,
    title: "Short Video Builder",
    description: "Queue branded short-form video requests with member names, CTAs, and a future-ready rendering abstraction.",
  },
  {
    icon: Target,
    title: "Mission & Rewards",
    description: "Progressive missions, tasteful milestone language, visual tracking, and premium reward unlocks.",
  },
  {
    icon: BookOpen,
    title: "Learning Center",
    description: "Brand story modules, product education, and quizzes that improve member confidence over time.",
  },
  {
    icon: ShieldCheck,
    title: "Proof Submission Review",
    description: "Submit URLs, attach screenshots, preserve audit trails, and support clean admin review workflows.",
  },
] as const;

const aiCards = [
  {
    icon: Sparkles,
    title: "AI Coach",
    subtitle: "Your Growth Mentor",
    description:
      "Receive personalized guidance on product knowledge, posting ideas, campaign talking points, and professional promotion best practices.",
    bullets: [
      "Suggested prompts for daily content direction",
      "Luxury-safe product and campaign explanation support",
      "Mission encouragement with coaching categories",
    ],
  },
  {
    icon: MessageSquareQuote,
    title: "AI Concierge",
    subtitle: "Your Daily Assistant",
    description:
      "Stay informed with campaign updates, featured products, pending missions, and proactive member insight cards before chat even begins.",
    bullets: [
      "Daily digest of brand campaigns and latest notices",
      "Pending mission reminders and progress summaries",
      "Featured products and announcement-led insight cards",
    ],
  },
] as const;

const platformSignals = [
  { label: "Enterprise-Ready", icon: CheckCircle2 },
  { label: "AI-Powered", icon: Sparkles },
  { label: "Premium Design", icon: Crown },
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">Platform Vision</p>
            <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.96] tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
              A Complete Growth Ecosystem for Every Member
            </h2>
            <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
              TOMEI Member Growth Platform blends luxury jewelry storytelling with AI-enabled
              guidance, campaign participation, and mission-driven engagement. Members are guided,
              rewarded, educated, and empowered to show up for the brand every day.
            </p>
            <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
              The experience stays structured and brand-safe through official templates, clear
              learning pathways, and daily assistance surfaces that feel more like a premium brand
              companion than a generic dashboard.
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

        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(196,168,114,0.2)] bg-[radial-gradient(circle_at_20%_20%,rgba(255,228,155,0.42),transparent_24%),radial-gradient(circle_at_74%_34%,rgba(255,214,110,0.28),transparent_18%),linear-gradient(145deg,#8d5d16_0%,#c49128_16%,#f1d08f_34%,#7b4d0f_58%,#d6ae4f_78%,#8d5d16_100%)] p-5 shadow-[0_24px_70px_rgba(122,78,17,0.28)] lg:p-7">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_18%,rgba(81,45,10,0.22))]" />
          <div className="relative h-full min-h-[420px] rounded-[28px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,247,228,0.18),rgba(125,77,13,0.22))] p-5 backdrop-blur-[1px] lg:p-7">
            <div className="grid h-full gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/30 bg-[rgba(255,247,228,0.38)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/80">Featured Campaign</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {campaigns[0]?.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/80">{campaigns[0]?.summary}</p>
                </div>
                <div className="rounded-[26px] border border-white/30 bg-[rgba(77,45,9,0.34)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">Reward Milestone</p>
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
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">Brand-Controlled Studio</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <FileImage className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">Poster Templates</p>
                    </div>
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <WandSparkles className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">Caption Styles</p>
                    </div>
                    <div className="rounded-[22px] border border-white/25 bg-[rgba(255,255,255,0.12)] p-4 text-white">
                      <PlayCircle className="h-7 w-7 text-[#fff0b8]" />
                      <p className="mt-6 text-sm font-medium">Video Requests</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/26 bg-[rgba(255,250,241,0.72)] p-5 shadow-[0_20px_55px_rgba(88,54,10,0.2)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                    Daily Brand Companion
                  </p>
                  <div className="mt-4 space-y-3">
                    {["Today’s focus", "Pending mission reminder", "Featured product card"].map((item) => (
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

      <section
        id="journey"
        className="rounded-[38px] border border-white/60 bg-[linear-gradient(180deg,rgba(248,243,236,0.95),rgba(245,237,226,0.92))] px-6 py-10 shadow-[0_24px_80px_rgba(88,68,40,0.08)] lg:px-10 lg:py-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">Member Journey</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
            How It Works
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            A seamless onboarding and growth experience designed for simplicity, elegance, and daily
            return value.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-[12%] right-[12%] top-28 hidden h-px bg-[linear-gradient(90deg,rgba(212,179,95,0.2),rgba(212,179,95,0.7),rgba(212,179,95,0.2))] lg:block" />
          <div className="grid gap-6 xl:grid-cols-4">
            {journeySteps.map((item) => (
              <Card
                key={item.step}
                className="rounded-[32px] border border-[rgba(224,210,191,0.85)] bg-white/86 p-8 text-center shadow-[0_18px_60px_rgba(93,74,44,0.1)]"
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
          <p className="text-xs uppercase tracking-[0.3em] text-[#e0bc54]">Intelligent Assistance</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-white lg:text-7xl">
            Your Personal AI Team
          </h2>
          <p className="mt-5 text-lg leading-9 text-[rgba(246,236,219,0.78)]">
            Mentor-like support, proactive concierge surfaces, and premium daily guidance designed
            to keep members active without feeling mechanical.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {aiCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[34px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">Core Capabilities</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-7xl">
            Everything Your Members Need to Succeed
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            A premium operating layer for member onboarding, education, campaign participation, AI
            support, and admin governance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {capabilityCards.map((card) => (
            <Card
              key={card.title}
              className="rounded-[32px] border border-[rgba(224,210,191,0.82)] bg-white/88 p-8 shadow-[0_18px_60px_rgba(93,74,44,0.08)]"
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
          <Badge className="w-fit">Admin-ready MVP</Badge>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] text-[var(--foreground)] lg:text-6xl">
            Operational control without clutter.
          </h2>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            Manage users, missions, rewards, templates, learning modules, proof reviews, and
            campaign visibility from a practical admin workspace built for daily use.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/member/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base")}>
              Explore member routes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/admin/dashboard"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-base")}
            >
              Explore admin workspace
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Active Campaigns", value: `${campaigns.length}`, detail: campaigns[0]?.title },
            { label: "Latest Notice", value: newsItems[0]?.category ?? "Campaign", detail: newsItems[0]?.title },
            { label: "Current Milestone", value: rewardMilestones[1]?.title ?? "Signature Presence", detail: "Reward ladder management" },
            { label: "Brand Safety", value: "Template-led", detail: "Controlled content generation workflows" },
          ].map((metric) => (
            <Card
              key={metric.label}
              className="rounded-[30px] border border-[rgba(224,210,191,0.82)] bg-white/88 p-6 shadow-[0_18px_55px_rgba(93,74,44,0.08)]"
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-strong)]">Premium Member Activation</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.05em] text-[var(--foreground)] lg:text-5xl">
              Luxury-brand engagement, structured for scale.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base")}>
              Start with onboarding
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-base")}
            >
              Member login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
