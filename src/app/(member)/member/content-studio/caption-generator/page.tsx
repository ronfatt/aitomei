import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CaptionGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="文案生成器"
        title="按平台、语气与产品主题生成文案"
        description="会员可以按不同平台生成文案，并带入 CTA、会员姓名与标签建议等参数。"
      />
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="neutral">文案设置</Badge>
          <form className="mt-6 space-y-4">
            <Input placeholder="平台：Instagram" />
            <Input placeholder="语气：优雅" />
            <Input placeholder="产品主题：节庆送礼黄金吊坠" />
            <Input placeholder="是否带会员姓名：是" />
            <Input placeholder="是否加入 CTA：欢迎私讯了解送礼推荐" />
            <Button>生成文案</Button>
          </form>
        </Card>
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.32),rgba(22,9,20,0.96))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.28)]">
          <Badge variant="default">生成结果</Badge>
          <Textarea
            className="mt-4 min-h-96 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            defaultValue="用一抹历久弥新的金色，为这个节庆时刻增添温度与心意。这件作品把优雅、价值感与祝福自然融合在一起，很适合用于家庭聚会与送礼场景。如果你也在寻找一份更有意义、也更耐看的礼物，我很乐意继续和你分享细节。#TOMEI #RayaRadiance #GoldenMoments"
          />
        </Card>
      </section>
    </div>
  );
}
