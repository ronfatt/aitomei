import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { goldnowKnowledgeSourceNote } from "@/features/ai/knowledge/goldnow";

export default function AiConciergePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI 礼宾"
        title="Aurex Legacy 主动提示中心"
        description="在你还没开始对话前，AI 礼宾会先把 demo 最常用、最容易打动客户的 Aurex Legacy 重点整理给你。"
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["今日最该先讲", "Aurex Legacy 不是普通珠宝零售，而是文化珠宝资产、会员权益账户与数字确权的组合生态。"],
          ["客户最容易记住的点", "它同时踩中 Luxury Brand、Membership Economy、Asset Digitization 和 RWA Optionality 四条资本语言。"],
          ["会员重点", "先讲清楚 Privilege Account：不是一次性卖货，而是长期权益与服务关系。"],
          ["信任基础", "它的设计逻辑是用真实商品、会员体系和可审计的编号证书，去承接长期品牌价值。"],
          ["成交切口", "先从 Heritage Gold Plaque 或 Signature Legacy Pack 讲起，更容易进入高端礼赠与身份表达场景。"],
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
