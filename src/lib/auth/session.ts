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

export async function getAuthContext(roleHint: UserRole = "member"): Promise<AuthContext> {
  if (!hasSupabaseEnv()) {
    return {
      mode: "demo",
      user: demoUsers[roleHint],
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "supabase", user: null };
  }

  const role = (user.user_metadata.role ?? "member") as UserRole;

  return {
    mode: "supabase",
    user: {
      id: user.id,
      email: user.email ?? "",
      role,
      displayName:
        user.user_metadata.display_name ??
        user.user_metadata.first_name ??
        user.email?.split("@")[0] ??
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
    redirect(context.user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
  }

  return {
    mode: context.mode,
    user: context.user,
  };
}
