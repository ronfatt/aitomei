"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import type { AiCoachResponse } from "@/features/ai/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface AiCoachLivePanelProps {
  initialPrompt: string;
  sourceNote: string;
  suggestedPrompts: readonly string[];
}

interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
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
}

function trimConversation(messages: ConversationMessage[]) {
  return messages.slice(-8);
}

export function AiCoachLivePanel({
  initialPrompt,
  sourceNote,
  suggestedPrompts,
}: AiCoachLivePanelProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [response, setResponse] = useState<AiCoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedPromptRef = useRef<string | null>(null);
  const messagesRef = useRef<ConversationMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  async function submitPrompt(nextPrompt: string) {
    const normalizedPrompt = nextPrompt.trim();

    if (!normalizedPrompt || isLoading) {
      return;
    }

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: normalizedPrompt,
    };
    const assistantMessageId = crypto.randomUUID();

    const requestHistory = trimConversation(messagesRef.current).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setPrompt(normalizedPrompt);
    setError(null);
    setIsLoading(true);
    setMessages((current) =>
      trimConversation([
        ...current,
        userMessage,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]),
    );

    try {
      const apiResponse = await fetch("/api/ai/coach/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: normalizedPrompt,
          history: requestHistory,
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
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed) {
            continue;
          }

          const event = JSON.parse(trimmed) as AiCoachStreamEvent;

          if (event.type === "meta") {
            setResponse((current) => ({
              reply: current?.reply ?? "",
              suggestedActions: current?.suggestedActions ?? [],
              provider: event.provider ?? current?.provider,
              model: event.model ?? current?.model,
              notice: event.notice ?? current?.notice ?? sourceNote,
            }));
          }

          if (event.type === "delta" && typeof event.text === "string") {
            latestReply += event.text;
            setMessages((current) =>
              trimConversation(
                current.map((message) =>
                  message.id === assistantMessageId ? { ...message, content: latestReply } : message,
                ),
              ),
            );
          }

          if (event.type === "done") {
            const finalReply = event.reply ?? latestReply;
            latestReply = finalReply;

            setResponse({
              reply: finalReply,
              suggestedActions:
                event.suggestedActions ?? ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"],
              provider: event.provider,
              model: event.model,
              notice: event.notice ?? sourceNote,
            });
            setMessages((current) =>
              trimConversation(
                current.map((message) =>
                  message.id === assistantMessageId ? { ...message, content: finalReply } : message,
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
      const message =
        requestError instanceof Error ? requestError.message : "AI 教练连接失败，请稍后再试。";
      setError(message);
      setMessages((current) =>
        trimConversation(current.filter((message) => message.id !== assistantMessageId)),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const runInitialPrompt = useEffectEvent(async () => {
    await submitPrompt(initialPrompt);
  });

  useEffect(() => {
    if (initializedPromptRef.current === initialPrompt) {
      return;
    }

    initializedPromptRef.current = initialPrompt;
    void runInitialPrompt();
  }, [initialPrompt]);

  const latestAssistantMessage = messages
    .slice()
    .reverse()
    .find((message) => message.role === "assistant");

  return (
    <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          <Badge variant="neutral">官方知识已载入</Badge>
          <Badge variant="default">OpenAI 实时应答</Badge>
          <Badge variant="default">GoldNow 产品说明</Badge>
          <Badge variant="default">Shariah 结构</Badge>
          <Badge variant="default">实体兑换</Badge>
          <Badge variant="default">Demo 话术辅助</Badge>
        </div>

        <div className="mt-4 space-y-4">
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
              placeholder="例如：客户问 GoldNow 是不是真的黄金，我该怎么讲？"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    正在生成
                  </>
                ) : (
                  "生成回答"
                )}
              </Button>
              <Badge variant="warning">{response?.notice ?? sourceNote}</Badge>
            </div>
          </form>

          <div className="rounded-[26px] border border-[var(--border)] bg-white/72 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">AI 实时对话记录</p>
              <div className="flex flex-wrap justify-end gap-2">
                {response?.provider === "openai" ? (
                  <Badge variant="default">{`OpenAI Live${response.model ? ` · ${response.model}` : ""}`}</Badge>
                ) : response?.provider === "mock" ? (
                  <Badge variant="warning">当前为本地 fallback</Badge>
                ) : null}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.75)] p-4 text-sm leading-7 text-[var(--muted)]">
                  AI 教练会先给结论，再补一条你现场 demo 可以直接接上的说法。
                </div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[88%] rounded-[24px] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)]"
                      : "max-w-[92%] rounded-[24px] border border-[rgba(196,168,114,0.22)] bg-[rgba(250,241,226,0.75)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]"
                  }
                >
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                    {message.role === "user" ? "你的问题" : "AI 教练"}
                  </p>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              ))}

              {isLoading ? (
                <div className="max-w-[92%] rounded-[24px] border border-[rgba(196,168,114,0.22)] bg-[rgba(250,241,226,0.55)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                  <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                    <Sparkles className="size-3.5" />
                    AI 教练
                  </p>
                  <p className="flex items-center gap-2 text-[var(--muted)]">
                    <LoaderCircle className="size-4 animate-spin" />
                    正在结合 GoldNow 资料组织回答...
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-[rgba(168,79,79,0.22)] bg-[rgba(255,242,241,0.9)] p-4 text-sm leading-7 text-[#8A4B4B]">
              {error}
            </div>
          ) : null}

          <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">AI 会主动建议你下一步怎么讲</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(response?.suggestedActions ?? ["先讲一句人话定义", "再讲真实黄金支持", "最后补实体兑换"]).map(
                (action) => (
                  <span
                    key={action}
                    className="rounded-full border border-[rgba(196,168,114,0.18)] bg-[rgba(255,255,255,0.9)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                  >
                    {action}
                  </span>
                ),
              )}
            </div>
            {latestAssistantMessage ? (
              <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
                最新回答已经保留在上方，你可以继续追问，AI 会接着上下文讲。
              </p>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Badge variant="warning">建议你 demo 时直接点这些问题</Badge>
        <div className="mt-4 space-y-4">
          {suggestedPrompts.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void submitPrompt(suggestion)}
              className="block w-full rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-left text-sm leading-6 text-[var(--muted)] transition hover:bg-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}
