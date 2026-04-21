import { CheckCircle2, Circle } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const onboardingSteps = [
  { title: "Create account and verify login", status: "done" },
  { title: "Complete profile and preferences", status: "done" },
  { title: "Upload profile photo", status: "done" },
  { title: "Generate your first poster", status: "next" },
  { title: "Submit your first social proof", status: "upcoming" },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Onboarding Journey"
        title="A polished first-run experience with clear momentum"
        description="The onboarding flow introduces the brand, unlocks the first mission, and gets members to their first personalized output quickly."
      />
      <Card className="p-6 lg:p-8">
        <Badge className="w-fit">Current stage</Badge>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
          Generate your first poster
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          This is the bridge between passive membership and active content participation. The UI nudges members to finish it early because it powers future missions and campaign visibility.
        </p>
        <div className="mt-8 space-y-4">
          {onboardingSteps.map((step) => (
            <div key={step.title} className="flex items-start gap-4 rounded-[28px] border border-[var(--border)] bg-white/70 p-4">
              {step.status === "done" ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--success)]" />
              ) : (
                <Circle className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
              )}
              <div>
                <p className="font-semibold text-[var(--foreground)]">{step.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {step.status === "next" ? "Recommended next action for activation." : "Structured to keep the journey understandable."}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button>Continue to poster generator</Button>
        </div>
      </Card>
    </div>
  );
}
