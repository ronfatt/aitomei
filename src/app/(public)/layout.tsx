import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import { PublicHeader } from "@/components/layout/public-header";

const publicShellStyle = {
  "--background": "#050403",
  "--foreground": "#F4EBDD",
  "--surface": "rgba(14,11,8,0.94)",
  "--muted": "#A99C8A",
  "--border": "rgba(214,177,94,0.18)",
  "--gold": "#D6B15E",
  "--gold-soft": "rgba(214,177,94,0.14)",
  "--gold-strong": "#C89B3C",
  "--panel-border": "rgba(214,177,94,0.18)",
  "--panel-bg": "linear-gradient(180deg, rgba(18,15,12,0.98), rgba(8,7,6,0.98))",
  "--panel-muted-border": "rgba(214,177,94,0.14)",
  "--panel-muted-bg": "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
  "--panel-shadow": "inset 0 1px 0 rgba(255,255,255,0.03), 0 24px 70px rgba(0,0,0,0.32)",
  "--ring": "rgba(214,177,94,0.22)",
  "--success": "#9AD0A8",
  "--warning": "#D6B15E",
} as CSSProperties;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(214,177,94,0.08),transparent_18%),linear-gradient(180deg,#050403_0%,#090705_48%,#050403_100%)]"
      style={publicShellStyle}
    >
      <PublicHeader />
      <main className="mx-auto w-full max-w-[1280px] px-5 py-8 lg:px-8 lg:py-12">{children}</main>
    </div>
  );
}
