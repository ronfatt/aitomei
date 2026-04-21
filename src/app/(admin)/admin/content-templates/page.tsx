import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminPageContent } from "@/data/page-content";
import { contentTemplates } from "@/data/mock-data";

export default function AdminContentTemplatesPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={adminPageContent.contentTemplates} />
      <section className="grid gap-4 lg:grid-cols-3">
        {contentTemplates.map((template) => (
          <Card key={template.id} className="p-6">
            <Badge variant="neutral">{template.format}</Badge>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{template.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{template.audience}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{template.lastUpdated}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
