import Link from "next/link";
import { ImagePlus, MessagesSquare, Video } from "lucide-react";

import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { memberPageContent } from "@/data/page-content";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: ImagePlus,
    title: "Poster generator",
    detail: "Upload a photo, choose a template, and request a personalized campaign poster.",
    href: "/member/content-studio/poster-generator",
  },
  {
    icon: MessagesSquare,
    title: "Caption generator",
    detail: "Create elegant, educational, festive, or promotional captions by platform.",
    href: "/member/content-studio/caption-generator",
  },
  {
    icon: Video,
    title: "Short video requests",
    detail: "Queue a template-based short-form video with member CTA and end card.",
    href: "/member/content-studio/short-video-requests",
  },
];

export default function ContentStudioPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.contentStudio} />
      <section className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(196,168,114,0.12)] text-[var(--gold-strong)]">
              <tool.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[var(--foreground)]">{tool.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{tool.detail}</p>
            <Link href={tool.href} className={cn(buttonVariants({ variant: "secondary" }), "mt-5")}>
              Open tool
            </Link>
          </Card>
        ))}
      </section>
      <Card className="p-6 lg:p-8">
        <Badge variant="warning">Brand-safe workflow</Badge>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            "Members only work from official templates in MVP.",
            "Freeform editing is intentionally excluded to preserve premium brand consistency.",
            "All outputs are saved into asset history for reuse, moderation, and campaign continuity.",
          ].map((rule) => (
            <div key={rule} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted)]">
              {rule}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
