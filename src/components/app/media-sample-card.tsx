import Image from "next/image";
import { FileText, ImageIcon, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SampleKind = "image" | "video" | "document";

const kindIconMap = {
  image: ImageIcon,
  video: PlayCircle,
  document: FileText,
} satisfies Record<SampleKind, typeof ImageIcon>;

export interface MediaSampleCardProps {
  kind: SampleKind;
  title: string;
  description: string;
  imageSrc: string;
  badge: string;
  meta?: string;
  tone?: "light" | "dark";
}

export function MediaSampleCard({
  kind,
  title,
  description,
  imageSrc,
  badge,
  meta,
  tone = "light",
}: MediaSampleCardProps) {
  const Icon = kindIconMap[kind];
  const imageMetaTone =
    tone === "dark"
      ? "bg-[rgba(16,8,15,0.84)] text-[var(--foreground)]"
      : "bg-[rgba(28,14,25,0.82)] text-[var(--foreground)]";

  return (
    <Card className="overflow-hidden border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-0 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(17,8,16,0.52),rgba(42,15,35,0.72))]">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,8,0.06),rgba(8,4,8,0.5))]" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(18,7,15,0.76)] px-3 py-2 shadow-sm backdrop-blur">
          <Icon className="size-3.5 text-[var(--gold-strong)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/90">
            {kind}
          </span>
        </div>
        {meta ? (
          <div
            className={cn(
              "absolute bottom-4 right-4 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-sm",
              imageMetaTone,
            )}
          >
            {meta}
          </div>
        ) : null}
      </div>
      <div className="p-5">
        <Badge variant="neutral">{badge}</Badge>
        <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
      </div>
    </Card>
  );
}
