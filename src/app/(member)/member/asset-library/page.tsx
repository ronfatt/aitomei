import { FeaturePage } from "@/components/app/feature-page";
import { Card } from "@/components/ui/card";
import { memberPageContent } from "@/data/page-content";

export default function AssetLibraryPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.assetLibrary} />
      <section className="grid gap-4 lg:grid-cols-3">
        {["Poster · Delivered", "Caption · Saved", "Video Request · Queued"].map((item) => (
          <Card key={item} className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item}</p>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">Member asset card</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Storage-backed asset cards live here with preview, download, and reuse actions.
            </p>
          </Card>
        ))}
      </section>
    </div>
  );
}
