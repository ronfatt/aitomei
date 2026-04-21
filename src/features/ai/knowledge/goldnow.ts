export interface GoldNowKnowledgeCard {
  id: string;
  title: string;
  detail: string;
  tag: string;
  sourceDocumentId: string | null;
  sequence: number;
}

export interface GoldNowKnowledgeSourceDocument {
  id: string;
  title: string;
  language: string;
  pages: number;
  scope: string;
  summary: string;
}

export interface GoldNowObjectionScript {
  id: string;
  objection: string;
  shortAnswer: string;
  talkTrack: string;
  nextMove: string;
  sequence: number;
}

export const goldnowKnowledgeSourceNote =
  "知识来源：已根据你提供的 GoldNow by Tomei 英文版与中文版 PDF 整理，用于 demo 回答。";

export const goldnowSuggestedPrompts = [
  "请用一句人话介绍 GoldNow 是什么",
  "GoldNow 为什么强调不是虚拟黄金？",
  "GoldNow 为什么说自己符合 Shariah？",
  "客户问最低要买多少，我该怎么讲？",
  "客户问能不能换实体黄金，我该怎么回答？",
  "帮我用 demo 口吻介绍 GoldNow 的信任基础",
] as const;

export const goldnowKnowledgeCards: GoldNowKnowledgeCard[] = [
  {
    id: "platform-positioning",
    tag: "核心定位",
    title: "安全且符合 Shariah 的数字黄金平台",
    detail:
      "GoldNow by Tomei 是一个安全、符合伊斯兰教法（Shariah）的数字黄金平台，强调真实黄金、数字化持有与随时兑换。",
    sourceDocumentId: "goldnow-cn-2026",
    sequence: 1,
  },
  {
    id: "gold-purity",
    tag: "产品事实",
    title: "999.9 纯度真实黄金",
    detail:
      "根据中文版资料，GoldNow 支持按所需数量购买 999.9 纯度黄金，并以克数累积持有。",
    sourceDocumentId: "goldnow-cn-2026",
    sequence: 2,
  },
  {
    id: "low-entry-point",
    tag: "低门槛",
    title: "从 0.1 克开始",
    detail:
      "用户可以从 0.1 克开始买入，不需要大额资金，重点是长期累积与纪律。",
    sourceDocumentId: "goldnow-en-2026",
    sequence: 3,
  },
  {
    id: "why-gold",
    tag: "黄金逻辑",
    title: "黄金重点是保值，不是投机",
    detail:
      "GoldNow 资料强调黄金是跨越时间的价值保存工具，尤其适合面对通胀、货币购买力下降与不确定环境。",
    sourceDocumentId: "goldnow-cn-2026",
    sequence: 4,
  },
  {
    id: "real-gold-backing",
    tag: "实体支持",
    title: "真实黄金支持，不是纯虚拟概念",
    detail:
      "资料强调数字黄金只有在真实黄金完全支持、透明且可兑换时才有意义；中文版写明每 1 克数字黄金对应 1 克真实实体黄金。",
    sourceDocumentId: "goldnow-cn-2026",
    sequence: 5,
  },
  {
    id: "physical-redemption",
    tag: "兑换能力",
    title: "可在 Tomei 门店兑换实体黄金",
    detail:
      "GoldNow 支持将数字黄金兑换为实体黄金，可在全国 Tomei 门店进行兑换与领取。",
    sourceDocumentId: "goldnow-en-2026",
    sequence: 6,
  },
  {
    id: "tomei-trust-foundation",
    tag: "信任基础",
    title: "Tomei 的实体基础设施支撑",
    detail:
      "资料强调 Tomei 是马来西亚上市黄金与珠宝集团，成立于 1968 年，拥有 50+ 年行业经验与 60+ 零售网点。",
    sourceDocumentId: "goldnow-en-2026",
    sequence: 7,
  },
  {
    id: "shariah-structure",
    tag: "Shariah",
    title: "无利息、无保本、无保证回报",
    detail:
      "GoldNow 的 Shariah 结构重点是：真实资产支持、无利息型收益、无保证回报、不做投机或杠杆式交易。",
    sourceDocumentId: "goldnow-en-2026",
    sequence: 8,
  },
  {
    id: "buy-flow",
    tag: "购买流程",
    title: "先 Top Up，再 Buy",
    detail:
      "英文版购买流程显示：先在 Top Up 菜单充值 GoldNow Points，再去 Buy 菜单按克数买入黄金。",
    sourceDocumentId: "goldnow-en-2026",
    sequence: 9,
  },
];

