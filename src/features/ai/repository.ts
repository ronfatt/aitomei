import type { DashboardMetric } from "@/types/domain";

import {
  aurexKnowledgeCards,
  aurexKnowledgeSourceDocuments,
  aurexKnowledgeSourceNote,
  aurexObjectionScripts,
  type AurexKnowledgeCard,
  type AurexKnowledgeSourceDocument,
  type AurexObjectionScript,
} from "@/features/ai/knowledge/aurex";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv, hasSupabaseAdminEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type KnowledgeRecordSource = "mock" | "supabase";
type RecordStatus = Database["public"]["Enums"]["record_status"];
type KnowledgeSourceRow = Database["public"]["Tables"]["ai_knowledge_sources"]["Row"];
type KnowledgeEntryRow = Database["public"]["Tables"]["ai_knowledge_entries"]["Row"];
type ObjectionScriptRow = Database["public"]["Tables"]["ai_objection_scripts"]["Row"];

export interface AiKnowledgeSourceRecord extends AurexKnowledgeSourceDocument {
  status: RecordStatus;
  source: KnowledgeRecordSource;
}

export interface AiKnowledgeCardRecord extends AurexKnowledgeCard {
  status: RecordStatus;
  source: KnowledgeRecordSource;
}

export interface AiObjectionScriptRecord extends AurexObjectionScript {
  status: RecordStatus;
  source: KnowledgeRecordSource;
}

export interface AiKnowledgeAdminOverview {
  metrics: DashboardMetric[];
  sourceDocuments: AiKnowledgeSourceRecord[];
  knowledgeCards: AiKnowledgeCardRecord[];
  objectionScripts: AiObjectionScriptRecord[];
  source: KnowledgeRecordSource;
  hasWritableStore: boolean;
}

export interface AiCoachKnowledgeBundle {
  sourceDocuments: AiKnowledgeSourceRecord[];
  knowledgeCards: AiKnowledgeCardRecord[];
  objectionScripts: AiObjectionScriptRecord[];
  source: KnowledgeRecordSource;
  sourceNote: string;
}

function buildMetrics(
  sourceDocuments: AiKnowledgeSourceRecord[],
  knowledgeCards: AiKnowledgeCardRecord[],
  objectionScripts: AiObjectionScriptRecord[],
): DashboardMetric[] {
  return [
    {
      label: "知识来源文件",
      value: `${sourceDocuments.length}`,
      trend: sourceDocuments.length > 0 ? "已接入官方资料" : "等待导入",
    },
    {
      label: "知识卡片",
      value: `${knowledgeCards.length}`,
      trend: "用于 AI 的核心事实回答",
    },
    {
      label: "追问脚本",
      value: `${objectionScripts.length}`,
      trend: "适合现场 demo 的应答话术",
    },
  ];
}

function getMockOverview(): AiKnowledgeAdminOverview {
  const sourceDocuments: AiKnowledgeSourceRecord[] = aurexKnowledgeSourceDocuments.map((document) => ({
    ...document,
    status: "active",
    source: "mock",
  }));
  const knowledgeCards: AiKnowledgeCardRecord[] = aurexKnowledgeCards.map((card) => ({
    ...card,
    status: "active",
    source: "mock",
  }));
  const objectionScripts: AiObjectionScriptRecord[] = aurexObjectionScripts.map((script) => ({
    ...script,
    status: "active",
    source: "mock",
  }));

  return {
    metrics: buildMetrics(sourceDocuments, knowledgeCards, objectionScripts),
    sourceDocuments,
    knowledgeCards,
    objectionScripts,
    source: "mock",
    hasWritableStore: hasSupabaseAdminEnv(),
  };
}

function hasLegacyGoldNowKnowledge(
  sourceDocuments: AiKnowledgeSourceRecord[],
  knowledgeCards: AiKnowledgeCardRecord[],
  objectionScripts: AiObjectionScriptRecord[],
) {
  const haystack = JSON.stringify({
    sourceDocuments,
    knowledgeCards,
    objectionScripts,
  }).toLowerCase();

  return haystack.includes("goldnow") || haystack.includes("tomei") || haystack.includes("shariah");
}

