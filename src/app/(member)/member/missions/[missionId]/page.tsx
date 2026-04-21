import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireRole } from "@/lib/auth/session";
import { getMemberMissionBySlug } from "@/lib/supabase/repositories";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const auth = await requireRole("member");
  const { missionId } = await params;
  const mission = await getMemberMissionBySlug(auth.user.id, missionId);

  if (!mission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Mission ${mission.sequence}`}
        title={mission.title}
        description={mission.description}
      />
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">{mission.type}</Badge>
            <Badge
              variant={
                mission.status === "completed"
                  ? "success"
                  : mission.status === "locked"
                    ? "warning"
                    : "neutral"
              }
            >
              {mission.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
            <p>
              <span className="font-semibold text-[var(--foreground)]">Reward:</span>{" "}
              {mission.rewardPoints} points · {mission.rewardItem}
            </p>
            <p>
              <span className="font-semibold text-[var(--foreground)]">Unlock condition:</span>{" "}
              {mission.unlockCondition}
            </p>
            <p>
              <span className="font-semibold text-[var(--foreground)]">Validation rule:</span>{" "}
              {mission.validationRule}
            </p>
            <p>
              <span className="font-semibold text-[var(--foreground)]">Proof requirement:</span>{" "}
              {mission.proofRequirement}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="neutral">Proof submission</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            This form is wired for the MVP review flow. Future AI-assisted proof validation can
            enrich the same submission record without changing the member experience.
          </p>
          <form className="mt-6 space-y-4">
            <Input placeholder="Social post URL" />
            <Input placeholder="Platform (Instagram, TikTok, Facebook...)" />
            <Input placeholder="Optional screenshot path / upload reference" />
            <Button>Submit mission proof</Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
