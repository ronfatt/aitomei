import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { memberPageContent } from "@/data/page-content";

export default function AiConciergePage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.aiConcierge} />
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Today’s focus", "Highlight meaningful festive gifting with a polished, educational post."],
          ["Pending mission reminder", "Your next unlock is tied to your first personalized poster submission."],
          ["Featured campaign", "Raya Radiance remains the strongest seasonal content entry point today."],
          ["Featured product", "The Heritage Bangle Collection fits family-centered celebration storytelling."],
          ["Latest announcement", "New social assets have been released in Content Studio for the active campaign."],
          ["Progress summary", "You have completed 2 missions and are actively progressing toward your next milestone."],
        ].map(([title, detail]) => (
          <Card key={title} className="p-6">
            <Badge variant="neutral">Insight card</Badge>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{detail}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
