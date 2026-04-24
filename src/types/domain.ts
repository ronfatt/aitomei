export type UserRole = "member" | "admin";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export type MissionStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "submitted"
  | "completed";

export type MissionType =
  | "profile"
  | "content"
  | "social"
  | "learning"
  | "ai"
  | "campaign";

export interface NavItem {
  title: string;
  href: string;
  description: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
}

export interface Mission {
  id: string;
  sequence: number;
  title: string;
  description: string;
  type: MissionType;
  status: MissionStatus;
  rewardPoints: number;
  rewardItem: string;
  unlockCondition: string;
  proofRequirement: string;
  validationRule: string;
}

export interface RewardMilestone {
  id: string;
  title: string;
  description: string;
  requiredPoints: number;
  badge: string;
  status: "locked" | "current" | "unlocked";
}

export interface RewardHistoryEntry {
  id: string;
  title: string;
  detail: string;
  points: number;
  awardedAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  theme: string;
  activePeriod: string;
  summary: string;
  cta: string;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface ProductHighlight {
  id: string;
  name: string;
  category: string;
  assetType: "numbered-collectible" | "gold-plaque" | "jewelry";
  collection: string;
  editionCode: string;
  provenanceLabel: string;
  memberAccessLabel: string;
  materialNote: string;
  availability: string;
  story: string;
  priceRange: string;
  spotlight: string;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  completionRate: string;
  quizId: string;
  summary: string;
}

export interface ProofSubmission {
  id: string;
  memberName: string;
  missionTitle: string;
  platform: string;
  submittedAt: string;
  status: "pending" | "approved" | "needs_revision";
  socialUrl?: string;
  screenshotPath?: string | null;
  reviewNotes?: string | null;
}

export interface ContentTemplate {
  id: string;
  title: string;
  format: "poster" | "caption" | "video";
  audience: string;
  lastUpdated: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  when: string;
}

export interface FeatureItem {
  eyebrow?: string;
  title: string;
  detail: string;
  meta?: string;
}

export interface FeatureSection {
  title: string;
  description: string;
  items: FeatureItem[];
}

export interface FeaturePageContent {
  eyebrow: string;
  title: string;
  description: string;
  metrics: DashboardMetric[];
  sections: FeatureSection[];
  actions?: Array<{
    label: string;
    href: string;
  }>;
}
