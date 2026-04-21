create extension if not exists "pgcrypto";

create type public.app_role as enum ('member', 'admin');
create type public.record_status as enum ('active', 'inactive', 'archived');
create type public.mission_type as enum ('profile', 'content', 'social', 'learning', 'ai', 'campaign');
create type public.mission_status as enum ('locked', 'available', 'in_progress', 'submitted', 'completed');
create type public.asset_type as enum ('poster', 'caption', 'video');
create type public.submission_status as enum ('pending', 'approved', 'needs_revision');
create type public.notification_type as enum ('mission', 'campaign', 'news', 'reward', 'system');

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.app_role not null default 'member',
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  first_name text,
  last_name text,
  display_name text,
  mobile_number text,
  preferred_locale text default 'en-MY',
  bio text,
  photo_path text,
  favorite_category text,
  preferred_tone text,
  profile_completion integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  type public.mission_type not null,
  sequence integer not null unique,
  reward_points integer not null default 0,
  reward_item text,
  unlock_condition text not null,
  proof_requirement text not null,
  validation_rule text not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.proof_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  platform text not null,
  social_url text not null,
  screenshot_path text,
  status public.submission_status not null default 'pending',
  review_notes text,
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  status public.mission_status not null default 'locked',
  progress_percentage integer not null default 0,
  proof_submission_id uuid references public.proof_submissions(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, mission_id)
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  badge_name text,
  points_required integer not null default 0,
  reward_type text not null default 'milestone',
  is_redeemable boolean not null default false,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.member_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  reward_id uuid not null references public.rewards(id) on delete cascade,
  source_member_mission_id uuid references public.member_missions(id) on delete set null,
  points_awarded integer not null default 0,
  awarded_at timestamptz not null default timezone('utc', now()),
  notes text
);

create table public.content_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  asset_type public.asset_type not null,
  audience text,
  metadata jsonb not null default '{}'::jsonb,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.generated_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  template_id uuid references public.content_templates(id) on delete set null,
  asset_type public.asset_type not null,
  title text not null,
  storage_path text,
  request_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  generation_status text not null default 'queued',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  theme text not null,
  summary text not null,
  cta text,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.campaign_participation (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  status text not null default 'joined',
  milestone_reached text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, campaign_id)
);

create table public.news_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  title text not null,
  summary text not null,
  body text,
  published_at timestamptz not null default timezone('utc', now()),
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  story text not null,
  price_range text,
  spotlight text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null,
  duration_minutes integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  learning_module_id uuid not null references public.learning_modules(id) on delete cascade,
  slug text not null unique,
  title text not null,
  passing_score integer not null default 70,
  question_payload jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null default 0,
  answers_payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default timezone('utc', now())
);

