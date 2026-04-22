import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMemberMissions, getMemberProfileFormData } from "@/lib/supabase/repositories";
import { requireRole } from "@/lib/auth/session";

export default async function OnboardingPage() {
  const auth = await requireRole("member");
  const [profile, missions] = await Promise.all([
    getMemberProfileFormData(auth.user.id),
    getMemberMissions(auth.user.id),
  ]);

  const profileComplete =
    Boolean(profile.firstName && profile.lastName && profile.displayName && profile.bio) &&
    profile.source === "supabase";
  const hasPhoto = Boolean(profile.photoPath);
  const posterMission = missions.find((mission) => mission.id === "generate-first-poster");
  const firstProofMission = missions.find((mission) => mission.id === "submit-first-post");
  const posterReady = posterMission?.status === "in_progress" || posterMission?.status === "completed";
  const proofReady = firstProofMission?.status === "available" || firstProofMission?.status === "completed";

  const onboardingSteps = [
    {
      title: "创建账号并确认登录状态",
      status: auth.mode === "supabase" ? "done" : "current",
      detail:
        auth.mode === "supabase"
          ? "这个会员账号已经接入真实 Supabase 身份验证。"
          : "在完成 Supabase 环境配置前，当前仍使用 demo 模式。",
      href: "/login",
      cta: "打开登录",
    },
    {
      title: "完善会员资料与偏好",
      status: profileComplete ? "done" : "current",
      detail:
        profile.source === "supabase"
          ? "你的资料已经连接到会员个性化和新手引导进度中。"
          : "将资料保存到 Supabase 后，才会启用真实的新手引导进度。",
      href: "/member/profile",
      cta: "完善资料",
    },
    {
      title: "上传会员头像",
      status: hasPhoto ? "done" : profileComplete ? "current" : "upcoming",
      detail:
        hasPhoto
          ? "头像已上传，可用于个性化内容生成。"
          : "上传清晰头像后，可解锁更完整的个性化与任务推进体验。",
      href: "/member/profile",
      cta: "上传头像",
    },
    {
      title: "生成第一张专属海报",
      status: posterReady ? "done" : hasPhoto ? "current" : "upcoming",
      detail:
        posterMission?.status === "completed"
          ? "你的第一条品牌安全海报流程已经完成。"
          : "这是会员开始内容参与的第一个关键动作。",
      href: "/member/content-studio/poster-generator",
      cta: "打开海报生成器",
    },
    {
      title: "提交第一条社媒证明",
      status: proofReady ? "current" : "upcoming",
      detail:
        proofReady
          ? "你已经可以发布并提交第一条与活动相关的证明内容。"
          : "提交证明后，才会继续解锁后续任务与奖励进度。",
      href: "/member/missions/submit-first-post",
      cta: "查看任务",
    },
  ] as const;

  const currentStep =
    onboardingSteps.find((step) => step.status === "current") ??
    onboardingSteps.find((step) => step.status === "upcoming") ??
    onboardingSteps[onboardingSteps.length - 1];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="新手引导旅程"
        title="真实连接会员进度的首次使用体验"
        description="这套新手引导会带会员认识平台、解锁第一个任务，并根据真实资料与任务状态动态显示下一步。"
      />
      <Card className="p-6 lg:p-8">
        <Badge className="w-fit">当前阶段</Badge>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
          {currentStep.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          {currentStep.detail}
        </p>
        <div className="mt-8 space-y-4">
          {onboardingSteps.map((step) => (
            <div
              key={step.title}
              className="flex items-start justify-between gap-4 rounded-[28px] border border-[var(--border)] bg-white/70 p-4"
            >
              <div className="flex items-start gap-4">
                {step.status === "done" ? (
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--success)]" />
                ) : (
                  <Circle className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
                )}
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{step.title}</p>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{step.detail}</p>
                </div>
              </div>
              <Link href={step.href} className="shrink-0 text-sm font-semibold text-[var(--gold-strong)]">
                {step.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href={currentStep.href}>
            <Button>
              {currentStep.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
