import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";
import type {
  AiCoachConversationMessage,
  AiCoachConversationSession,
  AiCoachStorageMode,
  MessageRole,
  ProviderType,
} from "@/features/ai/chat-types";

type AuthMode = "demo" | "supabase";
type AiChatSessionRow = Database["public"]["Tables"]["ai_chat_sessions"]["Row"];
type AiMessageRow = Database["public"]["Tables"]["ai_messages"]["Row"];

interface AiMessageMetadata {
  provider?: ProviderType;
  model?: string;
  notice?: string | null;
  state?: AiCoachConversationMessage["state"];
  surface?: string;
}

function isRecord(value: Json | null): value is Record<string, Json> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function parseAiMessageMetadata(metadata: Json): AiMessageMetadata {
  if (!isRecord(metadata)) {
    return {};
  }

  return {
    provider:
      metadata.provider === "openai" || metadata.provider === "mock"
        ? (metadata.provider as ProviderType)
        : undefined,
    model: typeof metadata.model === "string" ? metadata.model : undefined,
    notice: typeof metadata.notice === "string" ? metadata.notice : null,
    state:
      metadata.state === "complete" ||
      metadata.state === "streaming" ||
      metadata.state === "stopped" ||
      metadata.state === "error"
        ? (metadata.state as AiCoachConversationMessage["state"])
        : undefined,
  };
}

function mapMessage(row: AiMessageRow): AiCoachConversationMessage {
  const metadata = parseAiMessageMetadata(row.metadata);

  return {
    id: row.id,
    role: (row.sender === "assistant" ? "assistant" : "user") as MessageRole,
    content: row.content,
    createdAt: row.created_at,
    state: metadata.state,
  };
}

function buildConversationTitle(session: AiChatSessionRow, messages: AiCoachConversationMessage[]) {
  if (session.title?.trim()) {
    return session.title;
  }

  const latestUserMessage = messages.find((message) => message.role === "user");
  return latestUserMessage?.content.slice(0, 20) || "新对话";
}

export async function getAiCoachConversationBootstrap(userId: string, authMode: AuthMode): Promise<{
  storageMode: AiCoachStorageMode;
  conversations: AiCoachConversationSession[];
}> {
  if (authMode !== "supabase" || !hasSupabaseEnv()) {
    return {
      storageMode: "local",
      conversations: [],
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: sessionRows, error: sessionError } = await supabase
      .from("ai_chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("chat_type", "coach")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(12);

    const sessions = (sessionRows as AiChatSessionRow[] | null) ?? [];

    if (sessionError || sessions.length === 0) {
      return {
        storageMode: "supabase",
        conversations: [],
      };
    }

    const sessionIds = sessions.map((session) => session.id);
    const { data: messageRows, error: messageError } = await supabase
      .from("ai_messages")
      .select("*")
      .in("session_id", sessionIds)
      .order("created_at", { ascending: true });

    const messages = (messageRows as AiMessageRow[] | null) ?? [];

    if (messageError) {
      return {
        storageMode: "supabase",
        conversations: [],
      };
    }

    const messagesBySessionId = new Map<string, AiCoachConversationMessage[]>();
    for (const message of messages) {
      const collection = messagesBySessionId.get(message.session_id) ?? [];
      collection.push(mapMessage(message));
      messagesBySessionId.set(message.session_id, collection);
    }

    const conversations = sessions.map((session) => {
      const conversationMessages = messagesBySessionId.get(session.id) ?? [];
      const latestAssistant = conversationMessages
        .slice()
        .reverse()
        .find((message) => message.role === "assistant");
      const latestUser = conversationMessages
        .slice()
        .reverse()
        .find((message) => message.role === "user");
      const assistantMetadata = latestAssistant
        ? parseAiMessageMetadata(
            messages.find((message) => message.id === latestAssistant.id)?.metadata ?? null,
          )
        : {};

      return {
        id: session.id,
        remoteId: session.id,
        title: buildConversationTitle(session, conversationMessages),
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        messages: conversationMessages,
        suggestedActions: ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"],
        provider: assistantMetadata.provider,
        model: assistantMetadata.model,
        notice: assistantMetadata.notice ?? null,
        lastUserPrompt: latestUser?.content,
      } satisfies AiCoachConversationSession;
    });

    return {
      storageMode: "supabase",
      conversations,
    };
  } catch (error) {
    console.error("Failed to load AI coach conversations", error);
    return {
      storageMode: "local",
      conversations: [],
    };
  }
}

export async function ensureAiCoachSession(params: {
  userId: string;
  sessionId?: string | null;
  title?: string | null;
}) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (params.sessionId) {
    const { data: existingSession } = await supabase
      .from("ai_chat_sessions")
      .select("*")
      .eq("id", params.sessionId)
      .eq("user_id", params.userId)
      .eq("chat_type", "coach")
      .maybeSingle();

    const resolvedExistingSession = (existingSession as AiChatSessionRow | null) ?? null;

    if (resolvedExistingSession) {
      if (params.title && !resolvedExistingSession.title) {
        await supabase
          .from("ai_chat_sessions")
          .update({
            title: params.title,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", params.sessionId);
      }

      return resolvedExistingSession;
    }
  }

  const { data: createdSession, error } = await supabase
    .from("ai_chat_sessions")
    .insert({
      user_id: params.userId,
      chat_type: "coach",
      title: params.title ?? null,
    } as never)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return createdSession as AiChatSessionRow;
}

export async function appendAiCoachMessage(params: {
  sessionId: string;
  sender: MessageRole;
  content: string;
  metadata?: AiMessageMetadata;
}) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const metadata = {
    surface: "ai-coach",
    ...params.metadata,
  };

  const { data, error } = await supabase
    .from("ai_messages")
    .insert({
      session_id: params.sessionId,
      sender: params.sender,
      content: params.content,
      metadata: metadata as never,
    } as never)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await supabase
    .from("ai_chat_sessions")
    .update({
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", params.sessionId);

  return data as AiMessageRow;
}