create table public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  chat_type text not null default 'coach',
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  sender text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.admin_reviews (
  id uuid primary key default gen_random_uuid(),
  proof_submission_id uuid not null references public.proof_submissions(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  outcome public.submission_status not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.user_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  activity_type text not null,
  detail text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index idx_member_missions_user_id on public.member_missions(user_id);
create index idx_generated_assets_user_id on public.generated_assets(user_id);
create index idx_proof_submissions_user_id on public.proof_submissions(user_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_user_activity_logs_user_id on public.user_activity_logs(user_id);

create trigger users_set_updated_at before update on public.users for each row execute function public.handle_updated_at();
create trigger member_profiles_set_updated_at before update on public.member_profiles for each row execute function public.handle_updated_at();
create trigger missions_set_updated_at before update on public.missions for each row execute function public.handle_updated_at();
create trigger member_missions_set_updated_at before update on public.member_missions for each row execute function public.handle_updated_at();
create trigger rewards_set_updated_at before update on public.rewards for each row execute function public.handle_updated_at();
create trigger content_templates_set_updated_at before update on public.content_templates for each row execute function public.handle_updated_at();
create trigger generated_assets_set_updated_at before update on public.generated_assets for each row execute function public.handle_updated_at();
create trigger campaigns_set_updated_at before update on public.campaigns for each row execute function public.handle_updated_at();
create trigger campaign_participation_set_updated_at before update on public.campaign_participation for each row execute function public.handle_updated_at();
create trigger news_items_set_updated_at before update on public.news_items for each row execute function public.handle_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.handle_updated_at();
create trigger learning_modules_set_updated_at before update on public.learning_modules for each row execute function public.handle_updated_at();
create trigger quizzes_set_updated_at before update on public.quizzes for each row execute function public.handle_updated_at();
create trigger ai_chat_sessions_set_updated_at before update on public.ai_chat_sessions for each row execute function public.handle_updated_at();
create trigger proof_submissions_set_updated_at before update on public.proof_submissions for each row execute function public.handle_updated_at();

insert into storage.buckets (id, name, public)
values
  ('profile-uploads', 'profile-uploads', false),
  ('generated-assets', 'generated-assets', false),
  ('proof-screenshots', 'proof-screenshots', false)
on conflict (id) do nothing;

alter table public.users enable row level security;
alter table public.member_profiles enable row level security;
alter table public.missions enable row level security;
alter table public.proof_submissions enable row level security;
alter table public.member_missions enable row level security;
alter table public.rewards enable row level security;
alter table public.member_rewards enable row level security;
alter table public.content_templates enable row level security;
alter table public.generated_assets enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_participation enable row level security;
alter table public.news_items enable row level security;
alter table public.products enable row level security;
alter table public.learning_modules enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_messages enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.user_activity_logs enable row level security;

create policy "users can read own row or admin can read all"
on public.users for select
using (id = auth.uid() or public.is_admin());

create policy "admins manage users"
on public.users for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own profile"
on public.member_profiles for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read active missions"
on public.missions for select
using (status = 'active' or public.is_admin());

create policy "admins manage missions"
on public.missions for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own proof submissions"
on public.proof_submissions for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members manage own member missions"
on public.member_missions for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read active rewards"
on public.rewards for select
using (status = 'active' or public.is_admin());

create policy "admins manage rewards"
on public.rewards for all
using (public.is_admin())
with check (public.is_admin());

create policy "members read own reward ledger"
on public.member_rewards for select
using (user_id = auth.uid() or public.is_admin());

create policy "admins manage reward ledger"
on public.member_rewards for all
using (public.is_admin())
with check (public.is_admin());

create policy "members read active content templates"
on public.content_templates for select
using (status = 'active' or public.is_admin());

create policy "admins manage content templates"
on public.content_templates for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own generated assets"
on public.generated_assets for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read active campaigns"
on public.campaigns for select
using (status = 'active' or public.is_admin());

create policy "admins manage campaigns"
on public.campaigns for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own campaign participation"
on public.campaign_participation for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read active news items"
on public.news_items for select
using (status = 'active' or public.is_admin());

create policy "admins manage news items"
on public.news_items for all
using (public.is_admin())
with check (public.is_admin());

create policy "members read active products"
on public.products for select
using (status = 'active' or public.is_admin());

create policy "admins manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

create policy "members read active learning modules"
on public.learning_modules for select
using (status = 'active' or public.is_admin());

create policy "admins manage learning modules"
on public.learning_modules for all
using (public.is_admin())
with check (public.is_admin());

create policy "members read quizzes"
on public.quizzes for select
using (public.is_admin() or exists (
  select 1 from public.learning_modules lm
  where lm.id = learning_module_id
    and lm.status = 'active'
));

create policy "admins manage quizzes"
on public.quizzes for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own quiz attempts"
on public.quiz_attempts for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members manage own ai sessions"
on public.ai_chat_sessions for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read messages in owned sessions"
on public.ai_messages for select
using (
  public.is_admin() or exists (
    select 1 from public.ai_chat_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  )
);

create policy "admins manage ai messages"
on public.ai_messages for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage admin reviews"
on public.admin_reviews for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage own notifications"
on public.notifications for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "members read own activity logs"
on public.user_activity_logs for select
using (user_id = auth.uid() or public.is_admin());

create policy "admins manage activity logs"
on public.user_activity_logs for all
using (public.is_admin())
with check (public.is_admin());

create policy "members manage profile uploads bucket"
on storage.objects for all
using (
  bucket_id = 'profile-uploads'
  and (owner = auth.uid() or public.is_admin())
)
with check (
  bucket_id = 'profile-uploads'
  and (owner = auth.uid() or public.is_admin())
);

create policy "members manage generated assets bucket"
on storage.objects for all
using (
  bucket_id = 'generated-assets'
  and (owner = auth.uid() or public.is_admin())
)
with check (
  bucket_id = 'generated-assets'
  and (owner = auth.uid() or public.is_admin())
);

create policy "members manage proof screenshots bucket"
on storage.objects for all
using (
  bucket_id = 'proof-screenshots'
  and (owner = auth.uid() or public.is_admin())
)
with check (
  bucket_id = 'proof-screenshots'
  and (owner = auth.uid() or public.is_admin())
);
