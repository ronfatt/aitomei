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
  ChevronDown,
  ChevronUp,
  Copy,
  DatabaseZap,
  Languages,
  LoaderCircle,
  MessageSquarePlus,
  Mic,
  Paperclip,
  RotateCcw,
  Save,
  SendHorizontal,
  ShieldCheck,
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
import type {
  AiKnowledgeCardRecord,
  AiKnowledgeSourceRecord,
  AiObjectionScriptRecord,
} from "@/features/ai/repository";
import { cn } from "@/lib/utils";

interface AiCoachLivePanelProps {
  initialPrompt: string;
  sourceNote: string;
  initialConversations: AiCoachConversationSession[];
  storageMode: AiCoachStorageMode;
  sourceDocuments: AiKnowledgeSourceRecord[];
  knowledgeCards: AiKnowledgeCardRecord[];
  objectionScripts: AiObjectionScriptRecord[];
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
const SAVED_SNIPPETS_KEY = "tomei.ai_coach.saved_snippets.v1";
const DEFAULT_SUGGESTED_ACTIONS = ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"];

const welcomeQuickQuestions = [
  "一句话介绍 Aurex Legacy",
  "这是不是 MLM？",
  "它的会员权益怎么讲？",
  "帮我写跟进话术",
  "模拟客户追问",
  "生成 demo 讲解话术",
] as const;

const commonScenarios = [
  {
    title: "一句话介绍",
    prompt: "请用一句人话介绍 Aurex Legacy，语气专业但自然。",
  },
  {
    title: "20 秒讲解",
    prompt: "请把 Aurex Legacy 讲成 20 秒销售介绍，突出文化珠宝资产、会员权益与数字确权。",
  },
  {
    title: "WhatsApp 跟进",
    prompt: "请生成一段 WhatsApp 跟进文案，邀请客户继续了解 Aurex Legacy。",
  },
  {
    title: "Demo 开场白",
    prompt: "请帮我生成一段适合 demo 开场的 Aurex Legacy 讲解话术，控制在 30 秒内。",
  },
] as const;

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

function findLastAssistantMessage(messages: AiCoachConversationMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "assistant") {
      return messages[index];
    }
  }

  return null;
}

function getLastAssistantState(messages: AiCoachConversationMessage[]) {
  return messages
    .slice()
    .reverse()
    .find((message) => message.role === "assistant")?.state;
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

function readSavedSnippetIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(SAVED_SNIPPETS_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load saved AI coach snippets", error);
    return [];
  }
}

function writeSavedSnippetIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_SNIPPETS_KEY, JSON.stringify(ids));
}

function extractSummary(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "AI 正在整理更适合现场 demo 的回答。";
  }

  const sentences = normalized.split(/(?<=[。！？.!?])/u).filter(Boolean);
  return sentences.slice(0, 2).join(" ").trim() || normalized;
}

function buildFollowUpActions(message: string) {
  return [
    {
      label: "更口语",
      prompt: `请把这段回答改得更口语、更像 WhatsApp 或现场沟通会说的话：\n${message}`,
    },
    {
      label: "WhatsApp 文案",
      prompt: `请把这段回答转成一段 WhatsApp 跟进文案：\n${message}`,
    },
    {
      label: "模拟追问",
      prompt: `请模拟客户对这段回答继续追问，并教我下一句怎么接：\n${message}`,
    },
    {
      label: "缩成一句话",
      prompt: `请把这段回答浓缩成一句最容易讲的版本：\n${message}`,
    },
  ];
}

function keywordScore(query: string, value: string) {
  const keywords = ["mlm", "实体", "黄金", "shariah", "兑换", "demo", "whatsapp", "客户", "风险", "回报"];
  return keywords.reduce((score, keyword) => {
    if (query.includes(keyword) && value.toLowerCase().includes(keyword.toLowerCase())) {
      return score + 1;
    }

    return score;
  }, 0);
}

function getRelatedScripts(query: string, scripts: AiObjectionScriptRecord[]) {
  const normalized = query.toLowerCase();
  const ranked = scripts
    .map((script) => ({
      script,
      score: keywordScore(normalized, `${script.objection} ${script.shortAnswer} ${script.talkTrack}`),
    }))
    .sort((left, right) => right.score - left.score);

  const positiveMatches = ranked.filter((item) => item.score > 0).map((item) => item.script);
  return positiveMatches.length > 0 ? positiveMatches.slice(0, 4) : scripts.slice(0, 4);
}

