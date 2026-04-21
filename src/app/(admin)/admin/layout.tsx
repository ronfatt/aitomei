import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { adminNavigation } from "@/config/navigation";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await requireRole("admin");

  return (
    <AppShell role="admin" navigation={adminNavigation} currentUser={auth.user}>
      {children}
    </AppShell>
  );
}
