import { FeaturePage } from "@/components/app/feature-page";
import { adminPageContent } from "@/data/page-content";

export default function AdminProductsPage() {
  return <FeaturePage content={adminPageContent.products} />;
}
