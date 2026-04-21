import type { FeaturePageContent } from "@/types/domain";

export const memberPageContent = {
  missions: {
    eyebrow: "Mission Engine",
    title: "Structured mission progression",
    description:
      "Members unlock growth actions in a clear, motivating sequence with explicit proof requirements and reward logic.",
    metrics: [
      { label: "Available Missions", value: "3", trend: "2 need attention today" },
      { label: "Locked Missions", value: "5", trend: "Unlocked by proof and learning" },
      { label: "Approval SLA", value: "< 1 day", trend: "Same-day target" },
    ],
    sections: [
      {
        title: "Validation architecture",
        description: "Every mission carries distinct rules to avoid ambiguous completion states.",
        items: [
          {
            eyebrow: "Proof-first",
            title: "Social URL + screenshot support",
            detail: "Members can submit links, screenshots, and platform metadata for review.",
          },
          {
            eyebrow: "Automation-ready",
            title: "AI validation placeholder service",
            detail: "The system is structured for future AI-assisted moderation without changing mission flows.",
          },
        ],
      },
    ],
    actions: [
      { label: "Open first mission", href: "/member/missions/complete-profile" },
    ],
  },
  rewards: {
    eyebrow: "Retention Design",
    title: "Rewards that reinforce momentum",
    description:
      "Points, badges, and unlockable milestones are framed to feel premium and motivating rather than overly gamified.",
    metrics: [
      { label: "Current Tier", value: "Signature Presence", trend: "320 points to unlock" },
      { label: "Badges Earned", value: "4", trend: "2 in progress" },
      { label: "History Entries", value: "12", trend: "Visible with audit trail" },
    ],
    sections: [
      {
        title: "Reward mechanics",
        description: "Members can see what they gain now and what they are building toward next.",
        items: [
          {
            eyebrow: "Milestones",
            title: "Luxury-themed tier framing",
            detail: "Reward tiers use prestige language that feels aligned to a premium jewelry brand.",
          },
          {
            eyebrow: "Traceability",
            title: "Reward history and unlock lineage",
            detail: "Every reward event can be tied back to missions, reviews, or campaign participation.",
          },
        ],
      },
    ],
  },
  contentStudio: {
    eyebrow: "Content Studio",
    title: "Generate brand-ready materials faster",
    description:
      "Content creation is split into clear flows for posters, captions, and short-form video requests so members know exactly what to do next.",
    metrics: [
      { label: "Poster Templates", value: "12", trend: "Seasonal rotation enabled" },
      { label: "Caption Presets", value: "18", trend: "Per platform and tone" },
      { label: "Video Queue SLA", value: "24h", trend: "Extensible render pipeline" },
    ],
    sections: [
      {
        title: "Tooling model",
        description: "Each tool uses a future-ready service boundary for AI generation and rendering.",
        items: [
          {
            eyebrow: "Poster flow",
            title: "Template + campaign + member personalization",
            detail: "Supports photo upload, campaign theme selection, preview, save, and download actions.",
          },
          {
            eyebrow: "Caption flow",
            title: "Platform-specific caption generation",
            detail: "Supports tone, CTA, hashtags, and optional member-name insertion.",
          },
          {
            eyebrow: "Video flow",
            title: "Queue-driven personalization",
            detail: "Keeps rendering abstracted so external video services can plug in later.",
          },
        ],
      },
    ],
  },
  assetLibrary: {
    eyebrow: "Asset Management",
    title: "A clean library for reusable member assets",
    description:
      "Members can return to previous outputs, re-download assets, and prepare follow-up content without regenerating from scratch.",
    metrics: [
      { label: "Saved Assets", value: "24", trend: "12 posters, 9 captions, 3 video requests" },
      { label: "Favorites", value: "6", trend: "Pinned for fast reuse" },
      { label: "Storage Buckets", value: "3", trend: "Uploads, generated, proof" },
    ],
    sections: [
      {
        title: "Library UX",
        description: "Designed for fast filtering and premium visual scanning.",
        items: [
          {
            eyebrow: "Filters",
            title: "By format, campaign, and status",
            detail: "Helps members find the right asset quickly during a live campaign period.",
          },
          {
            eyebrow: "Storage",
            title: "Supabase Storage ready",
            detail: "Buckets are defined for profile uploads, proof screenshots, and generated assets.",
          },
        ],
      },
    ],
  },
  aiCoach: {
    eyebrow: "AI Guidance",
    title: "AI Coach keeps learning visible",
    description:
      "The coach acts as a member mentor, product explainer, and promotional advisor that nudges better mission completion and stronger brand fluency.",
    metrics: [
      { label: "Suggested Prompts", value: "8", trend: "Mission-aware prompts surfaced" },
      { label: "Knowledge Areas", value: "4", trend: "Brand, product, content, FAQ" },
      { label: "Simulation Flows", value: "3", trend: "Role-play ready" },
    ],
    sections: [
      {
        title: "Coach behaviors",
        description: "The UI is structured for chat now, with future LLM orchestration behind a clean contract.",
        items: [
          {
            eyebrow: "Mentor mode",
            title: "Explain the brand and products simply",
            detail: "Supports newcomer education without overwhelming members.",
          },
          {
            eyebrow: "Advisor mode",
            title: "Recommend what to post today",
            detail: "Members can ask for practical posting ideas aligned to current campaigns.",
          },
        ],
      },
    ],
  },
  aiConcierge: {
    eyebrow: "Daily Assistant",
    title: "AI Concierge turns updates into action",
    description:
      "The concierge dashboard combines news, campaigns, pending mission reminders, and quick insights in one premium panel.",
    metrics: [
      { label: "Daily Insight Cards", value: "5", trend: "Personalized each session" },
      { label: "Pending Nudges", value: "2", trend: "Mission-aware reminders" },
      { label: "Gold Info Module", value: "Placeholder", trend: "Future calculator-ready" },
    ],
    sections: [
      {
        title: "Concierge blocks",
        description: "Small, high-value information cards reduce clutter while keeping members informed.",
        items: [
          {
            eyebrow: "Awareness",
            title: "News, campaigns, and events in one place",
            detail: "Members do not need to hunt across separate pages for the latest context.",
          },
          {
            eyebrow: "Action",
            title: "Contextual mission reminders",
            detail: "Quick links push members back into the most meaningful next step.",
          },
        ],
      },
    ],
  },
  campaigns: {
    eyebrow: "Campaign Center",
    title: "Campaign visibility without complexity",
    description:
      "Members see live campaigns, target themes, and recommended actions without any MLM or referral-tree framing.",
    metrics: [
      { label: "Live Campaigns", value: "3", trend: "1 new asset drop today" },
      { label: "Member Challenges", value: "4", trend: "2 beginner-friendly" },
      { label: "Participation Rate", value: "74%", trend: "+8% vs last month" },
    ],
    sections: [
      {
        title: "Campaign design",
        description: "Every campaign card explains the story, CTA, and relevant content tool.",
        items: [
          {
            eyebrow: "Clarity",
            title: "Short briefs with direct next steps",
            detail: "Members can jump straight into a poster, caption, or learning module from a campaign card.",
          },
          {
            eyebrow: "Retention",
            title: "Challenges connect back to missions",
            detail: "Campaign work reinforces the broader member growth ladder rather than existing as a separate silo.",
          },
        ],
      },
    ],
  },
  news: {
    eyebrow: "Newsroom",
    title: "Brand updates and operational notices",
    description:
      "A segmented feed keeps important communications polished, concise, and easy to revisit.",
    metrics: [
      { label: "Fresh Notices", value: "7", trend: "2 published this week" },
      { label: "Operational Alerts", value: "2", trend: "Same-day visibility" },
      { label: "Product Stories", value: "5", trend: "Learning-linked" },
    ],
    sections: [
      {
        title: "Feed strategy",
        description: "Notices are grouped by campaign, training, operations, and product story.",
        items: [
          {
            eyebrow: "Readable",
            title: "Luxury-brand editorial tone",
            detail: "The interface supports short, premium messaging instead of noisy announcement clutter.",
          },
        ],
      },
    ],
  },
  products: {
    eyebrow: "Product Education",
    title: "Featured product guidance for everyday promotion",
    description:
      "Product pages teach members how to position collections, who they fit, and how to speak about them elegantly.",
    metrics: [
      { label: "Featured Categories", value: "6", trend: "Gold and diamond lead" },
      { label: "Recommendation Guides", value: "14", trend: "Use-case led" },
      { label: "CTA Paths", value: "3", trend: "Poster, caption, learning" },
    ],
    sections: [
      {
        title: "Recommendation support",
        description: "Members can connect product cards directly to content generation tools.",
        items: [
          {
            eyebrow: "Education-first",
            title: "Story-led product highlights",
            detail: "Each product card helps members understand and communicate the piece naturally.",
          },
        ],
      },
    ],
  },
  learning: {
    eyebrow: "Learning Center",
    title: "Short lessons that build confidence quickly",
    description:
      "Brand story, product knowledge, and promotion skills are broken into concise modules with linked quizzes and mission progress.",
    metrics: [
      { label: "Modules", value: "9", trend: "3 beginner tracks" },
      { label: "Quizzes", value: "6", trend: "Mission-linked scoring" },
      { label: "Completion Rate", value: "82%", trend: "+6% this month" },
    ],
    sections: [
      {
        title: "Learning design",
        description: "Every lesson is meant to be finished in one sitting and connected to platform action.",
        items: [
          {
            eyebrow: "Micro-learning",
            title: "Short, practical lessons",
            detail: "Members can learn between tasks without losing momentum.",
          },
          {
            eyebrow: "Mission-linked",
            title: "Completion and quiz score tracking",
            detail: "Learning results feed directly into mission unlock logic and reward allocation.",
          },
        ],
      },
    ],
  },
  notifications: {
    eyebrow: "Operational Awareness",
    title: "High-signal alerts, not noisy spam",
    description:
      "Notifications highlight mission deadlines, new campaigns, review outcomes, and concierge reminders with clear priority cues.",
    metrics: [
      { label: "Unread", value: "4", trend: "2 mission-related" },
      { label: "Today", value: "7", trend: "3 actionable" },
      { label: "Delivery Channels", value: "In-app", trend: "Email/SMS ready later" },
    ],
    sections: [
      {
        title: "Notification model",
        description: "The platform is structured for multi-channel expansion without changing the notification domain model.",
        items: [
          {
            eyebrow: "Future-ready",
            title: "In-app first, external channels later",
            detail: "Notifications table supports expansion into email, push, or WhatsApp orchestration later.",
          },
        ],
      },
    ],
  },
  settings: {
    eyebrow: "Platform Settings",
    title: "Preferences, privacy, and localization readiness",
    description:
      "Members can manage profile preferences now while the architecture stays prepared for multilingual growth and additional policy controls.",
    metrics: [
      { label: "Locale Support", value: "EN-first", trend: "BM & Chinese ready" },
      { label: "Privacy Controls", value: "3", trend: "Expandable" },
      { label: "Role Access", value: "RBAC", trend: "Member and admin policies" },
    ],
    sections: [
      {
        title: "Settings priorities",
        description: "The MVP focuses on clarity and future safety rather than bloated preference screens.",
        items: [
          {
            eyebrow: "Localization",
            title: "Translation-friendly content architecture",
            detail: "Labels and page sections are organized so locale expansion can happen without page rewrites.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, FeaturePageContent>;

export const adminPageContent = {
  users: {
    eyebrow: "User Operations",
    title: "Member lifecycle and segmentation",
    description:
      "Admin users can monitor onboarding progress, activity levels, and content participation without drifting into downline mechanics.",
    metrics: [
      { label: "New Members", value: "148", trend: "This month" },
      { label: "At-Risk Members", value: "64", trend: "Need reactivation" },
      { label: "Profile Completion", value: "79%", trend: "+5% vs last cycle" },
    ],
    sections: [
      {
        title: "User management",
        description: "Designed for segmentation, support, and content activation.",
        items: [
          {
            eyebrow: "Lifecycle",
            title: "Onboarding, active, dormant cohorts",
            detail: "Each segment can receive different campaigns, missions, and concierge nudges.",
          },
        ],
      },
    ],
  },
  missions: {
    eyebrow: "Mission Governance",
    title: "Mission rules and sequencing",
    description:
      "Admins can shape mission journeys, validation requirements, and unlock dependencies in a structured way.",
    metrics: [
      { label: "Configured Missions", value: "10", trend: "Journey v1" },
      { label: "Manual Review Missions", value: "4", trend: "Proof-based" },
      { label: "Automation Opportunities", value: "6", trend: "Ready for AI assist" },
    ],
    sections: [
      {
        title: "Mission management patterns",
        description: "Policies, points, and validation rules stay explicit and auditable.",
        items: [
          {
            eyebrow: "Trust",
            title: "No hidden reward logic",
            detail: "Every mission publishes its conditions, proof rules, and reward output clearly.",
          },
        ],
      },
    ],
  },
  rewards: {
    eyebrow: "Rewards Governance",
    title: "Reward configuration and member progression",
    description:
      "Control points, badges, and milestone unlocks from one place while keeping the system lightweight for the MVP.",
    metrics: [
      { label: "Active Milestones", value: "3", trend: "Luxury tier framing" },
      { label: "Badges", value: "12", trend: "Mission and campaign linked" },
      { label: "Redemption Types", value: "4", trend: "Placeholder-ready" },
    ],
    sections: [
      {
        title: "Reward model",
        description: "Simple enough for launch, extensible enough for future reward catalogs.",
        items: [
          {
            eyebrow: "Scalable",
            title: "Points + badge + milestone pattern",
            detail: "Keeps the logic understandable while leaving room for future catalog-based redemption.",
          },
        ],
      },
    ],
  },
  campaigns: {
    eyebrow: "Campaign Operations",
    title: "Plan and publish campaign visibility",
    description:
      "Campaign cards, event notices, and call-to-action pathways are managed centrally for consistent member guidance.",
    metrics: [
      { label: "Live Campaigns", value: "3", trend: "2 high priority" },
      { label: "Homepage Cards", value: "6", trend: "Admin-managed" },
      { label: "Participation Lift", value: "+18%", trend: "Since new brief layout" },
    ],
    sections: [
      {
        title: "Campaign operations",
        description: "Content blocks are segmented so the homepage and concierge can reuse them safely.",
        items: [
          {
            eyebrow: "Reusability",
            title: "Cards feed multiple surfaces",
            detail: "Campaign content can power dashboard cards, concierge insights, and mission-linked prompts.",
          },
        ],
      },
    ],
  },
  products: {
    eyebrow: "Product Feed",
    title: "Control educational product storytelling",
    description:
      "Admins can keep featured products, education notes, and campaign-specific product highlights consistent across the platform.",
    metrics: [
      { label: "Featured Products", value: "18", trend: "6 promoted now" },
      { label: "Story Blocks", value: "32", trend: "Segmented by category" },
      { label: "Content Links", value: "Poster / Caption / Learning", trend: "Cross-module" },
    ],
    sections: [
      {
        title: "Product publishing",
        description: "Product storytelling remains education-led, not commerce-heavy.",
        items: [
          {
            eyebrow: "Positioning",
            title: "Premium, helpful, non-pushy language",
            detail: "Product cards are built to support recommendation confidence rather than hard selling.",
          },
        ],
      },
    ],
  },
  learning: {
    eyebrow: "Learning Operations",
    title: "Lessons, quizzes, and knowledge quality",
    description:
      "The learning suite is modular so admins can expand into more advanced training without redesigning the platform.",
    metrics: [
      { label: "Published Modules", value: "9", trend: "3 categories" },
      { label: "Quiz Pass Rate", value: "76%", trend: "+9% after AI prompts" },
      { label: "Mission Links", value: "4", trend: "Direct unlock dependencies" },
    ],
    sections: [
      {
        title: "Learning governance",
        description: "Lessons, quizzes, and completion thresholds can be managed independently.",
        items: [
          {
            eyebrow: "Auditability",
            title: "Attempts and scores persist cleanly",
            detail: "Quiz attempts are normalized so analytics and mission validation can both use them.",
          },
        ],
      },
    ],
  },
  proofReview: {
    eyebrow: "Moderation Queue",
    title: "Review social proof with context and traceability",
    description:
      "Proof submissions include mission, member, platform, optional screenshot, and future AI validation hooks.",
    metrics: [
      { label: "Pending", value: "46", trend: "11 new today" },
      { label: "Approved Today", value: "83", trend: "89% within SLA" },
      { label: "Escalations", value: "8", trend: "Requires admin attention" },
    ],
    sections: [
      {
        title: "Review workflow",
        description: "Admins can approve, reject, or request revisions while keeping an audit trail.",
        items: [
          {
            eyebrow: "Future AI assist",
            title: "Validation service abstraction",
            detail: "Image and URL checks can be automated later without changing the review workflow.",
          },
        ],
      },
    ],
  },
  contentTemplates: {
    eyebrow: "Template Management",
    title: "Content templates for posters, captions, and videos",
    description:
      "Maintain the premium visual system centrally while enabling fast member personalization across campaign surfaces.",
    metrics: [
      { label: "Poster Templates", value: "12", trend: "Seasonal variations" },
      { label: "Caption Packs", value: "18", trend: "Platform-specific" },
      { label: "Video Templates", value: "5", trend: "Short-form first" },
    ],
    sections: [
      {
        title: "Template operations",
        description: "Template metadata stays structured for campaign and audience targeting.",
        items: [
          {
            eyebrow: "Consistency",
            title: "One premium design language",
            detail: "Templates can evolve without fragmenting the visual identity across member outputs.",
          },
        ],
      },
    ],
  },
  analytics: {
    eyebrow: "Decision Signals",
    title: "Engagement, retention, and content analytics",
    description:
      "The analytics layer focuses on member activity, mission throughput, content participation, and campaign lift rather than sales or referral trees.",
    metrics: [
      { label: "DAU", value: "1,308", trend: "+11% WoW" },
      { label: "Mission Throughput", value: "72%", trend: "Improving" },
      { label: "Content Participation", value: "58%", trend: "Caption tool leading" },
    ],
    sections: [
      {
        title: "MVP analytics scope",
        description: "Practical operational metrics first, deeper forecasting later.",
        items: [
          {
            eyebrow: "Growth",
            title: "Track what keeps members active",
            detail: "The dashboard favors retention, mission flow, and campaign visibility over vanity metrics.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, FeaturePageContent>;
