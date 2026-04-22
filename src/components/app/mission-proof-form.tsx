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
  platform: z.string().min(2, "请填写平台。"),
  socialUrl: z.url("请输入有效的社媒贴文链接。"),
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
            <Badge variant="neutral">最近一次提交</Badge>
            <Badge
              variant={
                latestSubmission.status === "approved"
                  ? "success"
                  : latestSubmission.status === "needs_revision"
                    ? "warning"
                    : "default"
              }
            >
              {latestSubmission.status === "approved"
                ? "已通过"
                : latestSubmission.status === "needs_revision"
                  ? "需修改"
                  : "待审核"}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            已于 {latestSubmission.submittedAt} 通过 {latestSubmission.platform} 提交。
          </p>
          {latestSubmission.reviewNotes ? (
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              审核备注：{latestSubmission.reviewNotes}
            </p>
          ) : null}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Input placeholder="社媒贴文链接" {...form.register("socialUrl")} />
          <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.socialUrl?.message}</p>
        </div>
        <div>
          <Input placeholder="平台（Instagram、TikTok、Facebook...）" {...form.register("platform")} />
          <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.platform?.message}</p>
        </div>
        <div>
          <Input placeholder="可选截图路径 / 上传引用" {...form.register("screenshotPath")} />
          <p className="mt-2 text-xs text-[var(--muted)]">
            下一步可把截图上传能力接到 `proof-screenshots` bucket。
          </p>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          提交任务证明
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
