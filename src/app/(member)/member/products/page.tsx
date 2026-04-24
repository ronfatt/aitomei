import Link from "next/link";
import Image from "next/image";

import { FeaturePage } from "@/components/app/feature-page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { productSampleVisuals } from "@/data/member-samples";
import { memberPageContent } from "@/data/page-content";
import { products } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const productGroups = [
  {
    key: "numbered-collectible",
    title: "编号藏品",
    description: "保留唯一编号、会员档案与数字确权表达，呈现出更接近 NFT-like 的独特感，但仍然是 Aurex Legacy 的高端品牌语境。",
  },
  {
    key: "gold-plaque",
    title: "金章区",
    description: "把文化金章、礼赠场景、纪念价值和证书逻辑组合在一起，适合高端成交与会员资产表达。",
  },
  {
    key: "jewelry",
    title: "珠宝展示区",
    description: "展示高端珠宝本身的陈列气质、情绪价值和预约咨询感，而不只是列出规格参数。",
  },
] as const;

export default function ProductsPage() {
  const heroProduct = products[0];

  return (
    <div className="space-y-6">
      <FeaturePage content={memberPageContent.products} />

      {heroProduct ? (
        <section className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
          <Card className="overflow-hidden border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-0">
            <div className="relative min-h-[620px]">
              <Image
                src={productSampleVisuals[heroProduct.id]?.imageSrc ?? "/samples/product-celestial-pendant.svg"}
                alt={heroProduct.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(214,177,94,0.14),transparent_18%),linear-gradient(135deg,rgba(5,4,3,0.12),rgba(5,4,3,0.68))]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-xl rounded-[28px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(11,10,8,0.82),rgba(11,10,8,0.58))] p-6 backdrop-blur-sm">
                  <Badge variant="default">编号主藏品</Badge>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[0.95] text-[var(--foreground)] md:text-5xl">
                    {heroProduct.name}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{heroProduct.story}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[heroProduct.editionCode, heroProduct.provenanceLabel, heroProduct.memberAccessLabel].map((cue) => (
                      <span
                        key={cue}
                        className="rounded-full border border-[rgba(242,200,107,0.16)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.1),transparent_24%),linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))] p-6 lg:p-8">
            <Badge variant="warning">{heroProduct.category}</Badge>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[var(--foreground)]">
              Aurex 商品与藏品档案
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
              这里不只是商品列表，而是会员可见的私人藏品、金章与珠宝陈列系统。
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              每张商品卡都会展示唯一编号、确权状态、会员权限标签与陈列定位，方便你 demo 时更像真实的高端会员资产平台。
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { label: "唯一编号", value: heroProduct.editionCode },
                { label: "确权状态", value: heroProduct.provenanceLabel },
                { label: "会员权限", value: heroProduct.memberAccessLabel },
                { label: "参考价格", value: heroProduct.priceRange },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-[rgba(242,200,107,0.14)] bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[var(--foreground)]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">商品区亮点</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  "编号藏品带独立编码",
                  "金章区带证书状态",
                  "珠宝区带陈列定位",
                  "所有卡片走黑金高端系统",
                ].map((cue) => (
                  <div key={cue} className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--foreground)]">
                    {cue}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/member/products/${heroProduct.id}`} className={cn(buttonVariants({ size: "lg" }), "px-6")}>
                查看主藏品详情
              </Link>
              <Link href="/member/ai-coach?prompt=帮我用高端会员语气介绍这件编号藏品" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "px-6")}>
                生成讲解话术
              </Link>
            </div>
          </Card>
        </section>
      ) : null}

      {productGroups.map((group) => {
        const items = products.filter((product) => product.assetType === group.key);

        return (
          <section key={group.key} className="space-y-4">
            <div className="px-1">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{group.title}</h2>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-[var(--muted)]">{group.description}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-0"
                >
                  <div className="grid gap-0 md:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="relative min-h-[340px]">
                      <Image
                        src={productSampleVisuals[product.id]?.imageSrc ?? "/samples/product-celestial-pendant.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.04),rgba(5,4,3,0.46))]" />
                      <div className="absolute left-4 top-4 rounded-full border border-[rgba(242,200,107,0.16)] bg-[rgba(8,7,6,0.68)] px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-[var(--gold)]">
                        {product.editionCode}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={product.assetType === "numbered-collectible" ? "default" : product.assetType === "gold-plaque" ? "warning" : "neutral"}>
                          {product.category}
                        </Badge>
                        <p className="text-sm font-medium text-[var(--gold)]">{product.priceRange}</p>
                      </div>

                      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.story}</p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "系列", value: product.collection },
                          { label: "材质 / 备注", value: product.materialNote },
                          { label: "确权状态", value: product.provenanceLabel },
                          { label: "会员权限", value: product.memberAccessLabel },
                        ].map((item) => (
                          <div key={item.label} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-[24px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">适合怎么讲</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{product.spotlight}</p>
                        <p className="mt-3 text-sm text-[var(--gold)]">{product.availability}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link href={`/member/products/${product.id}`} className={cn(buttonVariants({ size: "default" }), "px-5")}>
                          查看详情
                        </Link>
                        <Link
                          href={`/member/ai-coach?prompt=${encodeURIComponent(`帮我用高端会员语气介绍 ${product.name}`)}`}
                          className={cn(buttonVariants({ variant: "secondary", size: "default" }), "px-5")}
                        >
                          生成话术
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Collection Wall</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            用更像收藏墙的方式快速浏览所有编号、金章与珠宝陈列编号，demo 时会更像真实会员藏品系统。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={`wall-${product.id}`}
              href={`/member/products/${product.id}`}
              className="group rounded-[26px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-5 transition hover:-translate-y-1 hover:border-[rgba(242,200,107,0.22)]"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="neutral">{product.category}</Badge>
                <span className="text-xs font-medium tracking-[0.18em] text-[var(--gold)]">{product.editionCode}</span>
              </div>
              <p className="mt-5 font-[family-name:var(--font-display)] text-2xl leading-[1.02] text-[var(--foreground)]">
                {product.name}
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{product.collection}</p>
              <div className="mt-5 rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">状态</p>
                <p className="mt-2 text-sm text-[var(--foreground)]">{product.provenanceLabel}</p>
              </div>
              <div className="mt-4 text-sm font-semibold text-[var(--gold)]">查看详情</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
