import { AiCoachLivePanel } from "@/components/app/ai-coach-live-panel";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAiCoachConversationBootstrap } from "@/features/ai/chat-repository";
import {
  goldnowSuggestedPrompts,
} from "@/features/ai/knowledge/goldnow";
import { getAiCoachKnowledgeBundle } from "@/features/ai/repository";
import { requireRole } from "@/lib/auth/session";

export default async function AiCoachPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const auth = await requireRole("member");
  const knowledge = await getAiCoachKnowledgeBundle();
  const conversationBootstrap = await getAiCoachConversationBootstrap(auth.user.id, auth.mode);
  const resolvedSearchParams = await searchParams;
  const prompt = resolvedSearchParams.prompt?.trim() || "请用一句人话介绍 GoldNow by Tomei";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI 教练"
        title="GoldNow 官方知识 Live 助手"
        description="这版 AI 教练会优先依据已载入的 GoldNow by Tomei 英文版与中文版资料回答，并通过 OpenAI 实时生成更自然、更适合 demo 现场的话术。"
      />

      <AiCoachLivePanel
        initialPrompt={prompt}
        sourceNote={knowledge.sourceNote}
        suggestedPrompts={goldnowSuggestedPrompts}
        initialConversations={conversationBootstrap.conversations}
        storageMode={conversationBootstrap.storageMode}
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {knowledge.knowledgeCards.map((card) => (
          <Card
            key={card.title}
            className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-5 shadow-[0_22px_70px_rgba(5,3,8,0.24)]"
          >
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
          {knowledge.objectionScripts.map((script) => (
            <Card
              key={script.id}
              className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(75,17,56,0.28),rgba(22,9,20,0.96))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.28)]"
            >
              <Badge variant="warning">追问应对</Badge>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{script.objection}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{script.shortAnswer}</p>
              <div className="mt-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
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
