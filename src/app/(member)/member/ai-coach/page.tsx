import { AiCoachLivePanel } from "@/components/app/ai-coach-live-panel";
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
      <AiCoachLivePanel
        initialPrompt={prompt}
        sourceNote={knowledge.sourceNote}
        suggestedPrompts={goldnowSuggestedPrompts}
        initialConversations={conversationBootstrap.conversations}
        storageMode={conversationBootstrap.storageMode}
        sourceDocuments={knowledge.sourceDocuments}
        knowledgeCards={knowledge.knowledgeCards}
        objectionScripts={knowledge.objectionScripts}
      />
    </div>
  );
}
