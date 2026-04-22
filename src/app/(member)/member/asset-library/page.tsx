import { FeaturePage } from "@/components/app/feature-page";
import { MediaSampleCard } from "@/components/app/media-sample-card";
import { Card } from "@/components/ui/card";
import { assetLibrarySamples } from "@/data/member-samples";
import { memberPageContent } from "@/data/page-content";

export default function AssetLibraryPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.assetLibrary} />
      <section className="grid gap-4 lg:grid-cols-3">
        {assetLibrarySamples.map((sample) => (
          <MediaSampleCard key={sample.title} {...sample} />
        ))}
      </section>
      <Card className="p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">最近素材状态样板</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            "海报类素材可显示封面、尺寸与交付状态。",
            "视频请求可显示封面图、时长与队列进度。",
            "资料文件可显示文档类型、更新时间与内部用途。",
          ].map((item) => (
            <div key={item} className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4 text-sm leading-7 text-[var(--muted)]">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
