import { EmptyState } from "@/components/app/empty-state";
import { FeaturePage } from "@/components/app/feature-page";
import { ProofReviewCard } from "@/components/app/proof-review-card";
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
            <ProofReviewCard key={submission.id} submission={submission} />
          ))}
        </section>
      )}
    </div>
  );
}
