import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types/domain";

export function StatCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card className="p-5">
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="font-[family-name:var(--font-display)] text-4xl">{metric.value}</CardTitle>
      </CardHeader>
      <p className="text-sm text-[var(--gold-strong)]">{metric.trend}</p>
    </Card>
  );
}
