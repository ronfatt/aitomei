import { EmptyState } from "@/components/app/empty-state";
import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminPageContent } from "@/data/page-content";
import { getProofReviewQueue } from "@/lib/supabase/repositories";

export default async function AdminProofReviewPage() {
  const proofQueue = await getProofReviewQueue();

  return (
    <div className="space-y-6">
      <FeaturePage content={adminPageContent.proofReview} />
      {proofQueue.length === 0 ? (
        <EmptyState
          title="No proof submissions pending"
          description="When members submit social proof, the moderation queue will appear here with mission and member context."
        />
      ) : (
        <section className="grid gap-4">
          {proofQueue.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">{submission.platform}</Badge>
                <Badge
                  variant={
                    submission.status === "approved"
                      ? "success"
                      : submission.status === "needs_revision"
                        ? "warning"
                        : "default"
                  }
                >
                  {submission.status.replace("_", " ")}
                </Badge>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                {submission.memberName}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{submission.missionTitle}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                {submission.submittedAt}
              </p>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
