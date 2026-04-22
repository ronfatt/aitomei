import Link from "next/link";

import { FeaturePage } from "@/components/app/feature-page";
import { MediaSampleCard } from "@/components/app/media-sample-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { learningSampleResources } from "@/data/member-samples";
import { learningModules } from "@/data/mock-data";
import { memberPageContent } from "@/data/page-content";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.learning} />
      <section className="grid gap-4">
        {learningModules.map((module) => (
          <Link key={module.id} href={`/member/learning/quizzes/${module.quizId}`}>
            <Card className="border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(42,15,35,0.92),rgba(22,9,20,0.96))] p-6 shadow-[0_22px_70px_rgba(5,3,8,0.26)] transition hover:translate-y-[-2px]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <Badge variant="neutral">{module.category}</Badge>
                  <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{module.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{module.summary}</p>
                </div>
                <div className="grid gap-2 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[var(--muted)] lg:min-w-64">
                  <p>{module.duration}</p>
                  <p>完成率 {module.completionRate}</p>
                  <p>测验入口已准备</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>
      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">课程附件与资料样板</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            学习中心除了课程卡，也需要看起来真的有讲义、短视频与复习资料可供使用。
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {learningSampleResources.map((sample) => (
            <MediaSampleCard key={sample.title} {...sample} />
          ))}
        </div>
      </section>
    </div>
  );
}
