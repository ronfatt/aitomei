import { formatDistanceToNow } from "date-fns";

import { missions as mockMissions, proofQueue, rewardMilestones } from "@/data/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { Mission, ProofSubmission, RewardMilestone } from "@/types/domain";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  mobileNumber: string;
  preferredTone: string;
  favoriteCategory: string;
  bio: string;
  photoPath?: string | null;
  source: "mock" | "supabase";
}

export interface RewardOverview {
  currentPoints: number;
  nextMilestonePoints: number | null;
  progressPercent: number;
  milestones: RewardMilestone[];
  source: "mock" | "supabase";
}

const defaultProfile: Omit<ProfileFormData, "source"> = {
  firstName: "Nur",
  lastName: "Amirah",
  displayName: "Nur Amirah",
  mobileNumber: "+60 12-345 6789",
  preferredTone: "Elegant and educational",
  favoriteCategory: "Gold gifting",
  bio: "I enjoy creating elegant social content and helping my audience discover gift-worthy jewelry collections.",
  photoPath: null,
};

type MemberProfileRow = Database["public"]["Tables"]["member_profiles"]["Row"];
type MissionRow = Database["public"]["Tables"]["missions"]["Row"];
type MemberMissionRow = Database["public"]["Tables"]["member_missions"]["Row"];
type RewardRow = Database["public"]["Tables"]["rewards"]["Row"];
type MemberRewardRow = Database["public"]["Tables"]["member_rewards"]["Row"];
type ProofSubmissionRow = Database["public"]["Tables"]["proof_submissions"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

export async function getMemberProfileFormData(userId: string): Promise<ProfileFormData> {
  if (!hasSupabaseEnv()) {
    return { ...defaultProfile, source: "mock" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("member_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const profile = (data as MemberProfileRow | null) ?? null;

    if (error || !profile) {
      return { ...defaultProfile, source: "mock" };
    }

    return {
      firstName: profile.first_name ?? defaultProfile.firstName,
      lastName: profile.last_name ?? defaultProfile.lastName,
      displayName: profile.display_name ?? defaultProfile.displayName,
      mobileNumber: profile.mobile_number ?? defaultProfile.mobileNumber,
      preferredTone: profile.preferred_tone ?? defaultProfile.preferredTone,
      favoriteCategory: profile.favorite_category ?? defaultProfile.favoriteCategory,
      bio: profile.bio ?? defaultProfile.bio,
      photoPath: profile.photo_path,
      source: "supabase",
    };
  } catch (error) {
    console.error("Failed to load member profile", error);
    return { ...defaultProfile, source: "mock" };
  }
}

export async function getMemberMissions(userId: string): Promise<Mission[]> {
  if (!hasSupabaseEnv()) {
    return mockMissions;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: missionRows, error: missionError }, { data: memberMissionRows, error: memberMissionError }] =
      await Promise.all([
        supabase.from("missions").select("*").eq("status", "active").order("sequence"),
        supabase.from("member_missions").select("*").eq("user_id", userId),
      ]);

    const missions = (missionRows as MissionRow[] | null) ?? null;
    const memberMissions = (memberMissionRows as MemberMissionRow[] | null) ?? [];

    if (missionError || memberMissionError || !missions) {
      return mockMissions;
    }

    const missionStateByMissionId = new Map(memberMissions.map((row) => [row.mission_id, row]));

    return missions.map((row) => {
      const progress = missionStateByMissionId.get(row.id);
      return {
        id: row.slug,
        sequence: row.sequence,
        title: row.title,
        description: row.description,
        type: row.type,
        status: progress?.status ?? (row.sequence === 1 ? "available" : "locked"),
        rewardPoints: row.reward_points,
        rewardItem: row.reward_item ?? "Reward milestone",
        unlockCondition: row.unlock_condition,
        proofRequirement: row.proof_requirement,
        validationRule: row.validation_rule,
      } satisfies Mission;
    });
  } catch (error) {
    console.error("Failed to load missions", error);
    return mockMissions;
  }
}

export async function getMemberMissionBySlug(userId: string, slug: string): Promise<Mission | null> {
  const missionList = await getMemberMissions(userId);
  return missionList.find((mission) => mission.id === slug) ?? null;
}

export async function getRewardOverview(userId: string): Promise<RewardOverview> {
  if (!hasSupabaseEnv()) {
    return {
      currentPoints: 1820,
      nextMilestonePoints: 3000,
      progressPercent: 61,
      milestones: rewardMilestones,
      source: "mock",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: rewardRows, error: rewardsError }, { data: rewardLedger, error: ledgerError }] =
      await Promise.all([
        supabase.from("rewards").select("*").eq("status", "active").order("points_required"),
        supabase.from("member_rewards").select("points_awarded").eq("user_id", userId),
      ]);

    const rewards = (rewardRows as RewardRow[] | null) ?? null;
    const rewardEntries = (rewardLedger as Pick<MemberRewardRow, "points_awarded">[] | null) ?? [];

    if (rewardsError || ledgerError || !rewards) {
      return {
        currentPoints: 1820,
        nextMilestonePoints: 3000,
        progressPercent: 61,
        milestones: rewardMilestones,
        source: "mock",
      };
    }

    const currentPoints = rewardEntries.reduce(
      (total, reward) => total + reward.points_awarded,
      0,
    );
    const nextMilestone = rewards.find((reward) => reward.points_required > currentPoints) ?? null;
    const previousMilestone =
      [...rewards].reverse().find((reward) => reward.points_required <= currentPoints) ?? null;
    const lowerBound = previousMilestone?.points_required ?? 0;
    const upperBound = (nextMilestone?.points_required ?? lowerBound) || 1;
    const progressPercent =
      nextMilestone === null
        ? 100
        : Math.round(((currentPoints - lowerBound) / Math.max(upperBound - lowerBound, 1)) * 100);

    const milestones: RewardMilestone[] = rewards.map((reward) => ({
      id: reward.slug,
      title: reward.title,
      description: reward.description,
      requiredPoints: reward.points_required,
      badge: reward.badge_name ?? "Milestone",
      status:
        currentPoints >= reward.points_required
          ? "unlocked"
          : nextMilestone?.id === reward.id
            ? "current"
            : "locked",
    }));

    return {
      currentPoints,
      nextMilestonePoints: nextMilestone?.points_required ?? null,
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
      milestones,
      source: "supabase",
    };
  } catch (error) {
    console.error("Failed to load rewards", error);
    return {
      currentPoints: 1820,
      nextMilestonePoints: 3000,
      progressPercent: 61,
      milestones: rewardMilestones,
      source: "mock",
    };
  }
}

