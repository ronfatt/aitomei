import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(46,16,38,0.92),rgba(18,8,18,0.96))] p-8 text-center">
      <Badge className="mx-auto w-fit" variant="neutral">
        暂无内容
      </Badge>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p>
    </Card>
  );
}
