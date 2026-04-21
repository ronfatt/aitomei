import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(237,223,198,0.55),transparent_34%),linear-gradient(180deg,#f8f3ec_0%,#f4eee6_100%)] px-6 py-12">
      {children}
    </div>
  );
}
