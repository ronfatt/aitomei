"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Bot,
  History,
  LoaderCircle,
  MessageSquarePlus,
  RotateCcw,
  Sparkles,
  Square,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  AiCoachConversationMessage,
  AiCoachConversationSession,
  AiCoachStorageMode,
} from "@/features/ai/chat-types";
import { cn } from "@/lib/utils";

interface AiCoachLivePanelProps {
  initialPrompt: string;
  sourceNote: string;
  suggestedPrompts: readonly string[];
  initialConversations: AiCoachConversationSession[];
  storageMode: AiCoachStorageMode;
}

interface AiCoachStreamEvent {
  type: "meta" | "delta" | "done" | "error";
  text?: string;
  error?: string;
  reply?: string;
  suggestedActions?: string[];
  provider?: "mock" | "openai";
  model?: string;
  notice?: string | null;
  sessionId?: string | null;
}

interface StreamReplyOptions {
  conversationId: string;
  prompt: string;
  historyMessages: AiCoachConversationMessage[];
  mode: "new" | "regenerate";
  existingUserMessageId?: string;
  existingAssistantMessageId?: string;
}

const STORAGE_KEY = "tomei.ai_coach.conversations.v2";
const DEFAULT_SUGGESTED_ACTIONS = ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"];

function createConversation(title = "新对话"): AiCoachConversationSession {
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    remoteId: null,
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [],
    suggestedActions: DEFAULT_SUGGESTED_ACTIONS,
  };
}

function deriveConversationTitle(prompt: string) {
  const normalized = prompt.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "新对话";
  }

  return normalized.length > 20 ? `${normalized.slice(0, 20)}...` : normalized;
}

function orderConversations(conversations: AiCoachConversationSession[]) {
  return [...conversations].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function getConversationPreview(conversation: AiCoachConversationSession) {
  const latestMessage = conversation.messages
    .slice()
    .reverse()
    .find((message) => message.content.trim());

  if (!latestMessage) {
    return "开始新的 GoldNow 问答";
  }

  const preview = latestMessage.content.replace(/\s+/g, " ").trim();
  return preview.length > 34 ? `${preview.slice(0, 34)}...` : preview;
}

function trimConversationForServer(messages: AiCoachConversationMessage[]) {
  return messages
    .filter((message) => message.content.trim() && message.state !== "streaming")
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

function findLastUserMessage(messages: AiCoachConversationMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return { index, message: messages[index] };
    }
  }

  return null;
}

function formatConversationTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  return new Intl.DateTimeFormat(
    "zh-CN",
    sameDay
      ? { hour: "2-digit", minute: "2-digit" }
      : { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" },
  ).format(date);
}

function loadStoredConversations() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as AiCoachConversationSession[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return orderConversations(
      parsedValue
        .filter((item) => item && typeof item.id === "string")
        .map((conversation) => ({
          ...conversation,
          remoteId: conversation.remoteId ?? null,
          suggestedActions:
            Array.isArray(conversation.suggestedActions) && conversation.suggestedActions.length > 0
              ? conversation.suggestedActions
              : DEFAULT_SUGGESTED_ACTIONS,
          messages: Array.isArray(conversation.messages)
            ? conversation.messages.map((message) => ({
                id: message.id,
                role: message.role,
                content: message.content,
                createdAt: message.createdAt ?? new Date().toISOString(),
                state: message.state === "streaming" ? "stopped" : message.state,
              }))
            : [],
        })),
    );
  } catch (error) {
    console.error("Failed to load AI coach conversation history", error);
    return [];
  }
}

function getLastAssistantState(messages: AiCoachConversationMessage[]) {
  return messages
    .slice()
    .reverse()
    .find((message) => message.role === "assistant")?.state;
}

