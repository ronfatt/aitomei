import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { getRewardOverview } from "@/lib/supabase/repositories";

export default async function RewardsPage() {
  const auth = await requireRole("member");
  const rewardOverview = await getRewardOverview(auth.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rewards Engine"
        title="Points, badges, and premium milestones"
        description="The rewards system is intentionally simple for MVP launch while preserving clean extensibility for future redemption catalogs and tiering."
      />
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="default">Current position</Badge>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
              {rewardOverview.currentPoints.toLocaleString()} points
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {rewardOverview.nextMilestonePoints
                ? `${Math.max(rewardOverview.nextMilestonePoints - rewardOverview.currentPoints, 0)} points remaining to unlock the next milestone.`
                : "Top milestone unlocked. Keep participating to maintain momentum."}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Progress value={rewardOverview.progressPercent} />
          </div>
        </div>
      </Card>
      {rewardOverview.milestones.length === 0 ? (
        <EmptyState
          title="No reward milestones configured"
          description="Once active reward milestones are published, members will see progress and badge unlocks here."
        />
      ) : (
        <div className="space-y-4">
          <section className="grid gap-4 lg:grid-cols-3">
            {rewardOverview.milestones.map((reward) => (
              <Card key={reward.id} className="p-6">
                <Badge
                  variant={
                    reward.status === "unlocked"
                      ? "success"
                      : reward.status === "current"
                        ? "default"
                        : "warning"
                  }
                >
                  {reward.status}
                </Badge>
                <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{reward.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{reward.description}</p>
                <p className="mt-4 text-sm text-[var(--gold-strong)]">
                  {reward.requiredPoints} points · {reward.badge}
                </p>
              </Card>
            ))}
          </section>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge variant="neutral">Reward history</Badge>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                  Recent point activity
                </h2>
              </div>
            </div>

            {rewardOverview.history.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                Complete missions to start building your visible reward history.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {rewardOverview.history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 rounded-[24px] border border-[var(--border)] bg-white/72 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{entry.title}</p>
                      <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{entry.detail}</p>
                    </div>
                    <div className="text-sm text-[var(--muted)] lg:text-right">
                      <p className="font-semibold text-[var(--gold-strong)]">+{entry.points} pts</p>
                      <p className="mt-1">{entry.awardedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
