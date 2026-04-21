# Supabase SQL Editor Setup

Use this guide when you want to install the database manually through the Supabase SQL Editor.

## New project setup

1. Open your Supabase project.
2. Go to `SQL Editor`.
3. Run [production_schema_v2.sql](../supabase/baselines/production_schema_v2.sql).
4. Run [seed.sql](../supabase/seed.sql).
5. Confirm the three storage buckets exist:
   - `profile-uploads`
   - `generated-assets`
   - `proof-screenshots`

## Promote an account to admin

After a real user signs up through Supabase Auth, run:

```sql
update public.users
set role = 'admin'
where email = 'admin@example.com';
```

## Recommended verification queries

```sql
select id, email, role, status
from public.users
order by created_at desc;
```

```sql
select slug, title, sequence, status
from public.missions
order by sequence asc;
```

```sql
select slug, title, points_required
from public.rewards
order by points_required asc;
```

```sql
select slug, title, status
from public.campaigns
order by starts_at desc nulls last;
```

## Existing migration-driven project

If the project already tracks migrations, use:

1. [0001_initial_schema.sql](../supabase/migrations/0001_initial_schema.sql)
2. [0002_production_hardening.sql](../supabase/migrations/0002_production_hardening.sql)
3. [seed.sql](../supabase/seed.sql)

Use the consolidated baseline only for greenfield initialization.
