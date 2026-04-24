import type { AiCoachRequest } from "@/features/ai/contracts";

export function inferAiCoachContext(
  message: string,
  fallback: AiCoachRequest["context"] = "product",
): AiCoachRequest["context"] {
  const normalized = message.toLowerCase();

  if (/(campaign|活动|campaigns|promotion|发什么|posting|content)/i.test(normalized)) {
    return "campaign";
  }

  if (/(mission|任务|proof|submit|unlock|奖励)/i.test(normalized)) {
    return "mission";
  }

  if (/(brand|品牌|aurex|legacy|membership|会员|provenance|确权|rwa|nasdaq|luxury|heritage|jewelry|珠宝|购买)/i.test(normalized)) {
    return "product";
  }

  return fallback;
}
