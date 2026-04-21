import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { memberNavigation } from "@/config/navigation";
import { requireRole } from "@/lib/auth/session";

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const auth = await requireRole("member");

  return (
    <AppShell role="member" navigation={memberNavigation} currentUser={auth.user}>
      {children}
    </AppShell>
  );
}
