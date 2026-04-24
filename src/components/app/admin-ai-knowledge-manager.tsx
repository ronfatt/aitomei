"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  archiveAiKnowledgeEntryAction,
  archiveAiKnowledgeSourceAction,
  archiveAiObjectionScriptAction,
  saveAiKnowledgeEntryAction,
  saveAiKnowledgeSourceAction,
  saveAiObjectionScriptAction,
  type AiKnowledgeActionState,
} from "@/features/ai/admin-actions";
import type {
  AiKnowledgeAdminOverview,
  AiKnowledgeCardRecord,
  AiKnowledgeSourceRecord,
  AiObjectionScriptRecord,
} from "@/features/ai/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: AiKnowledgeActionState = { status: "idle" };

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(180,146,86,0.18)]";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : label}
    </Button>
  );
}

function ActionMessage({ state }: { state: AiKnowledgeActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <Badge variant={state.status === "success" ? "success" : "warning"}>
      {state.message}
    </Badge>
  );
}

function SourceForm({
  item,
  isNew = false,
}: {
  item: Partial<AiKnowledgeSourceRecord> & { id?: string };
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(saveAiKnowledgeSourceAction, initialState);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="neutral">{isNew ? "新增来源" : item.language ?? "来源"}</Badge>
        {!isNew && item.id ? (
          <form action={archiveAiKnowledgeSourceAction}>
            <input type="hidden" name="slug" value={item.id} />
            <Button type="submit" variant="secondary">
              归档
            </Button>
          </form>
        ) : null}
      </div>

      <form action={formAction} className="mt-4 space-y-4">

        {isNew ? (
          <Input name="slug" placeholder="来源标识，例如 goldnow-en-2026" defaultValue={item.id} />
        ) : (
          <input type="hidden" name="slug" value={item.id ?? ""} />
        )}

        {!isNew ? <p className="text-sm font-semibold text-[var(--foreground)]">{item.id}</p> : null}
        <Input name="title" placeholder="来源标题" defaultValue={item.title ?? ""} />
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="language" placeholder="语言" defaultValue={item.language ?? ""} />
          <Input name="pageCount" type="number" placeholder="页数" defaultValue={item.pages ?? 0} />
        </div>
        <Input name="scope" placeholder="覆盖范围" defaultValue={item.scope ?? ""} />
        <Textarea
          name="summary"
          placeholder="来源摘要"
          defaultValue={item.summary ?? ""}
          className="min-h-24"
        />
        <select name="status" className={selectClassName} defaultValue={item.status ?? "active"}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="archived">archived</option>
        </select>
        <div className="flex flex-wrap items-center gap-3">
          <SaveButton label={isNew ? "新增来源" : "保存来源"} />
          <ActionMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

function KnowledgeEntryForm({
  item,
  sourceDocuments,
  isNew = false,
}: {
  item: Partial<AiKnowledgeCardRecord> & { id?: string };
  sourceDocuments: AiKnowledgeAdminOverview["sourceDocuments"];
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(saveAiKnowledgeEntryAction, initialState);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="neutral">{isNew ? "新增知识卡" : item.tag ?? "知识卡"}</Badge>
        {!isNew && item.id ? (
          <form action={archiveAiKnowledgeEntryAction}>
            <input type="hidden" name="slug" value={item.id} />
            <Button type="submit" variant="secondary">
              归档
            </Button>
          </form>
        ) : null}
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        {isNew ? (
          <Input name="slug" placeholder="知识标识，例如 buy-flow" defaultValue={item.id} />
        ) : (
          <input type="hidden" name="slug" value={item.id ?? ""} />
        )}

        {!isNew ? <p className="text-sm font-semibold text-[var(--foreground)]">{item.id}</p> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="tag" placeholder="标签" defaultValue={item.tag ?? ""} />
          <Input
            name="sequence"
            type="number"
            placeholder="排序"
            defaultValue={item.sequence ?? 0}
          />
        </div>

        <Input name="title" placeholder="标题" defaultValue={item.title ?? ""} />

        <select
          name="sourceSlug"
          className={selectClassName}
          defaultValue={item.sourceDocumentId ?? ""}
        >
          <option value="">不关联来源</option>
          {sourceDocuments.map((source) => (
            <option key={source.id} value={source.id}>
              {source.title}
            </option>
          ))}
        </select>

        <Textarea
          name="detail"
          placeholder="知识内容"
          defaultValue={item.detail ?? ""}
          className="min-h-28"
        />

        <select name="status" className={selectClassName} defaultValue={item.status ?? "active"}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="archived">archived</option>
        </select>

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton label={isNew ? "新增知识卡" : "保存知识卡"} />
          <ActionMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

function ObjectionScriptForm({
  item,
  isNew = false,
}: {
  item: Partial<AiObjectionScriptRecord> & { id?: string };
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(saveAiObjectionScriptAction, initialState);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="warning">{isNew ? "新增追问脚本" : "追问脚本"}</Badge>
        {!isNew && item.id ? (
          <form action={archiveAiObjectionScriptAction}>
            <input type="hidden" name="slug" value={item.id} />
            <Button type="submit" variant="secondary">
              归档
            </Button>
          </form>
        ) : null}
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        {isNew ? (
          <Input name="slug" placeholder="脚本标识，例如 is-this-mlm" defaultValue={item.id} />
        ) : (
          <input type="hidden" name="slug" value={item.id ?? ""} />
        )}

        {!isNew ? <p className="text-sm font-semibold text-[var(--foreground)]">{item.id}</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            name="sequence"
            type="number"
            placeholder="排序"
            defaultValue={item.sequence ?? 0}
          />
          <select name="status" className={selectClassName} defaultValue={item.status ?? "active"}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <Input name="objection" placeholder="客户问题" defaultValue={item.objection ?? ""} />
        <Textarea
          name="shortAnswer"
          placeholder="短回答"
          defaultValue={item.shortAnswer ?? ""}
          className="min-h-24"
        />
        <Textarea
          name="talkTrack"
          placeholder="建议说法"
          defaultValue={item.talkTrack ?? ""}
          className="min-h-28"
        />
        <Textarea
          name="nextMove"
          placeholder="下一步建议"
          defaultValue={item.nextMove ?? ""}
          className="min-h-24"
        />
        <div className="flex flex-wrap items-center gap-3">
          <SaveButton label={isNew ? "新增追问脚本" : "保存追问脚本"} />
          <ActionMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function AdminAiKnowledgeManager({ overview }: { overview: AiKnowledgeAdminOverview }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">来源文件</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              这里先维护 AI 当前依赖的官方资料来源，后续可升级为 PDF 上传入口。
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {overview.sourceDocuments.map((item) => (
            <SourceForm key={item.id} item={item} />
          ))}
          <SourceForm
            isNew
            item={{
              id: "",
              title: "",
              language: "",
              pages: 0,
              scope: "",
              summary: "",
              status: "active",
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">核心知识卡</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            这些内容会直接影响 AI 对 Aurex Legacy 核心事实的解释方式。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {overview.knowledgeCards.map((item) => (
            <KnowledgeEntryForm
              key={item.id}
              item={item}
              sourceDocuments={overview.sourceDocuments}
            />
          ))}
          <KnowledgeEntryForm
            isNew
            sourceDocuments={overview.sourceDocuments}
            item={{
              id: "",
              tag: "",
              title: "",
              detail: "",
              sequence: overview.knowledgeCards.length + 1,
              sourceDocumentId: overview.sourceDocuments[0]?.id ?? "",
              status: "active",
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">客户追问脚本</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            这部分会直接影响 AI 如何回答敏感问题与现场 demo 话术。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {overview.objectionScripts.map((item) => (
            <ObjectionScriptForm key={item.id} item={item} />
          ))}
          <ObjectionScriptForm
            isNew
            item={{
              id: "",
              objection: "",
              shortAnswer: "",
              talkTrack: "",
              nextMove: "",
              sequence: overview.objectionScripts.length + 1,
              status: "active",
            }}
          />
        </div>
      </section>
    </div>
  );
}
