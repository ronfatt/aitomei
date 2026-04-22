import { z } from "zod";

import { appendAiCoachMessage, ensureAiCoachSession } from "@/features/ai/chat-repository";
import { createAiCoachStreamingResponse } from "@/features/ai/live";
import { getAuthContext } from "@/lib/auth/session";

const aiCoachStreamingRequestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
  sessionId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(120).optional(),
  mode: z.enum(["new", "regenerate"]).default("new"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2400),
      }),
    )
    .max(8)
    .optional(),
});

function deriveSessionTitle(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();
  return normalized.length > 20 ? `${normalized.slice(0, 20)}...` : normalized;
}

export async function POST(request: Request) {
  const auth = await getAuthContext("member");

  if (!auth.user) {
    return new Response(JSON.stringify({ error: "请先登入后再使用 AI 教练。" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  try {
    const json = (await request.json()) as unknown;
    const payload = aiCoachStreamingRequestSchema.parse(json);
    let persistedSessionId: string | null = null;

    if (auth.mode === "supabase") {
      const session = await ensureAiCoachSession({
        userId: auth.user.id,
        sessionId: payload.sessionId,
        title: payload.title ?? deriveSessionTitle(payload.message),
      });

      persistedSessionId = session?.id ?? null;

      if (persistedSessionId && payload.mode === "new") {
        await appendAiCoachMessage({
          sessionId: persistedSessionId,
          sender: "user",
          content: payload.message,
          metadata: {
            state: "complete",
          },
        });
      }
    }

    return createAiCoachStreamingResponse(
      {
        memberId: auth.user.id,
        memberName: auth.user.displayName,
        message: payload.message,
        history: payload.history,
      },
      {
        sessionId: persistedSessionId,
        onReplyFinalized: persistedSessionId
          ? async (response) => {
              await appendAiCoachMessage({
                sessionId: persistedSessionId,
                sender: "assistant",
                content: response.reply,
                metadata: {
                  provider: response.provider,
                  model: response.model,
                  notice: response.notice,
                  state: "complete",
                },
              });
            }
          : undefined,
      },
    );
  } catch (error) {
    console.error("AI coach stream route failed", error);

    const message =
      error instanceof z.ZodError ? "提交的问题格式不对，请重新输入。" : "AI 教练流式连接失败。";

    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}
