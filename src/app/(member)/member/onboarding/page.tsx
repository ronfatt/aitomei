import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMemberMissions, getMemberProfileFormData } from "@/lib/supabase/repositories";
import { requireRole } from "@/lib/auth/session";

export default async function OnboardingPage() {
  const auth = await requireRole("member");
  const [profile, missions] = await Promise.all([
    getMemberProfileFormData(auth.user.id),
    getMemberMissions(auth.user.id),
  ]);

  const profileComplete =
    Boolean(profile.firstName && profile.lastName && profile.displayName && profile.bio) &&
    profile.source === "supabase";
  const hasPhoto = Boolean(profile.photoPath);
  const posterMission = missions.find((mission) => mission.id === "generate-first-poster");
  const firstProofMission = missions.find((mission) => mission.id === "submit-first-post");
  const posterReady = posterMission?.status === "in_progress" || posterMission?.status === "completed";
  const proofReady = firstProofMission?.status === "available" || firstProofMission?.status === "completed";

  const onboardingSteps = [
    {
      title: "Create account and verify login",
      status: auth.mode === "supabase" ? "done" : "current",
      detail:
        auth.mode === "supabase"
          ? "Real Supabase authentication is active for this member account."
          : "Demo mode is active until Supabase environment variables are configured.",
      href: "/login",
      cta: "Open login",
    },
    {
      title: "Complete profile and preferences",
      status: profileComplete ? "done" : "current",
      detail:
        profile.source === "supabase"
          ? "Your profile data is connected to member personalization and onboarding progress."
          : "Save your profile to Supabase to activate real onboarding progress.",
      href: "/member/profile",
      cta: "Complete profile",
    },
    {
      title: "Upload profile photo",
      status: hasPhoto ? "done" : profileComplete ? "current" : "upcoming",
      detail:
        hasPhoto
          ? "Profile photo is attached and ready for content personalization."
          : "A premium portrait unlocks better personalization and mission progression.",
      href: "/member/profile",
      cta: "Upload photo",
    },
    {
      title: "Generate your first poster",
      status: posterReady ? "done" : hasPhoto ? "current" : "upcoming",
      detail:
        posterMission?.status === "completed"
          ? "Your first brand-safe poster flow has been completed."
          : "This is the first major activation step for content participation.",
      href: "/member/content-studio/poster-generator",
      cta: "Open poster generator",
    },
    {
      title: "Submit your first social proof",
      status: proofReady ? "current" : "upcoming",
      detail:
        proofReady
          ? "You are ready to publish and submit your first campaign-aligned proof."
          : "Proof submission unlocks the next layer of mission and reward progress.",
      href: "/member/missions/submit-first-post",
      cta: "Review mission",
    },
  ] as const;

  const currentStep =
    onboardingSteps.find((step) => step.status === "current") ??
    onboardingSteps.find((step) => step.status === "upcoming") ??
    onboardingSteps[onboardingSteps.length - 1];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Onboarding Journey"
        title="A polished first-run experience with real member progress"
        description="The onboarding flow introduces the brand, unlocks the first mission, and now reflects live profile and mission readiness instead of static placeholders."
      />
      <Card className="p-6 lg:p-8">
        <Badge className="w-fit">Current stage</Badge>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
          {currentStep.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          {currentStep.detail}
        </p>
        <div className="mt-8 space-y-4">
          {onboardingSteps.map((step) => (
            <div
              key={step.title}
              className="flex items-start justify-between gap-4 rounded-[28px] border border-[var(--border)] bg-white/70 p-4"
            >
              <div className="flex items-start gap-4">
                {step.status === "done" ? (
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--success)]" />
                ) : (
                  <Circle className="mt-1 h-5 w-5 text-[var(--gold-strong)]" />
                )}
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{step.title}</p>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{step.detail}</p>
                </div>
              </div>
              <Link href={step.href} className="shrink-0 text-sm font-semibold text-[var(--gold-strong)]">
                {step.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href={currentStep.href}>
            <Button>
              {currentStep.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
