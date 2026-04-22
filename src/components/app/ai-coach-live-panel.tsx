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
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clipboard,
  Copy,
  DatabaseZap,
  FileStack,
  History,
  Languages,
  LoaderCircle,
  MessageSquarePlus,
  PlayCircle,
  Radar,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Square,
  UserRound,
  WandSparkles,
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
  suggestedPrompts: readonly string[];
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

interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  content: string;
  followUpPrompt: string;
}

interface ScenarioTemplate {
  category: string;
  title: string;
  description: string;
  prompt: string;
}

const STORAGE_KEY = "tomei.ai_coach.conversations.v2";
const SAVED_SNIPPETS_KEY = "tomei.ai_coach.saved_snippets.v1";
const DEFAULT_SUGGESTED_ACTIONS = ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"];

const heroQuickActions = [
  "请用一句人话介绍 GoldNow",
  "客户说这是不是 MLM，我该怎么回答？",
  "为什么说它符合 Shariah？",
  "帮我生成 demo 讲解话术",
  "模拟一个客户追问场景",
  "转成 WhatsApp 跟进文案",
] as const;

const scenarioTemplates: ScenarioTemplate[] = [
  {
    category: "产品介绍",
    title: "一句话介绍 GoldNow",
    description: "适合第一次接触客户时，用 10 秒讲清楚定位。",
    prompt: "请用一句人话介绍 GoldNow by Tomei，语气专业但自然。",
  },
  {
    category: "产品介绍",
    title: "20 秒高端讲解",
    description: "把核心卖点压缩成简洁、有成交感的开场。",
    prompt: "请把 GoldNow 讲成 20 秒高端销售介绍，突出真实黄金支持与 Tomei 信任基础。",
  },
  {
    category: "客户异议处理",
    title: "处理“这是不是 MLM”",
    description: "更稳地处理敏感问题，避免讲成拉人头。",
    prompt: "客户说这是不是 MLM，我该怎么回答？请给我稳一点的销售口吻。",
  },
  {
    category: "客户异议处理",
    title: "回答 Shariah 疑问",
    description: "强调真实资产、无利息、无保证回报的结构。",
    prompt: "客户问为什么它符合 Shariah？请给我简洁、可信的回答。",
  },
  {
    category: "客户跟进",
    title: "WhatsApp 跟进文案",
    description: "把回答转成能直接发给客户的简短信息。",
    prompt: "请生成一段 WhatsApp 跟进文案，邀请客户继续了解 GoldNow。",
  },
  {
    category: "客户跟进",
    title: "温和推进下一步",
    description: "适合客户有兴趣但还没决定时继续推进。",
    prompt: "请写一段温和但有行动引导的跟进话术，邀请客户看 GoldNow demo。",
  },
  {
    category: "Demo 场景",
    title: "模拟客户追问 Shariah",
    description: "演练客户连续追问时的现场回答节奏。",
    prompt: "模拟一个客户追问 Shariah 的场景：先扮演客户追问 3 轮，再给我建议回答。",
  },
  {
    category: "Demo 场景",
    title: "现场 demo 脚本",
    description: "整理成一套更容易现场讲的 demo 流程。",
    prompt: "请帮我生成一份 GoldNow demo 讲解脚本，控制在 60 秒内。",
  },
];

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

function findLastAssistantMessage(messages: AiCoachConversationMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "assistant") {
      return messages[index];
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

function extractSummary(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "AI 正在整理更适合 demo 场景的回答。";
  }

  const punctuationIndex = normalized.search(/[。！？.!?]/u);

  if (punctuationIndex >= 0) {
    return normalized.slice(0, punctuationIndex + 1);
  }

  return normalized.length > 96 ? `${normalized.slice(0, 96)}...` : normalized;
}

function truncateText(content: string, length = 110) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > length ? `${normalized.slice(0, length)}...` : normalized;
}

function buildWhatsAppVariant(summary: string) {
  return `${summary}\n\n如果你愿意，我可以直接发你一版更完整的 GoldNow 介绍，里面会把真实黄金支持、可兑换和 Shariah 结构讲清楚。`;
}

