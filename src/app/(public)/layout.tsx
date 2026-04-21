import type { ReactNode } from "react";

import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(237,223,198,0.55),transparent_34%),linear-gradient(180deg,#f8f3ec_0%,#f4eee6_100%)]">
      <PublicHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
