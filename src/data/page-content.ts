import type { FeaturePageContent } from "@/types/domain";

export const memberPageContent = {
  missions: {
    eyebrow: "任务引擎",
    title: "清晰递进的任务成长路径",
    description:
      "会员会依照清晰、具有推动力的顺序逐步解锁成长动作，每一步都配有明确的证明要求与奖励逻辑。",
    metrics: [
      { label: "当前可执行任务", value: "3", trend: "其中 2 项今天值得优先推进" },
      { label: "待解锁任务", value: "5", trend: "通过证明与学习逐步开启" },
      { label: "审核时效目标", value: "少于 1 天", trend: "目标为当天完成" },
    ],
    sections: [
      {
        title: "校验机制",
        description: "每一个任务都有独立规则，避免出现含糊不清的完成状态。",
        items: [
          {
            eyebrow: "证明优先",
            title: "支持社媒链接与截图提交",
            detail: "会员可以提交链接、截图与平台信息，方便审核与追踪。",
          },
          {
            eyebrow: "可扩展自动化",
            title: "预留 AI 校验服务接口",
            detail: "未来可接入 AI 辅助审核，而不需要重做现有任务流程。",
          },
        ],
      },
    ],
    actions: [
      { label: "打开第一个任务", href: "/member/missions/complete-profile" },
    ],
  },
  rewards: {
    eyebrow: "留存设计",
    title: "让动力持续累积的奖励系统",
    description:
      "积分、徽章与可解锁里程碑以更高端、克制的方式呈现，既有激励感，又不会显得过度游戏化。",
    metrics: [
      { label: "当前层级", value: "标志影响力", trend: "还差 320 分即可解锁" },
      { label: "已获徽章", value: "4", trend: "另有 2 项进行中" },
      { label: "奖励记录", value: "12", trend: "含可追溯历史记录" },
    ],
    sections: [
      {
        title: "奖励机制",
        description: "会员可以清楚看到自己现在获得了什么，以及下一步正朝什么目标前进。",
        items: [
          {
            eyebrow: "里程碑",
            title: "更贴合珠宝品牌语境的层级命名",
            detail: "奖励层级使用具有质感与荣誉感的语言，更符合高端珠宝品牌形象。",
          },
          {
            eyebrow: "可追溯",
            title: "奖励历史与解锁来源清晰可查",
            detail: "每一条奖励记录都可以回溯到对应任务、审核结果或活动参与行为。",
          },
        ],
      },
    ],
  },
  contentStudio: {
    eyebrow: "内容创作中心",
    title: "更快生成可直接用于品牌传播的内容素材",
    description:
      "内容创作被拆成海报、文案与短视频请求三条清晰流程，让会员一眼就知道下一步该做什么。",
    metrics: [
      { label: "海报模板", value: "12", trend: "支持季节性轮替" },
      { label: "文案预设", value: "18", trend: "按平台与语气区分" },
      { label: "视频队列时效", value: "24 小时", trend: "可扩展渲染管线" },
    ],
    sections: [
      {
        title: "工具设计方式",
        description: "每个工具都采用面向未来扩展的服务边界，便于后续接入 AI 生成与渲染能力。",
        items: [
          {
            eyebrow: "海报流程",
            title: "模板 + 活动 + 会员个性化",
            detail: "支持上传照片、选择活动主题、预览、保存与下载等动作。",
          },
          {
            eyebrow: "文案流程",
            title: "按平台生成专属文案",
            detail: "支持语气、CTA、标签与会员姓名插入等参数。",
          },
          {
            eyebrow: "视频流程",
            title: "以队列驱动的个性化请求",
            detail: "将渲染逻辑抽象化，方便后续接入外部视频服务。",
          },
        ],
      },
    ],
  },
  assetLibrary: {
    eyebrow: "素材管理",
    title: "整洁好用、可重复利用的会员素材库",
    description:
      "会员可以随时回看过往产出、重新下载素材，并继续准备后续内容，不需要每次都从头生成。",
    metrics: [
      { label: "已保存素材", value: "24", trend: "含 12 张海报、9 条文案、3 个视频请求" },
      { label: "收藏内容", value: "6", trend: "可置顶以便快速复用" },
      { label: "存储分区", value: "3", trend: "上传、生成与证明分开管理" },
    ],
    sections: [
      {
        title: "素材库体验",
        description: "为快速筛选与高质感视觉浏览而设计。",
        items: [
          {
            eyebrow: "筛选",
            title: "按格式、活动与状态分类查找",
            detail: "帮助会员在活动进行期间更快找到正确素材。",
          },
          {
            eyebrow: "存储",
            title: "已为 Supabase Storage 做好准备",
            detail: "已规划会员头像、证明截图与生成素材的独立 bucket 结构。",
          },
        ],
      },
    ],
  },
  aiCoach: {
    eyebrow: "AI 引导",
    title: "AI 教练让学习与行动始终可见",
    description:
      "AI 教练同时扮演会员导师、产品讲解助手与推广顾问，帮助会员更顺利完成任务，也更自然地掌握品牌表达。",
    metrics: [
      { label: "建议提问", value: "8", trend: "会根据任务状态主动显示" },
      { label: "知识领域", value: "4", trend: "涵盖品牌、产品、内容与常见问题" },
      { label: "模拟对话流程", value: "3", trend: "支持角色演练扩展" },
    ],
    sections: [
      {
        title: "教练能力结构",
        description: "当前界面已支持对话体验，后续也可在同一契约下接入更完整的 LLM 编排能力。",
        items: [
          {
            eyebrow: "导师模式",
            title: "用简单方式讲清品牌与产品",
            detail: "帮助新会员理解重点，而不会被过量信息压垮。",
          },
          {
            eyebrow: "顾问模式",
            title: "推荐今天适合发什么内容",
            detail: "会员可以直接获取与当前活动一致、能马上使用的发帖建议。",
          },
        ],
      },
    ],
  },
  aiConcierge: {
    eyebrow: "每日助理",
    title: "AI 礼宾把资讯更新转化为下一步行动",
    description:
      "AI 礼宾把资讯、活动、待完成任务提醒与快速洞察整合在一个高端而易读的面板里。",
    metrics: [
      { label: "每日洞察卡片", value: "5", trend: "每次进入都会个性化呈现" },
      { label: "待办提醒", value: "2", trend: "会结合任务状态提醒" },
      { label: "黄金信息模块", value: "预留中", trend: "后续可接计算器能力" },
    ],
    sections: [
      {
        title: "礼宾信息模块",
        description: "以小而高价值的信息卡片减少杂乱感，同时保证会员及时掌握重点。",
        items: [
          {
            eyebrow: "信息掌握",
            title: "资讯、活动与事件集中呈现",
            detail: "会员不需要在不同页面之间来回寻找最新重点。",
          },
          {
            eyebrow: "行动引导",
            title: "结合情境的任务提醒",
            detail: "通过快捷入口把会员拉回最值得先做的下一步。",
          },
        ],
      },
    ],
  },
  campaigns: {
    eyebrow: "活动中心",
    title: "活动信息清楚可见，但不过度复杂",
    description:
      "会员可以直接看到进行中的活动、主推主题与推荐动作，不会出现 MLM 或关系链式表达。",
    metrics: [
      { label: "进行中活动", value: "3", trend: "今天新增 1 批素材" },
      { label: "会员挑战", value: "4", trend: "其中 2 项适合新手" },
      { label: "参与率", value: "74%", trend: "较上月提升 8%" },
    ],
    sections: [
      {
        title: "活动卡设计",
        description: "每一张活动卡都会说清楚活动故事、CTA 与可直接使用的内容工具。",
        items: [
          {
            eyebrow: "清晰",
            title: "短简报 + 直接下一步",
            detail: "会员可以从活动卡直接进入海报、文案或学习模块。",
          },
          {
            eyebrow: "留存",
            title: "挑战任务会回连成长主线",
            detail: "活动参与会强化整体会员成长路径，而不是成为孤立模块。",
          },
        ],
      },
    ],
  },
  news: {
    eyebrow: "资讯中心",
    title: "品牌更新与运营通知",
    description:
      "通过分区式资讯流，让重要沟通保持精炼、有质感，也更方便回看。",
    metrics: [
      { label: "最新通知", value: "7", trend: "本周新增 2 条" },
      { label: "运营提醒", value: "2", trend: "当天可见" },
      { label: "产品故事", value: "5", trend: "已与学习内容联动" },
    ],
    sections: [
      {
        title: "资讯流策略",
        description: "资讯会按活动、培训、运营与产品故事等维度分组呈现。",
        items: [
          {
            eyebrow: "易读",
            title: "更像高端品牌编辑语气",
            detail: "界面强调短而精致的信息表达，避免杂乱喧闹的公告堆叠。",
          },
        ],
      },
    ],
  },
  products: {
    eyebrow: "产品教育",
    title: "适合日常推广的主推产品引导",
    description:
      "产品页会帮助会员理解系列该如何定位、适合什么客户，以及怎样用更优雅的方式介绍它们。",
    metrics: [
      { label: "主推品类", value: "6", trend: "黄金与钻石为主" },
      { label: "推荐指引", value: "14", trend: "按使用场景组织" },
      { label: "CTA 路径", value: "3", trend: "海报、文案、学习三条联动" },
    ],
    sections: [
      {
        title: "推荐辅助",
        description: "会员可以把产品卡片直接连到内容生成工具中使用。",
        items: [
          {
            eyebrow: "教育优先",
            title: "用故事感带出产品重点",
            detail: "每张产品卡都帮助会员更自然地理解并表达产品价值。",
          },
        ],
      },
    ],
  },
  learning: {
    eyebrow: "学习中心",
    title: "用短课快速建立表达信心",
    description:
      "品牌故事、产品知识与推广技巧被拆成短小清晰的模块，并与测验和任务进度联动。",
    metrics: [
      { label: "课程模块", value: "9", trend: "含 3 条新手路径" },
      { label: "测验数量", value: "6", trend: "与任务得分联动" },
      { label: "完成率", value: "82%", trend: "本月提升 6%" },
    ],
    sections: [
      {
        title: "学习设计",
        description: "每一节课都尽量能在一次使用中完成，并直接连接到平台行为。",
        items: [
          {
            eyebrow: "微学习",
            title: "短小、实用、能马上吸收",
            detail: "会员可以在任务之间穿插学习，而不会打断整体节奏。",
          },
          {
            eyebrow: "任务联动",
            title: "完成度与测验成绩可追踪",
            detail: "学习结果会直接回流到任务解锁与奖励分配逻辑中。",
          },
        ],
      },
    ],
  },
  notifications: {
    eyebrow: "动态提醒",
    title: "高信号提醒，而不是打扰式通知",
    description:
      "通知会聚焦任务截止、活动上线、审核结果与礼宾提醒，并通过清晰优先级传达重点。",
    metrics: [
      { label: "未读", value: "4", trend: "其中 2 条与任务相关" },
      { label: "今日通知", value: "7", trend: "其中 3 条可立即处理" },
      { label: "通知渠道", value: "站内", trend: "后续可扩展到 Email / SMS" },
    ],
    sections: [
      {
        title: "通知模型",
        description: "平台已预留多渠道扩展能力，不需要改动现有通知领域模型。",
        items: [
          {
            eyebrow: "面向未来",
            title: "先站内，后扩展外部渠道",
            detail: "通知表结构已经能支持未来接入 Email、Push 或 WhatsApp。",
          },
        ],
      },
    ],
  },
  settings: {
    eyebrow: "平台设置",
    title: "偏好、隐私与多语言准备",
    description:
      "会员现在就能管理个人偏好，同时整体架构也已为多语言扩展和更多策略控制做好准备。",
    metrics: [
      { label: "语言支持", value: "当前中文化中", trend: "已预留英文与马来文扩展" },
      { label: "隐私控制", value: "3", trend: "可继续扩展" },
      { label: "角色权限", value: "RBAC", trend: "覆盖会员与管理员策略" },
    ],
    sections: [
      {
        title: "设置优先级",
        description: "MVP 更强调清晰与可扩展性，而不是堆叠繁杂的设置项。",
        items: [
          {
            eyebrow: "本地化",
            title: "便于翻译扩展的内容架构",
            detail: "标签和页面区块的组织方式，能让后续语言扩展不必重写整页。",
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
