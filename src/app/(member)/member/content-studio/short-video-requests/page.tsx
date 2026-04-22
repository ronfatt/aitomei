import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ShortVideoRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="短视频请求"
        title="提交会员个性化短视频活动请求"
        description="MVP 把视频生成为抽象化请求管线，后续可接真实渲染引擎，而不需要改动会员体验。"
      />
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="neutral">加入队列</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            这条流程会维持模板化与品牌可控，不开放自由场景编辑。
          </p>
          <form className="mt-6 space-y-4">
            <Input placeholder="官方模板视频名称" />
            <Input placeholder="会员展示名称" />
            <Input placeholder="会员编号或 CTA" />
            <Input placeholder="结尾卡文案" />
            <Button>加入视频个性化队列</Button>
          </form>
        </Card>
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.32),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="warning">队列状态</Badge>
          <div className="mt-4 space-y-4">
            {[
              "请求已接收，并已分配到渲染队列中。",
              "MVP 阶段的目标交付时间维持在 24 小时内。",
              "完成后的素材会保存到素材历史与 generated-assets bucket 中，方便下载。",
            ].map((line) => (
              <div
                key={line}
                className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm leading-6 text-[var(--muted)]"
              >
                {line}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
