import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { learningModules } from "@/data/mock-data";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const learningModule = learningModules.find((item) => item.quizId === quizId);

  if (!learningModule) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="测验详情"
        title={learningModule.title}
        description={learningModule.summary}
      />
      <Card className="p-6">
        <Badge variant="neutral">{learningModule.category}</Badge>
        <div className="mt-6 space-y-4">
          {[
            "如果只用一句话，你会怎样描述品牌的整体语气？",
            "这节课中提到的产品类别，最适合哪一种客户场景？",
            "什么样的社媒内容风格，最能让高端推广看起来专业而自然？",
          ].map((question, index) => (
            <div key={question} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                问题 {index + 1}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{question}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button>提交测验</Button>
        </div>
      </Card>
    </div>
  );
}
