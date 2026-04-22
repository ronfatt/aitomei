import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PosterGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="海报生成器"
        title="个性化生成高端品牌活动海报"
        description="这条流程已经具备会员输入、模板信息、存储结构与输出生命周期，后续可直接接入真实渲染服务。"
      />
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="neutral">请求表单</Badge>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            当前仅支持官方模板工作流。会员会在品牌可控框架内完成个性化，而不是自由编辑版面。
          </p>
          <form className="mt-6 space-y-4">
            <Input placeholder="模板：象牙金调签名海报" />
            <Input placeholder="活动：Raya 臻彩金辉 2026" />
            <Input placeholder="会员照片上传路径 / 引用" />
            <Input placeholder="可选 CTA 文案" />
            <Button>加入海报生成队列</Button>
          </form>
        </Card>
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.32),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="default">预览区</Badge>
          <div className="mt-4 flex min-h-96 items-center justify-center rounded-[28px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[radial-gradient(circle_at_top,rgba(177,58,134,0.26),transparent_46%),linear-gradient(180deg,rgba(27,13,23,0.92),rgba(17,8,15,0.96))]">
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">活动海报预览</p>
              <p className="mt-3 text-sm text-[var(--muted)]">未来真实渲染能力会接入同一套请求契约。</p>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm leading-7 text-[var(--muted)]">
            生成完成后的海报会自动保存到素材历史中，方便下载、复用与后续追踪。
          </div>
        </Card>
      </section>
    </div>
  );
}
