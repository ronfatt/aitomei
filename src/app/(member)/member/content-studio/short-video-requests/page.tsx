import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ShortVideoRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Short Video Requests"
        title="Queue member-personalized short-form campaign videos"
        description="The MVP treats video generation as an abstracted request pipeline so future render engines can be integrated without changing the member experience."
      />
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <Badge variant="neutral">Queue request</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            This flow stays template-based and brand-controlled, with no freeform scene editing in the MVP.
          </p>
          <form className="mt-6 space-y-4">
            <Input placeholder="Official template video" />
            <Input placeholder="Member display name" />
            <Input placeholder="Member code or CTA" />
            <Input placeholder="End card note" />
            <Button>Queue video personalization</Button>
          </form>
        </Card>
        <Card className="p-6">
          <Badge variant="warning">Queue status</Badge>
          <div className="mt-4 space-y-4">
            {[
              "Request accepted and assigned to the render queue.",
              "ETA target remains under 24 hours for MVP operations.",
              "Finished assets save to asset history and the generated-assets bucket for download.",
            ].map((line) => (
              <div key={line} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
                {line}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
