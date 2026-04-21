export interface ProofSubmissionRequest {
  memberId: string;
  missionId: string;
  platform: string;
  socialUrl: string;
  screenshotPath?: string;
}

export interface ProofValidationOutcome {
  status: "pending" | "approved" | "needs_revision";
  rationale: string;
}

// Placeholder validation boundary for future AI-assisted URL/image review.
export async function validateProofSubmission(
  request: ProofSubmissionRequest,
): Promise<ProofValidationOutcome> {
  void request;

  return {
    status: "pending",
    rationale:
      "Queued for admin review. Future automation can enrich this outcome with AI-based URL and screenshot checks.",
  };
}
