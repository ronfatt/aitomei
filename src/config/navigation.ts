import type { NavItem } from "@/types/domain";

export const publicNavigation: NavItem[] = [
  {
    title: "Platform",
    href: "#platform",
    description: "Explore the Aurex Legacy luxury platform architecture.",
  },
  {
    title: "Collections",
    href: "#collections",
    description: "View the luxury product ladder from entry to black card.",
  },
  {
    title: "Membership",
    href: "#membership",
    description: "See how private privileges turn purchases into relationships.",
  },
  {
    title: "Provenance",
    href: "#provenance",
    description: "Understand provenance, audit trail and asset readiness.",
  },
  {
    title: "Dashboard",
    href: "#dashboard",
    description: "Preview the member and admin dashboard experience.",
  },
];

export const memberNavigation: NavItem[] = [
  {
    title: "首页",
    href: "/member/dashboard",
    description: "查看今日目标、奖励进度与 AI 建议。",
  },
  {
    title: "任务",
    href: "/member/missions",
    description: "聚焦今天要推进的任务与证明提交。",
  },
  {
    title: "内容创作中心",
    href: "/member/content-studio",
    description: "快速生成海报、文案、短视频与证明内容。",
  },
  {
    title: "学习中心",
    href: "/member/learning",
    description: "继续课程、测验与品牌表达训练。",
  },
  {
    title: "我的",
    href: "/member/profile",
    description: "管理资料、奖励、通知与个人成长偏好。",
  },
];

export const adminNavigation: NavItem[] = [
  {
    title: "总览",
    href: "/admin/dashboard",
    description: "运营概览与关键决策信号。",
  },
  {
    title: "会员管理",
    href: "/admin/users",
    description: "会员名单、分层与生命周期管理。",
  },
  {
    title: "任务管理",
    href: "/admin/missions",
    description: "任务设计、校验规则与解锁顺序。",
  },
  {
    title: "奖励管理",
    href: "/admin/rewards",
    description: "积分体系、徽章与奖励逻辑。",
  },
  {
    title: "活动管理",
    href: "/admin/campaigns",
    description: "活动卡片、事件通知与首页露出。",
  },
  {
    title: "产品管理",
    href: "/admin/products",
    description: "产品教育亮点与产品内容管理。",
  },
  {
    title: "学习管理",
    href: "/admin/learning",
    description: "课程、测验编排与内容治理。",
  },
  {
    title: "证明审核",
    href: "/admin/proof-review",
    description: "审核社媒证明并保留审计记录。",
  },
  {
    title: "内容模板",
    href: "/admin/content-templates",
    description: "海报、文案与视频模板管理。",
  },
  {
    title: "AI 知识库",
    href: "/admin/ai-knowledge",
    description: "管理 AI 回答所依赖的官方知识、脚本与来源。",
  },
  {
    title: "数据分析",
    href: "/admin/analytics",
    description: "互动、留存与活动参与趋势。",
  },
];