function buildShortSalesVariant(summary: string) {
  return `你可以先这样讲：${summary} 重点先让客户理解“真实黄金支持 + Tomei 背书 + 可继续了解下一步”。`;
}

function buildPredictionVariant(summary: string, script?: AiObjectionScriptRecord) {
  if (script) {
    return `${summary}\n\n客户下一步大概率会追问：${script.objection} 你可以提前准备这句：${script.shortAnswer}`;
  }

  return `${summary}\n\n客户下一步通常会追问“这是不是 MLM、能不能换实体黄金、为什么说符合 Shariah”，建议你先准备一版更口语的收口。`;
}

function keywordScore(query: string, value: string) {
  const keywords = ["mlm", "实体", "真实黄金", "shariah", "伊斯兰", "风险", "兑换", "demo", "whatsapp", "跟进", "顾客", "客户", "回报"];
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

function buildKnowledgeSourceCards(
  sourceDocuments: AiKnowledgeSourceRecord[],
  knowledgeCards: AiKnowledgeCardRecord[],
  objectionScripts: AiObjectionScriptRecord[],
) {
  const shariahCount =
    knowledgeCards.filter((item) => item.tag.toLowerCase().includes("shariah")).length +
    objectionScripts.filter((item) => item.objection.toLowerCase().includes("shariah")).length;

  return [
    {
      id: "goldnow-product",
      title: "GoldNow 产品知识",
      quantity: `${knowledgeCards.length} 条`,
      updatedLabel: sourceDocuments[0]?.title ?? "官方知识已接入",
      status: "已连接",
      actionPrompt: "请用 GoldNow 产品知识帮我整理一版简洁回答。",
    },
    {
      id: "shariah-faq",
      title: "Shariah FAQ",
      quantity: `${shariahCount} 条`,
      updatedLabel: "Shariah 模块在线",
      status: "可调用",
      actionPrompt: "请用 Shariah FAQ 帮我解释 GoldNow 为什么符合 Shariah。",
    },
    {
      id: "sales-objections",
      title: "销售异议库",
      quantity: `${objectionScripts.length} 条`,
      updatedLabel: "销售脚本可用",
      status: "已连接",
      actionPrompt: "请根据销售异议库，帮我准备一版处理客户顾虑的话术。",
    },
    {
      id: "demo-scripts",
      title: "Demo 脚本",
      quantity: `${Math.min(6, objectionScripts.length + 1)} 套`,
      updatedLabel: "Demo 现场模式",
      status: "可生成",
      actionPrompt: "请整理成 GoldNow demo 讲稿，适合 60 秒现场讲解。",
    },
  ];
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

export function AiCoachLivePanel({
  initialPrompt,
  sourceNote,
  suggestedPrompts,
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
  const [detailedAnswerMessageId, setDetailedAnswerMessageId] = useState<string | null>(null);
  const [expandedRecommendationState, setExpandedRecommendationState] = useState<{
    messageId: string;
    recommendationId: string;
  } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [savedSnippetIds, setSavedSnippetIds] = useState<string[]>([]);
  const [, startSwitchTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationsRef = useRef<AiCoachConversationSession[]>([]);
  const activeConversationIdRef = useRef(activeConversationId);
  const bootstrappedRef = useRef(false);
  const feedbackTimerRef = useRef<number | null>(null);

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

  const summaryAnswer = extractSummary(latestAssistantMessage?.content ?? "");
  const relatedScripts = getRelatedScripts(
    latestUserTurn?.message.content ?? activeConversation?.lastUserPrompt ?? "",
    objectionScripts,
  );
  const recommendationCards: RecommendationCard[] = [
    {
      id: "sales-short",
      title: "简短销售版",
      description: "适合现场先讲一句，再看客户反应。",
      content: buildShortSalesVariant(summaryAnswer),
      followUpPrompt: "请把刚才回答改成更短、更像销售现场会说的话。",
    },
    {
      id: "whatsapp-followup",
      title: "WhatsApp 跟进版",
      description: "适合演示完后，马上发给客户继续推进。",
      content: buildWhatsAppVariant(summaryAnswer),
      followUpPrompt: "请把刚才回答转成 WhatsApp 跟进文案，短一点、自然一点。",
    },
    {
      id: "objection-predict",
      title: "客户追问预判",
      description: "先准备下一句，避免客户继续追问时卡住。",
      content: buildPredictionVariant(summaryAnswer, relatedScripts[0]),
      followUpPrompt: `请模拟客户继续追问：“${relatedScripts[0]?.objection ?? "这是不是 MLM？"}”，并教我怎么接。`,
    },
  ];
  const followUpChips = [
    "帮我更口语一点",
    "改成更专业一点",
    "模拟客户追问",
    "加入 Shariah 角度",
    "缩短成 20 秒讲解",
    "转成 WhatsApp 文案",
  ];
  const relatedKnowledgeSources = [
    {
      label: "GoldNow FAQ",
      count: Math.min(knowledgeCards.length, 3),
      detail: "核心产品事实与真实黄金支持",
    },
    {
      label: "Shariah 知识",
      count:
        knowledgeCards.filter((item) => item.tag.toLowerCase().includes("shariah")).length > 0
          ? 2
          : 1,
      detail: "资产支持、无利息、无保证回报",
    },
    {
      label: "Demo 脚本",
      count: 1,
      detail: "现场演示、口语化收口与下一步推进",
    },
    {
      label: "销售话术库",
      count: Math.min(objectionScripts.length, 2),
      detail: "异议处理与客户追问回答",
    },
  ];
  const knowledgeSourceCards = buildKnowledgeSourceCards(sourceDocuments, knowledgeCards, objectionScripts);
  const isLatestReplySaved = latestAssistantMessage ? savedSnippetIds.includes(latestAssistantMessage.id) : false;
  const showDetailedAnswer = latestAssistantMessage
    ? detailedAnswerMessageId === latestAssistantMessage.id
    : false;
  const currentOutputStyles = ["专业支持", "双语可切换", "Demo 口语优先"];
  const generationTypes = ["摘要回答", "WhatsApp 跟进", "异议脚本", "Demo 讲稿"];
  const hotScenarios = relatedScripts.slice(0, 3).map((item) => item.objection);
  const topQuestions = suggestedPrompts.slice(0, 3);
  const combinedFollowUpChips = Array.from(new Set([...followUpChips, ...activeSuggestedActions])).slice(0, 8);

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
      setDetailedAnswerMessageId(null);
      setExpandedRecommendationState(null);
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
      setDetailedAnswerMessageId(null);
      setExpandedRecommendationState(null);
    });
  }

  function stopGeneration() {
    if (!isLoading) {
      return;
    }

    abortControllerRef.current?.abort();
  }

  const systemStatus = [
    {
      label: "已连接 GoldNow 知识库",
      value: `${knowledgeCards.length} 条知识`,
      icon: DatabaseZap,
    },
    {
      label: "Shariah 模块在线",
      value: "规则已联动",
      icon: ShieldCheck,
    },
    {
      label: "Demo 脚本可用",
      value: `${Math.min(6, objectionScripts.length + 1)} 套模板`,
      icon: FileStack,
    },
    {
      label: "双语模式",
      value: "中文 / English",
      icon: Languages,
    },
    {
      label: "销售教练模式",
      value: "实时生成可成交话术",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_420px]">
        <Card className="relative overflow-hidden border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(177,58,134,0.24),transparent_36%),linear-gradient(180deg,rgba(42,15,35,0.98),rgba(18,7,15,0.98))] p-6 shadow-[0_32px_120px_rgba(5,3,8,0.38)] sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(242,200,107,0.06),transparent_34%,transparent)]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">AI 教练工作台</Badge>
              <Badge variant="neutral">GoldNow by Tomei</Badge>
              <Badge variant="neutral">{providerLabel}</Badge>
            </div>

            <div className="max-w-3xl space-y-3">
              <div className="space-y-2">
                <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
                  GoldNow AI 教练
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                  实时理解客户问题，自动调用产品知识，生成更可成交的话术与建议。
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                <span>输入</span>
                <span className="text-[var(--gold-strong)]">→</span>
                <span>AI 回答</span>
                <span className="text-[var(--gold-strong)]">→</span>
                <span>下一步建议</span>
                <span className="text-[var(--gold-strong)]">→</span>
                <span>一键生成</span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
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
                  placeholder="请帮我用一句人话介绍 GoldNow / 客户说这是不是 MLM，我该怎么回答？/ 帮我生成 WhatsApp 跟进话术 / 模拟一个客户追问 Shariah 的场景"
                  className="min-h-36 border-none bg-transparent px-0 py-0 text-base shadow-none placeholder:text-[var(--muted)]/75 focus:ring-0"
                />

                <div className="flex flex-wrap gap-2">
                  {heroQuickActions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => void submitPrompt(item)}
                      className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!prompt.trim() || isLoading || !activeConversationId || !isHydrated}
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="mr-2 size-4 animate-spin" />
                          正在生成
                        </>
                      ) : (
                        <>
                          开始生成
                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() =>
                        void submitPrompt(
                          "模拟一个客户追问 Shariah 的场景：先扮演客户追问 3 轮，再给我建议回答。",
                        )
                      }
                      disabled={isLoading || !activeConversationId || !isHydrated}
                    >
                      <PlayCircle className="mr-2 size-4" />
                      进入演练模式
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    {assistantState === "stopped" ? <Badge variant="warning">本轮已停止</Badge> : null}
                    {assistantState === "error" ? <Badge variant="warning">生成异常</Badge> : null}
                    <span>{storageMode === "supabase" ? "会话已接入 Supabase" : "会话保留在当前浏览器"}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Card>

        <Card className="border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top,rgba(242,200,107,0.1),transparent_34%),linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-6 shadow-[0_24px_80px_rgba(5,3,8,0.32)]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">AI 中控台</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">系统状态</h2>
            </div>

            <div className="grid gap-3">
              {systemStatus.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(216,177,91,0.18)] bg-[linear-gradient(180deg,rgba(242,200,107,0.16),rgba(177,58,134,0.14))] text-[var(--gold-strong)]">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    <p className="text-xs text-[var(--muted)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">今日热门场景</p>
                <div className="mt-3 space-y-2">
                  {hotScenarios.map((item) => (
                    <div key={item} className="text-sm leading-6 text-[var(--foreground)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">高频问题 Top 3</p>
                <div className="mt-3 space-y-2">
                  {topQuestions.map((item) => (
                    <div key={item} className="text-sm leading-6 text-[var(--foreground)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">当前输出风格</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentOutputStyles.map((style) => (
                    <Badge key={style} variant="neutral">
                      {style}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">本轮可生成类型</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {generationTypes.map((style) => (
                    <Badge key={style} variant="default">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.95fr)]">
        <div className="space-y-6">
          <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-6 shadow-[0_28px_100px_rgba(5,3,8,0.34)]">
            <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">AI 对话与结果工作区</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">这轮 AI 正在帮你推进销售</h2>
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

            <div className="mt-6 space-y-5">
              <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(14,9,14,0.92)] text-white">
                    <UserRound className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">你的问题</p>
                    <p className="mt-1 text-sm leading-7 text-[var(--foreground)]">
                      {latestUserTurn?.message.content ?? activeConversation?.lastUserPrompt ?? "请直接输入一个客户问题开始。"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-[rgba(216,177,91,0.18)] bg-[radial-gradient(circle_at_top_left,rgba(177,58,134,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default">AI 教练回答</Badge>
                      {latestAssistantMessage?.state === "streaming" ? <Badge variant="neutral">实时生成中</Badge> : null}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">摘要版回答</h3>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--foreground)]">
                      {summaryAnswer}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setDetailedAnswerMessageId((current) =>
                          current === latestAssistantMessage?.id ? null : (latestAssistantMessage?.id ?? null),
                        )
                      }
                    >
                      {showDetailedAnswer ? "收起详细版" : "查看详细版"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => void submitPrompt("请把刚才回答改成更口语、更像现场 demo 会说的话。")}
                      disabled={!latestAssistantMessage || isLoading}
                    >
                      <WandSparkles className="mr-2 size-4" />
                      生成口语版
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void copyToClipboard(latestAssistantMessage?.content ?? "", "已复制回答。")}
                      disabled={!latestAssistantMessage}
                    >
                      <Copy className="mr-2 size-4" />
                      复制回答
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={saveLatestSnippet}
                      disabled={!latestAssistantMessage || isLatestReplySaved}
                    >
                      <Save className="mr-2 size-4" />
                      {isLatestReplySaved ? "已保存为常用话术" : "保存为常用话术"}
                    </Button>
                  </div>
                </div>

                {showDetailedAnswer ? (
                  <div className="mt-5 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">详细版</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[var(--muted)]">
                      {latestAssistantMessage?.content || "AI 正在准备完整回答。"}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="px-1">
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">AI 推荐下一步</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    不用重新思考下一句，直接从这里接着走。
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  {recommendationCards.map((item) => {
                    const isExpanded =
                      expandedRecommendationState?.messageId === latestAssistantMessage?.id &&
                      expandedRecommendationState?.recommendationId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">{item.title}</Badge>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{item.description}</p>
                        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                          {isExpanded ? item.content : truncateText(item.content, 88)}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setExpandedRecommendationState(
                                isExpanded || !latestAssistantMessage
                                  ? null
                                  : { messageId: latestAssistantMessage.id, recommendationId: item.id },
                              )
                            }
                          >
                            {isExpanded ? "收起" : "展开"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => void copyToClipboard(item.content, `已复制${item.title}。`)}
                          >
                            <Clipboard className="mr-1.5 size-3.5" />
                            复制
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => void submitPrompt(item.followUpPrompt)}
                          >
                            继续追问
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[var(--gold-strong)]" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">继续追问建议</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {combinedFollowUpChips.map((item) => (
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

              <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">对话流</p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">最近会话片段</h3>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={createNewConversation}>
                    <MessageSquarePlus className="mr-2 size-4" />
                    新对话
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {activeConversation?.messages.length ? (
                    activeConversation.messages.slice(-4).map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "rounded-[22px] border px-4 py-3",
                          message.role === "assistant"
                            ? "border-[rgba(216,177,91,0.16)] bg-[linear-gradient(180deg,rgba(177,58,134,0.12),rgba(255,255,255,0.03))]"
                            : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {message.role === "assistant" ? (
                            <Bot className="size-4 text-[var(--gold-strong)]" />
                          ) : (
                            <UserRound className="size-4 text-[var(--foreground)]" />
                          )}
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                            {message.role === "assistant" ? "AI 教练" : "用户输入"}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                          {message.content || "AI 正在生成中..."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] p-5 text-sm leading-7 text-[var(--muted)]">
                      还没有对话记录。直接从上方输入一个客户场景，AI 会马上开始协助你。
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
            <div className="flex items-center gap-2">
              <Radar className="size-4 text-[var(--gold-strong)]" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">本次调用知识来源</h3>
            </div>
            <div className="mt-4 space-y-3">
              {relatedKnowledgeSources.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    <Badge variant="neutral">{item.count}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
            <div className="flex items-center gap-2">
              <History className="size-4 text-[var(--gold-strong)]" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">推荐继续追问</h3>
            </div>
            <div className="mt-4 space-y-3">
              {relatedScripts.map((script) => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => void submitPrompt(script.objection)}
                  className="block w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">{script.objection}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{truncateText(script.shortAnswer, 68)}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--gold-strong)]" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">快速动作</h3>
            </div>
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => void copyToClipboard(latestAssistantMessage?.content ?? "", "已复制本次回答。")}
                className="flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">复制本次回答</span>
                <Copy className="size-4 text-[var(--gold-strong)]" />
              </button>
              <button
                type="button"
                onClick={() => void submitPrompt("请把刚才回答转成 WhatsApp 版，短一点、像发给客户的口气。")}
                className="flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">生成 WhatsApp 版</span>
                <ArrowRight className="size-4 text-[var(--gold-strong)]" />
              </button>
              <button
                type="button"
                onClick={() => void submitPrompt("请把刚才回答加入客户脚本，分成开场、解释、收口。")}
                className="flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">加入客户脚本</span>
                <FileStack className="size-4 text-[var(--gold-strong)]" />
              </button>
              <button
                type="button"
                onClick={saveLatestSnippet}
                className="flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">保存到知识库</span>
                <Save className="size-4 text-[var(--gold-strong)]" />
              </button>
              <button
                type="button"
                onClick={() => void submitPrompt("请把刚才回答导出成一份 60 秒 demo 讲稿。")}
                className="flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left transition hover:border-[rgba(216,177,91,0.24)] hover:bg-[rgba(255,255,255,0.07)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">导出成 demo 讲稿</span>
                <WandSparkles className="size-4 text-[var(--gold-strong)]" />
              </button>
            </div>
          </Card>

          <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.96),rgba(18,7,15,0.98))] p-5 shadow-[0_24px_80px_rgba(5,3,8,0.3)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">会话历史</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">像 AI 中控台一样切换上下文</h3>
              </div>
              <Badge variant="neutral">{storageMode === "supabase" ? "Supabase 已接入" : "本机保留"}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {conversations.map((conversation) => {
                const active = conversation.id === activeConversationId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => selectConversation(conversation.id)}
                    className={cn(
                      "block w-full rounded-[22px] border p-4 text-left transition",
                      active
                        ? "border-[rgba(216,177,91,0.28)] bg-[linear-gradient(180deg,rgba(177,58,134,0.2),rgba(255,255,255,0.05))]"
                        : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{conversation.title}</p>
                      <span className="shrink-0 text-[11px] text-[var(--muted)]">
                        {formatConversationTime(conversation.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{getConversationPreview(conversation)}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">场景模板区</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">不用先想问题，直接选一个场景生成</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scenarioTemplates.map((template) => (
            <Card
              key={`${template.category}-${template.title}`}
              className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(18,7,15,0.96))] p-5 shadow-[0_22px_70px_rgba(5,3,8,0.24)]"
            >
              <Badge variant="neutral">{template.category}</Badge>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{template.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{template.description}</p>
              <Button type="button" className="mt-5" onClick={() => void submitPrompt(template.prompt)}>
                立即生成
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">知识来源区</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">底层知识保持摘要化，不把页面做成资料库</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {knowledgeSourceCards.map((item) => (
            <Card
              key={item.id}
              className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(18,7,15,0.96))] p-5 shadow-[0_22px_70px_rgba(5,3,8,0.24)]"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="default">{item.status}</Badge>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  <CheckCircle2 className="size-3.5 text-[var(--gold-strong)]" />
                  可调用
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{item.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">知识数量：</span>
                  {item.quantity}
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">最近更新时间：</span>
                  {item.updatedLabel}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => void copyToClipboard(item.updatedLabel, "已复制知识来源说明。")}
                >
                  查看详情
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => void submitPrompt(item.actionPrompt)}>
                  立即调用
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => void submitPrompt(`${item.actionPrompt} 请直接给我一版回答。`)}>
                  用它生成回答
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-2 rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4 text-sm text-[var(--muted)] lg:flex-row lg:items-center lg:justify-between">
        <p>{activeConversation?.notice ?? sourceNote}</p>
        <div className="flex flex-wrap items-center gap-3">
          {feedbackMessage ? <span className="text-[var(--gold-strong)]">{feedbackMessage}</span> : null}
          <span>
            {storageMode === "supabase"
              ? "当前会话会写入 Supabase，换设备登入也能继续查看。"
              : "当前会话保留在浏览器中，刷新页面不会丢。"}
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-[20px] border border-[rgba(245,120,120,0.22)] bg-[rgba(93,30,41,0.42)] p-4 text-sm leading-7 text-[#F7C1C1]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
