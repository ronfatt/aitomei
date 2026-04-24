import { inferAiCoachContext } from "@/features/ai/helpers";
import type { AiCoachResponse } from "@/features/ai/contracts";
import { getAiCoachSuggestedActionsForMessage } from "@/features/ai/contracts";
import { mockAiCoach } from "@/features/ai/contracts";
import { getAiCoachKnowledgeBundle } from "@/features/ai/repository";

interface AiCoachConversationTurn {
  role: "user" | "assistant";
  content: string;
}

interface GenerateAiCoachReplyInput {
  memberId: string;
  memberName: string;
  message: string;
  history?: AiCoachConversationTurn[];
}

interface AiCoachStreamingOptions {
  sessionId?: string | null;
  onReplyFinalized?: (payload: {
    reply: string;
    provider: "mock" | "openai";
    model: string;
    notice: string | null;
  }) => Promise<void> | void;
}

const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

function getAiCoachProvider() {
  return (process.env.AI_COACH_PROVIDER ?? "openai").trim().toLowerCase();
}

function getAiCoachModel() {
  return (process.env.AI_COACH_MODEL ?? DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL;
}

function hasOpenAiApiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function buildKnowledgeDigest(knowledge: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>) {
  const knowledgeLines = knowledge.knowledgeCards
    .sort((left, right) => left.sequence - right.sequence)
    .map((card) => `- [${card.tag}] ${card.title}: ${card.detail}`)
    .join("\n");

  const objectionLines = knowledge.objectionScripts
    .sort((left, right) => left.sequence - right.sequence)
    .map(
      (script) =>
        `- ${script.objection}\n  简短回答：${script.shortAnswer}\n  建议话术：${script.talkTrack}\n  主动补一句：${script.nextMove}`,
    )
    .join("\n");

  const sourceLines = knowledge.sourceDocuments
    .map((document) => `- ${document.title} (${document.language}): ${document.summary}`)
    .join("\n");

  return [`资料来源:\n${sourceLines}`, `核心知识:\n${knowledgeLines}`, `客户追问脚本:\n${objectionLines}`].join(
    "\n\n",
  );
}

function buildConversationTranscript(history: AiCoachConversationTurn[], message: string) {
  const transcript = history
    .slice(-6)
    .map((turn) => `${turn.role === "user" ? "会员" : "AI 教练"}: ${turn.content}`)
    .join("\n");

  return [
    transcript ? `最近对话:\n${transcript}` : "最近对话:\n暂无",
    `当前问题:\n会员: ${message}`,
  ].join("\n\n");
}

function buildAiCoachInstructions(input: {
  memberName: string;
  knowledge: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>;
  context: ReturnType<typeof inferAiCoachContext>;
}) {
  return [
    "你是 Aurex Legacy Member Platform 里的 AI 教练，也是 Aurex Legacy demo 现场的官方知识助手。",
    `当前会员名称：${input.memberName}。当前问题上下文：${input.context}。`,
    "你的角色不是冷冰冰客服，而是专业、支持型、会主动带话术的品牌教练。",
    "回答默认用简体中文；如果用户明确用英文或马来文提问，再切换语言。",
    "回答风格要像真人在帮销售现场 demo：先给结论，再解释，再主动补一句“你可以这样跟客户讲”。",
    "语气要自然、口语化、有判断力，但不能油腻、不能夸大、不能乱承诺收益。",
    "任何涉及 Aurex Legacy 的品牌定位、会员逻辑、数字确权、RWA 方向、纳斯达克路线、产品阶梯或是否 MLM 时，优先依据提供的知识资料回答。",
    "这个平台不是 MLM、不是 downline/upline 招募系统、不是发币项目、也不是保证收入模型；如果被问到相关问题，要明确回到真实产品、会员关系、provenance、audit trail 与 future readiness。",
    "如果资料没有明确写的数字、比例、收益、法律承诺，不要编造。你可以直接说“这版 demo 目前先按已载入的官方资料回答”。",
    "输出必须是 JSON，包含 reply 和 suggestedActions。",
    "reply 用 2 到 4 小段文字，适合直接给客户 demo 看。",
    "suggestedActions 给 3 条简短下一句建议，每条不超过 18 个字。",
    buildKnowledgeDigest(input.knowledge),
  ].join("\n\n");
}

function buildAiCoachStreamingInstructions(input: {
  memberName: string;
  knowledge: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>;
  context: ReturnType<typeof inferAiCoachContext>;
}) {
  return [
    "你是 Aurex Legacy Member Platform 里的 AI 教练，也是 Aurex Legacy demo 现场的官方知识助手。",
    `当前会员名称：${input.memberName}。当前问题上下文：${input.context}。`,
    "你要用简体中文回答，风格像专业但很会带 demo 的真人顾问。",
    "请先直接回答，再补一句“你可以这样跟客户讲”。",
    "回答自然、主动、口语化，但不能夸张承诺，不能乱编收益、比例或未给出的规则。",
    "如果问题涉及 Aurex Legacy 的品牌定位、会员权益、数字确权、RWA 方向、纳斯达克路线或是否 MLM，优先依据下面资料作答。",
    "不要输出 JSON，不要输出代码块，不要输出标题前缀，只输出适合直接展示给会员看的正文。",
    buildKnowledgeDigest(input.knowledge),
  ].join("\n\n");
}

function buildFallbackNotice() {
  return "未配置 OPENAI_API_KEY，当前自动回退到本地 Aurex Legacy 知识模式。";
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const responsePayload = payload as {
    output_text?: unknown;
    output?: Array<{
      type?: unknown;
      content?: Array<{ type?: unknown; text?: unknown }>;
    }>;
  };

  if (typeof responsePayload.output_text === "string" && responsePayload.output_text.trim()) {
    return responsePayload.output_text.trim();
  }

  const texts =
    responsePayload.output
      ?.flatMap((entry) =>
        entry.type === "message"
          ? (entry.content ?? [])
              .filter((item) => item.type === "output_text" && typeof item.text === "string")
              .map((item) => item.text as string)
          : [],
      )
      .filter(Boolean) ?? [];

  return texts.join("\n").trim();
}

function buildOpenAiInputPayload(input: GenerateAiCoachReplyInput) {
  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: buildConversationTranscript(input.history ?? [], input.message.trim()),
        },
      ],
    },
  ];
}

