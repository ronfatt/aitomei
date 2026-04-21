import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { memberPageContent } from "@/data/page-content";

export default function AiCoachPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.aiCoach} />
      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="neutral">Coach chat</Badge>
            <Badge variant="default">Brand language</Badge>
            <Badge variant="default">Product guidance</Badge>
            <Badge variant="default">Campaign support</Badge>
            <Badge variant="default">Promotion mentoring</Badge>
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted)]">
              Explain how I should promote festive gold gifting without sounding too sales-oriented.
            </div>
            <div className="rounded-[24px] border border-[rgba(196,168,114,0.22)] bg-[rgba(250,241,226,0.75)] p-4 text-sm leading-7 text-[var(--foreground)]">
              Lead with meaning, occasion, and style rather than urgency. Talk about why the piece fits the celebration, who it is ideal for, and how it adds emotional value.
            </div>
            <Textarea placeholder="Ask AI Coach about products, campaigns, or what to post next..." />
            <Button>Send question</Button>
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="warning">Suggested prompts</Badge>
          <div className="mt-4 space-y-4">
            {[
              "What should I post today for Raya Radiance?",
              "How do I explain the TOMEI brand story simply?",
              "Which product category is easiest for my audience to understand?",
              "How can I sound professional without being too promotional?",
            ].map((prompt) => (
              <div key={prompt} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
                {prompt}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
