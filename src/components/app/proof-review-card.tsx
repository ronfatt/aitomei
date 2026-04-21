"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { reviewProofSubmissionAction } from "@/features/proofs/actions";
import type { ProofSubmission } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProofReviewCard({ submission }: { submission: ProofSubmission }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });
  const form = useForm<{ reviewNotes: string }>({
    defaultValues: {
      reviewNotes: submission.reviewNotes ?? "",
    },
  });

  async function submitReview(outcome: "approved" | "needs_revision") {
    const reviewNotes = form.getValues("reviewNotes");
    setFeedback({ status: "idle" });

    startTransition(async () => {
      const result = await reviewProofSubmissionAction({
        proofSubmissionId: submission.id,
        outcome,
        reviewNotes,
      });

      setFeedback({ status: result.status, message: result.message });

      if (result.status === "success") {
        router.refresh();
      }
    });
  }

  return (
    <Card className="p-6">
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
      <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{submission.memberName}</h2>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{submission.missionTitle}</p>
      {submission.socialUrl ? (
        <a
          href={submission.socialUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block text-sm font-semibold text-[var(--gold-strong)]"
        >
          Open submitted post
        </a>
      ) : null}
      {submission.screenshotPath ? (
        <p className="mt-2 text-sm text-[var(--muted)]">Screenshot: {submission.screenshotPath}</p>
      ) : null}
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
        {submission.submittedAt}
      </p>

      <div className="mt-5 space-y-3">
        <Input placeholder="Add review notes" {...form.register("reviewNotes")} />
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => submitReview("approved")}>
            Approve proof
          </Button>
          <Button type="button" variant="secondary" onClick={() => submitReview("needs_revision")}>
            Request revision
          </Button>
        </div>
        {feedback.status !== "idle" ? (
          <Badge className="w-fit" variant={feedback.status === "success" ? "success" : "warning"}>
            {feedback.message}
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}
