# TOMEI Member Growth Platform

Premium SaaS MVP for TOMEI Malaysia focused on member engagement, mission-driven activation, AI-assisted guidance, campaign visibility, product education, and reward retention.

This platform is intentionally not MLM, not a referral tree, and not a downline/upline commission system. It is a member growth and brand participation platform.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style component structure
- Supabase Auth / PostgreSQL / Storage / RLS
- AI-ready service abstraction layer for coach, concierge, poster generation, captions, video requests, and proof validation

## Current scope

This scaffold delivers the MVP architecture and premium UI foundation across:

- Public landing page
- Auth entry pages
- Member workspace
- Admin workspace
- Mission and reward system surfaces
- Content Studio flows
- AI Coach and AI Concierge shells
- Campaign, news, products, and learning pages
- Proof submission and proof review surfaces
- Supabase schema, RLS policies, and seed data

## Folder structure

```text
src
├── app
│   ├── (public)
│   ├── (auth)
│   ├── (member)/member/*
│   ├── (admin)/admin/*
│   └── api/health
├── components
│   ├── app
│   ├── layout
│   ├── marketing
│   └── ui
├── config
├── data
├── features
│   ├── ai
│   ├── auth
│   ├── content
│   └── proofs
├── lib
│   └── supabase
└── types

supabase
├── migrations/0001_initial_schema.sql
└── seed.sql
```

## Route map

### Public

- `/`
- `/login`
- `/signup`
- `/forgot-password`

### Member

- `/member/dashboard`
- `/member/onboarding`
- `/member/profile`
- `/member/missions`
- `/member/missions/[missionId]`
- `/member/rewards`
- `/member/content-studio`
- `/member/content-studio/poster-generator`
- `/member/content-studio/caption-generator`
- `/member/content-studio/short-video-requests`
- `/member/asset-library`
- `/member/ai-coach`
- `/member/ai-concierge`
- `/member/campaigns`
- `/member/news`
- `/member/products`
- `/member/learning`
- `/member/learning/quizzes/[quizId]`
- `/member/notifications`
- `/member/settings`

### Admin

- `/admin/dashboard`
- `/admin/users`
- `/admin/missions`
- `/admin/rewards`
- `/admin/campaigns`
- `/admin/products`
- `/admin/learning`
- `/admin/proof-review`
- `/admin/content-templates`
- `/admin/analytics`

## Database model

Core tables defined in `supabase/migrations/0001_initial_schema.sql`:

- `users`
- `member_profiles`
- `missions`
- `member_missions`
- `rewards`
- `member_rewards`
- `content_templates`
- `generated_assets`
- `campaigns`
- `campaign_participation`
- `news_items`
- `products`
- `learning_modules`
- `quizzes`
- `quiz_attempts`
- `ai_chat_sessions`
- `ai_messages`
- `proof_submissions`
- `admin_reviews`
- `notifications`
- `user_activity_logs`

The migration also includes:

- enums for roles, mission states, asset types, and notification types
- update triggers
- storage buckets
- row level security
- member ownership policies
- admin governance policies

Production hardening additions live in:

- [supabase/migrations/0002_production_hardening.sql](/Users/rms/Desktop/Ai Project/AiTomei/tomei-member-growth-platform/supabase/migrations/0002_production_hardening.sql)
- [docs/supabase-schema-v2.md](/Users/rms/Desktop/Ai Project/AiTomei/tomei-member-growth-platform/docs/supabase-schema-v2.md)

Single-file greenfield baseline lives in:

- [supabase/baselines/production_schema_v2.sql](/Users/rms/Desktop/Ai Project/AiTomei/tomei-member-growth-platform/supabase/baselines/production_schema_v2.sql)
- [docs/supabase-production-baseline.md](/Users/rms/Desktop/Ai Project/AiTomei/tomei-member-growth-platform/docs/supabase-production-baseline.md)
- [docs/supabase-sql-editor-setup.md](/Users/rms/Desktop/Ai Project/AiTomei/tomei-member-growth-platform/docs/supabase-sql-editor-setup.md)

## Environment

Copy `.env.example` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_COACH_PROVIDER=
AI_COACH_MODEL=
CONTENT_RENDER_WEBHOOK_URL=
```

If Supabase credentials are not present, the platform uses a safe demo-mode auth context so the member and admin experiences can still be previewed during UI development.

## Local development

```bash
npm install
npm run dev
```

Optional quality checks:

```bash
npm run lint
npm run typecheck
```

## Supabase setup

1. Create a Supabase project.
2. For a new project, run `supabase/baselines/production_schema_v2.sql`.
3. Then run `supabase/seed.sql`.
4. For an existing migration-driven project, continue using `0001_initial_schema.sql` and `0002_production_hardening.sql`.
5. Add the project URL and anon key to `.env.local`.
6. Wire Auth redirects and server actions as you move from MVP scaffold to live flows.

## Product decisions baked into the scaffold

- The UI is mobile-first, premium, and restrained instead of playful or over-gamified.
- Member growth is driven by missions, education, content participation, and AI guidance.
- Proof review is admin-governed with a future AI-assist seam, not hidden automation.
- AI modules are placeholders behind typed contracts so real provider logic can be added later without rewriting the page layer.
- Locale expansion is anticipated by keeping copy and domain concepts organized instead of hard-wiring multilingual behavior into the MVP.

## Future integration points

- Replace auth page placeholders with real Supabase server actions and redirects.
- Swap the current demo-mode auth fallback for full Supabase-authenticated session enforcement in production.
- Connect Content Studio requests to external rendering or AI generation services.
- Persist dashboard data through typed repositories instead of mock data.
- Add real analytics queries and charts from Supabase views or aggregates.
- Add translations and content dictionaries for English, Bahasa Melayu, and Chinese.
