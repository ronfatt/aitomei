import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gem,
  Globe,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { LandingHero } from "@/components/marketing/landing-hero";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const shellClass =
  "rounded-[34px] border border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(16,13,10,0.96),rgba(8,7,6,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_28px_80px_rgba(0,0,0,0.32)]";

const glassCardClass =
  "rounded-[30px] border border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(8,7,6,0.98))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(214,177,94,0.32)]";

const positioningLayers = [
  {
    title: "Physical Jewelry Layer",
    description: "Signature collections, ceremonial gifting and collectible pieces with real luxury product value.",
  },
  {
    title: "Membership Privilege Layer",
    description: "Private access, tiered upgrades, concierge moments and ongoing relationship logic around every purchase.",
  },
  {
    title: "Digital Provenance Layer",
    description: "Item-level provenance, account records and brand-ready documentation for long-term ownership confidence.",
  },
] as const;

const productLadder = [
  {
    tier: "Entry",
    title: "Heritage Access Pack",
    price: "From MYR 3,800",
    benefits: ["Signature welcome gift", "Member profile activation", "Foundational provenance record"],
    cta: "Start Entry Pack",
  },
  {
    tier: "Core",
    title: "Signature Legacy Pack",
    price: "From MYR 12,800",
    benefits: ["Core jewelry selection", "Privilege balance tracking", "Priority event access"],
    cta: "View Core Benefits",
  },
  {
    tier: "Premium",
    title: "Family Heritage Pack",
    price: "From MYR 28,000",
    benefits: ["Family account grouping", "Bespoke engraving story", "Expanded provenance archive"],
    cta: "Explore Premium",
  },
  {
    tier: "Elite",
    title: "Founder Circle / Black Card",
    price: "Private Invitation",
    benefits: ["Private advisor service", "Closed-door maison events", "Legacy archive concierge"],
    cta: "Request Circle Access",
  },
] as const;

const ecosystemCards = [
  {
    icon: Globe,
    title: "Global Membership Club",
    description: "Extend luxury transactions into invitations, access windows and relationship continuity across markets.",
  },
  {
    icon: WalletCards,
    title: "Privilege Account Logic",
    description: "Track benefit value, purchase behavior and status progression inside a polished private member account.",
  },
  {
    icon: ShieldCheck,
    title: "Digital Provenance Certificate",
    description: "Connect every item to a clean record of origin, ownership context and future-ready documentation.",
  },
  {
    icon: Gem,
    title: "Luxury Heritage Story",
    description: "Package jewelry, legacy narrative and member prestige into a brand world clients want to stay inside.",
  },
] as const;

const provenanceCards = [
  {
    title: "Unique Item ID",
    description: "Assign every piece a permanent identifier linked to collection details, provenance notes and issuance data.",
  },
  {
    title: "Member Account Ledger",
    description: "Structure purchases, privileges and profile milestones into a clear relationship record instead of one-off retail logs.",
  },
  {
    title: "Audit & Compliance Interface",
    description: "Keep internal review, verification and future asset-readiness workflows documented without making financial promises.",
  },
] as const;

const dashboardPanels = [
  { label: "Member Profile", value: "Aurex Legacy Black Member", detail: "Private tier, concierge contact and verified identity" },
  { label: "Purchase History", value: "12 Certified Pieces", detail: "Collection timeline with issuance dates and narratives" },
  { label: "Privilege Balance", value: "MYR 18,400", detail: "Reserved value for member services and private releases" },
  { label: "Provenance Certificate", value: "4 Active Records", detail: "Digital certificates synced to product-level archives" },
  { label: "Admin Approval", value: "Verified", detail: "Compliance-ready review trail with approval checkpoints" },
] as const;

