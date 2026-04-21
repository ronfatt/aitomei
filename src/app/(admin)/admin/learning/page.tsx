import { FeaturePage } from "@/components/app/feature-page";
import { adminPageContent } from "@/data/page-content";

export default function AdminLearningPage() {
  return <FeaturePage content={adminPageContent.learning} />;
}
