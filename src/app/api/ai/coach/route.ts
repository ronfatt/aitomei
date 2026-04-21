import { NextResponse } from "next/server";
import { z } from "zod";

import { generateAiCoachReply } from "@/features/ai/live";
import { getAuthContext } from "@/lib/auth/session";

const aiCoachRequestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
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

export async function POST(request: Request) {
  const auth = await getAuthContext("member");

  if (!auth.user) {
    return NextResponse.json({ error: "请先登入后再使用 AI 教练。" }, { status: 401 });
  }

  try {
    const json = (await request.json()) as unknown;
    const payload = aiCoachRequestSchema.parse(json);
    const response = await generateAiCoachReply({
      memberId: auth.user.id,
      memberName: auth.user.displayName,
      message: payload.message,
      history: payload.history,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI coach route failed", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "提交的问题格式不对，请重新输入。" }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "OpenAI 连接失败，请检查 OPENAI_API_KEY 或 AI_COACH_MODEL 配置。",
      },
      { status: 500 },
    );
  }
}
