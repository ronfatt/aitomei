import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { AuthenticatedUser, UserRole } from "@/types/domain";

const demoUsers: Record<UserRole, AuthenticatedUser> = {
  member: {
    id: "demo-member",
    email: "member.demo@tomei-growth.local",
    role: "member",
    displayName: "Nur Amirah",
  },
  admin: {
    id: "demo-admin",
    email: "admin.demo@tomei-growth.local",
    role: "admin",
    displayName: "Platform Admin",
  },
};

export interface AuthContext {
  mode: "demo" | "supabase";
  user: AuthenticatedUser | null;
}

export function getRoleHomePath(role: UserRole) {
  return role === "admin" ? "/admin/dashboard" : "/member/dashboard";
}

export async function getAuthContext(
  roleHint: UserRole = "member",
  options: { allowDemoFallback?: boolean } = {},
): Promise<AuthContext> {
  const allowDemoFallback = options.allowDemoFallback ?? true;

  if (!hasSupabaseEnv()) {
    return {
      mode: "demo",
      user: allowDemoFallback ? demoUsers[roleHint] : null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "supabase", user: null };
  }

  const [{ data: userRow }, { data: profileRow }] = await Promise.all([
    supabase.from("users").select("role").eq("id", user.id).maybeSingle(),
    supabase
      .from("member_profiles")
      .select("display_name, first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const resolvedUserRow = userRow as { role?: UserRole } | null;
  const resolvedProfileRow = profileRow as
    | {
        display_name?: string | null;
        first_name?: string | null;
        last_name?: string | null;
      }
    | null;
  const role = (resolvedUserRow?.role ?? user.user_metadata.role ?? "member") as UserRole;
  const profileDisplayName =
    resolvedProfileRow?.display_name ??
    [resolvedProfileRow?.first_name, resolvedProfileRow?.last_name].filter(Boolean).join(" ").trim();

  return {
    mode: "supabase",
    user: {
      id: user.id,
      email: user.email ?? "",
      role,
      displayName:
        profileDisplayName ||
        user.user_metadata.display_name ||
        user.user_metadata.first_name ||
        user.email?.split("@")[0] ||
        "TOMEI Member",
    },
  };
}

export async function requireRole(
  role: UserRole,
): Promise<{ mode: "demo" | "supabase"; user: AuthenticatedUser }> {
  const context = await getAuthContext(role);

  if (!context.user) {
    redirect("/login");
  }

  if (context.user.role !== role) {
    redirect(getRoleHomePath(context.user.role));
  }

  return {
    mode: context.mode,
    user: context.user,
  };
}

export async function redirectAuthenticatedUser() {
  const context = await getAuthContext("member", { allowDemoFallback: false });

  if (!context.user) {
    return;
  }

  redirect(getRoleHomePath(context.user.role));
}
