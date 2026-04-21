import Link from "next/link";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { getMemberMissions } from "@/lib/supabase/repositories";

export default async function MissionsPage() {
  const auth = await requireRole("member");
  const missions = await getMemberMissions(auth.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mission System"
        title="Ten missions that activate learning, posting, and retention"
        description="Each mission has a clear type, reward, unlock condition, validation rule, and completion proof requirement."
      />
      {missions.length === 0 ? (
        <EmptyState
          title="No missions published yet"
          description="Once the operations team publishes active missions, the member growth journey will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {missions.map((mission) => (
            <Link key={mission.id} href={`/member/missions/${mission.id}`}>
              <Card className="p-6 transition hover:translate-y-[-2px]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="neutral">Mission {mission.sequence}</Badge>
                      <Badge
                        variant={
                          mission.status === "completed"
                            ? "success"
                            : mission.status === "locked"
                              ? "warning"
                              : "default"
                        }
                      >
                        {mission.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--foreground)]">{mission.title}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-[var(--muted)] lg:min-w-72">
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">Reward:</span>{" "}
                      {mission.rewardPoints} pts · {mission.rewardItem}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">Unlock:</span>{" "}
                      {mission.unlockCondition}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--foreground)]">Proof:</span>{" "}
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
