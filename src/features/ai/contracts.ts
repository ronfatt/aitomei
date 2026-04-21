import { getAiCoachKnowledgeBundle } from "@/features/ai/repository";

export interface AiCoachRequest {
  memberId: string;
  message: string;
  context: "brand" | "product" | "campaign" | "mission";
}

export interface AiCoachResponse {
  reply: string;
  suggestedActions: string[];
  provider?: "mock" | "openai";
  model?: string;
  notice?: string | null;
}

export interface AiConciergeInsight {
  title: string;
  detail: string;
  type: "campaign" | "news" | "mission" | "market";
}

type GoldNowTopic =
  | "overview"
  | "why_gold"
  | "digital_gold"
  | "trust"
  | "shariah"
  | "entry"
  | "buy"
  | "redeem"
  | "partner"
  | "mlm"
  | "returns";

function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

function includesAny(message: string, keywords: string[]) {
  return keywords.some((keyword) => message.includes(keyword));
}

function wantsDemoScript(message: string) {
  return includesAny(message, ["demo", "演示", "怎么讲", "怎么介绍", "话术", "客户问", "人话"]);
}

function detectTopic(message: string): GoldNowTopic {
  if (includesAny(message, ["shariah", "伊斯兰", "教法", "halal", "合规"])) {
    return "shariah";
  }

  if (includesAny(message, ["兑换", "redeem", "实体", "门店", "shop", "outlet", "领取"])) {
    return "redeem";
  }

  if (includesAny(message, ["怎么买", "购买", "buy", "top up", "充值", "gram", "克", "步骤"])) {
    return "buy";
  }

  if (includesAny(message, ["0.1", "最低", "入门", "start from", "门槛", "多少钱可以开始"])) {
    return "entry";
  }

  if (includesAny(message, ["推荐", "伙伴", "partner", "referral", "奖励", "佣金"])) {
    return "partner";
  }

  if (includesAny(message, ["mlm", "multi level", "拉人头", "金字塔", "传销", "downline", "upline"])) {
    return "mlm";
  }

  if (includesAny(message, ["回报", "收益", "return", "speculation", "投机", "保本", "稳赚"])) {
    return "returns";
  }

  if (includesAny(message, ["安全", "真实", "真的吗", "backed", "虚拟", "trust", "上市", "tomei"])) {
    return "trust";
  }

  if (includesAny(message, ["数字黄金", "digital gold", "为什么数字黄金", "优势"])) {
    return "digital_gold";
  }

  if (includesAny(message, ["为什么黄金", "why gold", "保值", "抗通胀", "inflation"])) {
    return "why_gold";
  }

  return "overview";
}

function findScript(
  scriptId: string,
  scripts: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>["objectionScripts"],
) {
  return scripts.find((script) => script.id === scriptId);
}

function findCard(
  cardId: string,
  cards: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>["knowledgeCards"],
) {
  return cards.find((card) => card.id === cardId);
}

function buildScriptReply(
  script:
    | Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>["objectionScripts"][number]
    | undefined,
  fallback: string[],
) {
  if (!script) {
    return fallback.join("\n\n");
  }

  return [script.shortAnswer, script.talkTrack, script.nextMove].join("\n\n");
}