export const goldnowKnowledgeSourceDocuments: GoldNowKnowledgeSourceDocument[] = [
  {
    id: "goldnow-en-2026",
    title: "GoldNow by Tomei pdf.pdf",
    language: "English",
    pages: 15,
    scope: "产品定位、信任基础、买入流程、兑换流程、伙伴计划",
    summary:
      "英文版资料较完整，包含 Why Gold、Trust & Security、伙伴计划、购买流程与实体兑换流程。",
  },
  {
    id: "goldnow-cn-2026",
    title: "GoldNow-by-Tomei-CN_2026.pdf",
    language: "中文",
    pages: 11,
    scope: "核心卖点、Shariah 结构、0.1 克起购、实体兑换、推荐计划",
    summary:
      "中文版资料更适合中文 demo 口径，表达更直接，适合提炼给 AI 作为客户可理解的话术基础。",
  },
];

export const goldnowObjectionScripts: GoldNowObjectionScript[] = [
  {
    id: "is-this-real-gold",
    objection: "客户问：这是真的吗？还是只是 App 里的数字？",
    shortAnswer: "这是 GoldNow 最值得主动讲的地方，它强调每 1 克数字黄金对应 1 克真实实体黄金，而且可以兑换实体黄金。",
    talkTrack:
      "你可以这样讲：『它不是只有价格曲线的虚拟点数，而是背后有真实黄金支持。你在 App 里是数字化持有，但需要时可以到 Tomei 门店换成实体黄金。』",
    nextMove: "下一句建议主动补：Tomei 有实体门店与长期基础设施，不是纯线上概念。",
    sequence: 1,
  },
  {
    id: "is-this-mlm",
    objection: "客户问：这个是不是 MLM？",
    shortAnswer: "GoldNow 资料里确实有推荐与伙伴计划，但官方写法是合规、交易驱动、无保证收入，不能讲成拉人头承诺回报。",
    talkTrack:
      "你可以这样讲：『它有伙伴参与机制，但奖励是建立在真实黄金交易基础上，不是空口承诺收益；而且官方资料明确写了无保证收入、无投资回报承诺，并要求 KYC 与合规。』",
    nextMove: "如果客户继续追问，重点回到“真实交易、合规介绍、长期参与”这三个关键词。",
    sequence: 2,
  },
  {
    id: "how-much-to-start",
    objection: "客户问：我要很多钱才能开始吗？",
    shortAnswer: "不用，GoldNow 的重点之一就是门槛低，从 0.1 克就可以开始。",
    talkTrack:
      "你可以这样讲：『这不是一定要很大笔钱才玩得起的产品，0.1 克就能开始，更像是用比较轻松的方式慢慢累积真实黄金。』",
    nextMove: "下一句建议补：重点不是一次买很多，而是持续累积。",
    sequence: 3,
  },
  {
    id: "what-makes-it-shariah",
    objection: "客户问：为什么它可以说符合 Shariah？",
    shortAnswer: "因为它强调真实资产支持、没有利息型收益、没有保本或保证回报，也不是杠杆和投机结构。",
    talkTrack:
      "你可以这样讲：『它不是靠承诺回报来吸引人，而是用真实黄金所有权为基础，再加上无利息、无保证回报的结构，所以才会把 Shariah 放成核心原则。』",
    nextMove: "如果对方很在意宗教合规，补一句有权威伊斯兰教法顾问背书会更稳。",
    sequence: 4,
  },
  {
    id: "can-redeem-physical",
    objection: "客户问：买了以后真的能拿到实体黄金吗？",
    shortAnswer: "可以，GoldNow 最强的说服点之一就是数字持有、实体可兑。",
    talkTrack:
      "你可以这样讲：『你平时在 App 管理持有量，需要的时候可以选兑换重量、选 Tomei 门店，再去指定门店领取实体黄金。』",
    nextMove: "建议顺手补一句：领取时会做身份核验，这反而更像正规的实物交付流程。",
    sequence: 5,
  },
  {
    id: "is-there-guaranteed-return",
    objection: "客户问：这个会不会保证我赚？",
    shortAnswer: "官方资料没有把它包装成保证赚钱产品，反而一直强调黄金更适合做长期保值，而不是短线投机。",
    talkTrack:
      "你可以这样讲：『它的重点不是向你承诺回报，而是让你更容易拥有真实黄金；如果讲得更直一点，它卖的是资产持有逻辑，不是收益保证。』",
    nextMove: "把对话拉回“真实黄金、低门槛、可兑换”会更专业。",
    sequence: 6,
  },
  {
    id: "why-tomei",
    objection: "客户问：为什么是 Tomei，凭什么信它？",
    shortAnswer: "因为 GoldNow 背后不是一间纯 App 公司，而是有实体黄金零售、制造、供应链和门店网络支撑的 Tomei 集团。",
    talkTrack:
      "你可以这样讲：『Tomei 是马来西亚上市黄金与珠宝集团，成立于 1968 年，拥有 50+ 年经验和 60+ 零售网点，所以它的数字黄金不是脱离实体能力存在的。』",
    nextMove: "如果客户点头，就接“这也是为什么它能做实体兑换”这句。",
    sequence: 7,
  },
];
