import { FeaturePage } from "@/components/app/feature-page";
import { memberPageContent } from "@/data/page-content";

export default function SettingsPage() {
  return <FeaturePage content={memberPageContent.settings} />;
}
