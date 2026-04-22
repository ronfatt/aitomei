import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { getRewardOverview } from "@/lib/supabase/repositories";

function getRewardStatusLabel(status: string) {
  switch (status) {
    case "unlocked":
      return "已解锁";
    case "current":
      return "当前阶段";
    default:
      return "未解锁";
  }
}

export default async function RewardsPage() {
  const auth = await requireRole("member");
  const rewardOverview = await getRewardOverview(auth.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="奖励系统"
        title="积分、徽章与高端里程碑"
        description="奖励系统在 MVP 阶段保持简单清晰，同时保留后续扩展兑换目录与分层体系的能力。"
      />
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="default">当前进度</Badge>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
              {rewardOverview.currentPoints.toLocaleString()} 分
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {rewardOverview.nextMilestonePoints
                ? `距离下一个里程碑还差 ${Math.max(rewardOverview.nextMilestonePoints - rewardOverview.currentPoints, 0)} 分。`
                : "最高里程碑已经解锁，继续参与以维持成长动能。"}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Progress value={rewardOverview.progressPercent} />
          </div>
        </div>
      </Card>
      {rewardOverview.milestones.length === 0 ? (
        <EmptyState
          title="暂未配置奖励里程碑"
          description="当奖励里程碑发布后，会员就能在这里看到进度与徽章解锁情况。"
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
                  {getRewardStatusLabel(reward.status)}
                </Badge>
                <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{reward.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{reward.description}</p>
                <p className="mt-4 text-sm text-[var(--gold-strong)]">
                  {reward.requiredPoints} 分 · {reward.badge}
                </p>
              </Card>
            ))}
          </section>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge variant="neutral">奖励记录</Badge>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                  最近积分动态
                </h2>
              </div>
            </div>

            {rewardOverview.history.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                完成任务后，这里就会开始累积你的奖励记录。
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
                      <p className="font-semibold text-[var(--gold-strong)]">+{entry.points} 分</p>
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
