# Supabase Schema V2

This document explains the production-minded database shape for the TOMEI Member Growth Platform.

## 1. Schema explanation

### Role model

- `auth.users` remains the source of authenticated identity.
- `public.users` extends identity with platform role and operational status.
- `public.app_role` is the core access enum:
  - `member`
  - `admin`

### Core domains

- `users`, `member_profiles`
  - identity, role, profile, language, bio, member preferences
- `missions`, `member_missions`
  - mission templates and per-member mission progression
- `rewards`, `member_rewards`
  - reward definitions and reward ledger
- `content_templates`, `generated_assets`
  - brand-controlled official templates and generated outputs
- `campaigns`, `campaign_participation`
  - campaign publishing and member participation records
- `news_items`, `products`
  - announcement and product education content
- `learning_modules`, `quizzes`, `quiz_attempts`
  - learning center and assessment tracking
- `ai_chat_sessions`, `ai_messages`
  - AI Coach and future AI Concierge conversations
- `proof_submissions`, `admin_reviews`
  - member proof submission and admin moderation trail
- `notifications`, `user_activity_logs`
  - member alerts and operational audit events

### Soft delete strategy

Two layers are used:

- `status`
  - business visibility state such as `active`, `inactive`, `archived`
- `deleted_at`
  - operational soft delete marker for records that should stay auditable but disappear from normal member reads

`deleted_at` is applied where content and admin-managed records are likely to be retired rather than hard-deleted:

- `users`
- `missions`
- `rewards`
- `content_templates`
- `generated_assets`
- `campaigns`
- `news_items`
- `products`
- `learning_modules`
- `quizzes`
- `ai_chat_sessions`
- `notifications`

### Integrity and operational constraints

V2 adds production-minded checks:

- profile completion must stay between `0` and `100`
- mission progress must stay between `0` and `100`
- mission reward points must be non-negative
- reward point thresholds must be non-negative
- campaign end date cannot be before start date
- quiz passing score must stay between `0` and `100`
- quiz attempt score must stay between `0` and `100`

### Indexing strategy

The schema now includes:

- ownership indexes for member-specific queries
- composite operational indexes for admin queues
- content visibility indexes for active, non-deleted content
- chronological indexes for activity and review views

Examples:

- `proof_submissions(status, submitted_at desc)`
- `generated_assets(user_id, asset_type, created_at desc)`
- `notifications(user_id, is_read, created_at desc)`
- `campaigns(status, starts_at desc, ends_at)`

### RLS strategy

- members can only access their own private rows
- members can only read active, non-deleted shared content
- admins can manage all rows through `public.is_admin()`
- storage buckets use ownership-based policies for uploads and generated outputs

## 2. SQL migration scripts

Base schema:

- [0001_initial_schema.sql](../supabase/migrations/0001_initial_schema.sql)

Production hardening migration:

- [0002_production_hardening.sql](../supabase/migrations/0002_production_hardening.sql)

Consolidated greenfield baseline:

- [production_schema_v2.sql](../supabase/baselines/production_schema_v2.sql)

## 3. RLS policies

RLS is enabled for all core tables in `0001`.

V2 updates the read policies for shared content tables so member-facing selects exclude soft-deleted content:

- `missions`
- `rewards`
- `content_templates`
- `campaigns`
- `news_items`
- `products`
- `learning_modules`
- `quizzes`

The guiding rule is:

- members see only active, non-deleted shared records
- members manage only their own rows
- admins bypass member scoping through `public.is_admin()`

## 4. Seed SQL

Seed content lives in:

- [seed.sql](../supabase/seed.sql)

It currently includes example data for:

- 10 missions
- 3 reward milestones
- 3 campaigns
- 3 news items
- 3 products
- 3 learning modules
- quizzes generated from those modules
- 3 brand-controlled content templates

This gives the app enough baseline content to render the member journey, admin content views, and learning flows during MVP development.
