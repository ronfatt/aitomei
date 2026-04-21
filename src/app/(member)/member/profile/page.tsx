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
        eyebrow="Member Profile"
        title="Member identity and promotion preferences"
        description="Profile data powers personalization across content generation, campaign recommendations, and learning guidance."
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
