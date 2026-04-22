import { FeaturePage } from "@/components/app/feature-page";
import { MediaSampleCard } from "@/components/app/media-sample-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { newsSampleResources } from "@/data/member-samples";
import { newsItems } from "@/data/mock-data";
import { memberPageContent } from "@/data/page-content";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.news} />
      <section className="grid gap-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="neutral">{item.category}</Badge>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{item.publishedAt}</p>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.summary}</p>
          </Card>
        ))}
      </section>
      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">本周资讯配套资料</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            资讯页除了文字通知，也可以同步出现活动视频封面、产品资料与内部参考文件。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {newsSampleResources.map((sample) => (
            <MediaSampleCard key={sample.title} {...sample} />
          ))}
        </div>
      </section>
    </div>
  );
}
