import Link from "next/link";

import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { learningModules } from "@/data/mock-data";
import { memberPageContent } from "@/data/page-content";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.learning} />
      <section className="grid gap-4">
        {learningModules.map((module) => (
          <Link key={module.id} href={`/member/learning/quizzes/${module.quizId}`}>
            <Card className="p-6 transition hover:translate-y-[-2px]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <Badge variant="neutral">{module.category}</Badge>
                  <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{module.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{module.summary}</p>
                </div>
                <div className="grid gap-2 text-sm text-[var(--muted)] lg:min-w-64">
                  <p>{module.duration}</p>
                  <p>{module.completionRate} completion rate</p>
                  <p>Quiz route ready</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
