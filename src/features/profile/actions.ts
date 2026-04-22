"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  defaultProfileValues,
  profileSchema,
  type ProfileFormValues,
} from "@/features/profile/schemas";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export interface ProfileActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const profilePhotoSchema = z.object({
  photoPath: z.string().min(1, "缺少头像路径。"),
});

type MemberProfileRow = Database["public"]["Tables"]["member_profiles"]["Row"];
type MemberProfileInsert = Database["public"]["Tables"]["member_profiles"]["Insert"];
type MissionRow = Database["public"]["Tables"]["missions"]["Row"];
type MemberMissionRow = Database["public"]["Tables"]["member_missions"]["Row"];

function getProfileCompletion(values: ProfileFormValues, photoPath?: string | null) {
  const fields = [
    values.firstName,
    values.lastName,
    values.displayName,
    values.mobileNumber,
    values.preferredTone,
    values.favoriteCategory,
    values.bio,
    photoPath ?? "",
  ];

  return Math.round(
    (fields.filter((value) => String(value).trim().length > 0).length / fields.length) * 100,
  );
}

async function getAuthenticatedMemberId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
}

async function syncProfileMissionProgress(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  options: { profileCompleted: boolean; hasPhoto: boolean },
) {
  const { data: missionRows } = await supabase
    .from("missions")
    .select("id, slug")
    .in("slug", ["complete-profile", "upload-profile-photo", "generate-first-poster"]);
  const missions =
    (missionRows as Array<Pick<MissionRow, "id" | "slug">> | null)?.reduce<Map<string, string>>(
      (map, mission) => map.set(mission.slug, mission.id),
      new Map<string, string>(),
    ) ?? new Map<string, string>();

  const profileMissionId = missions.get("complete-profile");
  const photoMissionId = missions.get("upload-profile-photo");
  const posterMissionId = missions.get("generate-first-poster");

  if (profileMissionId && options.profileCompleted) {
    await supabase.from("member_missions").upsert(
      {
        user_id: userId,
        mission_id: profileMissionId,
        status: "completed",
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
      } as never,
      { onConflict: "user_id,mission_id" },
    );
  }

  if (photoMissionId) {
    await supabase.from("member_missions").upsert(
      {
        user_id: userId,
        mission_id: photoMissionId,
        status: options.hasPhoto ? "completed" : options.profileCompleted ? "available" : "locked",
        progress_percentage: options.hasPhoto ? 100 : 0,
        completed_at: options.hasPhoto ? new Date().toISOString() : null,
      } as never,
      { onConflict: "user_id,mission_id" },
    );
  }

  if (posterMissionId && options.hasPhoto) {
    const { data: existingPosterMissionData } = await supabase
      .from("member_missions")
      .select("id, status")
      .eq("user_id", userId)
      .eq("mission_id", posterMissionId)
      .maybeSingle();
    const existingPosterMission = existingPosterMissionData as Pick<MemberMissionRow, "id" | "status"> | null;

    if (!existingPosterMission) {
      await supabase.from("member_missions").insert(
        {
          user_id: userId,
          mission_id: posterMissionId,
          status: "available",
          progress_percentage: 0,
        } as never,
      );
    } else if (existingPosterMission.status === "locked") {
      await supabase
        .from("member_missions")
        .update({ status: "available", progress_percentage: 0 } as never)
        .eq("id", existingPosterMission.id);
    }
  }
}

export async function saveMemberProfileAction(
  values: ProfileFormValues,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "请检查你的会员资料。",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: "尚未配置 Supabase 环境变量，暂时无法保存资料。",
    };
  }

  const { supabase, userId } = await getAuthenticatedMemberId();

  if (!userId) {
    return {
      status: "error",
      message: "你的登录状态已过期，请重新登录。",
    };
  }

  const { data: currentProfile } = await supabase
    .from("member_profiles")
    .select("photo_path")
    .eq("user_id", userId)
    .maybeSingle();
  const resolvedCurrentProfile = currentProfile as Pick<MemberProfileRow, "photo_path"> | null;

  const profileCompletion = getProfileCompletion(parsed.data, resolvedCurrentProfile?.photo_path);

  const payload: MemberProfileInsert = {
      user_id: userId,
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      display_name: parsed.data.displayName,
      mobile_number: parsed.data.mobileNumber,
      preferred_tone: parsed.data.preferredTone,
      favorite_category: parsed.data.favoriteCategory,
      bio: parsed.data.bio,
      profile_completion: profileCompletion,
    };

  const { error } = await supabase.from("member_profiles").upsert(
    payload as never,
    { onConflict: "user_id" },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await supabase.auth.updateUser({
    data: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      display_name: parsed.data.displayName,
      mobile_number: parsed.data.mobileNumber,
    },
  });

  await syncProfileMissionProgress(supabase, userId, {
    profileCompleted: true,
    hasPhoto: Boolean(resolvedCurrentProfile?.photo_path),
  });

  revalidatePath("/member/profile");
  revalidatePath("/member/onboarding");
  revalidatePath("/member/missions");
  revalidatePath("/member/dashboard");

  return {
    status: "success",
    message: "会员资料保存成功。",
  };
}

export async function saveMemberPhotoAction(input: {
  photoPath: string;
}): Promise<ProfileActionState> {
  const parsed = profilePhotoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "头像上传信息无法保存。",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: "尚未配置 Supabase 环境变量，暂时无法上传头像。",
    };
  }

  const { supabase, userId } = await getAuthenticatedMemberId();

  if (!userId) {
    return {
      status: "error",
      message: "你的登录状态已过期，请重新登录。",
    };
  }

  const { data: profile } = await supabase
    .from("member_profiles")
    .select(
      "first_name, last_name, display_name, mobile_number, preferred_tone, favorite_category, bio",
    )
    .eq("user_id", userId)
    .maybeSingle();

  const resolvedProfile = profile as
    | Pick<
        MemberProfileRow,
        | "first_name"
        | "last_name"
        | "display_name"
        | "mobile_number"
        | "preferred_tone"
        | "favorite_category"
        | "bio"
      >
    | null;

  const formValues: ProfileFormValues = {
    firstName: resolvedProfile?.first_name ?? defaultProfileValues.firstName,
    lastName: resolvedProfile?.last_name ?? defaultProfileValues.lastName,
    displayName: resolvedProfile?.display_name ?? defaultProfileValues.displayName,
    mobileNumber: resolvedProfile?.mobile_number ?? defaultProfileValues.mobileNumber,
    preferredTone: resolvedProfile?.preferred_tone ?? defaultProfileValues.preferredTone,
    favoriteCategory: resolvedProfile?.favorite_category ?? defaultProfileValues.favoriteCategory,
    bio: resolvedProfile?.bio ?? defaultProfileValues.bio,
  };

  const profileCompletion = getProfileCompletion(formValues, parsed.data.photoPath);

  const payload: MemberProfileInsert = {
      user_id: userId,
      photo_path: parsed.data.photoPath,
      profile_completion: profileCompletion,
    };

  const { error } = await supabase
    .from("member_profiles")
    .upsert(payload as never, { onConflict: "user_id" });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await syncProfileMissionProgress(supabase, userId, {
    profileCompleted: true,
    hasPhoto: true,
  });

  revalidatePath("/member/profile");
  revalidatePath("/member/onboarding");
  revalidatePath("/member/missions");
  revalidatePath("/member/dashboard");

  return {
    status: "success",
    message: "会员头像上传成功。",
  };
}
