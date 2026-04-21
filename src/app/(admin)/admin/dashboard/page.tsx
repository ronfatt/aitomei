import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminActivity, adminMetrics, proofQueue } from "@/data/mock-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Operational visibility across members, missions, and content activity"
        description="The admin workspace is structured for governance, review throughput, content quality, and analytics without adding unnecessary operational clutter."
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {adminMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <Badge variant="neutral">Proof queue snapshot</Badge>
          <div className="mt-4 space-y-4">
            {proofQueue.map((submission) => (
              <div key={submission.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="font-semibold text-[var(--foreground)]">{submission.memberName}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{submission.missionTitle}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                  {submission.platform} · {submission.status}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="warning">Admin pulse</Badge>
          <div className="mt-4 space-y-4">
            {adminActivity.map((activity) => (
              <div key={activity.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="font-semibold text-[var(--foreground)]">{activity.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activity.detail}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{activity.when}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
