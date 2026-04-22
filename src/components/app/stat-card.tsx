import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types/domain";

export function StatCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card className="rounded-[28px] border-white/8 bg-[linear-gradient(180deg,rgba(48,17,40,0.92),rgba(21,8,20,0.95))] p-5">
      <CardHeader>
        <CardDescription className="text-xs uppercase tracking-[0.18em]">{metric.label}</CardDescription>
        <CardTitle className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em]">{metric.value}</CardTitle>
      </CardHeader>
      <p className="text-sm text-[var(--gold)]">{metric.trend}</p>
    </Card>
  );
}
