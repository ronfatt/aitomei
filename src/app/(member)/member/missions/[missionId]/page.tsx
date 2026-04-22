import { notFound } from "next/navigation";

import { MissionProofForm } from "@/components/app/mission-proof-form";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { getLatestMissionProofSubmission, getMemberMissionBySlug } from "@/lib/supabase/repositories";

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

function getMissionTypeLabel(type: string) {
  switch (type) {
    case "profile":
      return "资料";
    case "content":
      return "内容";
    case "social":
      return "社媒";
    case "learning":
      return "学习";
    case "ai":
      return "AI";
    case "campaign":
      return "活动";
    default:
      return type;
  }
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const auth = await requireRole("member");
  const { missionId } = await params;
  const [mission, latestSubmission] = await Promise.all([
    getMemberMissionBySlug(auth.user.id, missionId),
    getLatestMissionProofSubmission(auth.user.id, missionId),
  ]);

  if (!mission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`任务 ${mission.sequence}`}
        title={mission.title}
        description={mission.description}
      />
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">{getMissionTypeLabel(mission.type)}</Badge>
            <Badge
              variant={
                mission.status === "completed"
                  ? "success"
                  : mission.status === "locked"
                    ? "warning"
                    : "neutral"
              }
            >
              {getMissionStatusLabel(mission.status)}
            </Badge>
          </div>
          <div className="mt-6 rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">任务摘要</p>
            <div className="mt-4 grid gap-4 text-sm text-[var(--muted)]">
              <p>
                <span className="font-semibold text-[var(--foreground)]">奖励：</span>
                {mission.rewardPoints} 分 · {mission.rewardItem}
              </p>
              <p>
                <span className="font-semibold text-[var(--foreground)]">解锁条件：</span>
                {mission.unlockCondition}
              </p>
              <p>
                <span className="font-semibold text-[var(--foreground)]">校验规则：</span>
                {mission.validationRule}
              </p>
              <p>
                <span className="font-semibold text-[var(--foreground)]">证明要求：</span>
                {mission.proofRequirement}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.32),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="neutral">证明提交</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            这份表单已经接入 MVP 审核流程。未来若加入 AI 辅助校验，也能沿用同一条提交记录，不需要改变会员体验。
          </p>
          <div className="mt-6 rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
            <MissionProofForm missionSlug={mission.id} latestSubmission={latestSubmission} />
          </div>
        </Card>
      </section>
    </div>
  );
}
