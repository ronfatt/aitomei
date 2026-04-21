export interface PosterGenerationRequest {
  memberId: string;
  templateId: string;
  campaignId?: string;
  photoPath?: string;
  captionRequested?: boolean;
}

export interface CaptionGenerationRequest {
  memberId: string;
  platform: "facebook" | "instagram" | "tiktok" | "xiaohongshu" | "whatsapp";
  tone: "elegant" | "friendly" | "festive" | "educational" | "promotional";
  productTheme: string;
  includeMemberName: boolean;
  includeCta: boolean;
}

export interface VideoPersonalizationRequest {
  memberId: string;
  templateId: string;
  cta: string;
  endCardNote?: string;
}

// Placeholder async contracts for future rendering services.
export async function queuePosterGeneration(request: PosterGenerationRequest) {
  void request;
  return { status: "queued", eta: "Within 15 minutes" } as const;
}

export async function queueVideoPersonalization(request: VideoPersonalizationRequest) {
  void request;
  return { status: "queued", eta: "Within 24 hours" } as const;
}