function mapSourceRow(row: KnowledgeSourceRow): AiKnowledgeSourceRecord {
  return {
    id: row.slug,
    title: row.title,
    language: row.language,
    pages: row.page_count,
    scope: row.scope,
    summary: row.summary ?? "",
    status: row.status,
    source: "supabase",
  };
}

function mapKnowledgeEntryRow(row: KnowledgeEntryRow, sourceSlugById: Map<string, string>): AiKnowledgeCardRecord {
  return {
    id: row.slug,
    title: row.title,
    detail: row.detail,
    tag: row.tag,
    sourceDocumentId: row.source_id ? (sourceSlugById.get(row.source_id) ?? null) : null,
    sequence: row.sequence,
    status: row.status,
    source: "supabase",
  };
}

function mapObjectionScriptRow(row: ObjectionScriptRow): AiObjectionScriptRecord {
  return {
    id: row.slug,
    objection: row.objection,
    shortAnswer: row.short_answer,
    talkTrack: row.talk_track,
    nextMove: row.next_move,
    sequence: row.sequence,
    status: row.status,
    source: "supabase",
  };
}

async function getKnowledgeClient() {
  const adminClient = createSupabaseAdminClient();

  if (adminClient) {
    return adminClient;
  }

  if (!hasSupabaseEnv()) {
    return null;
  }

  return createSupabaseServerClient();
}

async function loadSupabaseKnowledge(): Promise<AiKnowledgeAdminOverview | null> {
  const client = await getKnowledgeClient();

  if (!client) {
    return null;
  }

  try {
    const [{ data: sourceRows, error: sourceError }, { data: entryRows, error: entryError }, { data: scriptRows, error: scriptError }] =
      await Promise.all([
        client.from("ai_knowledge_sources").select("*").is("deleted_at", null).order("page_count"),
        client.from("ai_knowledge_entries").select("*").is("deleted_at", null).order("sequence"),
        client.from("ai_objection_scripts").select("*").is("deleted_at", null).order("sequence"),
      ]);

    if (sourceError || entryError || scriptError) {
      return null;
    }

    const resolvedSourceRows = (sourceRows as KnowledgeSourceRow[] | null) ?? [];
    const resolvedEntryRows = (entryRows as KnowledgeEntryRow[] | null) ?? [];
    const resolvedScriptRows = (scriptRows as ObjectionScriptRow[] | null) ?? [];

    if (
      resolvedSourceRows.length === 0 &&
      resolvedEntryRows.length === 0 &&
      resolvedScriptRows.length === 0
    ) {
      return null;
    }

    const sourceSlugById = new Map(resolvedSourceRows.map((row) => [row.id, row.slug]));
    const sourceDocuments = resolvedSourceRows.map(mapSourceRow);
    const knowledgeCards = resolvedEntryRows.map((row) => mapKnowledgeEntryRow(row, sourceSlugById));
    const objectionScripts = resolvedScriptRows.map(mapObjectionScriptRow);

    if (hasLegacyGoldNowKnowledge(sourceDocuments, knowledgeCards, objectionScripts)) {
      return null;
    }

    return {
      metrics: buildMetrics(sourceDocuments, knowledgeCards, objectionScripts),
      sourceDocuments,
      knowledgeCards,
      objectionScripts,
      source: "supabase",
      hasWritableStore: hasSupabaseAdminEnv(),
    };
  } catch (error) {
    console.error("Failed to load AI knowledge overview", error);
    return null;
  }
}

export async function getAiKnowledgeAdminOverview(): Promise<AiKnowledgeAdminOverview> {
  const supabaseOverview = await loadSupabaseKnowledge();
  return supabaseOverview ?? getMockOverview();
}

export async function getAiCoachKnowledgeBundle(): Promise<AiCoachKnowledgeBundle> {
  const overview = await getAiKnowledgeAdminOverview();

  return {
    sourceDocuments: overview.sourceDocuments.filter((item) => item.status !== "archived"),
    knowledgeCards: overview.knowledgeCards.filter((item) => item.status !== "archived"),
    objectionScripts: overview.objectionScripts.filter((item) => item.status !== "archived"),
    source: overview.source,
    sourceNote: aurexKnowledgeSourceNote,
  };
}
