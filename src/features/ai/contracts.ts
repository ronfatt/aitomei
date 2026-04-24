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

type AurexTopic =
  | "overview"
  | "positioning"
  | "membership"
  | "provenance"
  | "product_ladder"
  | "rwa"
  | "nasdaq"
  | "mlm"
  | "crypto"
  | "business_model";

function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

function includesAny(message: string, keywords: string[]) {
  return keywords.some((keyword) => message.includes(keyword));
}

function wantsDemoScript(message: string) {
  return includesAny(message, ["demo", "演示", "怎么讲", "怎么介绍", "话术", "客户问", "人话", "现场"]);
}

function detectTopic(message: string): AurexTopic {
  if (includesAny(message, ["mlm", "拉人头", "传销", "downline", "upline", "会员盘", "招募"])) {
    return "mlm";
  }

  if (includesAny(message, ["crypto", "nft", "发币", "token", "链上项目", "币圈"])) {
    return "crypto";
  }

  if (includesAny(message, ["rwa", "收益", "升值", "投资", "证券化", "回报", "retail promise"])) {
    return "rwa";
  }

  if (includesAny(message, ["纳斯达克", "nasdaq", "上市", "ipo", "资本市场", "governance"])) {
    return "nasdaq";
  }

  if (includesAny(message, ["证书", "确权", "溯源", "provenance", "audit", "编号", "ownership"])) {
    return "provenance";
  }

  if (includesAny(message, ["会员", "黑卡", "privilege", "club", "权益账户", "礼遇", "founder circle"])) {
    return "membership";
  }

  if (includesAny(message, ["entry", "core", "premium", "elite", "black card", "产品分层", "套餐", "pack"])) {
    return "product_ladder";
  }

  if (includesAny(message, ["商业模式", "收入", "会销", "年费", "授权", "business model"])) {
    return "business_model";
  }

  if (includesAny(message, ["定位", "是什么", "一句话", "普通珠宝", "为什么不一样", "luxury consumer asset"])) {
    return "positioning";
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
  topic: AurexTopic,
  knowledge: Awaited<ReturnType<typeof getAiCoachKnowledgeBundle>>,
) {
  const demoMode = wantsDemoScript(message);
  const { knowledgeCards, objectionScripts } = knowledge;
  const positioningCard = findCard("platform-positioning", knowledgeCards);
  const threeLayerCard = findCard("three-layer-model", knowledgeCards);
  const plaqueCard = findCard("heritage-gold-plaque", knowledgeCards);
  const privilegeCard = findCard("privilege-account", knowledgeCards);
  const provenanceCard = findCard("digital-provenance", knowledgeCards);
  const clubCard = findCard("membership-club", knowledgeCards);
  const ladderCard = findCard("product-ladder", knowledgeCards);
  const capitalCard = findCard("global-capital-language", knowledgeCards);
  const rwaCard = findCard("rwa-direction", knowledgeCards);
  const nasdaqCard = findCard("nasdaq-roadmap", knowledgeCards);
  const moatCard = findCard("brand-moat", knowledgeCards);

  switch (topic) {
    case "overview":
      return [
        "可以，Aurex Legacy 最适合先讲成一个高端品牌系统，而不是单一产品。",
        positioningCard?.detail ??
          "Aurex Legacy 不是单纯卖珠宝，而是把高端文化金章、珠宝消费权益、数字确权证书和全球会员网络做成一个可持续经营的高端消费资产系统。",
        threeLayerCard?.detail ??
          "它最核心的结构，是实物层、会员层、数字层一起运作，而不是只有漂亮的品牌外观。",
        demoMode
          ? "你 demo 时可以直接这样讲：『它卖的不只是珠宝作品，而是一套把产品、会员身份和数字档案串起来的高端关系系统。』"
          : "如果客户继续追问，我建议你下一句接会员权益账户或数字确权证书，这两个记忆点最强。",
      ].join("\n\n");

    case "positioning":
      return buildScriptReply(findScript("what-is-aurex", objectionScripts), [
        "一句人话版，我帮你收得更清楚一点。",
        positioningCard?.detail ??
          "Aurex Legacy 可以理解成一个把高端珠宝、会员权益和数字确权做成长期关系的 luxury heritage platform。",
        demoMode
          ? "你可以接一句：『它不只是在卖一件首饰，而是在建立一个客户愿意长期留在里面的品牌世界。』"
          : "如果你要，我下一轮可以顺手把这段压成 15 秒口播稿。",
      ]);

    case "membership":
      return buildScriptReply(findScript("why-membership-account", objectionScripts), [
        "会员逻辑其实是 Aurex Legacy 很值得主动讲的地方。",
        privilegeCard?.detail ??
          "Jewelry Privilege Account 的重点，是把消费、礼遇、升级和服务变成长期关系，而不是一次性成交。",
        clubCard?.detail ??
          "再往上接，就是 Global Membership Club，让客户看到它还有活动、定制、新品优先权和跨区域权益。",
        demoMode
          ? "你 demo 时可以这样讲：『它不是卖完就结束，而是从成交开始，把客户带进一个更高端的会员体系。』"
          : "建议你把 Privilege Account 和 Global Membership Club 连着讲，层次会更完整。",
      ]);

    case "provenance":
      return buildScriptReply(findScript("what-is-provenance", objectionScripts), [
        "数字确权这件事，重点不是科技名词，而是高级感、信任感和长期记录能力。",
        provenanceCard?.detail ??
          "每件产品都绑定数字确权证书，用于溯源、防伪、所有权记录和未来资产接口。",
        demoMode
          ? "你可以这样讲：『它让每件作品不只是“有货号”，而是有来历、有故事、有编号、有档案。』"
          : "建议你多用 provenance、ownership record、audit trail 这几个词，会更稳。",
      ]);

    case "product_ladder":
      return [
        "Aurex Legacy 的产品层级不是堆 SKU，而是在设计客户升级路径。",
        ladderCard?.detail ??
          "它从 Heritage Access Pack 一路走到 Founder Circle / Black Card，用来承接首购、升级、家族传承和顶层客户关系。",
        plaqueCard?.detail ??
          "如果你想找最容易切入的产品入口，可以先从 Heritage Gold Plaque 讲起，因为它很适合礼赠、纪念和身份表达场景。",
        demoMode
          ? "你可以现场这样讲：『我们不是只有一件产品，而是从入门、核心到黑卡圈层，客户会一路往上走。』"
          : "如果你要，我下一步可以帮你把四层 pack 变成一套销售对比话术。",
      ].join("\n\n");

    case "rwa":
      return buildScriptReply(findScript("returns-and-rwa", objectionScripts), [
        "这个问题一定要讲得克制，反而更有专业感。",
        rwaCard?.detail ??
          "RWA 方向是未来合规基础设施能力，包括确权、登记、审计和兼容接口，不是当前零售承诺。",
        capitalCard?.detail ??
          "它的价值在于让品牌同时拥有 Luxury Brand、Membership Economy、Asset Digitization 和 RWA Optionality 这四条更长期的叙事语言。",
        demoMode
          ? "你可以直接说：『我们今天讲的不是收益承诺，而是一个未来更容易被资本市场理解的基础设施方向。』"
          : "建议你把回答锁在 provenance、audit trail、future readiness 这三个表达里。",
      ]);

    case "nasdaq":
      return buildScriptReply(findScript("why-nasdaq-story", objectionScripts), [
        "纳斯达克路线图在这里更像治理升级路径，不是销售口号。",
        nasdaqCard?.detail ??
          "它分成三阶段：先做品牌与收入基础，再做区域扩张与治理升级，最后才谈 capital market readiness。",
        demoMode
          ? "你可以这样讲：『这说明品牌想走长期路线，但今天给客户看的重点，还是产品、会员礼遇和信任基础。』"
          : "建议你把这段放在客户已经认可品牌定位之后再讲，不要一上来就讲资本故事。",
      ]);

    case "mlm":
      return buildScriptReply(findScript("is-this-mlm", objectionScripts), [
        "这个问题你要回得很干净。",
        "Aurex Legacy 的定位是高端产品、会员礼遇和数字确权平台，不是 downline / upline 的招募结算系统。",
        demoMode
          ? "你可以这样讲：『它不是靠拉人头赚钱，而是靠真实产品、会员关系和品牌服务去建立长期价值。』"
          : "如果场景敏感，就少讲复杂结构，多讲品牌、产品和会员服务。",
      ]);

    case "crypto":
      return buildScriptReply(findScript("is-this-crypto", objectionScripts), [
        "不是，这里不要讲成币圈项目。",
        provenanceCard?.detail ??
          "它现在强调的是数字确权、可审计记录和未来接口，而不是面向零售客户做 token 或 NFT 销售。",
        demoMode
          ? "你可以对客户说：『我们先把真实商品和会员系统做扎实，再谈未来更远的数字基础设施。』"
          : "建议你把“先有真实商品、再有数字记录”这句话记住，很好用。",
      ]);

    case "business_model":
      return [
        "Aurex Legacy 的商业模型不是只靠卖一件珠宝赚钱。",
        "它的收入结构分成金章销售、珠宝销售、会员收入、活动收入，以及后期的技术服务和国际授权收入。",
        moatCard?.detail ??
          "它的护城河来自身份价值、线下履约能力、数字编号体系、高毛利会员模型和未来资本化弹性。",
        demoMode
          ? "你可以这样讲：『它卖的是产品，但真正做大的是会员关系、服务收入和品牌资产。』"
          : "如果你愿意，我可以下一轮把商业模型整理成客户能听懂的 20 秒版本。",
      ].join("\n\n");
  }
}

function getSuggestedActions(topic: AurexTopic) {
  switch (topic) {
    case "membership":
      return ["先讲权益账户", "再讲黑卡路径", "最后讲全球礼遇"];
    case "provenance":
      return ["强调唯一编号", "补 ownership record", "带出 audit trail"];
    case "product_ladder":
      return ["先讲 Entry 入口", "再讲 Black Card", "补一句升级路径"];
    case "rwa":
      return ["先讲合规边界", "回到 future readiness", "避免收益承诺"];
    case "nasdaq":
      return ["强调三阶段路线", "不要当销售承诺", "拉回品牌基础"];
    case "mlm":
      return ["先否定招募盘", "强调真实产品", "回到会员关系"];
    case "crypto":
      return ["先说明不是发币", "强调数字确权", "补真实商品基础"];
    case "business_model":
      return ["先讲产品收入", "再讲会员收入", "最后讲长期授权"];
    default:
      return ["先讲品牌定位", "再讲会员逻辑", "最后讲数字确权"];
  }
}

export function getAiCoachSuggestedActionsForMessage(message: string) {
  const normalizedMessage = normalizeMessage(message);
  const topic = detectTopic(normalizedMessage);
  return getSuggestedActions(topic);
}

export async function mockAiCoach(request: AiCoachRequest): Promise<AiCoachResponse> {
  const normalizedMessage = normalizeMessage(request.message);
  const topic = detectTopic(normalizedMessage || request.context);
  const knowledge = await getAiCoachKnowledgeBundle();

  return {
    reply: buildReply(normalizedMessage, topic, knowledge),
    suggestedActions: getSuggestedActions(topic),
    provider: "mock",
    model: "local-demo",
    notice: "未检测到 OpenAI 连接，当前使用本地 Aurex Legacy 知识回答。",
  };
}
