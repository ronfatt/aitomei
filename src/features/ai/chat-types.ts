export type MessageRole = "user" | "assistant";
export type MessageState = "complete" | "streaming" | "stopped" | "error";
export type ProviderType = "mock" | "openai";
export type AiCoachStorageMode = "local" | "supabase";

export interface AiCoachConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  state?: MessageState;
}

export interface AiCoachConversationSession {
  id: string;
  remoteId?: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiCoachConversationMessage[];
  suggestedActions: string[];
  provider?: ProviderType;
  model?: string;
  notice?: string | null;
  lastUserPrompt?: string;
}
