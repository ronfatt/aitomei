import { PageHeader } from "@/components/app/page-header";
import { ProfileForm } from "@/components/app/profile-form";
import { requireRole } from "@/lib/auth/session";
import { getMemberProfileFormData } from "@/lib/supabase/repositories";

export default async function ProfilePage() {
  const auth = await requireRole("member");
  const profile = await getMemberProfileFormData(auth.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="会员资料"
        title="会员身份信息与推广偏好"
        description="会员资料会驱动内容生成个性化、活动推荐与学习引导等关键体验。"
      />
      <ProfileForm
        userId={auth.user.id}
        initialValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.displayName,
          mobileNumber: profile.mobileNumber,
          preferredTone: profile.preferredTone,
          favoriteCategory: profile.favoriteCategory,
          bio: profile.bio,
        }}
        initialPhotoPath={profile.photoPath ?? null}
        source={profile.source}
      />
    </div>
  );
}
