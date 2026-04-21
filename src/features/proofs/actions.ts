"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export interface ProofActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const proofSubmissionSchema = z.object({
  missionSlug: z.string().min(1, "Mission slug is required."),
  platform: z.string().min(2, "Platform is required."),
  socialUrl: z.url("Enter a valid social post URL."),
  screenshotPath: z.string().optional(),
});

const proofReviewSchema = z.object({
  proofSubmissionId: z.string().min(1, "Proof submission is required."),
  outcome: z.enum(["approved", "needs_revision"]),
  reviewNotes: z.string().min(4, "Add a short review note."),
});

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type MissionRow = Database["public"]["Tables"]["missions"]["Row"];
type MemberMissionRow = Database["public"]["Tables"]["member_missions"]["Row"];
type ProofSubmissionRow = Database["public"]["Tables"]["proof_submissions"]["Row"];

async function getCurrentUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
}

async function syncNextMissionAvailability(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  currentSequence: number,
) {
  const { data: nextMissionData } = await supabase
    .from("missions")
    .select("id")
    .eq("sequence", currentSequence + 1)
    .eq("status", "active")
    .maybeSingle();
  const nextMission = nextMissionData as Pick<MissionRow, "id"> | null;

  if (!nextMission) {
    return;
  }

  const { data: existingNextMissionData } = await supabase
    .from("member_missions")
    .select("id, status")
    .eq("user_id", userId)
    .eq("mission_id", nextMission.id)
    .maybeSingle();
  const existingNextMission = existingNextMissionData as Pick<MemberMissionRow, "id" | "status"> | null;

  if (existingNextMission) {
    if (existingNextMission.status === "locked") {
      await supabase
        .from("member_missions")
        .update({ status: "available", progress_percentage: 0 } as never)
        .eq("id", existingNextMission.id);
    }
    return;
  }

  await supabase.from("member_missions").insert(
    {
      user_id: userId,
      mission_id: nextMission.id,
      status: "available",
      progress_percentage: 0,
    } as never,
  );
}

export async function submitMissionProofAction(input: {
  missionSlug: string;
  platform: string;
  socialUrl: string;
  screenshotPath?: string;
}): Promise<ProofActionState> {
  const parsed = proofSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please review your proof details.",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing. Add them to enable proof submissions.",
    };
  }

  const { supabase, userId } = await getCurrentUserId();

  if (!userId) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again.",
    };
  }

  const { data: missionData } = await supabase
    .from("missions")
    .select("id, title")
    .eq("slug", parsed.data.missionSlug)
    .maybeSingle();
  const mission = missionData as Pick<MissionRow, "id" | "title"> | null;

  if (!mission) {
    return {
      status: "error",
      message: "Mission not found.",
    };
  }

  const { data: existingMemberMissionData } = await supabase
    .from("member_missions")
    .select("id, started_at")
    .eq("user_id", userId)
    .eq("mission_id", mission.id)
    .maybeSingle();
  const existingMemberMission = existingMemberMissionData as Pick<MemberMissionRow, "id" | "started_at"> | null;

  const { data: submissionData, error: submissionError } = await supabase
    .from("proof_submissions")
    .insert(
      {
        user_id: userId,
        mission_id: mission.id,
        platform: parsed.data.platform,
        social_url: parsed.data.socialUrl,
        screenshot_path: parsed.data.screenshotPath?.trim() || null,
        status: "pending",
      } as never,
    )
    .select("id")
    .single();
  const submission = submissionData as Pick<ProofSubmissionRow, "id"> | null;

  if (submissionError || !submission) {
    return {
      status: "error",
      message: submissionError?.message ?? "Unable to submit your proof right now.",
    };
  }

  if (existingMemberMission) {
    await supabase
      .from("member_missions")
      .update({
        status: "submitted",
        progress_percentage: 90,
        proof_submission_id: submission.id,
      } as never)
      .eq("id", existingMemberMission.id);
  } else {
    await supabase.from("member_missions").insert(
      {
        user_id: userId,
        mission_id: mission.id,
        status: "submitted",
        progress_percentage: 90,
        proof_submission_id: submission.id,
        started_at: new Date().toISOString(),
      } as never,
    );
  }

  await supabase.from("notifications").insert(
    {
      user_id: userId,
      type: "mission",
      title: "Proof submitted for review",
      body: `${mission.title} has been submitted and is awaiting admin review.`,
    } as never,
  );

  revalidatePath(`/member/missions/${parsed.data.missionSlug}`);
  revalidatePath("/member/missions");
  revalidatePath("/member/onboarding");
  revalidatePath("/admin/proof-review");

  return {
    status: "success",
    message: "Mission proof submitted successfully. Our team will review it shortly.",
  };
}