function buildReply(
  message: string,
  topic: GoldNowTopic,
  knowledge: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>,
) {
  const demoMode = wantsDemoScript(message);
  const { knowledgeCards, objectionScripts } = knowledge;
  const overviewCard = findCard("platform-positioning", knowledgeCards);
  const purityCard = findCard("gold-purity", knowledgeCards);
  const entryCard = findCard("low-entry-point", knowledgeCards);
  const whyGoldCard = findCard("why-gold", knowledgeCards);
  const backingCard = findCard("real-gold-backing", knowledgeCards);
  const redemptionCard = findCard("physical-redemption", knowledgeCards);
  const trustCard = findCard("tomei-trust-foundation", knowledgeCards);
  const shariahCard = findCard("shariah-structure", knowledgeCards);
  const buyFlowCard = findCard("buy-flow", knowledgeCards);

  switch (topic) {
    case "overview":
      return [
        "可以，GoldNow 其实很好讲。",
        `一句人话版是：${overviewCard?.detail ?? "GoldNow by Tomei 是一个安全、符合 Shariah 的数字黄金平台。"}${purityCard ? ` 另外它也强调 ${purityCard.detail}` : ""}`,
        `${backingCard?.detail ?? "它不是单纯的虚拟数字点数。"}${redemptionCard ? ` ${redemptionCard.detail}` : ""}`,
        demoMode
          ? "你 demo 时可以直接接这一句：『它把黄金这件事做得更轻松，但底层还是实物黄金，不是空的概念。』"
          : `如果客户继续追问，我建议你下一句就带出『${entryCard?.title ?? "从 0.1 克就能开始"}』，这个记忆点很强。`,
      ].join("\n\n");

    case "why_gold":
      return [
        "这个问题很关键，而且官方资料讲得很清楚。",
        whyGoldCard?.detail ??
          "GoldNow 的资料把黄金定位成“保值资产”，不是投机工具。它强调黄金在通胀、货币贬值、地缘政治紧张或市场不确定时，更能守住购买力和长期价值。",
        "简单说，现金会被通胀慢慢吃掉，但黄金更像是把价值存下来。官方原话的核心意思就是：黄金不是拿来赌短线的，是拿来保存真实财富的。",
        demoMode
          ? "你可以这样对客户讲：『它不是叫你炒黄金，而是让你更容易用小额方式慢慢累积真实资产。』"
          : "如果你愿意，我下一轮可以顺手帮你把这段整理成 15 秒 demo 口播稿。",
      ].join("\n\n");

    case "digital_gold":
      return [
        "数字黄金会成立，前提不是“数字化”这三个字，而是背后有没有真黄金。",
        `${entryCard?.detail ?? "GoldNow 的资料强调，数字黄金之所以越来越受欢迎，是因为它可以小额开始、买卖更方便、能长期慢慢累积。"}${redemptionCard ? ` ${redemptionCard.detail}` : ""}`,
        backingCard?.detail ?? "官方也很明确地说了，数字黄金只有在完全有实物支持、透明、可兑换时才有意义。",
        demoMode
          ? "你 demo 时可以这样讲：『它把黄金变得更好入手，但不会把黄金变成空的概念。』"
          : "我建议你把“方便”跟“真实支持”一起讲，这样客户会比较安心。",
      ].join("\n\n");

    case "trust":
      return buildScriptReply(findScript("is-this-real-gold", objectionScripts), [
        "如果客户担心真不真，这里反而是 GoldNow 最好讲的地方。",
        backingCard?.detail ?? "官方资料写得很直白：每 1 克数字黄金，对应 1 克真实实体黄金。",
        trustCard?.detail ??
          "再加上 Tomei 本身是马来西亚上市黄金与珠宝集团，成立于 1968 年，有 50+ 年行业经验和 60+ 零售网点。",
      ]);

    case "shariah":
      return buildScriptReply(findScript("what-makes-it-shariah", objectionScripts), [
        "这个点我帮你讲得直接一点。",
        shariahCard?.detail ??
          "GoldNow 强调自己符合 Shariah，核心不是一句标签，而是结构本身：真实资产支持、没有利息型收益、没有保本承诺、没有保证回报，也不是投机或杠杆式交易。",
        demoMode
          ? "你 demo 时可以这样讲：『它的重点不是承诺你赚多少，而是让你用合规、透明、真实资产支持的方式持有黄金。』"
          : "如果客户对 Shariah 很重视，你可以先讲“真实资产 + 无利息 + 无保证回报”这三个关键词。",
      ]);

    case "entry":
      return buildScriptReply(findScript("how-much-to-start", objectionScripts), [
        "这个很好回答，记住一个数字就够了：0.1 克。",
        entryCard?.detail ??
          "GoldNow 支持从 0.1 克开始，意思是客户不用一次准备很大笔资金，也可以先开始持有真实黄金。",
        demoMode
          ? "你可以这样讲：『它很适合想开始持有黄金、但不想一上来压力太大的人。』"
          : "建议你把“低门槛”跟“长期累积”一起说，这样客户不会误会成短线投机产品。",
      ]);

    case "buy":
      return [
        "购买流程我帮你整理成 demo 可直接讲的版本。",
        buyFlowCard?.detail ??
          "官方英文版的流程是：先到 Top Up 菜单充值 GoldNow Points，金额会从银行账户扣除；充值完成后，再到 Buy 菜单，按你想买的克数输入数量，然后确认购买。",
        `重点记忆点有两个：第一，${entryCard?.title ?? "最低可以从 0.1 克开始"}；第二，是按克数累积黄金，不需要一次买很大。`,
        demoMode
          ? "你可以现场边讲边演示：『先充值，再按克数买黄金，流程很直观。』"
          : "如果你要，我下一步可以顺手帮你把购买流程写成页面里的“AI 推荐回答模板”。",
      ].join("\n\n");

    case "redeem":
      return buildScriptReply(findScript("can-redeem-physical", objectionScripts), [
        "可以换，而且这正是 GoldNow 很有说服力的一点。",
        redemptionCard?.detail ??
          "官方资料强调，GoldNow 不是“只能看不能拿”的虚拟黄金，用户可以兑换实体黄金。",
        demoMode
          ? "你可以直接对客户说：『今天是数字化持有，需要时就可以实物化。』"
          : "建议你 demo 时一定主动讲“全国 Tomei 门店可兑换”，这会让安心感明显上升。",
      ]);

    case "partner":
      return buildScriptReply(findScript("is-this-mlm", objectionScripts), [
        "这个部分要讲得稳一点，不要讲成“保证赚钱”。",
        "GoldNow 的资料把它定义成推荐与伙伴计划，而且核心原则写得很明确：无保证收入、无投资回报承诺、奖励基于真实交易、并且需要完成 KYC 与合规要求。",
        demoMode
          ? "你可以这样讲：『它重视真实交易和长期参与，不是拿高回报口号去推动加入。』"
          : "如果客户要问伙伴层级和奖励比例，我可以下一步把那一页单独整理成 AI 专用知识卡。",
      ]);

    case "mlm":
      return buildScriptReply(findScript("is-this-mlm", objectionScripts), [
        "这个问题你要回答得非常干净。",
        "就 GoldNow 资料本身来看，它有推荐与伙伴计划，但官方强调的是基于真实黄金交易的奖励机制。",
        demoMode
          ? "你可以这样对客户讲：『它有伙伴机制，但官方定位是合规、交易驱动、长期参与，不是靠拉人头承诺收入。』"
          : "如果场景敏感，建议你少讲层级，多讲“真实交易、KYC、无保证回报”。",
      ]);

    case "returns":
      return buildScriptReply(findScript("is-there-guaranteed-return", objectionScripts), [
        "这个我建议你回答得很克制，反而更可信。",
        whyGoldCard?.detail ??
          "GoldNow 的官方资料没有把它包装成“稳赚”或“高回报”产品，反而强调黄金更适合做长期保值。",
        demoMode
          ? "你可以直接说：『这个产品重点不是短期收益承诺，而是让用户更容易拥有真实黄金。』"
          : "如果你担心客户一直追问收益，我建议把回答拉回“真实黄金、低门槛、可兑换”这三个事实上。",
      ]);
  }
}

