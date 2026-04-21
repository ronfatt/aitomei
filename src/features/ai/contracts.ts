export interface AiCoachRequest {
  memberId: string;
  message: string;
  context: "brand" | "product" | "campaign" | "mission";
}

export interface AiCoachResponse {
  reply: string;
  suggestedActions: string[];
}

export interface AiConciergeInsight {
  title: string;
  detail: string;
  type: "campaign" | "news" | "mission" | "market";
}

// Placeholder integration surface for future LLM orchestration.
export async function mockAiCoach(request: AiCoachRequest): Promise<AiCoachResponse> {
  void request;

  return {
    reply:
      "A polished place to start today is a product-education post tied to the active campaign theme, followed by a clear invitation for viewers to ask about gifting options.",
    suggestedActions: [
      "Open the caption generator",
      "Review the Raya campaign brief",
      "Complete the brand story lesson",
    ],
  };
}
