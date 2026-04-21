import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockAiCoach } from "@/features/ai/contracts";
import { inferAiCoachContext } from "@/features/ai/helpers";
import {
  goldnowKnowledgeCards,
  goldnowObjectionScripts,
  goldnowKnowledgeSourceNote,
  goldnowSuggestedPrompts,
} from "@/features/ai/knowledge/goldnow";
import { requireRole } from "@/lib/auth/session";

export default async function AiCoachPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const auth = await requireRole("member");
  const resolvedSearchParams = await searchParams;
  const prompt = resolvedSearchParams.prompt?.trim() || "请用一句人话介绍 GoldNow by Tomei";
  const response = await mockAiCoach({
    memberId: auth.user.id,
    message: prompt,
    context: inferAiCoachContext(prompt),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI 教练"
        title="GoldNow 官方知识 Demo 助手"
        description="这版 AI 教练已经载入 GoldNow by Tomei 英文版与中文版资料，回答会更贴近 demo 场景：先给结论，再主动补一句你可以怎么讲。"
      />

      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="neutral">官方知识已载入</Badge>
            <Badge variant="default">GoldNow 产品说明</Badge>
            <Badge variant="default">Shariah 结构</Badge>
            <Badge variant="default">实体兑换</Badge>
            <Badge variant="default">Demo 话术辅助</Badge>
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted)]">
              {prompt}
            </div>
            <div className="rounded-[24px] border border-[rgba(196,168,114,0.22)] bg-[rgba(250,241,226,0.75)] p-4 text-sm leading-7 text-[var(--foreground)]">
              <p className="whitespace-pre-line">{response.reply}</p>
            </div>
            <form className="space-y-4" method="get">
              <Textarea
                name="prompt"
                defaultValue={prompt}
                placeholder="例如：客户问 GoldNow 是不是真的黄金，我该怎么讲？"
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit">生成回答</Button>
                <Badge variant="warning">{goldnowKnowledgeSourceNote}</Badge>
              </div>
            </form>

            <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">AI 会主动建议你下一步怎么讲</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {response.suggestedActions.map((action) => (
                  <span
                    key={action}
                    className="rounded-full border border-[rgba(196,168,114,0.18)] bg-[rgba(255,255,255,0.9)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <Badge variant="warning">建议你 demo 时直接点这些问题</Badge>
          <div className="mt-4 space-y-4">
            {goldnowSuggestedPrompts.map((suggestion) => (
              <Link
                key={suggestion}
                href={`/member/ai-coach?prompt=${encodeURIComponent(suggestion)}`}
                className="block rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)] transition hover:bg-white"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {goldnowKnowledgeCards.map((card) => (
          <Card key={card.title} className="p-5">
            <Badge variant="neutral">{card.tag}</Badge>
            <h2 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.detail}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">客户追问脚本</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            这部分专门给你 demo 时用。遇到敏感问题，不只回答事实，也带出更稳的说法。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {goldnowObjectionScripts.map((script) => (
            <Card key={script.id} className="p-5">
              <Badge variant="warning">追问应对</Badge>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{script.objection}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{script.shortAnswer}</p>
              <div className="mt-4 rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">建议说法</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{script.talkTrack}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{script.nextMove}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