export default function LandingPage() {
  return (
    <div className="space-y-28 pb-10 lg:space-y-[7.5rem] lg:pb-16">
      <LandingHero />

      <section id="platform" className={cn(shellClass, "luxury-fade-lift px-6 py-16 lg:px-10 lg:py-24")}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Platform Positioning</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.9rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-[var(--foreground)]">
            Luxury + Heritage + Digital Ownership
          </h2>
          <p className="mt-5 text-lg leading-8 text-[rgba(169,156,138,0.92)]">
            A clearer brand platform for luxury collections, private member relationships and provenance-led records.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {positioningLayers.map((item) => (
            <Card key={item.title} className={glassCardClass}>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">Platform Layer</p>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-[2rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[rgba(169,156,138,0.94)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="collections" className={cn(shellClass, "luxury-fade-lift-delay-1 px-6 py-16 lg:px-10 lg:py-24")}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Product Ladder</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-[var(--foreground)]">
            From First Purchase to Black Card Circle
          </h2>
          <p className="mt-5 text-lg leading-8 text-[rgba(169,156,138,0.92)]">
            A membership ladder designed to move clients from initial entry into deeper loyalty, provenance and private access.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-4">
          {productLadder.map((item) => (
            <Card key={item.title} className={glassCardClass}>
              <div className="flex items-center justify-between gap-4">
                <Badge className="rounded-full border border-[rgba(214,177,94,0.18)] bg-[rgba(214,177,94,0.08)] px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
                  {item.tier}
                </Badge>
                <span className="text-sm tracking-[0.08em] text-[rgba(169,156,138,0.9)]">{item.price}</span>
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-[2rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                {item.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {item.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-[rgba(169,156,138,0.94)]">
                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#membership"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-8 h-12 w-full rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(18,15,12,0.94),rgba(10,9,7,0.94))] text-[rgba(244,235,221,0.96)] hover:bg-[rgba(214,177,94,0.08)] hover:text-white",
                )}
              >
                {item.cta}
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section id="membership" className={cn(shellClass, "luxury-fade-lift-delay-2 px-6 py-16 lg:px-10 lg:py-24")}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Membership Ecosystem</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-[var(--foreground)]">
            Turn High-End Transactions Into Long-Term Relationships
          </h2>
          <p className="mt-5 text-lg leading-8 text-[rgba(169,156,138,0.92)]">
            The ecosystem is built to keep luxury clients returning through account logic, recognition and elegant after-purchase continuity.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {ecosystemCards.map((item) => (
            <Card key={item.title} className={glassCardClass}>
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(214,177,94,0.18)] bg-[rgba(214,177,94,0.08)] text-[var(--gold)]">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-[2rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[rgba(169,156,138,0.94)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="provenance" className={cn(shellClass, "luxury-fade-lift-delay-3 px-6 py-16 lg:px-10 lg:py-24")}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Provenance &amp; RWA Foundation</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-[var(--foreground)]">
            Built for Provenance, Audit Trail and Future Asset Readiness
          </h2>
          <p className="mt-5 text-lg leading-8 text-[rgba(169,156,138,0.92)]">
            The language stays compliant: provenance first, governance second, future readiness only where the brand can support it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {provenanceCards.map((item) => (
            <Card key={item.title} className={glassCardClass}>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">Readiness Layer</p>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-[2rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[rgba(169,156,138,0.94)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="dashboard"
        className={cn(
          shellClass,
          "luxury-fade-lift-delay-3 overflow-hidden px-6 py-16 lg:grid lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-10 lg:px-10 lg:py-24",
        )}
      >
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Demo Dashboard Preview</p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-[var(--foreground)]">
            A live member experience, not just a concept slide.
          </h2>
          <p className="text-lg leading-8 text-[rgba(169,156,138,0.92)]">
            Show clients how luxury membership, provenance records and admin governance actually work inside one polished platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/demo-login?role=member"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full border border-[rgba(214,177,94,0.24)] bg-[linear-gradient(135deg,#f0d18a_0%,#d6b15e_50%,#a07120_100%)] px-8 text-[#1b1309] shadow-[0_18px_44px_rgba(200,155,60,0.24)] hover:shadow-[0_22px_50px_rgba(200,155,60,0.3)]",
              )}
            >
              Enter Member Demo
            </Link>
            <Link
              href="/api/demo-login?role=admin"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(18,15,12,0.94),rgba(10,9,7,0.94))] px-8 text-[rgba(244,235,221,0.96)] hover:bg-[rgba(214,177,94,0.08)] hover:text-white",
              )}
            >
              View Admin Demo
            </Link>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="relative overflow-hidden rounded-[34px] border border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(13,11,9,0.96),rgba(9,8,7,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_28px_80px_rgba(0,0,0,0.3)] lg:p-7">
            <div className="absolute inset-x-[18%] top-0 h-16 bg-[linear-gradient(180deg,rgba(214,177,94,0.14),transparent)] blur-2xl" />
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-[rgba(214,177,94,0.16)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(9,8,7,0.98))] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">Member Overview</p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-[2.1rem] tracking-[-0.05em] text-[var(--foreground)]">
                      Aurex Legacy
                    </p>
                  </div>
                  <div className="rounded-full border border-[rgba(214,177,94,0.18)] bg-[rgba(214,177,94,0.08)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                    Active
                  </div>
                </div>
                <div className="mt-6 h-40 rounded-[24px] border border-[rgba(214,177,94,0.12)] bg-[radial-gradient(circle_at_72%_16%,rgba(214,177,94,0.12),transparent_16%),linear-gradient(180deg,rgba(7,6,5,0.92),rgba(16,13,10,0.92))] p-5">
                  <p className="text-sm tracking-[0.08em] text-[rgba(244,235,221,0.92)]">Black Member Profile</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-[rgba(214,177,94,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(244,235,221,0.74)]">Purchase Timeline</p>
                      <p className="mt-3 text-xl text-[var(--foreground)]">12 pieces</p>
                    </div>
                    <div className="rounded-[18px] border border-[rgba(214,177,94,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[rgba(244,235,221,0.74)]">Privilege Value</p>
                      <p className="mt-3 text-xl text-[var(--foreground)]">MYR 18.4k</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {dashboardPanels.slice(0, 3).map((panel) => (
                  <div
                    key={panel.label}
                    className="rounded-[24px] border border-[rgba(214,177,94,0.14)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(9,8,7,0.98))] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-[rgba(244,235,221,0.74)]">{panel.label}</p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-[1.8rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                      {panel.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[rgba(244,235,221,0.72)]">{panel.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {dashboardPanels.slice(3).map((panel) => (
                <div
                  key={panel.label}
                  className="rounded-[24px] border border-[rgba(214,177,94,0.14)] bg-[linear-gradient(180deg,rgba(18,15,12,0.98),rgba(9,8,7,0.98))] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[rgba(244,235,221,0.74)]">{panel.label}</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-[1.8rem] leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                    {panel.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(244,235,221,0.72)]">{panel.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={cn(shellClass, "luxury-fade-lift-delay-3 px-6 py-14 lg:px-10 lg:py-20")}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Final CTA</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.6rem,4.5vw,4.6rem)] leading-[0.96] tracking-[-0.05em] text-[var(--foreground)]">
              A Luxury Jewelry Platform Built for Brand, Members and Legacy.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/demo-login?role=member"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full border border-[rgba(214,177,94,0.24)] bg-[linear-gradient(135deg,#f0d18a_0%,#d6b15e_50%,#a07120_100%)] px-8 text-[#1b1309] shadow-[0_18px_44px_rgba(200,155,60,0.24)] hover:shadow-[0_22px_50px_rgba(200,155,60,0.3)]",
              )}
            >
              Enter Member Demo
            </Link>
            <Link
              href="/api/demo-login?role=admin"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(18,15,12,0.94),rgba(10,9,7,0.94))] px-8 text-[rgba(244,235,221,0.96)] hover:bg-[rgba(214,177,94,0.08)] hover:text-white",
              )}
            >
              View Admin Demo
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
