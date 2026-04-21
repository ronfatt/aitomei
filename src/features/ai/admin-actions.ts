"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

export interface AiKnowledgeActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const initialActionState: AiKnowledgeActionState = { status: "idle" };

const sourceSchema = z.object({
  slug: z.string().min(2, "请填写来源标识。"),
  title: z.string().min(2, "请填写来源标题。"),
  language: z.string().min(1, "请填写语言。"),
  pageCount: z.coerce.number().int().min(0, "页数不能小于 0。"),
  scope: z.string().min(2, "请填写覆盖范围。"),
  summary: z.string().min(2, "请填写摘要。"),
  status: z.enum(["active", "inactive", "archived"] satisfies Database["public"]["Enums"]["record_status"][]),
});

const entrySchema = z.object({
  slug: z.string().min(2, "请填写知识标识。"),
  sourceSlug: z.string().optional().transform((value) => value?.trim() || ""),
  tag: z.string().min(1, "请填写标签。"),
  title: z.string().min(2, "请填写标题。"),
  detail: z.string().min(2, "请填写知识内容。"),
  sequence: z.coerce.number().int().min(0, "排序不能小于 0。"),
  status: z.enum(["active", "inactive", "archived"] satisfies Database["public"]["Enums"]["record_status"][]),
});

const scriptSchema = z.object({
  slug: z.string().min(2, "请填写脚本标识。"),
  objection: z.string().min(2, "请填写客户问题。"),
  shortAnswer: z.string().min(2, "请填写短回答。"),
  talkTrack: z.string().min(2, "请填写建议说法。"),
  nextMove: z.string().min(2, "请填写下一步建议。"),
  sequence: z.coerce.number().int().min(0, "排序不能小于 0。"),
  status: z.enum(["active", "inactive", "archived"] satisfies Database["public"]["Enums"]["record_status"][]),
});

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function revalidateKnowledgeSurfaces() {
  revalidatePath("/admin/ai-knowledge");
  revalidatePath("/member/ai-coach");
  revalidatePath("/member/ai-concierge");
}

async function requireAdminWriteAccess() {
  const auth = await getAuthContext("admin");

  if (!auth.user || auth.user.role !== "admin") {
    return {
      error: {
        status: "error",
        message: "只有管理员可以修改 AI 知识库。",
      } satisfies AiKnowledgeActionState,
      client: null,
    };
  }

  const client = createSupabaseAdminClient();

  if (!client) {
    return {
      error: {
        status: "error",
        message: "缺少 Supabase Service Role Key，当前无法写入知识库。",
      } satisfies AiKnowledgeActionState,
      client: null,
    };
  }

  return { error: null, client };
}

export async function saveAiKnowledgeSourceAction(
  previousState: AiKnowledgeActionState = initialActionState,
  formData: FormData,
): Promise<AiKnowledgeActionState> {
  void previousState;
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return access.error ?? initialActionState;
  }

  const parsed = sourceSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "来源数据填写不完整。",
    };
  }

  const { error } = await access.client.from("ai_knowledge_sources").upsert(
    {
      slug: parsed.data.slug,
      title: parsed.data.title,
      language: parsed.data.language,
      page_count: parsed.data.pageCount,
      scope: parsed.data.scope,
      summary: parsed.data.summary,
      status: parsed.data.status,
      deleted_at: parsed.data.status === "archived" ? new Date().toISOString() : null,
    } as never,
    { onConflict: "slug" },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateKnowledgeSurfaces();

  return {
    status: "success",
    message: "来源资料已保存。",
  };
}

export async function archiveAiKnowledgeSourceAction(formData: FormData) {
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return;
  }

  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    return;
  }

  await access.client
    .from("ai_knowledge_sources")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    } as never)
    .eq("slug", slug);

  revalidateKnowledgeSurfaces();
}

export async function saveAiKnowledgeEntryAction(
  previousState: AiKnowledgeActionState = initialActionState,
  formData: FormData,
): Promise<AiKnowledgeActionState> {
  void previousState;
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return access.error ?? initialActionState;
  }

  const parsed = entrySchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "知识卡数据填写不完整。",
    };
  }

  let sourceId: string | null = null;

  if (parsed.data.sourceSlug) {
    const { data: source } = await access.client
      .from("ai_knowledge_sources")
      .select("id")
      .eq("slug", parsed.data.sourceSlug)
      .is("deleted_at", null)
      .maybeSingle();

    sourceId = (source as { id: string } | null)?.id ?? null;
  }

  const { error } = await access.client.from("ai_knowledge_entries").upsert(
    {
      slug: parsed.data.slug,
      source_id: sourceId,
      tag: parsed.data.tag,
      title: parsed.data.title,
      detail: parsed.data.detail,
      sequence: parsed.data.sequence,
      status: parsed.data.status,
      deleted_at: parsed.data.status === "archived" ? new Date().toISOString() : null,
    } as never,
    { onConflict: "slug" },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateKnowledgeSurfaces();

  return {
    status: "success",
    message: "知识卡已保存。",
  };
}

export async function archiveAiKnowledgeEntryAction(formData: FormData) {
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return;
  }

  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    return;
  }

  await access.client
    .from("ai_knowledge_entries")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    } as never)
    .eq("slug", slug);

  revalidateKnowledgeSurfaces();
}

export async function saveAiObjectionScriptAction(
  previousState: AiKnowledgeActionState = initialActionState,
  formData: FormData,
): Promise<AiKnowledgeActionState> {
  void previousState;
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return access.error ?? initialActionState;
  }

  const parsed = scriptSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "追问脚本填写不完整。",
    };
  }

  const { error } = await access.client.from("ai_objection_scripts").upsert(
    {
      slug: parsed.data.slug,
      objection: parsed.data.objection,
      short_answer: parsed.data.shortAnswer,
      talk_track: parsed.data.talkTrack,
      next_move: parsed.data.nextMove,
      sequence: parsed.data.sequence,
      status: parsed.data.status,
      deleted_at: parsed.data.status === "archived" ? new Date().toISOString() : null,
    } as never,
    { onConflict: "slug" },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateKnowledgeSurfaces();

  return {
    status: "success",
    message: "追问脚本已保存。",
  };
}

export async function archiveAiObjectionScriptAction(formData: FormData) {
  const access = await requireAdminWriteAccess();

  if (access.error || !access.client) {
    return;
  }

  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    return;
  }

  await access.client
    .from("ai_objection_scripts")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    } as never)
    .eq("slug", slug);

  revalidateKnowledgeSurfaces();
}
