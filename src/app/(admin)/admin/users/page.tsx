import { FeaturePage } from "@/components/app/feature-page";
import { adminPageContent } from "@/data/page-content";

export default function AdminUsersPage() {
  return <FeaturePage content={adminPageContent.users} />;
}
