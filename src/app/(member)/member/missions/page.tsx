import Link from "next/link";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { getMemberMissions } from "@/lib/supabase/repositories";

function getMissionStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "已完成";
    case "in_progress":
      return "进行中";
    case "available":
      return "可开始";
    case "submitted":
      return "已提交";
    default:
      return "未解锁";
  }
}

export default async function MissionsPage() {
  const auth = await requireRole("member");
  const missions = await getMemberMissions(auth.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="任务系统"
        title="用 10 个任务带动学习、发帖与留存"
        description="每个任务都具备清晰的类型、奖励、解锁条件、校验规则与完成证明要求。"
      />
      {missions.length === 0 ? (
        <EmptyState
          title="暂时还没有已发布任务"
          description="当运营团队发布任务后，会员成长路径就会显示在这里。"
        />
      ) : (
        <div className="grid gap-4">
          {missions.map((mission) => (
            <Link key={mission.id} href={`/member/missions/${mission.id}`}>
              <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_22px_70px_rgba(5,3,8,0.28)] transition hover:translate-y-[-2px]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="neutral">任务 {mission.sequence}</Badge>
                      <Badge
                        variant={
                          mission.status === "completed"
                            ? "success"
                            : mission.status === "locked"
                              ? "warning"
                              : "default"
                        }
                      >
                        {getMissionStatusLabel(mission.status)}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--foreground)]">{mission.title}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                        {mission.description}
                      </p>
                    </div>
                    <div className="max-w-xl rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                        <span>任务进度</span>
                        <span>
                          {mission.status === "completed"
                            ? "100%"
                            : mission.status === "submitted"
                              ? "90%"
                              : mission.status === "in_progress"
                                ? "65%"
                                : mission.status === "available"
                                  ? "20%"
                                  : "0%"}
                        </span>
                      </div>
                      <Progress
                        className="mt-3"
                        value={
                          mission.status === "completed"
                            ? 100
                            : mission.status === "submitted"
                              ? 90
                              : mission.status === "in_progress"
                                ? 65
                                : mission.status === "available"
                                  ? 20
                                  : 0
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[var(--muted)] lg:min-w-72">
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">奖励：</span>
                      {mission.rewardPoints} 分 · {mission.rewardItem}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">解锁条件：</span>
                      {mission.unlockCondition}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">证明要求：</span>
                      {mission.proofRequirement}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
