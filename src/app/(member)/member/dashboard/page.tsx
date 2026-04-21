import { MemberMobileDashboard } from "@/components/app/member-mobile-dashboard";
import {
  campaigns,
  learningModules,
  recentGeneratedAssets,
} from "@/data/mock-data";
import { requireRole } from "@/lib/auth/session";
import {
  getMemberMissions,
  getMemberProfileFormData,
  getRewardOverview,
} from "@/lib/supabase/repositories";

export default async function MemberDashboardPage() {
  const auth = await requireRole("member");
  const [profile, missions, rewardOverview] = await Promise.all([
    getMemberProfileFormData(auth.user.id),
    getMemberMissions(auth.user.id),
    getRewardOverview(auth.user.id),
  ]);

  return (
    <MemberMobileDashboard
      displayName={profile.displayName || auth.user.displayName}
      missions={missions}
      rewardOverview={rewardOverview}
      campaigns={campaigns}
      learningModules={learningModules}
      recentAssets={[...recentGeneratedAssets]}
    />
  );
}
