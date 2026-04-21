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
        eyebrow="Quiz Detail"
        title={learningModule.title}
        description={learningModule.summary}
      />
      <Card className="p-6">
        <Badge variant="neutral">{learningModule.category}</Badge>
        <div className="mt-6 space-y-4">
          {[
            "How would you describe the brand tone in one sentence?",
            "Which customer occasion best fits the product category highlighted in this lesson?",
            "What kind of social content style keeps luxury promotion feeling professional?",
          ].map((question, index) => (
            <div key={question} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Question {index + 1}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{question}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button>Submit quiz attempt</Button>
        </div>
      </Card>
    </div>
  );
}
