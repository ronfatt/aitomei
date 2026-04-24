import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { productSampleVisuals } from "@/data/member-samples";
import { products } from "@/data/mock-data";
import { cn } from "@/lib/utils";

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const productPlaybook = {
  "numbered-collectible": {
    title: "编号藏品讲法",
    cues: ["强调唯一编号", "讲清会员档案绑定", "突出 provenance 记录", "避免直接用投机语境"],
    summary: "适合讲稀缺感、档案归属感和高端收藏语境，让客户感觉这是一件被认真记录的会员藏品。",
  },
  "gold-plaque": {
    title: "金章成交语境",
    cues: ["礼赠与纪念", "家族与传承", "证书与归档", "高端客户沟通"],
    summary: "重点不是重量本身，而是纪念性、体面感、证书状态和可被讲述的故事价值。",
  },
  jewelry: {
    title: "珠宝展示语境",
    cues: ["承诺与纪念", "预约咨询", "高预算客户", "陈列与故事先行"],
    summary: "更适合把情绪价值和陈列气质放在前面，帮助会员用更高级的方式推进咨询。",
  },
} as const;

const productArchiveProfiles: Record<
  string,
  {
    holder: string;
    accountTier: string;
    acquisition: string;
    ownershipMode: string;
    archiveStatus: string;
  }
> = {
  "product-1": {
    holder: "Nur Amirah",
    accountTier: "Legacy Signature",
    acquisition: "2026 年 4 月 12 日",
    ownershipMode: "私人会员档案持有",
    archiveStatus: "正常归档中",
  },
  "product-2": {
    holder: "Founder Preview Desk",
    accountTier: "Founder Circle Preview",
    acquisition: "2026 年 4 月 4 日",
    ownershipMode: "预留邀约档案",
    archiveStatus: "待补录故事档案",
  },
  "product-3": {
    holder: "Nur Amirah",
    accountTier: "Legacy Signature",
    acquisition: "2026 年 4 月 12 日",
    ownershipMode: "已申请收藏",
    archiveStatus: "证书齐备",
  },
  "product-4": {
    holder: "Family Heritage Desk",
    accountTier: "Family Heritage",
    acquisition: "2026 年 3 月 28 日",
    ownershipMode: "家族档案保留",
    archiveStatus: "支持补录",
  },
  "product-5": {
    holder: "Concierge Appointment Pool",
    accountTier: "Jewelry Showcase",
    acquisition: "2026 年 4 月 18 日",
    ownershipMode: "预约咨询陈列",
    archiveStatus: "珠宝档案已建立",
  },
  "product-6": {
    holder: "Private Client Showcase",
    accountTier: "High Value Client View",
    acquisition: "2026 年 4 月 9 日",
    ownershipMode: "门店陈列编号绑定",
    archiveStatus: "正常陈列",
  },
};

const productArchiveTimeline: Record<
  string,
  Array<{
    label: string;
    detail: string;
    when: string;
  }>
