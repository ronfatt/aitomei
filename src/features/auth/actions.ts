"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import type { AuthFormState } from "@/features/auth/contracts";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
  updatePasswordSchema,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type SignupFormValues,
  type UpdatePasswordFormValues,
} from "@/features/auth/schemas";
import { getRoleHomePath } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type MemberProfileRow = Database["public"]["Tables"]["member_profiles"]["Row"];

function validationError(message: string): AuthFormState {
  return { status: "error", message };
}

async function getBaseUrl() {
  const headersList = await headers();
  const forwardedProto = headersList.get("x-forwarded-proto");
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (forwardedProto && host) {
    return `${forwardedProto}://${host}`;
  }

  if (host) {
    return `http://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function getAuthenticatedRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<Database["public"]["Enums"]["app_role"]> {
  const { data } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  const user = data as Pick<UserRow, "role"> | null;
  return user?.role ?? "member";
}

async function getMemberDestination(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("member_profiles")
    .select("profile_completion, photo_path")
    .eq("user_id", userId)
    .maybeSingle();

  const profile = data as Pick<MemberProfileRow, "profile_completion" | "photo_path"> | null;

  if (!profile || profile.profile_completion < 70 || !profile.photo_path) {
    return "/member/onboarding";
  }

  return "/member/dashboard";
}

async function getPostAuthDestination(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const role = await getAuthenticatedRole(supabase, userId);

  if (role === "admin") {
    return getRoleHomePath("admin");
  }

  return getMemberDestination(supabase, userId);
}

export async function signInWithPasswordAction(
  values: LoginFormValues,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Please check your login details.");
  }

  if (!hasSupabaseEnv()) {
    return validationError("Supabase environment variables are missing. Add them to enable real login.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return validationError(error?.message ?? "Unable to sign in. Please try again.");
  }

  const redirectTo = await getPostAuthDestination(supabase, data.user.id);

  revalidatePath("/", "layout");

  return {
    status: "success",
    message: "Signed in successfully.",
    redirectTo,
  };
}

export async function signUpWithPasswordAction(
  values: SignupFormValues,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Please review your details.");
  }

  if (!hasSupabaseEnv()) {
    return validationError("Supabase environment variables are missing. Add them to enable real signup.");
  }

  const supabase = await createSupabaseServerClient();
  const displayName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        display_name: displayName,
        mobile_number: parsed.data.mobileNumber,
        preferred_locale: parsed.data.preferredLanguage,
        role: "member",
      },
    },
  });

  if (error || !data.user) {
    return validationError(error?.message ?? "Unable to create your account. Please try again.");
  }

  revalidatePath("/", "layout");

  if (!data.session) {
    return {
      status: "success",
      message:
        "Account created. Check your email to confirm your account before signing in.",
    };
  }

  return {
    status: "success",
    message: "Account created successfully.",
    redirectTo: "/member/onboarding",
  };
}

export async function requestPasswordResetAction(
  values: ForgotPasswordFormValues,
): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
  }

  if (!hasSupabaseEnv()) {
    return validationError(
      "Supabase environment variables are missing. Add them to enable password recovery.",
    );
  }

  const supabase = await createSupabaseServerClient();
  const redirectTo = `${await getBaseUrl()}/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo,
  });

  if (error) {
    return validationError(error.message);
  }

  return {
    status: "success",
    message: "Password reset email sent. Use the link in your inbox to continue.",
  };
}

export async function updatePasswordAction(
  values: UpdatePasswordFormValues,
): Promise<AuthFormState> {
  const parsed = updatePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Please review your new password.");
  }

  if (!hasSupabaseEnv()) {
    return validationError(
      "Supabase environment variables are missing. Add them to enable password updates.",
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return validationError("Open this page from your recovery email to update your password.");
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return validationError(error.message);
  }

  return {
    status: "success",
    message: "Password updated successfully.",
    redirectTo: await getPostAuthDestination(supabase, user.id),
  };
}
