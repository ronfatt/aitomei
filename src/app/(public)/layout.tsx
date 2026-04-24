import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import { PublicHeader } from "@/components/layout/public-header";

const publicShellStyle = {
  "--background": "#050505",
  "--foreground": "#F5EAD6",
  "--surface": "rgba(14,12,10,0.96)",
  "--muted": "#BBAE9C",
  "--border": "rgba(216,177,91,0.14)",
  "--gold": "#F2C86B",
  "--gold-soft": "rgba(242,200,107,0.16)",
  "--gold-strong": "#D8B15B",
  "--ring": "rgba(216,177,91,0.24)",
  "--success": "#9AD0A8",
  "--warning": "#F2C86B",
} as CSSProperties;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(216,177,91,0.08),transparent_22%),linear-gradient(180deg,#030303_0%,#070606_48%,#0a0908_100%)]"
      style={publicShellStyle}
    >
      <PublicHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
