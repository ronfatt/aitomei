import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { memberPageContent } from "@/data/page-content";
import { products } from "@/data/mock-data";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.products} />
      <section className="grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="p-6">
            <Badge variant="neutral">{product.category}</Badge>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{product.name}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.story}</p>
            <p className="mt-4 text-sm text-[var(--gold-strong)]">{product.priceRange}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{product.spotlight}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
