import { FeaturePage } from "@/components/app/feature-page";
import { adminPageContent } from "@/data/page-content";

export default function AdminCampaignsPage() {
  return <FeaturePage content={adminPageContent.campaigns} />;
}
