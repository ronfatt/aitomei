import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  campaigns,
  memberActivities,
  memberMetrics,
  missions,
  newsItems,
  products,
  recentGeneratedAssets,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Member Dashboard"
        title="A daily workspace that makes participation feel clear"
        description="Members see their profile completion, mission momentum, campaign visibility, AI assistance, and next recommended action in one refined dashboard."
        action={{ label: "Open AI Coach", href: "/member/ai-coach" }}
      />

      <section className="grid gap-4 lg:grid-cols-4">
        {memberMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="default">Current mission</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
                {missions[2]?.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{missions[2]?.description}</p>
            </div>
            <Link href={`/member/missions/${missions[2]?.id}`} className={cn(buttonVariants({ variant: "secondary" }))}>
              Continue
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Journey progress</span>
              <span>3 / 10 missions touched</span>
            </div>
            <Progress value={30} />
          </div>
        </Card>

        <Card className="p-6">
          <Badge variant="neutral">Daily recommendations</Badge>
          <div className="mt-4 space-y-4">
            {[
              "Generate a festive caption for Raya Radiance on Instagram.",
              "Complete the brand story lesson to unlock your learning mission.",
              "Review the featured Heritage Bangle Collection talking points.",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6">
          <Badge variant="warning">AI Concierge</Badge>
          <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">Today’s brand pulse</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Raya Radiance poster requests are up today. Pair a festive visual with a warm gifting caption and a soft CTA.
          </p>
          <Link href="/member/ai-concierge" className={cn(buttonVariants({ variant: "ghost" }), "mt-4 px-0")}>
            Open concierge
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
        <Card className="p-6">
          <Badge variant="neutral">Latest campaigns</Badge>
          <div className="mt-4 space-y-4">
            {campaigns.slice(0, 2).map((campaign) => (
              <div key={campaign.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{campaign.theme}</p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{campaign.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{campaign.summary}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="neutral">Recent activity</Badge>
          <div className="mt-4 space-y-4">
            {memberActivities.map((activity) => (
              <div key={activity.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="font-semibold text-[var(--foreground)]">{activity.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activity.detail}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{activity.when}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6">
          <Badge variant="default">Recently generated assets</Badge>
          <div className="mt-4 space-y-4">
            {recentGeneratedAssets.map((asset) => (
              <div key={asset.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--foreground)]">{asset.title}</p>
                  <Badge variant="neutral">{asset.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{asset.detail}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="neutral">Latest news</Badge>
          <div className="mt-4 space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.category}</p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="neutral">Featured products</Badge>
          <div className="mt-4 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{product.category}</p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{product.name}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{product.story}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{product.priceRange}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