export async function reviewProofSubmissionAction(input: {
  proofSubmissionId: string;
  outcome: "approved" | "needs_revision";
  reviewNotes: string;
}): Promise<ProofActionState> {
  const parsed = proofReviewSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please review the moderation input.",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing. Add them to enable proof review.",
    };
  }

  const { supabase, userId } = await getCurrentUserId();

  if (!userId) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again.",
    };
  }

  const { data: reviewerData } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  const reviewer = reviewerData as Pick<UserRow, "role"> | null;

  if (reviewer?.role !== "admin") {
    return {
      status: "error",
      message: "Only admins can review proof submissions.",
    };
  }

  const { data: proofData } = await supabase
    .from("proof_submissions")
    .select("*")
    .eq("id", parsed.data.proofSubmissionId)
    .maybeSingle();
  const proof = proofData as ProofSubmissionRow | null;

  if (!proof) {
    return {
      status: "error",
      message: "Proof submission not found.",
    };
  }

  const { data: missionData } = await supabase
    .from("missions")
    .select("id, slug, title, sequence")
    .eq("id", proof.mission_id)
    .maybeSingle();
  const mission = missionData as Pick<MissionRow, "id" | "slug" | "title" | "sequence"> | null;

  if (!mission) {
    return {
      status: "error",
      message: "Related mission not found.",
    };
  }

  await supabase
    .from("proof_submissions")
    .update({
      status: parsed.data.outcome,
      review_notes: parsed.data.reviewNotes,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq("id", proof.id);

  await supabase.from("admin_reviews").insert(
    {
      proof_submission_id: proof.id,
      reviewer_id: userId,
      outcome: parsed.data.outcome,
      notes: parsed.data.reviewNotes,
    } as never,
  );

  const { data: memberMissionData } = await supabase
    .from("member_missions")
    .select("id")
    .eq("user_id", proof.user_id)
    .eq("mission_id", proof.mission_id)
    .maybeSingle();
  const memberMission = memberMissionData as Pick<MemberMissionRow, "id"> | null;

  const memberMissionPayload =
    parsed.data.outcome === "approved"
      ? {
          status: "completed" as const,
          progress_percentage: 100,
          proof_submission_id: proof.id,
          completed_at: new Date().toISOString(),
        }
      : {
          status: "in_progress" as const,
          progress_percentage: 65,
          proof_submission_id: proof.id,
        };

  if (memberMission) {
    await supabase.from("member_missions").update(memberMissionPayload as never).eq("id", memberMission.id);
  } else {
    await supabase.from("member_missions").insert(
      {
        user_id: proof.user_id,
        mission_id: proof.mission_id,
        ...memberMissionPayload,
        started_at: new Date().toISOString(),
      } as never,
    );
  }

  if (parsed.data.outcome === "approved") {
    await syncNextMissionAvailability(supabase, proof.user_id, mission.sequence);
  }

  await supabase.from("notifications").insert(
    {
      user_id: proof.user_id,
      type: "mission",
      title:
        parsed.data.outcome === "approved"
          ? "Mission proof approved"
          : "Mission proof needs revision",
      body:
        parsed.data.outcome === "approved"
          ? `${mission.title} has been approved and your mission progress has been updated.`
          : `${mission.title} needs revision. Review the admin feedback and resubmit when ready.`,
    } as never,
  );

  revalidatePath("/admin/proof-review");
  revalidatePath(`/member/missions`);
  revalidatePath(`/member/missions/${mission.slug}`);
  revalidatePath("/member/rewards");
  revalidatePath("/member/onboarding");

  return {
    status: "success",
    message:
      parsed.data.outcome === "approved"
        ? "Proof approved and member progress updated."
        : "Revision requested and member progress updated.",
  };
}
