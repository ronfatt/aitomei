import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { campaigns } from "@/data/mock-data";
import { memberPageContent } from "@/data/page-content";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.campaigns} />
      <section className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <Badge variant="default">{campaign.theme}</Badge>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{campaign.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{campaign.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{campaign.activePeriod}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
