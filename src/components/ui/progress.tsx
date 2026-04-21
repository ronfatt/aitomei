import { cn } from "@/lib/utils";

export function Progress({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-[rgba(43,37,31,0.08)]", className)}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold-strong),var(--gold))]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