export function getAiCoachRuntimeConfig() {
  return {
    provider: getAiCoachProvider(),
    model: getAiCoachModel(),
    hasOpenAiApiKey: hasOpenAiApiKey(),
  };
}

export function buildAiCoachFallbackReply(message: string) {
  return getAiCoachSuggestedActionsForMessage(message);
}

export async function generateAiCoachReply(
  input: GenerateAiCoachReplyInput,
): Promise<AiCoachResponse> {
  const normalizedMessage = input.message.trim();
  const context = inferAiCoachContext(normalizedMessage);

  if (!normalizedMessage) {
    return {
      reply: "你直接把客户会问的话丢给我就行，我会先帮你讲人话版，再补一条你下一句可以怎么接。",
      suggestedActions: ["先问品牌定位", "再问会员逻辑", "最后问数字确权"],
      provider: "mock",
      model: "local-demo",
      notice: "问题为空，已返回默认引导。",
    };
  }

  if (getAiCoachProvider() !== "openai" || !hasOpenAiApiKey()) {
    const fallback = await mockAiCoach({
      memberId: input.memberId,
      message: normalizedMessage,
      context,
    });

    return {
      ...fallback,
      notice: buildFallbackNotice(),
    };
  }

  const knowledge = await getAiCoachKnowledgeBundle();
  const instructions = buildAiCoachInstructions({
    memberName: input.memberName,
    knowledge,
    context,
  });
  const model = getAiCoachModel();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      model,
      instructions,
      input: buildOpenAiInputPayload(input),
      text: {
        format: {
          type: "json_schema",
          name: "ai_coach_response",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              reply: {
                type: "string",
              },
              suggestedActions: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "string",
                },
              },
            },
            required: ["reply", "suggestedActions"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const outputText = extractOutputText(payload);

  if (!outputText) {
    throw new Error("OpenAI response did not include readable output_text.");
  }

  const parsed = JSON.parse(outputText) as AiCoachResponse;

  return {
    reply: parsed.reply,
    suggestedActions: parsed.suggestedActions,
    provider: "openai",
    model,
    notice: knowledge.sourceNote,
  };
}

