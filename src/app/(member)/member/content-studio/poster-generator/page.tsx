import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PosterGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Poster Generator"
        title="Personalize a luxury-branded campaign poster"
        description="This flow is built for future rendering services while already supporting the right member inputs, template metadata, storage patterns, and output lifecycle."
      />
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <Badge variant="neutral">Request form</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Official templates only. Members personalize within a controlled brand framework rather than editing layouts freely.
          </p>
          <form className="mt-6 space-y-4">
            <Input placeholder="Template: Ivory Signature Poster" />
            <Input placeholder="Campaign: Raya Radiance 2026" />
            <Input placeholder="Member photo upload reference" />
            <Input placeholder="Optional CTA line" />
            <Button>Queue poster generation</Button>
          </form>
        </Card>
        <Card className="p-6">
          <Badge variant="default">Preview surface</Badge>
          <div className="mt-4 flex min-h-96 items-center justify-center rounded-[28px] border border-dashed border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,243,0.88),rgba(246,235,214,0.55))]">
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">Campaign Poster Preview</p>
              <p className="mt-3 text-sm text-[var(--muted)]">Future rendering pipeline plugs into the same request contract.</p>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted)]">
            Delivered poster outputs are designed to save automatically into asset history for fast download and reuse.
          </div>
        </Card>
      </section>
    </div>
  );
}
