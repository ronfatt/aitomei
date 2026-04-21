alter table public.users
  add column if not exists deleted_at timestamptz;

alter table public.member_profiles
  add constraint member_profiles_profile_completion_range
  check (profile_completion between 0 and 100);

alter table public.missions
  add column if not exists deleted_at timestamptz,
  add constraint missions_reward_points_non_negative
  check (reward_points >= 0);

alter table public.proof_submissions
  add column if not exists reviewed_at timestamptz;

alter table public.member_missions
  add constraint member_missions_progress_percentage_range
  check (progress_percentage between 0 and 100);

alter table public.rewards
  add column if not exists deleted_at timestamptz,
  add constraint rewards_points_required_non_negative
  check (points_required >= 0);

alter table public.content_templates
  add column if not exists deleted_at timestamptz;

alter table public.generated_assets
  add column if not exists deleted_at timestamptz,
  add column if not exists generation_completed_at timestamptz;

alter table public.campaigns
  add column if not exists deleted_at timestamptz,
  add constraint campaigns_valid_window
  check (ends_at is null or starts_at is null or ends_at >= starts_at);

alter table public.news_items
  add column if not exists deleted_at timestamptz;

alter table public.products
  add column if not exists deleted_at timestamptz;

alter table public.learning_modules
  add column if not exists deleted_at timestamptz;

alter table public.quizzes
  add column if not exists deleted_at timestamptz,
  add constraint quizzes_passing_score_range
  check (passing_score between 0 and 100);

alter table public.quiz_attempts
  add constraint quiz_attempts_score_range
  check (score between 0 and 100);

alter table public.ai_chat_sessions
  add column if not exists deleted_at timestamptz;

alter table public.notifications
  add column if not exists read_at timestamptz,
  add column if not exists deleted_at timestamptz;

create index if not exists idx_users_role_status
  on public.users(role, status)
  where deleted_at is null;

create index if not exists idx_missions_active_sequence
  on public.missions(status, deleted_at, sequence);

create index if not exists idx_member_missions_user_status
  on public.member_missions(user_id, status, updated_at desc);

create index if not exists idx_proof_submissions_status_submitted_at
  on public.proof_submissions(status, submitted_at desc);

create index if not exists idx_generated_assets_user_type_created_at
  on public.generated_assets(user_id, asset_type, created_at desc)
  where deleted_at is null;

create index if not exists idx_campaigns_status_window
  on public.campaigns(status, starts_at desc, ends_at)
  where deleted_at is null;

create index if not exists idx_campaign_participation_campaign_status
  on public.campaign_participation(campaign_id, status, updated_at desc);

create index if not exists idx_news_items_status_published_at
  on public.news_items(status, published_at desc)
  where deleted_at is null;

create index if not exists idx_products_status_category
  on public.products(status, category)
  where deleted_at is null;

create index if not exists idx_learning_modules_status_category
  on public.learning_modules(status, category)
  where deleted_at is null;

create index if not exists idx_quiz_attempts_user_completed_at
  on public.quiz_attempts(user_id, completed_at desc);

create index if not exists idx_ai_messages_session_created_at
  on public.ai_messages(session_id, created_at asc);

create index if not exists idx_admin_reviews_proof_submission_created_at
  on public.admin_reviews(proof_submission_id, created_at desc);

create index if not exists idx_notifications_user_unread_created_at
  on public.notifications(user_id, is_read, created_at desc)
  where deleted_at is null;

create index if not exists idx_user_activity_logs_user_created_at
  on public.user_activity_logs(user_id, created_at desc);

drop policy if exists "members read active missions" on public.missions;
create policy "members read active missions"
on public.missions for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active rewards" on public.rewards;
create policy "members read active rewards"
on public.rewards for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active content templates" on public.content_templates;
create policy "members read active content templates"
on public.content_templates for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active campaigns" on public.campaigns;
create policy "members read active campaigns"
on public.campaigns for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active news items" on public.news_items;
create policy "members read active news items"
on public.news_items for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active products" on public.products;
create policy "members read active products"
on public.products for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read active learning modules" on public.learning_modules;
create policy "members read active learning modules"
on public.learning_modules for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "members read quizzes" on public.quizzes;
create policy "members read quizzes"
on public.quizzes for select
using (
  public.is_admin()
  or (
    deleted_at is null
    and exists (
      select 1
      from public.learning_modules lm
      where lm.id = learning_module_id
        and lm.status = 'active'
        and lm.deleted_at is null
    )
  )
);
