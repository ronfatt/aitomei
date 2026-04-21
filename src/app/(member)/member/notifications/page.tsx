import { FeaturePage } from "@/components/app/feature-page";
import { Card } from "@/components/ui/card";
import { memberPageContent } from "@/data/page-content";
import { memberActivities } from "@/data/mock-data";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.notifications} />
      <section className="grid gap-4">
        {memberActivities.map((activity) => (
          <Card key={activity.id} className="p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{activity.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{activity.detail}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{activity.when}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
