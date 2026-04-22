import Link from "next/link";
import { ImagePlus, MessagesSquare, Video } from "lucide-react";

import { FeaturePage } from "@/components/app/feature-page";
import { MediaSampleCard } from "@/components/app/media-sample-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contentStudioSamples } from "@/data/member-samples";
import { memberPageContent } from "@/data/page-content";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: ImagePlus,
    title: "海报生成器",
    detail: "上传照片、选择模板，并提交个性化活动海报请求。",
    href: "/member/content-studio/poster-generator",
  },
  {
    icon: MessagesSquare,
    title: "文案生成器",
    detail: "按平台生成优雅、教育型、节庆型或推广型文案。",
    href: "/member/content-studio/caption-generator",
  },
  {
    icon: Video,
    title: "短视频请求",
    detail: "提交基于官方模板的短视频请求，并加入会员 CTA 与结尾卡。",
    href: "/member/content-studio/short-video-requests",
  },
];

export default function ContentStudioPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.contentStudio} />
      <section className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card
            key={tool.title}
            className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.3)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.22)] bg-[linear-gradient(180deg,rgba(242,200,107,0.16),rgba(177,58,134,0.18))] text-[var(--gold-strong)]">
              <tool.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[var(--foreground)]">{tool.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{tool.detail}</p>
            <Link href={tool.href} className={cn(buttonVariants({ variant: "secondary" }), "mt-5")}>
              打开工具
            </Link>
          </Card>
        ))}
      </section>
      <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.34),rgba(42,15,35,0.7))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)] lg:p-8">
        <Badge variant="warning">品牌安全工作流</Badge>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            "MVP 阶段仅允许会员使用官方模板工作流。",
            "系统刻意不开放自由编辑，以维持高端品牌的一致性。",
            "所有产出都会进入素材历史，方便复用、审核与活动延续。",
          ].map((rule) => (
            <div
              key={rule}
              className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm leading-7 text-[var(--muted)]"
            >
              {rule}
            </div>
          ))}
        </div>
      </Card>
      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">创作样板预览</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            这些不是开放式编辑器，而是官方模板工作流完成后的效果示意，方便会员理解会产出什么。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {contentStudioSamples.map((sample) => (
            <MediaSampleCard key={sample.title} {...sample} />
          ))}
        </div>
      </section>
    </div>
  );
}
