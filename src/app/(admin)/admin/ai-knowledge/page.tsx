import { AdminAiKnowledgeManager } from "@/components/app/admin-ai-knowledge-manager";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAiKnowledgeAdminOverview } from "@/features/ai/repository";

export default async function AdminAiKnowledgePage() {
  const overview = await getAiKnowledgeAdminOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI 知识库"
        title="Aurex Legacy AI 回答资料管理"
        description="这一页先用本地知识仓作为 MVP 管理入口，已经把来源文件、核心事实卡片与客户追问脚本拆开。后续可直接替换为 Supabase 表与后台 CRUD。"
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {overview.metrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={overview.source === "supabase" ? "success" : "warning"}>
            {overview.source === "supabase" ? "当前数据源：Supabase" : "当前数据源：本地 mock 回退"}
          </Badge>
          <Badge variant={overview.hasWritableStore ? "default" : "warning"}>
            {overview.hasWritableStore ? "可写入后台" : "缺少 Service Role Key，当前不可写入"}
          </Badge>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          如果你已经执行了最新 Supabase migration，并配置了 `SUPABASE_SERVICE_ROLE_KEY`，
          这里保存的内容会直接进入数据库，并同步影响会员端 AI 回答。
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <Badge variant="neutral">来源文件</Badge>
          <div className="mt-4 space-y-4">
            {overview.sourceDocuments.map((document) => (
              <div
                key={document.id}
                className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4"
              >
                <p className="font-semibold text-[var(--foreground)]">{document.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{document.scope}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                  {document.language} · {document.pages} pages
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Badge variant="warning">未来接入点</Badge>
          <div className="mt-4 space-y-4">
            {[
              "把知识来源从本地文件迁移到 Supabase `ai_knowledge_sources` 表。",
              "把问答脚本拆成可编辑条目，允许 admin 在后台更新语气与禁语。",
              "加入 PDF 上传与解析流程，让新资料能自动生成知识卡与建议问题。",
              "把 AI 回答日志写入 `ai_chat_sessions` / `ai_messages`，统计高频追问与错误回答。",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="text-sm leading-7 text-[var(--muted)]">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <Badge variant="neutral">核心知识卡</Badge>
          <div className="mt-4 space-y-4">
            {overview.knowledgeCards.map((card) => (
              <div key={card.title} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">{card.tag}</p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{card.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{card.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Badge variant="warning">客户追问脚本</Badge>
          <div className="mt-4 space-y-4">
            {overview.objectionScripts.map((script) => (
              <div key={script.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                <p className="font-semibold text-[var(--foreground)]">{script.objection}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{script.shortAnswer}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{script.talkTrack}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <AdminAiKnowledgeManager overview={overview} />
    </div>
  );
}
