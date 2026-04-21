import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CaptionGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Caption Generator"
        title="Generate captions by platform, tone, and product theme"
        description="Members can shape platform-specific copy with optional CTA, member naming, and hashtag suggestions."
      />
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-6">
          <Badge variant="neutral">Caption settings</Badge>
          <form className="mt-6 space-y-4">
            <Input placeholder="Platform: Instagram" />
            <Input placeholder="Tone: Elegant" />
            <Input placeholder="Product theme: Festive gifting gold pendant" />
            <Input placeholder="Include member name: Yes" />
            <Input placeholder="Include CTA: Ask about gifting options" />
            <Button>Generate caption</Button>
          </form>
        </Card>
        <Card className="p-6">
          <Badge variant="default">Generated output</Badge>
          <Textarea
            className="mt-4 min-h-96"
            defaultValue="Celebrate the season with a touch of timeless gold. This piece brings warmth, meaning, and elegance to every festive gathering. If you are exploring a thoughtful gift with lasting value, I would be happy to share more details. #TOMEI #RayaRadiance #GoldenMoments"
          />
        </Card>
      </section>
    </div>
  );
}