export async function getProofReviewQueue(): Promise<ProofSubmission[]> {
  if (!hasSupabaseEnv()) {
    return proofQueue;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: submissions, error } = await supabase
      .from("proof_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    const proofSubmissions = (submissions as ProofSubmissionRow[] | null) ?? null;

    if (error) {
      return proofQueue;
    }

    if (!proofSubmissions?.length) {
      return [];
    }

    const userIds = [...new Set(proofSubmissions.map((item) => item.user_id))];
    const missionIds = [...new Set(proofSubmissions.map((item) => item.mission_id))];

    const [{ data: users }, { data: profiles }, { data: missions }] = await Promise.all([
      supabase.from("users").select("id, email").in("id", userIds),
      supabase.from("member_profiles").select("user_id, display_name, first_name, last_name").in("user_id", userIds),
      supabase.from("missions").select("id, title").in("id", missionIds),
    ]);

    const userRows = (users as Pick<UserRow, "id" | "email">[] | null) ?? [];
    const profileRows =
      (profiles as Array<Pick<MemberProfileRow, "user_id" | "display_name" | "first_name" | "last_name">> | null) ??
      [];
    const missionRows = (missions as Array<Pick<MissionRow, "id" | "title">> | null) ?? [];

    const emailByUserId = new Map(userRows.map((user) => [user.id, user.email]));
    const nameByUserId = new Map(
      profileRows.map((profile) => [
        profile.user_id,
        profile.display_name ??
          ([profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || null),
      ]),
    );
    const missionTitleById = new Map(missionRows.map((mission) => [mission.id, mission.title]));

    return proofSubmissions.map((submission) => ({
      id: submission.id,
      memberName:
        nameByUserId.get(submission.user_id) ??
        emailByUserId.get(submission.user_id) ??
        "TOMEI Member",
      missionTitle: missionTitleById.get(submission.mission_id) ?? "Mission review",
      platform: submission.platform,
      submittedAt: formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true }),
      status: submission.status,
    }));
  } catch (error) {
    console.error("Failed to load proof review queue", error);
    return proofQueue;
  }
}
