import type { MediaSampleCardProps } from "@/components/app/media-sample-card";

export const assetLibrarySamples: MediaSampleCardProps[] = [
  {
    kind: "image",
    title: "Raya 臻彩金辉会员海报",
    description: "已完成输出的节庆版样板海报，适合直接放进素材库做“最近生成内容”展示。",
    imageSrc: "/samples/campaign-raya-glow.svg",
    badge: "海报 · 已交付",
    meta: "1080 × 1350",
  },
  {
    kind: "video",
    title: "婚嫁故事短视频样板",
    description: "作为已排队或已交付的视频样板封面，用来展示短视频请求结果与风格方向。",
    imageSrc: "/samples/video-bridal-storyboard.svg",
    badge: "视频 · 排队中",
    meta: "18 秒",
    tone: "dark",
  },
  {
    kind: "document",
    title: "Aurex Legacy 销售话术资料卡",
    description: "用于模拟可回看资料、品牌 brief、活动指南等文件类素材，方便 demo 时看起来更完整。",
    imageSrc: "/samples/document-goldnow-brief.svg",
    badge: "资料 · 已保存",
    meta: "PDF 简报",
  },
];

export const contentStudioSamples: MediaSampleCardProps[] = [
  {
    kind: "image",
    title: "品牌活动视觉样板",
    description: "给内容创作中心加入一个标准化视觉样板区，让会员知道官方海报会长什么样。",
    imageSrc: "/samples/campaign-raya-glow.svg",
    badge: "活动海报",
    meta: "品牌安全模板",
  },
  {
    kind: "video",
    title: "官方短视频片头样板",
    description: "展示模板式视频工作流的结果感，不需要自由编辑，也能看起来有真实内容。",
    imageSrc: "/samples/video-bridal-storyboard.svg",
    badge: "视频模板",
    meta: "竖版短片",
    tone: "dark",
  },
  {
    kind: "document",
    title: "发布用文案资料单",
    description: "把 caption direction、campaign hashtag、posting cue 等作为资料型卡片一起放进来。",
    imageSrc: "/samples/document-goldnow-brief.svg",
    badge: "内容简报",
    meta: "内部使用",
  },
];

export const campaignSampleAssets: Record<string, MediaSampleCardProps[]> = {
  "heritage-launch": [
    {
      kind: "image",
      title: "Raya 主视觉样板",
      description: "适合社媒首图、节庆主题海报与会员转发素材。",
      imageSrc: "/samples/campaign-raya-glow.svg",
      badge: "主视觉",
      meta: "活动主图",
    },
    {
      kind: "document",
      title: "活动简报摘要",
      description: "用来展示活动说明、贴文角度和 CTA 指引。",
      imageSrc: "/samples/document-goldnow-brief.svg",
      badge: "简报",
      meta: "3 页",
    },
  ],
  "founder-circle-preview": [
    {
      kind: "video",
      title: "婚嫁情境短视频样板",
      description: "配合承诺与见证主题，适合拿来 demo 短视频工作流。",
      imageSrc: "/samples/video-bridal-storyboard.svg",
      badge: "短视频",
      meta: "故事剪辑",
      tone: "dark",
    },
    {
      kind: "image",
      title: "求婚推荐视觉板",
      description: "用于展示婚嫁主题内容也可以有高质感封面。",
      imageSrc: "/samples/product-promise-ring.svg",
      badge: "氛围板",
      meta: "婚嫁主题",
    },
  ],
  "digital-provenance-story": [
    {
      kind: "document",
      title: "数字确权教育资料卡",
      description: "适合资讯式、教育式内容方向的 posting brief。",
      imageSrc: "/samples/document-goldnow-brief.svg",
      badge: "教育简报",
      meta: "每日贴文",
    },
    {
      kind: "image",
      title: "黄金内容视觉样板",
      description: "把“教育内容也可以很高级”这件事直接可视化出来。",
      imageSrc: "/samples/product-celestial-pendant.svg",
      badge: "视觉样板",
      meta: "黄金主题",
    },
  ],
};

export const newsSampleResources: MediaSampleCardProps[] = [
  {
    kind: "document",
    title: "Aurex Legacy 产品资料摘要",
    description: "适合放在资讯页侧边，作为“本周资料更新”样板文件卡。",
    imageSrc: "/samples/document-goldnow-brief.svg",
    badge: "参考 PDF",
    meta: "今日更新",
  },
  {
    kind: "video",
    title: "门店活动视频封面样板",
    description: "用于说明新活动上线时，资讯页也会出现相关视频素材预览。",
    imageSrc: "/samples/video-bridal-storyboard.svg",
    badge: "更新短片",
    meta: "20 秒",
    tone: "dark",
  },
];

export const productSampleVisuals: Record<string, MediaSampleCardProps> = {
  "product-1": {
    kind: "image",
    title: "Legacy Provenance Piece 样板图",
    description: "用于表现编号藏品和数字确权卡的陈列感，不直接叫 NFT，但保留独立编号的独特性。",
    imageSrc: "/samples/product-celestial-pendant.svg",
    badge: "产品视觉",
    meta: "编号藏品",
  },
  "product-2": {
    kind: "image",
    title: "Founder Archive Piece 样板图",
    description: "用更高端、更私享的方式展示 founder 级编号藏品的气质。",
    imageSrc: "/samples/product-promise-ring.svg",
    badge: "产品视觉",
    meta: "私享档案",
  },
  "product-3": {
    kind: "image",
    title: "Heritage Gold Plaque 样板图",
    description: "用于文化金章主推页，突出编号、证书和礼赠场景。",
    imageSrc: "/samples/product-heritage-bangle.svg",
    badge: "产品视觉",
    meta: "金章区",
  },
  "product-4": {
    kind: "image",
    title: "Family Legacy Gold Plaque 样板图",
    description: "适合家族纪念和高端礼赠的金章陈列视觉。",
    imageSrc: "/samples/product-celestial-pendant.svg",
    badge: "产品视觉",
    meta: "家族金章",
  },
  "product-5": {
    kind: "image",
    title: "Signature Emerald Pendant 样板图",
    description: "用于高端珠宝区，补足会员端的真实珠宝展示感。",
    imageSrc: "/samples/product-promise-ring.svg",
    badge: "产品视觉",
    meta: "珠宝展示",
  },
  "product-6": {
    kind: "image",
    title: "Imperial Heritage Bangle 样板图",
    description: "用于高客单珠宝展示，兼顾节庆与家族传承语境。",
    imageSrc: "/samples/product-heritage-bangle.svg",
    badge: "产品视觉",
    meta: "珠宝展示",
  },
};

export const learningSampleResources: MediaSampleCardProps[] = [
  {
    kind: "document",
    title: "品牌表达手册样板",
    description: "放在学习中心作为课后资料，让页面更像真实培训平台。",
    imageSrc: "/samples/document-goldnow-brief.svg",
    badge: "课程讲义",
    meta: "PDF 讲义",
  },
  {
    kind: "video",
    title: "教学视频封面样板",
    description: "用于模拟课程短视频或导览视频，不必等真实视频上线才有内容感。",
    imageSrc: "/samples/video-bridal-storyboard.svg",
    badge: "教学视频",
    meta: "8 分钟",
    tone: "dark",
  },
];
