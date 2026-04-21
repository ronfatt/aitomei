import { Card } from "@/components/ui/card";

export function SectionLoading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-8">
        <div className="h-3 w-28 rounded-full bg-[rgba(43,37,31,0.08)]" />
        <div className="mt-5 h-10 w-80 max-w-full rounded-full bg-[rgba(43,37,31,0.08)]" />
        <div className="mt-4 h-4 w-full rounded-full bg-[rgba(43,37,31,0.06)]" />
        <div className="mt-3 h-4 w-3/4 rounded-full bg-[rgba(43,37,31,0.06)]" />
      </Card>
      <Card className="p-6">
        <p className="text-sm text-[var(--muted)]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </Card>
    </div>
  );
}
