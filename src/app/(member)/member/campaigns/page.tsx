import Image from "next/image";

import { FeaturePage } from "@/components/app/feature-page";
import { MediaSampleCard } from "@/components/app/media-sample-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { campaignSampleAssets } from "@/data/member-samples";
import { campaigns } from "@/data/mock-data";
import { memberPageContent } from "@/data/page-content";

const campaignEditorialDetails: Record<
  string,
  {
    headline: string;
    direction: string;
    cues: string[];
    priority: string;
    imageSrc: string;
  }
> = {
  "raya-radiance": {
    headline: "以温暖送礼与家庭团聚语境，建立节庆黄金内容的高端亲切感。",
    direction:
      "这档活动更适合做“送礼有意义”“团圆场景佩戴”“节庆期间的金饰升级感”这类内容，不需要喊价，也不需要做太重的销售语气。",
    cues: ["家庭节庆", "送礼建议", "柔和金色视觉"],
    priority: "优先推荐给新会员做第一波海报与 caption 产出",
    imageSrc: "/samples/campaign-raya-glow.svg",
  },
  "bridal-signatures": {
    headline: "婚嫁主题要做得像情感叙事，不像硬销 catalogue。",
    direction:
      "会员在发布这类内容时，重点不是介绍规格，而是把承诺、见证与人生阶段感做出来，再自然带到产品推荐。",
    cues: ["承诺与纪念", "钻戒与婚嫁", "情绪价值内容"],
    priority: "适合高客单顾客、预约咨询与故事型短视频内容",
    imageSrc: "/samples/product-promise-ring.svg",
  },
  "daily-gold-story": {
    headline: "把教育内容做得更简洁、更可信，而不是像冷知识贴文。",
    direction:
      "这档活动适合用一句观点、一张视觉、一条轻教育 caption 的组合，让会员更容易形成每日更新节奏。",
    cues: ["黄金教育", "GoldNow 简报", "每日轻内容"],
    priority: "适合做连续打卡、轻量社媒曝光与 AI caption 辅助",
    imageSrc: "/samples/document-goldnow-brief.svg",
  },
};

export default function CampaignsPage() {
  const [heroCampaign, ...secondaryCampaigns] = campaigns;

  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.campaigns} />

      {heroCampaign ? (
        <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <Card className="overflow-hidden p-0">
            <div className="relative min-h-[520px]">
              <Image
                src={campaignEditorialDetails[heroCampaign.id]?.imageSrc ?? "/samples/campaign-raya-glow.svg"}
                alt={heroCampaign.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(27,23,20,0.18),rgba(27,23,20,0.72))]" />
              <div className="relative flex h-full min-h-[520px] flex-col justify-end p-6 lg:p-8">
                <Badge variant="default" className="w-fit">
                  {heroCampaign.theme}
                </Badge>
                <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[0.95] text-white lg:text-5xl">
                  {heroCampaign.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 lg:text-base">
                  {campaignEditorialDetails[heroCampaign.id]?.headline ?? heroCampaign.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(campaignEditorialDetails[heroCampaign.id]?.cues ?? []).map((cue) => (
                    <span
                      key={cue}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/88 backdrop-blur"
                    >
                      {cue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">活动方向</Badge>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                  {heroCampaign.activePeriod}
                </p>
              </div>
              <p className="mt-4 text-base leading-8 text-[var(--foreground)]">
                {campaignEditorialDetails[heroCampaign.id]?.direction ?? heroCampaign.summary}
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">本档优先动作</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{heroCampaign.cta}</p>
                </div>
                <div className="rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">会员建议</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                    {campaignEditorialDetails[heroCampaign.id]?.priority}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {(campaignSampleAssets[heroCampaign.id] ?? []).map((sample) => (
                <MediaSampleCard key={`${heroCampaign.id}-${sample.title}`} {...sample} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">活动内容编排</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            下面这些卡不是单纯活动列表，而是把每档活动拆成内容方向、推荐表达与样板素材，让会员一看就知道怎么发。
          </p>
        </div>
        <div className="grid gap-4">
          {secondaryCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden p-0">
              <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
                <div className="relative min-h-[320px]">
                  <Image
                    src={campaignEditorialDetails[campaign.id]?.imageSrc ?? "/samples/campaign-raya-glow.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 lg:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default">{campaign.theme}</Badge>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-strong)]">
                      {campaign.activePeriod}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                        {campaign.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{campaign.summary}</p>
                      <p className="mt-4 text-base leading-8 text-[var(--foreground)]">
                        {campaignEditorialDetails[campaign.id]?.direction}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(campaignEditorialDetails[campaign.id]?.cues ?? []).map((cue) => (
                          <span
                            key={cue}
                            className="rounded-full border border-[rgba(196,168,114,0.18)] bg-[rgba(250,241,226,0.82)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                          >
                            {cue}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">推荐 CTA</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{campaign.cta}</p>
                      </div>
                      <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">适合会员</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                          {campaignEditorialDetails[campaign.id]?.priority}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {(campaignSampleAssets[campaign.id] ?? []).map((sample) => (
                      <MediaSampleCard key={`${campaign.id}-${sample.title}`} {...sample} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