export async function createAiCoachStreamingResponse(
  input: GenerateAiCoachReplyInput,
  options: AiCoachStreamingOptions = {},
) {
  const normalizedMessage = input.message.trim();
  const context = inferAiCoachContext(normalizedMessage);
  const config = getAiCoachRuntimeConfig();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      function emit(payload: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      }

      emit({
        type: "meta",
        sessionId: options.sessionId ?? null,
        provider: config.hasOpenAiApiKey && config.provider === "openai" ? "openai" : "mock",
        model: config.hasOpenAiApiKey && config.provider === "openai" ? config.model : "local-demo",
        notice:
          config.hasOpenAiApiKey && config.provider === "openai"
            ? "Aurex Legacy 官方资料已注入，正在生成实时回答。"
            : buildFallbackNotice(),
      });

      if (!normalizedMessage) {
        emit({
          type: "done",
          reply: "你直接把客户会问的话丢给我就行，我会先帮你讲人话版，再补一条你下一句可以怎么接。",
          suggestedActions: ["先问品牌定位", "再问会员逻辑", "最后问数字确权"],
          provider: "mock",
          model: "local-demo",
          sessionId: options.sessionId ?? null,
          notice: "问题为空，已返回默认引导。",
        });
        controller.close();
        return;
      }

      if (config.provider !== "openai" || !config.hasOpenAiApiKey) {
        const fallback = await mockAiCoach({
          memberId: input.memberId,
          message: normalizedMessage,
          context,
        });

        const chunks = fallback.reply
          .split(/(?<=[。！？\n])/)
          .map((item) => item.trim())
          .filter(Boolean);

        for (const chunk of chunks) {
          emit({ type: "delta", text: chunk });
        }

        emit({
          type: "done",
          ...fallback,
          sessionId: options.sessionId ?? null,
          notice: buildFallbackNotice(),
        });
        try {
          await options.onReplyFinalized?.({
            reply: fallback.reply,
            provider: "mock",
            model: "local-demo",
            notice: buildFallbackNotice(),
          });
        } catch (error) {
          console.error("Failed to persist fallback AI reply", error);
        }
        controller.close();
        return;
      }

      try {
        const knowledge = await getAiCoachKnowledgeBundle();
        const instructions = buildAiCoachStreamingInstructions({
          memberName: input.memberName,
          knowledge,
          context,
        });
        const upstream = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          cache: "no-store",
          body: JSON.stringify({
            model: config.model,
            stream: true,
            instructions,
            input: buildOpenAiInputPayload(input),
            text: {
              format: {
                type: "text",
              },
            },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const errorText = await upstream.text();
          throw new Error(`OpenAI streaming request failed (${upstream.status}): ${errorText}`);
        }

        const decoder = new TextDecoder();
        const reader = upstream.body.getReader();
        let buffer = "";
        let fullReply = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const segments = buffer.split("\n\n");
          buffer = segments.pop() ?? "";

          for (const segment of segments) {
            const lines = segment
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            const dataLines = lines
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim());

            if (dataLines.length === 0) {
              continue;
            }

            const rawPayload = dataLines.join("\n");

            if (rawPayload === "[DONE]") {
              continue;
            }

            const event = JSON.parse(rawPayload) as { type?: string; delta?: string; text?: string; error?: { message?: string } };

            if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
              fullReply += event.delta;
              emit({ type: "delta", text: event.delta });
            }

            if (
              event.type === "response.output_text.done" &&
              typeof event.text === "string" &&
              !fullReply.trim()
            ) {
              fullReply = event.text;
            }

            if (event.type === "error") {
              throw new Error(event.error?.message ?? "OpenAI streaming error");
            }
          }
        }

        const finalizedReply = fullReply.trim();

        try {
          await options.onReplyFinalized?.({
            reply: finalizedReply,
            provider: "openai",
            model: config.model,
            notice: knowledge.sourceNote,
          });
        } catch (error) {
          console.error("Failed to persist AI reply", error);
        }

        emit({
          type: "done",
          reply: finalizedReply,
          suggestedActions: getAiCoachSuggestedActionsForMessage(normalizedMessage),
          provider: "openai",
          model: config.model,
          sessionId: options.sessionId ?? null,
          notice: knowledge.sourceNote,
        });
        controller.close();
      } catch (error) {
        console.error("AI coach streaming failed", error);
        emit({
          type: "error",
          error:
            error instanceof Error
              ? error.message
              : "AI 教练流式连接失败，请检查 OPENAI_API_KEY 或模型配置。",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
