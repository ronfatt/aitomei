import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { goldnowKnowledgeSourceNote } from "@/features/ai/knowledge/goldnow";

export default function AiConciergePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI 礼宾"
        title="GoldNow 主动提示中心"
        description="在你还没开始对话前，AI 礼宾会先把 demo 最常用、最容易打动客户的 GoldNow 重点整理给你。"
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["今日最该先讲", "GoldNow 不是虚拟概念黄金，而是有真实黄金支持、可数字化持有、可兑换实体黄金。"],
          ["客户最容易记住的点", "从 0.1 克就能开始，这个门槛非常适合 demo 时先抛出来。"],
          ["Shariah 重点", "真实资产支持、无利息、无保证回报，这三个关键词最值得主动说。"],
          ["信任基础", "Tomei 成立于 1968 年，是马来西亚上市黄金与珠宝集团，并有 60+ 零售网点。"],
          ["兑换卖点", "用户可在 App 管理黄金，并到 Tomei 门店兑换与领取实体黄金。"],
          ["当前知识来源", goldnowKnowledgeSourceNote],
        ].map(([title, detail]) => (
          <Card key={title} className="p-6">
            <Badge variant="neutral">主动提示卡</Badge>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{detail}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
