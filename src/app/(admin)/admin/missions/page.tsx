import { FeaturePage } from "@/components/app/feature-page";
import { adminPageContent } from "@/data/page-content";

export default function AdminMissionsPage() {
  return <FeaturePage content={adminPageContent.missions} />;
}