function getSuggestedActions(topic: GoldNowTopic) {
  switch (topic) {
    case "buy":
      return ["演示 Top Up 与 Buy 流程", "强调 0.1 克起购", "补一句按克数长期累积"];
    case "entry":
      return ["强调 0.1 克起购", "补一句长期累积", "避免讲短线收益"];
    case "redeem":
      return ["打开兑换流程说明", "强调可到 Tomei 门店领取", "提醒需带身份资料核验"];
    case "shariah":
      return ["先说真实资产支持", "再说无利息与无保证回报", "补一句权威顾问背书"];
    case "trust":
      return ["强调 1 克对 1 克实体黄金", "提到 Tomei 上市集团背景", "补充 60+ 门店网络"];
    case "partner":
      return ["先讲合规原则", "避免讲保证收入", "如被追问再展开伙伴机制"];
    case "mlm":
      return ["先避免绝对化口号", "强调真实交易与 KYC", "主动说明无保证收入承诺"];
    default:
      return ["先讲一句人话定义", "再讲真实黄金支持", "最后补 0.1 克与实体兑换"];
  }
}

export function getAiCoachSuggestedActionsForMessage(message: string) {
  const normalizedMessage = normalizeMessage(message);
  const topic = detectTopic(normalizedMessage);
  return getSuggestedActions(topic);
}

// Placeholder integration surface for future LLM orchestration.
export async function mockAiCoach(request: AiCoachRequest): Promise<AiCoachResponse> {
  const normalizedMessage = normalizeMessage(request.message);
  const topic = detectTopic(normalizedMessage || request.context);
  const knowledge = await getAiCoachKnowledgeBundle();

  return {
    reply: buildReply(normalizedMessage, topic, knowledge),
    suggestedActions: getSuggestedActions(topic),
    provider: "mock",
    model: "local-demo",
    notice: "未检测到 OpenAI 连接，当前使用本地 demo 知识回答。",
  };
}
