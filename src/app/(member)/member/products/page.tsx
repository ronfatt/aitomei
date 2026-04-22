import Image from "next/image";

import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { productSampleVisuals } from "@/data/member-samples";
import { memberPageContent } from "@/data/page-content";
import { products } from "@/data/mock-data";

const productEditorialAngles: Record<
  string,
  {
    positioning: string;
    styling: string[];
    talkingPoint: string;
    clientFit: string;
  }
> = {
  "product-1": {
    positioning: "更适合做日常佩戴、轻奢送礼与可重复佩戴场景内容。",
    styling: ["Everyday gold", "Soft gifting", "Layered styling"],
    talkingPoint: "重点不是强调“便宜好入手”，而是讲它很容易融入每天的优雅穿搭。",
    clientFit: "适合第一次介绍金饰、送礼或轻内容输出的会员。",
  },
  "product-2": {
    positioning: "婚嫁与纪念日方向的主推单品，要把情绪价值放在产品信息前面。",
    styling: ["Bridal moment", "Promise story", "Milestone gift"],
    talkingPoint: "更适合讲承诺、见证与纪念，而不是单纯讲材质规格。",
    clientFit: "适合高预算客群、求婚场景与预约咨询导向内容。",
  },
  "product-3": {
    positioning: "节庆、家庭赠礼与传承表达是这类手镯内容的重点语境。",
    styling: ["Festive gold", "Family heritage", "Elegant gifting"],
    talkingPoint: "讲“传承感”和“送礼体面感”会比直接讲重量更有内容价值。",
    clientFit: "适合节庆 campaign、家庭内容与中高客单推荐。",
  },
};

export default function ProductsPage() {
  const [heroProduct, ...otherProducts] = products;

  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.products} />

      {heroProduct ? (
        <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <Card className="overflow-hidden p-0">
            <div className="relative min-h-[560px]">
              <Image
                src={productSampleVisuals[heroProduct.id]?.imageSrc ?? "/samples/product-celestial-pendant.svg"}
                alt={heroProduct.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,241,235,0.06),rgba(30,24,20,0.2))]" />
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <Badge variant="neutral">{heroProduct.category}</Badge>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[var(--foreground)]">
              {heroProduct.name}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
              {productEditorialAngles[heroProduct.id]?.positioning}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{heroProduct.story}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">价格带</p>
                <p className="mt-2 text-sm font-semibold text-[var(--gold-strong)]">{heroProduct.priceRange}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">推荐客群</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                  {productEditorialAngles[heroProduct.id]?.clientFit}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">内容方向</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(productEditorialAngles[heroProduct.id]?.styling ?? []).map((cue) => (
                  <span
                    key={cue}
                    className="rounded-full border border-[rgba(196,168,114,0.18)] bg-[rgba(250,241,226,0.82)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                  >
                    {cue}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">推荐说法</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                {productEditorialAngles[heroProduct.id]?.talkingPoint}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{heroProduct.spotlight}</p>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">产品内容编排</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            这里不只是商品卡，而是把每个产品拆成适合会员拿去讲、拿去发、拿去推荐的内容结构。
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {otherProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden p-0">
              <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]">
                <div className="relative min-h-[300px]">
                  <Image
                    src={productSampleVisuals[product.id]?.imageSrc ?? "/samples/product-celestial-pendant.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="neutral">{product.category}</Badge>
                    <p className="text-sm font-medium text-[var(--gold-strong)]">{product.priceRange}</p>
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.story}</p>
                  <p className="mt-4 text-base leading-8 text-[var(--foreground)]">
                    {productEditorialAngles[product.id]?.positioning}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(productEditorialAngles[product.id]?.styling ?? []).map((cue) => (
                      <span
                        key={cue}
                        className="rounded-full border border-[rgba(196,168,114,0.18)] bg-[rgba(250,241,226,0.82)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">推荐表达</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                        {productEditorialAngles[product.id]?.talkingPoint}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">内容价值</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{product.spotlight}</p>
                    </div>
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