> = {
  "product-1": [
    { label: "编号创建", detail: "系统完成 AX-0018 编号注册并进入 Aurex Archive Series。", when: "2026 年 4 月 8 日" },
    { label: "会员档案绑定", detail: "已绑定 Nur Amirah 的私人会员档案，并开放详情页查看。", when: "2026 年 4 月 12 日" },
    { label: "确权签发", detail: "已生成 provenance 记录，可用于 demo 展示与讲解。", when: "2026 年 4 月 14 日" },
  ],
  "product-2": [
    { label: "Founder 预留", detail: "FC-0006 被保留在 Founder Circle Preview 名单中。", when: "2026 年 4 月 4 日" },
    { label: "审核中", detail: "等待补录故事档案与 private note。", when: "2026 年 4 月 11 日" },
    { label: "待激活", detail: "适合继续作为高端邀约用展示藏品。", when: "本周" },
  ],
  "product-3": [
    { label: "实物登记", detail: "金章实物编号 HP-018 已录入系统。", when: "2026 年 4 月 10 日" },
    { label: "证书归档", detail: "已同步实物证书与会员档案信息。", when: "2026 年 4 月 12 日" },
    { label: "升级联动", detail: "当前可衔接 Signature Legacy Pack 说明页。", when: "今天" },
  ],
  "product-4": [
    { label: "家族档案建立", detail: "Family Heritage Edition 建立了独立档案入口。", when: "2026 年 3 月 28 日" },
    { label: "证书签发", detail: "已签发证书并开放家族补录字段。", when: "2026 年 4 月 3 日" },
    { label: "礼赠跟进", detail: "当前适合作为节庆与纪念礼赠主推。", when: "本周" },
  ],
  "product-5": [
    { label: "珠宝建档", detail: "J-024 已进入 Signature Legacy Jewelry 档案。", when: "2026 年 4 月 18 日" },
    { label: "预约陈列", detail: "已开放私享推荐简报与预约沟通。", when: "2026 年 4 月 20 日" },
    { label: "咨询优先", detail: "适合导向纪念日与高预算客户咨询。", when: "今天" },
  ],
  "product-6": [
    { label: "门店绑定", detail: "J-011 与门店陈列编号完成绑定。", when: "2026 年 4 月 9 日" },
    { label: "高客单标签", detail: "被加入高价值客户沟通列表。", when: "2026 年 4 月 15 日" },
    { label: "主推中", detail: "当前处于节庆与 heritage styling 主推期。", when: "本周" },
  ],
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const playbook = productPlaybook[product.assetType];
  const visual = productSampleVisuals[product.id];
  const archiveProfile = productArchiveProfiles[product.id];
  const archiveTimeline = productArchiveTimeline[product.id];
  const holderInitials = getInitials(archiveProfile.holder);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <Card className="overflow-hidden border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-0">
          <div className="relative min-h-[680px]">
            <Image
              src={visual?.imageSrc ?? "/samples/product-celestial-pendant.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(214,177,94,0.16),transparent_18%),linear-gradient(135deg,rgba(5,4,3,0.14),rgba(5,4,3,0.7))]" />

            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              <Badge variant="default">{product.category}</Badge>
              <Badge variant="neutral">{product.collection}</Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-xl rounded-[30px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(11,10,8,0.86),rgba(11,10,8,0.62))] p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Aurex Product Archive</p>
                <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[0.95] text-[var(--foreground)] md:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{product.story}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[product.editionCode, product.provenanceLabel, product.availability].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[rgba(242,200,107,0.16)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.1),transparent_24%),linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">会员藏品档案</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
              独立编号、确权状态与会员权限都在同一页
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              这张详情页模拟真实会员可见的商品 / 藏品档案体验，适合 demo 时直接展示“每件商品都有自己的记录和故事”。
            </p>

            <div className="mt-6 grid gap-3">
              {[
                { label: "编号", value: product.editionCode },
                { label: "价格 / 方式", value: product.priceRange },
                { label: "材质说明", value: product.materialNote },
                { label: "会员权限", value: product.memberAccessLabel },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 font-semibold text-[var(--foreground)]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/member/content-studio/poster-generator`}
                className={cn(buttonVariants({ size: "lg" }), "px-6")}
              >
                申请收藏
              </Link>
              <Link
                href={`/member/ai-coach?prompt=${encodeURIComponent(`帮我写一段邀请客户预约顾问了解 ${product.name} 的话术`)}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "px-6")}
              >
                预约顾问
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={`/member/ai-coach?prompt=${encodeURIComponent(`帮我用高端会员语气介绍 ${product.name}，并解释它的编号与确权价值`)}`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
              >
                生成讲解话术
              </Link>
              <Link
                href="/samples/document-aurex-provenance-certificate.svg"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "px-6")}
              >
                下载证书样板
              </Link>
            </div>
          </Card>

          <Card className="border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Provenance Certificate</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  确权证书预览
                </h3>
              </div>
              <div className="rounded-full border border-[rgba(242,200,107,0.18)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--gold)]">
                {product.editionCode}
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-[rgba(242,200,107,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-3">
                <div className="relative min-h-[220px] overflow-hidden rounded-[20px]">
                  <Image
                    src="/samples/document-aurex-provenance-certificate.svg"
                    alt="Aurex provenance certificate sample"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Collection", value: product.collection },
                  { label: "Edition", value: product.editionCode },
                  { label: "Status", value: product.provenanceLabel },
                  { label: "Access", value: product.memberAccessLabel },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[24px] border border-[rgba(242,200,107,0.16)] bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">审批印章</p>
                    <Badge variant="default">Approved</Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(242,200,107,0.26)] bg-[radial-gradient(circle_at_center,rgba(242,200,107,0.18),rgba(242,200,107,0.04))] text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)] shadow-[0_0_30px_rgba(242,200,107,0.12)]">
                      Seal
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Aurex Archive Review Desk</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        已完成品牌侧档案审核，可在 demo 中作为后台审批完成状态展示。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">QR 编号区</p>
                    <span className="text-xs font-medium tracking-[0.18em] text-[var(--gold)]">{product.editionCode}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="grid h-20 w-20 grid-cols-5 gap-1 rounded-[18px] border border-white/8 bg-[rgba(8,7,6,0.88)] p-2">
                      {Array.from({ length: 25 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "rounded-[2px]",
                            (index + product.id.length) % 2 === 0 || index % 5 === 0
                              ? "bg-[var(--gold)]"
                              : "bg-white/12",
                          )}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Archive Scan Ready</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        用于模拟扫码进入商品 / 藏品详情的编号入口。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                此区块用于模拟会员可见的确权摘要、档案状态与后台审核逻辑。它强调 provenance、audit trail 与 member record，而不是投机型表述。
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{playbook.title}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
            这件商品更适合怎样被会员介绍
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{playbook.summary}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {playbook.cues.map((cue) => (
              <div
                key={cue}
                className="rounded-[22px] border border-[rgba(242,200,107,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm font-medium text-[var(--foreground)]"
              >
                {cue}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">会员 demo 说法</p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              {product.spotlight}
            </p>
          </div>
        </Card>

        <Card className="border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.08),transparent_20%),linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">下一步动作</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
            把这件商品接进你的会员工作流
          </h2>

          <div className="mt-5 space-y-3">
            {[
              "生成商品介绍话术",
              "生成高端黑金海报",
              "加入客户跟进脚本",
              "加入会员陈列推荐清单",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm text-[var(--foreground)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/member/content-studio/poster-generator" className={cn(buttonVariants({ size: "lg" }), "px-6")}>
              生成黑金海报
            </Link>
            <Link href="/member/products" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "px-6")}>
              返回商品区
            </Link>
            <Link href="/member/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}>
              返回会员首页
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(17,14,11,0.96),rgba(8,7,6,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">持有人档案</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
            当前持有与账户归属
          </h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-[rgba(242,200,107,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">持有人头像卡</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(242,200,107,0.22)] bg-[radial-gradient(circle_at_30%_30%,rgba(242,200,107,0.22),rgba(255,255,255,0.05))] text-2xl font-semibold text-[var(--foreground)] shadow-[0_0_30px_rgba(242,200,107,0.12)]">
                  {holderInitials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{archiveProfile.holder}</p>
                  <p className="mt-1 text-sm text-[var(--gold)]">{archiveProfile.accountTier}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    作为当前档案持有人展示，强化“这件商品已经进入账户系统”的感觉。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">购买凭证</p>
                <Badge variant="neutral">Receipt</Badge>
              </div>
              <div className="mt-4 rounded-[22px] border border-white/8 bg-[rgba(8,7,6,0.65)] p-4">
                <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Aurex Legacy Purchase Slip</span>
                  <span className="text-xs tracking-[0.18em] text-[var(--gold)]">{product.editionCode}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3 text-[var(--muted)]">
                    <span>Buyer</span>
                    <span className="text-[var(--foreground)]">{archiveProfile.holder}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[var(--muted)]">
                    <span>Date</span>
                    <span className="text-[var(--foreground)]">{archiveProfile.acquisition}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[var(--muted)]">
                    <span>Mode</span>
                    <span className="text-[var(--foreground)]">{archiveProfile.ownershipMode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[var(--muted)]">
                    <span>Status</span>
                    <span className="text-[var(--gold)]">{archiveProfile.archiveStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: "持有人", value: archiveProfile.holder },
              { label: "账户层级", value: archiveProfile.accountTier },
              { label: "取得时间", value: archiveProfile.acquisition },
              { label: "持有方式", value: archiveProfile.ownershipMode },
              { label: "档案状态", value: archiveProfile.archiveStatus },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-[rgba(242,200,107,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Demo 用法</p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              这一块很适合现场展示“每件商品不是单独图片，而是已经进入会员账户与档案系统”，会比普通珠宝目录更像真实平台。
            </p>
          </div>
        </Card>

        <Card className="border-[rgba(242,200,107,0.14)] bg-[radial-gradient(circle_at_top_right,rgba(242,200,107,0.08),transparent_20%),linear-gradient(180deg,rgba(19,16,13,0.98),rgba(8,7,6,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">档案轨迹</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
            购买、审核、补录与状态流转
          </h2>

          <div className="mt-6 space-y-4">
            {archiveTimeline.map((item: { label: string; detail: string; when: string }, index: number) => (
              <div key={`${item.label}-${item.when}`} className="relative rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-5">
                <div className="absolute left-5 top-6 h-3 w-3 rounded-full bg-[var(--gold)] shadow-[0_0_20px_rgba(242,200,107,0.45)]" />
                {index < archiveTimeline.length - 1 ? (
                  <div className="absolute bottom-[-18px] left-[30px] top-[38px] w-px bg-[linear-gradient(180deg,rgba(242,200,107,0.32),rgba(255,255,255,0.02))]" />
                ) : null}
                <div className="pl-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-[var(--foreground)]">{item.label}</p>
                    <Badge variant="neutral">{item.when}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
