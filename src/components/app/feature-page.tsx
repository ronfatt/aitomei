import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FeaturePageContent } from "@/types/domain";

export function FeaturePage({ content }: { content: FeaturePageContent }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        action={content.actions?.[0]}
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {content.metrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="grid gap-4">
        {content.sections.map((section) => (
          <Card
            key={section.title}
            className="overflow-hidden border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.34)]"
          >
            <CardHeader className="max-w-3xl p-0">
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-6 grid gap-4 p-0 lg:grid-cols-2">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                >
                  {item.eyebrow ? (
                    <Badge className="mb-3 w-fit" variant="neutral">
                      {item.eyebrow}
                    </Badge>
                  ) : null}
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                  {item.meta ? <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{item.meta}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
      {content.actions && content.actions.length > 1 ? (
        <div className="panel flex flex-wrap gap-3 border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.38),rgba(42,15,35,0.58))] p-5">
          {content.actions.slice(1).map((action) => (
            <Link key={action.href} href={action.href} className={cn(buttonVariants({ variant: "secondary" }))}>
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
