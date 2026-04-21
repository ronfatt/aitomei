# Supabase Production Baseline

For a brand new Supabase project, use:

1. [production_schema_v2.sql](../supabase/baselines/production_schema_v2.sql)
2. [seed.sql](../supabase/seed.sql)

Use this baseline when you want a single, consolidated initialization script.

## When to use which file

- New project bootstrap:
  - `supabase/baselines/production_schema_v2.sql`
  - then `supabase/seed.sql`
- Existing project already using migration history:
  - `supabase/migrations/0001_initial_schema.sql`
  - `supabase/migrations/0002_production_hardening.sql`

## What is included

- core tables
- enums
- primary keys and foreign keys
- timestamps and update triggers
- soft delete fields where relevant
- integrity constraints
- operational indexes
- storage buckets
- RLS policies
- member/admin role model

This baseline is functionally equivalent to applying `0001` and then `0002`, but is easier to use for clean-room project initialization.