function buildSourceSummary(
  sourceDocuments: AiKnowledgeSourceRecord[],
  knowledgeCards: AiKnowledgeCardRecord[],
  objectionScripts: AiObjectionScriptRecord[],
) {
  const shariahCount =
    knowledgeCards.filter((item) => item.tag.toLowerCase().includes("shariah")).length +
    objectionScripts.filter((item) => item.objection.toLowerCase().includes("shariah")).length;

  return [
    {
      label: "Aurex FAQ",
      detail: `${Math.min(knowledgeCards.length, 3)} 条核心产品知识`,
    },
    {
      label: "Shariah FAQ",
      detail: `${Math.max(1, Math.min(shariahCount, 3))} 条结构说明`,
    },
    {
      label: "Demo 脚本",
      detail: `${Math.min(sourceDocuments.length, 2)} 份 demo 参考`,
    },
    {
      label: "销售异议库",
      detail: `${Math.min(objectionScripts.length, 4)} 条常见应对`,
    },
  ];
}

export function AiCoachLivePanel({
  initialPrompt,
  sourceNote,
  initialConversations,
  storageMode,
  sourceDocuments,
  knowledgeCards,
  objectionScripts,
}: AiCoachLivePanelProps) {
  const [conversations, setConversations] = useState<AiCoachConversationSession[]>(
    storageMode === "supabase"
      ? initialConversations.length > 0
        ? initialConversations
        : [createConversation()]
      : [],
  );
  const [activeConversationId, setActiveConversationId] = useState(
    storageMode === "supabase" ? (initialConversations[0]?.id ?? "") : "",
  );
  const [prompt, setPrompt] = useState(
    storageMode === "supabase" && initialConversations.length > 0 ? "" : initialPrompt,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(storageMode === "supabase");
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [sourceMessageId, setSourceMessageId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [savedSnippetIds, setSavedSnippetIds] = useState<string[]>([]);
  const [, startSwitchTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationsRef = useRef<AiCoachConversationSession[]>([]);
  const activeConversationIdRef = useRef(activeConversationId);
  const bootstrappedRef = useRef(false);
  const feedbackTimerRef = useRef<number | null>(null);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSavedSnippetIds(readSavedSnippetIds());
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!messageViewportRef.current) {
      return;
    }

    messageViewportRef.current.scrollTo({
      top: messageViewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversations, isLoading]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const latestUserTurn = activeConversation ? findLastUserMessage(activeConversation.messages) : null;
  const latestAssistantMessage = activeConversation ? findLastAssistantMessage(activeConversation.messages) : null;
  const canRegenerate = Boolean(!isLoading && activeConversation && latestUserTurn?.message.content.trim());
  const providerLabel =
    activeConversation?.provider === "openai"
      ? `OpenAI Live${activeConversation.model ? ` · ${activeConversation.model}` : ""}`
      : activeConversation?.provider === "mock"
        ? "本地 fallback"
        : "AI 会话";
  const assistantState = activeConversation ? getLastAssistantState(activeConversation.messages) : undefined;
  const relatedScripts = getRelatedScripts(
    latestUserTurn?.message.content ?? activeConversation?.lastUserPrompt ?? "",
    objectionScripts,
  );
  const sourceSummary = buildSourceSummary(sourceDocuments, knowledgeCards, objectionScripts);

  function showFeedback(message: string) {
    setFeedbackMessage(message);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 2200);
  }

  async function copyToClipboard(value: string, successMessage: string) {
    if (!value.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showFeedback(successMessage);
    } catch (copyError) {
      console.error("Failed to copy AI coach content", copyError);
      showFeedback("复制失败，请再试一次。");
    }
  }

  function saveLatestSnippet() {
    if (!latestAssistantMessage) {
      return;
    }

    const nextIds = Array.from(new Set([...savedSnippetIds, latestAssistantMessage.id]));
    setSavedSnippetIds(nextIds);
    writeSavedSnippetIds(nextIds);
    showFeedback("已保存到常用话术。");
  }

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
      setExpandedMessageId(null);
      setSourceMessageId(null);
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
      setExpandedMessageId(null);
      setSourceMessageId(null);
    });
  }

  function stopGeneration() {
    if (!isLoading) {
      return;
    }

    abortControllerRef.current?.abort();
  }

  const compactConversations = conversations.slice(0, 4);
  const recommendedQuestions = relatedScripts.map((item) => item.objection).slice(0, 4);
  const currentSuggestedActions =
    activeConversation?.suggestedActions.length && activeConversation.suggestedActions.length > 0
      ? activeConversation.suggestedActions
      : DEFAULT_SUGGESTED_ACTIONS;

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="flex min-h-[78vh] flex-col overflow-hidden border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(242,200,107,0.14),transparent_26%),linear-gradient(180deg,rgba(18,15,12,0.98),rgba(8,7,6,0.99))] p-0 shadow-[0_34px_120px_rgba(0,0,0,0.36)]">
        <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Aurex AI 教练</Badge>
                <Badge variant="neutral">在线</Badge>
                <Badge variant="neutral">已连接知识库</Badge>
                <Badge variant="neutral">销售教练模式</Badge>
                <Badge variant="neutral">{providerLabel}</Badge>
                {assistantState === "stopped" ? <Badge variant="warning">本轮已停止</Badge> : null}
                {assistantState === "error" ? <Badge variant="warning">本轮异常</Badge> : null}
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                  Aurex AI 教练
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  随时问我产品介绍、客户异议、跟进话术或 demo 场景。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={createNewConversation}>
                <MessageSquarePlus className="mr-2 size-4" />
                新对话
              </Button>
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

          <div className="mt-4 flex flex-wrap gap-2">
            {compactConversations.map((conversation) => {
              const active = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-left text-xs transition",
                    active
                      ? "border-[rgba(216,177,91,0.24)] bg-[rgba(255,255,255,0.07)] text-[var(--foreground)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:bg-[rgba(255,255,255,0.06)]",
                  )}
                >
                  {conversation.title}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={messageViewportRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {activeConversation?.messages.length ? (
            activeConversation.messages.map((message) => {
              const isAssistant = message.role === "assistant";
              const isLatestAssistant = latestAssistantMessage?.id === message.id;
              const isExpanded = expandedMessageId === message.id;
              const showSources = sourceMessageId === message.id;
              const summary = extractSummary(message.content);
              const followUpActions = buildFollowUpActions(message.content);

              return (
                <div
                  key={message.id}
                  className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end")}
                >
                  {isAssistant ? (
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.18)] bg-[linear-gradient(180deg,rgba(242,200,107,0.14),rgba(255,255,255,0.04))] text-[var(--gold-strong)]">
                      <Bot className="size-4" />
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "max-w-[88%] rounded-[28px] border px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.14)] sm:max-w-[78%]",
                      isAssistant
                        ? "border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]"
                        : "border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(242,200,107,0.12),rgba(255,255,255,0.04))]",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                        {isAssistant ? "AI 教练" : "你"}
                      </p>
                      <div className="flex items-center gap-2">
                        {isAssistant && message.state === "streaming" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
                            <LoaderCircle className="size-3 animate-spin" />
                            AI 正在输入...
                          </span>
                        ) : null}
                        <span className="text-[11px] text-[var(--muted)]">{formatConversationTime(message.createdAt)}</span>
                      </div>
                    </div>

                    {isAssistant ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">摘要回答</p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--foreground)]">
                            {summary || "..."}
                          </p>
                        </div>

                        {isLatestAssistant ? (
                          <div className="flex flex-wrap gap-2">
                            {followUpActions.map((action) => (
                              <button
                                key={action.label}
                                type="button"
                                onClick={() => void submitPrompt(action.prompt)}
                                className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedMessageId(isExpanded ? null : message.id)}
                          >
                            {isExpanded ? (
                              <>
                                收起详细内容
                                <ChevronUp className="ml-1.5 size-3.5" />
                              </>
                            ) : (
                              <>
                                查看详细内容
                                <ChevronDown className="ml-1.5 size-3.5" />
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => void copyToClipboard(message.content, "已复制这条回答。")}
                          >
                            <Copy className="mr-1.5 size-3.5" />
                            复制
                          </Button>
                          {isLatestAssistant ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={saveLatestSnippet}
                              disabled={savedSnippetIds.includes(message.id)}
                            >
                              <Save className="mr-1.5 size-3.5" />
                              {savedSnippetIds.includes(message.id) ? "已保存" : "保存"}
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSourceMessageId(showSources ? null : message.id)}
                          >
                            <DatabaseZap className="mr-1.5 size-3.5" />
                            查看引用来源
                          </Button>
                        </div>

                        {isExpanded ? (
                          <div className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">详细内容</p>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
                              {message.content || "AI 正在整理更完整的回答。"}
                            </p>
                          </div>
                        ) : null}

                        {showSources ? (
                          <div className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">本次引用来源</p>
                            <div className="mt-3 grid gap-2">
                              {sourceSummary.map((source) => (
                                <div key={source.label} className="flex items-center justify-between gap-3 text-sm">
                                  <span className="font-medium text-[var(--foreground)]">{source.label}</span>
                                  <span className="text-[var(--muted)]">{source.detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm leading-7 text-[var(--foreground)]">
                        {message.content || "..."}
                      </p>
                    )}
                  </div>

                  {!isAssistant ? (
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(14,9,14,0.92)] text-white">
                      <UserRound className="size-4" />
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.18)] bg-[linear-gradient(180deg,rgba(242,200,107,0.14),rgba(255,255,255,0.04))] text-[var(--gold-strong)]">
                  <Bot className="size-4" />
                </div>
                <div className="max-w-[88%] rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.14)] sm:max-w-[78%]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold-strong)]">AI 教练</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                    早安。今天你可以直接问我 Aurex Legacy 怎么介绍、客户异议怎么回，或者让我帮你写 WhatsApp 跟进话术。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pl-[3.25rem]">
                {welcomeQuickQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void submitPrompt(item)}
                    className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && !latestAssistantMessage ? (
            <div className="flex gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.18)] bg-[linear-gradient(180deg,rgba(242,200,107,0.14),rgba(255,255,255,0.04))] text-[var(--gold-strong)]">
                <Bot className="size-4" />
              </div>
              <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                  <LoaderCircle className="size-4 animate-spin" />
                  AI 正在输入...
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-4 sm:px-6">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void submitPrompt(prompt);
            }}
          >
            <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="问我 Aurex Legacy 怎么介绍 / 问我客户异议怎么回应 / 让我帮你写跟进话术"
                className="min-h-24 border-none bg-transparent px-0 py-0 text-sm shadow-none placeholder:text-[var(--muted)]/75 focus:ring-0"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
                    title="上传附件"
                  >
                    <Paperclip className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
                    title="语音输入"
                  >
                    <Mic className="size-4" />
                  </button>
                  <div className="hidden flex-wrap gap-2 lg:flex">
                    {currentSuggestedActions.slice(0, 3).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => void submitPrompt(item)}
                        className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!prompt.trim() || isLoading || !activeConversationId || !isHydrated}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                      发送中
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="mr-2 size-4" />
                      发送
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>{activeConversation?.notice ?? sourceNote}</p>
              <p>
                {storageMode === "supabase"
                  ? "当前会话会写入 Supabase，换设备也能继续。"
                  : "当前会话保留在浏览器中，刷新不会丢。"}
              </p>
            </div>
          </form>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(35,13,30,0.94),rgba(18,7,15,0.98))] p-4 shadow-[0_18px_50px_rgba(5,3,8,0.24)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">推荐问题</p>
          <div className="mt-4 space-y-2">
            {recommendedQuestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void submitPrompt(item)}
                className="block w-full rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-sm text-[var(--foreground)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                {item}
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(35,13,30,0.94),rgba(18,7,15,0.98))] p-4 shadow-[0_18px_50px_rgba(5,3,8,0.24)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">常用场景</p>
          <div className="mt-4 space-y-2">
            {commonScenarios.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => void submitPrompt(item.prompt)}
                className="flex w-full items-center justify-between rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <span>{item.title}</span>
                <Sparkles className="size-4 text-[var(--gold)]" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(35,13,30,0.94),rgba(18,7,15,0.98))] p-4 shadow-[0_18px_50px_rgba(5,3,8,0.24)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">本次引用来源</p>
          <div className="mt-4 space-y-3">
            {sourceSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  {item.label === "Aurex FAQ" ? <DatabaseZap className="size-4 text-[var(--gold)]" /> : null}
                  {item.label === "Shariah FAQ" ? <ShieldCheck className="size-4 text-[var(--gold)]" /> : null}
                  {item.label === "Demo 脚本" ? <Sparkles className="size-4 text-[var(--gold)]" /> : null}
                  {item.label === "销售异议库" ? <Languages className="size-4 text-[var(--gold)]" /> : null}
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {feedbackMessage ? (
        <div className="fixed bottom-6 right-6 z-30 rounded-full border border-[rgba(216,177,91,0.18)] bg-[rgba(18,7,15,0.92)] px-4 py-2 text-sm text-[var(--foreground)] shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          {feedbackMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[20px] border border-[rgba(245,120,120,0.22)] bg-[rgba(93,30,41,0.42)] p-4 text-sm leading-7 text-[#F7C1C1] xl:col-span-2">
          {error}
        </div>
      ) : null}
    </section>
  );
}