export function AiCoachLivePanel({
  initialPrompt,
  sourceNote,
  suggestedPrompts,
  initialConversations,
  storageMode,
}: AiCoachLivePanelProps) {
  const [conversations, setConversations] = useState<AiCoachConversationSession[]>(
    storageMode === "supabase"
      ? initialConversations.length > 0
        ? initialConversations
        : [createConversation()]
      : [],
  );
  const [activeConversationId, setActiveConversationId] = useState(
    storageMode === "supabase"
      ? (initialConversations[0]?.id ?? "")
      : "",
  );
  const [prompt, setPrompt] = useState(
    storageMode === "supabase" && initialConversations.length > 0 ? "" : initialPrompt,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(storageMode === "supabase");
  const [, startSwitchTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationsRef = useRef<AiCoachConversationSession[]>([]);
  const activeConversationIdRef = useRef(activeConversationId);
  const bootstrappedRef = useRef(false);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (storageMode !== "local") {
      return;
    }

    const storedConversations = loadStoredConversations();
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (storedConversations.length > 0) {
        setConversations(storedConversations);
        setActiveConversationId(storedConversations[0].id);
        setPrompt("");
      } else {
        const firstConversation = createConversation();
        setConversations([firstConversation]);
        setActiveConversationId(firstConversation.id);
        setPrompt(initialPrompt);
      }

      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [initialPrompt, storageMode]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    if (!isHydrated || storageMode !== "local") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, isHydrated, storageMode]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const latestUserTurn = activeConversation ? findLastUserMessage(activeConversation.messages) : null;
  const canRegenerate = Boolean(!isLoading && activeConversation && latestUserTurn?.message.content.trim());

  useEffect(() => {
    if (!messagesViewportRef.current) {
      return;
    }

    messagesViewportRef.current.scrollTo({
      top: messagesViewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeConversation?.messages, isLoading]);

  async function streamReply({
    conversationId,
    prompt: nextPrompt,
    historyMessages,
    mode,
    existingUserMessageId,
    existingAssistantMessageId,
  }: StreamReplyOptions) {
    const normalizedPrompt = nextPrompt.trim();

    if (!normalizedPrompt || isLoading) {
      return;
    }

    const now = new Date().toISOString();
    const controller = new AbortController();
    const assistantMessageId = existingAssistantMessageId ?? crypto.randomUUID();

    abortControllerRef.current = controller;
    setIsLoading(true);
    setError(null);

    if (mode === "new") {
      const userMessage: AiCoachConversationMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: normalizedPrompt,
        createdAt: now,
      };

      setConversations((current) =>
        orderConversations(
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  title:
                    conversation.messages.length > 0
                      ? conversation.title
                      : deriveConversationTitle(normalizedPrompt),
                  updatedAt: now,
                  lastUserPrompt: normalizedPrompt,
                  messages: [
                    ...conversation.messages,
                    userMessage,
                    {
                      id: assistantMessageId,
                      role: "assistant",
                      content: "",
                      createdAt: now,
                      state: "streaming",
                    },
                  ],
                }
              : conversation,
          ),
        ),
      );
    } else {
      setConversations((current) =>
        orderConversations(
          current.map((conversation) => {
            if (conversation.id !== conversationId) {
              return conversation;
            }

            const targetUserIndex = conversation.messages.findIndex(
              (message) => message.id === existingUserMessageId,
            );

            if (targetUserIndex < 0) {
              return conversation;
            }

            return {
              ...conversation,
              updatedAt: now,
              lastUserPrompt: normalizedPrompt,
              messages: [
                ...conversation.messages.slice(0, targetUserIndex + 1),
                {
                  id: assistantMessageId,
                  role: "assistant",
                  content: "",
                  createdAt: now,
                  state: "streaming",
                },
              ],
            };
          }),
        ),
      );
    }

    setPrompt("");

    try {
      const currentConversation = conversationsRef.current.find(
        (conversation) => conversation.id === conversationId,
      );

      const apiResponse = await fetch("/api/ai/coach/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: normalizedPrompt,
          sessionId: storageMode === "supabase" ? currentConversation?.remoteId ?? undefined : undefined,
          title: currentConversation?.title ?? deriveConversationTitle(normalizedPrompt),
          mode,
          history: trimConversationForServer(historyMessages),
        }),
      });

      if (!apiResponse.ok) {
        const payload = (await apiResponse.json()) as { error?: string };
        throw new Error(payload.error ?? "AI 教练暂时没有回应。");
      }

      if (!apiResponse.body) {
        throw new Error("AI 教练流式返回为空。");
      }

      const reader = apiResponse.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let latestReply = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() ?? "";

        for (const line of chunks) {
          const trimmed = line.trim();

          if (!trimmed) {
            continue;
          }

          const event = JSON.parse(trimmed) as AiCoachStreamEvent;

          if (event.type === "meta") {
            setConversations((current) =>
              orderConversations(
                current.map((conversation) =>
                  conversation.id === conversationId
                    ? {
                        ...conversation,
                        remoteId: event.sessionId ?? conversation.remoteId ?? null,
                        provider: event.provider ?? conversation.provider,
                        model: event.model ?? conversation.model,
                        notice: event.notice ?? conversation.notice ?? sourceNote,
                      }
                    : conversation,
                ),
              ),
            );
          }

          if (event.type === "delta" && typeof event.text === "string") {
            latestReply += event.text;
            setConversations((current) =>
              orderConversations(
                current.map((conversation) =>
                  conversation.id === conversationId
                    ? {
                        ...conversation,
                        updatedAt: new Date().toISOString(),
                        messages: conversation.messages.map((message) =>
                          message.id === assistantMessageId
                            ? { ...message, content: latestReply, state: "streaming" as const }
                            : message,
                        ),
                      }
                    : conversation,
                ),
              ),
            );
          }

          if (event.type === "done") {
            const finalReply = event.reply ?? latestReply;
            latestReply = finalReply;

            setConversations((current) =>
              orderConversations(
                current.map((conversation) =>
                  conversation.id === conversationId
                    ? {
                        ...conversation,
                        remoteId: event.sessionId ?? conversation.remoteId ?? null,
                        updatedAt: new Date().toISOString(),
                        provider: event.provider ?? conversation.provider,
                        model: event.model ?? conversation.model,
                        notice: event.notice ?? conversation.notice ?? sourceNote,
                        suggestedActions:
                          event.suggestedActions && event.suggestedActions.length > 0
                            ? event.suggestedActions
                            : conversation.suggestedActions,
                        messages: conversation.messages.map((message) =>
                          message.id === assistantMessageId
                            ? { ...message, content: finalReply, state: "complete" as const }
                            : message,
                        ),
                      }
                    : conversation,
                ),
              ),
            );
          }

          if (event.type === "error") {
            throw new Error(event.error ?? "AI 教练连接失败，请稍后再试。");
          }
        }
      }
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        setConversations((current) =>
          orderConversations(
            current.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    updatedAt: new Date().toISOString(),
                    messages: conversation.messages
                      .map((message) =>
                        message.id === assistantMessageId
                          ? {
                              ...message,
                              state: "stopped" as const,
                            }
                          : message,
                      )
                      .filter((message) => message.role === "user" || message.content.trim()),
                  }
                : conversation,
            ),
          ),
        );
        setError("已停止本次生成，你可以继续追问或点击重新回答。");
      } else {
        const message =
          requestError instanceof Error ? requestError.message : "AI 教练连接失败，请稍后再试。";
        setError(message);
        setConversations((current) =>
          orderConversations(
            current.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    updatedAt: new Date().toISOString(),
                    messages: conversation.messages
                      .map((entry) =>
                        entry.id === assistantMessageId
                          ? {
                              ...entry,
                              state: "error" as const,
                            }
                          : entry,
                      )
                      .filter((entry) => entry.role === "user" || entry.content.trim()),
                  }
                : conversation,
            ),
          ),
        );
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }

  const runInitialPrompt = useEffectEvent(async () => {
    if (!activeConversation || activeConversation.messages.length > 0 || !initialPrompt.trim()) {
      return;
    }

    await streamReply({
      conversationId: activeConversation.id,
      prompt: initialPrompt,
      historyMessages: [],
      mode: "new",
    });
  });

  useEffect(() => {
    if (!isHydrated || bootstrappedRef.current || !activeConversation) {
      return;
    }

    bootstrappedRef.current = true;
    void runInitialPrompt();
  }, [activeConversation, isHydrated]);

  async function submitPrompt(nextPrompt: string) {
    const currentConversationId = activeConversationIdRef.current;
    const currentConversation = conversationsRef.current.find(
      (conversation) => conversation.id === currentConversationId,
    );

    if (!currentConversation) {
      return;
    }

    await streamReply({
      conversationId: currentConversation.id,
      prompt: nextPrompt,
      historyMessages: currentConversation.messages,
      mode: "new",
    });
  }

  async function regenerateLastReply() {
    if (!activeConversation || isLoading) {
      return;
    }

    const latestUser = findLastUserMessage(activeConversation.messages);

    if (!latestUser?.message.content.trim()) {
      return;
    }

    const existingAssistantMessage =
      activeConversation.messages[latestUser.index + 1]?.role === "assistant"
        ? activeConversation.messages[latestUser.index + 1]
        : undefined;

    await streamReply({
      conversationId: activeConversation.id,
      prompt: latestUser.message.content,
      historyMessages: activeConversation.messages.slice(0, latestUser.index),
      mode: "regenerate",
      existingUserMessageId: latestUser.message.id,
      existingAssistantMessageId: existingAssistantMessage?.id,
    });
  }

  function createNewConversation() {
    if (isLoading) {
      abortControllerRef.current?.abort();
    }

    const nextConversation = createConversation();

    setConversations((current) => orderConversations([nextConversation, ...current]));
    startSwitchTransition(() => {
      setActiveConversationId(nextConversation.id);
      setPrompt("");
      setError(null);
    });
  }

  function selectConversation(conversationId: string) {
    if (conversationId === activeConversationId) {
      return;
    }

    if (isLoading) {
      abortControllerRef.current?.abort();
    }

    startTransition(() => {
      setActiveConversationId(conversationId);
      setPrompt("");
      setError(null);
    });
  }

  function stopGeneration() {
    if (!isLoading) {
      return;
    }

    abortControllerRef.current?.abort();
  }

  const activeSuggestedActions =
    activeConversation?.suggestedActions.length && activeConversation.suggestedActions.length > 0
      ? activeConversation.suggestedActions
      : DEFAULT_SUGGESTED_ACTIONS;
  const providerLabel =
    activeConversation?.provider === "openai"
      ? `OpenAI Live${activeConversation.model ? ` · ${activeConversation.model}` : ""}`
      : activeConversation?.provider === "mock"
        ? "本地 fallback"
        : "AI 会话";
  const assistantState = activeConversation ? getLastAssistantState(activeConversation.messages) : undefined;

  return (
    <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(22,9,20,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">会话历史</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">像 ChatGPT 一样继续聊</h2>
            </div>
            <Badge variant="neutral">{storageMode === "supabase" ? "Supabase 已接入" : "本机保留"}</Badge>
          </div>

          <Button
            className="mt-4 w-full"
            type="button"
            variant="secondary"
            onClick={createNewConversation}
          >
            <MessageSquarePlus className="mr-2 size-4" />
            新对话
          </Button>

          <div className="mt-4 space-y-2">
            {conversations.map((conversation) => {
              const active = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  className={cn(
                    "w-full rounded-[26px] border p-4 text-left transition",
                    active
                      ? "border-[rgba(216,177,91,0.28)] bg-[linear-gradient(180deg,rgba(177,58,134,0.24),rgba(42,15,35,0.78))] shadow-[0_20px_40px_rgba(0,0,0,0.28)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--foreground)]">
                      {conversation.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-[var(--muted)]">
                      {formatConversationTime(conversation.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
                    {getConversationPreview(conversation)}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.94),rgba(22,9,20,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
          <div className="flex items-center gap-2">
            <History className="size-4 text-[var(--gold-strong)]" />
            <p className="text-sm font-semibold text-[var(--foreground)]">建议你直接点这些问题</p>
          </div>
          <div className="mt-4 space-y-3">
            {suggestedPrompts.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void submitPrompt(suggestion)}
                className="block w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-left text-sm leading-6 text-[var(--muted)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="flex min-h-[720px] flex-col overflow-hidden border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(22,9,20,0.99))] p-0 shadow-[0_30px_110px_rgba(5,3,8,0.34)]">
        <div className="border-b border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(177,58,134,0.16),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="neutral">GoldNow 官方知识已载入</Badge>
                <Badge variant="default">{providerLabel}</Badge>
                {assistantState === "stopped" ? <Badge variant="warning">已停止生成</Badge> : null}
                {assistantState === "error" ? <Badge variant="warning">本轮生成异常</Badge> : null}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">AI 教练对话室</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  这里会保留你的会话上下文，方便你现场 demo 时连续追问，不用每次重新解释背景。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => void regenerateLastReply()} disabled={!canRegenerate}>
                <RotateCcw className="mr-2 size-4" />
                重新回答
              </Button>
              <Button type="button" variant="outline" onClick={stopGeneration} disabled={!isLoading}>
                <Square className="mr-2 size-4 fill-current" />
                停止生成
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 sm:px-6">
          <div
            ref={messagesViewportRef}
            className="h-full max-h-[58vh] min-h-[420px] space-y-4 overflow-y-auto pr-1"
          >
            {activeConversation?.messages.length ? (
              activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.2)] bg-[linear-gradient(180deg,rgba(242,200,107,0.16),rgba(177,58,134,0.16))] text-[var(--gold-strong)]">
                      <Bot className="size-4" />
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "max-w-[88%] rounded-[28px] px-4 py-3 shadow-sm sm:max-w-[78%]",
                      message.role === "user"
                        ? "border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-[var(--foreground)]"
                        : "border border-[rgba(216,177,91,0.16)] bg-[linear-gradient(180deg,rgba(177,58,134,0.16),rgba(255,255,255,0.05))] text-[var(--foreground)]",
                    )}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                        {message.role === "user" ? "你的问题" : "AI 教练"}
                      </p>
                      {message.role === "assistant" && message.state === "streaming" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
                          <LoaderCircle className="size-3 animate-spin" />
                          正在生成
                        </span>
                      ) : null}
                      {message.role === "assistant" && message.state === "stopped" ? (
                        <span className="text-[11px] text-[var(--muted)]">已手动停止</span>
                      ) : null}
                    </div>
                    <p className="whitespace-pre-line text-sm leading-7">{message.content || "..."}</p>
                  </div>

                  {message.role === "user" ? (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(14,9,14,0.92)] text-white">
                      <UserRound className="size-4" />
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md rounded-[28px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.2)] bg-[linear-gradient(180deg,rgba(242,200,107,0.16),rgba(177,58,134,0.18))] text-[var(--gold-strong)]">
                    <Sparkles className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">开始一段新的 AI 对话</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    你可以直接问产品、Shariah、兑换、怎么介绍、客户 objection，AI 教练会按 demo 口吻继续接下去。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-4 sm:px-6">
          <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submitPrompt(prompt);
              }}
            >
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="你可以直接问 GoldNow、产品、Shariah、客户 objection、怎么介绍，或继续追问上一轮回答..."
                className="min-h-32 border-none bg-transparent px-0 py-0 shadow-none focus:ring-0"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {activeSuggestedActions.map((action) => (
                    <span
                      key={action}
                      className="rounded-full border border-[rgba(216,177,91,0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                    >
                      {action}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={stopGeneration} disabled={!isLoading}>
                    停止
                  </Button>
                  <Button type="submit" disabled={!prompt.trim() || isLoading || !activeConversationId || !isHydrated}>
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 size-4 animate-spin" />
                        正在生成
                      </>
                    ) : (
                      "发送给 AI 教练"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-[var(--muted)]">
              {activeConversation?.notice ?? sourceNote}
            </p>
            <p className="text-xs leading-6 text-[var(--muted)]">
              {storageMode === "supabase"
                ? "当前会话会写入 Supabase，换设备登入也能继续查看。"
                : "历史会话会保留在当前浏览器中，刷新页面不会丢。"}
            </p>
          </div>

          {error ? (
            <div className="mt-3 rounded-[20px] border border-[rgba(245,120,120,0.22)] bg-[rgba(93,30,41,0.42)] p-4 text-sm leading-7 text-[#F7C1C1]">
              {error}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
