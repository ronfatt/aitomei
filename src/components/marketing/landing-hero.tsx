import Link from "next/link";
import { ArrowRight, Gem, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroTags = [
  "Certified Provenance",
  "Private Member Access",
  "Heritage Asset Record",
] as const;

const trustPoints = [
  { icon: Gem, label: "Cultural Jewelry Asset" },
  { icon: WalletCards, label: "Member Privilege Account" },
  { icon: ShieldCheck, label: "Digital Provenance" },
  { icon: Sparkles, label: "Capital-Ready Narrative" },
] as const;

export function LandingHero() {
  return (
    <section className="gold-sweep luxury-fade-lift relative overflow-hidden rounded-[40px] border border-[rgba(214,177,94,0.18)] bg-[radial-gradient(circle_at_20%_12%,rgba(214,177,94,0.12),transparent_18%),radial-gradient(circle_at_84%_18%,rgba(214,177,94,0.08),transparent_16%),linear-gradient(180deg,#0a0806_0%,#060504_100%)] px-6 py-7 shadow-[0_40px_120px_rgba(0,0,0,0.46)] lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_18%,rgba(214,177,94,0.05)_45%,transparent_64%)]" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="space-y-8 py-4 lg:py-10">
          <Badge className="w-fit rounded-full border border-[rgba(214,177,94,0.18)] bg-[rgba(214,177,94,0.08)] px-5 py-2 text-xs uppercase tracking-[0.28em] text-[var(--gold)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            Aurex Legacy Maison
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,7vw,6.6rem)] leading-[0.9] tracking-[-0.05em] text-[var(--foreground)]">
              Heritage Jewelry.
              <br />
              <span className="text-[var(--gold)]">Privilege Membership.</span>
              <br />
              Future Provenance.
            </h1>
            <p className="max-w-[35rem] text-lg leading-8 text-[rgba(169,156,138,0.96)] lg:text-[1.08rem]">
              A luxury jewelry membership platform connecting physical collections, private privileges and digital provenance records.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="#membership"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full border border-[rgba(214,177,94,0.24)] bg-[linear-gradient(135deg,#f0d18a_0%,#d6b15e_50%,#a07120_100%)] px-8 text-[0.95rem] font-semibold tracking-[0.12em] text-[#1b1309] shadow-[0_18px_44px_rgba(200,155,60,0.24)] hover:shadow-[0_22px_50px_rgba(200,155,60,0.3)]",
              )}
            >
              Explore Membership
            </Link>
            <Link
              href="#dashboard"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 rounded-full border-[rgba(214,177,94,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] px-8 text-[0.95rem] font-semibold tracking-[0.1em] text-[rgba(244,235,221,0.94)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white",
              )}
            >
              View Demo Dashboard
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map((point) => (
              <div
                key={point.label}
                className="rounded-[22px] border border-[rgba(214,177,94,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(214,177,94,0.28)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(214,177,94,0.18)] bg-[rgba(214,177,94,0.08)] text-[var(--gold)]">
                  <point.icon className="h-[18px] w-[18px]" />
                </div>
                <p className="mt-4 text-sm tracking-[0.08em] text-[rgba(244,235,221,0.92)]">{point.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-fade-lift-delay-1 relative min-h-[640px] overflow-hidden rounded-[34px] border border-[rgba(214,177,94,0.16)] bg-[radial-gradient(circle_at_68%_18%,rgba(214,177,94,0.16),transparent_14%),radial-gradient(circle_at_72%_30%,rgba(255,255,255,0.06),transparent_12%),linear-gradient(180deg,#070605_0%,#100d0a_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:min-h-[720px] lg:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.04)_100%)]" />
          <div className="absolute inset-x-[12%] bottom-[10%] h-[42%] rounded-[48px] bg-[radial-gradient(circle_at_50%_18%,rgba(214,177,94,0.2),transparent_34%),linear-gradient(180deg,rgba(30,22,16,0.32),rgba(8,7,6,0.94))] blur-[1px]" />
          <div className="gold-breathe absolute right-[10%] top-[12%] h-[68%] w-[54%] rounded-[46%] bg-[radial-gradient(circle_at_50%_30%,rgba(214,177,94,0.14),rgba(214,177,94,0.03)_48%,transparent_74%)]" />

          <div className="absolute left-6 top-6 flex flex-wrap gap-3 lg:left-8 lg:top-8">
            {heroTags.map((tag) => (
              <div
                key={tag}
                className="rounded-full border border-[rgba(214,177,94,0.16)] bg-[rgba(8,7,6,0.52)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[rgba(244,235,221,0.84)] backdrop-blur-md"
              >
                {tag}
              </div>
            ))}
          </div>

          <div className="absolute right-[12%] top-[16%] h-[44%] w-[32%] rounded-[48%] bg-[radial-gradient(circle_at_46%_38%,rgba(255,245,218,0.16),rgba(214,177,94,0.12)_28%,rgba(15,13,10,0.02)_66%)] blur-sm" />

          <div className="absolute bottom-[18%] right-[12%] h-[38%] w-[46%] rounded-[44%] border border-[rgba(214,177,94,0.12)] bg-[linear-gradient(160deg,rgba(21,17,13,0.82),rgba(6,5,4,0.98))] shadow-[0_40px_110px_rgba(0,0,0,0.52)]" />
          <div className="absolute bottom-[27%] right-[25%] h-[22%] w-[26%] rounded-full border border-[rgba(214,177,94,0.26)] bg-[radial-gradient(circle_at_48%_42%,rgba(245,227,177,0.28),rgba(214,177,94,0.1)_44%,transparent_72%)] shadow-[0_0_44px_rgba(214,177,94,0.16)]" />
          <div className="absolute bottom-[26%] right-[19%] h-[26%] w-[10%] rounded-full bg-[linear-gradient(180deg,rgba(214,177,94,0.92),rgba(111,77,24,0.78))] shadow-[0_8px_24px_rgba(214,177,94,0.16)]" />
          <div className="absolute bottom-[20%] right-[17%] h-[20%] w-[14%] rounded-[40%] border border-[rgba(214,177,94,0.36)] bg-[radial-gradient(circle_at_50%_32%,rgba(255,245,218,0.34),rgba(214,177,94,0.18)_42%,rgba(79,56,17,0.92)_78%)] shadow-[0_20px_52px_rgba(0,0,0,0.46)]" />

          <div className="absolute bottom-[16%] left-[7%] max-w-[18rem] rounded-[28px] border border-[rgba(214,177,94,0.14)] bg-[linear-gradient(180deg,rgba(10,9,7,0.78),rgba(9,7,6,0.48))] p-5 backdrop-blur-md shadow-[0_18px_42px_rgba(0,0,0,0.32)]">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--gold)]">Featured Piece</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[2rem] leading-none tracking-[-0.05em] text-[var(--foreground)]">
              Black Card Diamond Set
            </p>
            <p className="mt-3 text-sm leading-7 text-[rgba(169,156,138,0.92)]">
              Crafted for ceremonial gifting, private club membership and archival provenance storytelling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
