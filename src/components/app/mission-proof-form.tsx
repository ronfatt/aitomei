"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submitMissionProofAction } from "@/features/proofs/actions";
import type { MemberProofSubmissionSummary } from "@/lib/supabase/repositories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const proofFormSchema = z.object({
  platform: z.string().min(2, "Platform is required."),
  socialUrl: z.url("Enter a valid social post URL."),
  screenshotPath: z.string().optional(),
});

type ProofFormValues = z.infer<typeof proofFormSchema>;

export function MissionProofForm({
  missionSlug,
  latestSubmission,
}: {
  missionSlug: string;
  latestSubmission: MemberProofSubmissionSummary | null;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const form = useForm<ProofFormValues>({
    resolver: zodResolver(proofFormSchema),
    defaultValues: {
      platform: latestSubmission?.platform ?? "",
      socialUrl: latestSubmission?.socialUrl ?? "",
      screenshotPath: latestSubmission?.screenshotPath ?? "",
    },
  });

  async function onSubmit(values: ProofFormValues) {
    setFeedback({ status: "idle" });

    startTransition(async () => {
      const result = await submitMissionProofAction({
        missionSlug,
        platform: values.platform,
        socialUrl: values.socialUrl,
        screenshotPath: values.screenshotPath,
      });

      setFeedback({ status: result.status, message: result.message });

      if (result.status === "success") {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      {latestSubmission ? (
        <div className="rounded-[24px] border border-[rgba(196,168,114,0.18)] bg-white/72 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neutral">Latest submission</Badge>
            <Badge
              variant={
                latestSubmission.status === "approved"
                  ? "success"
                  : latestSubmission.status === "needs_revision"
                    ? "warning"
                    : "default"
              }
            >
              {latestSubmission.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Submitted {latestSubmission.submittedAt} via {latestSubmission.platform}.
          </p>
          {latestSubmission.reviewNotes ? (
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Admin note: {latestSubmission.reviewNotes}
            </p>
          ) : null}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Input placeholder="Social post URL" {...form.register("socialUrl")} />
          <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.socialUrl?.message}</p>
        </div>
        <div>
          <Input placeholder="Platform (Instagram, TikTok, Facebook...)" {...form.register("platform")} />
          <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.platform?.message}</p>
        </div>
        <div>
          <Input placeholder="Optional screenshot path / upload reference" {...form.register("screenshotPath")} />
          <p className="mt-2 text-xs text-[var(--muted)]">
            Screenshot upload storage can be connected next through the `proof-screenshots` bucket.
          </p>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit mission proof
        </Button>
        {feedback.status !== "idle" ? (
          <Badge className="w-fit" variant={feedback.status === "success" ? "success" : "warning"}>
            {feedback.message}
          </Badge>
        ) : null}
      </form>
    </div>
  );
}
