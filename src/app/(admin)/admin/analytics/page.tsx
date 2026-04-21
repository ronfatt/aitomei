import { FeaturePage } from "@/components/app/feature-page";
import { Card } from "@/components/ui/card";
import { adminPageContent } from "@/data/page-content";

const bars = [
  { label: "Onboarding completion", value: 82 },
  { label: "Mission completion", value: 72 },
  { label: "Content participation", value: 58 },
  { label: "Learning completion", value: 76 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={adminPageContent.analytics} />
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Engagement bars</h2>
        <div className="mt-6 space-y-4">
          {bars.map((bar) => (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]">{bar.label}</span>
                <span className="text-[var(--muted)]">{bar.value}%</span>
              </div>
              <div className="h-3 rounded-full bg-[rgba(43,37,31,0.08)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold-strong),var(--gold))]"
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
