create or replace function public.sync_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_role public.app_role;
  resolved_display_name text;
begin
  resolved_role := coalesce((new.raw_app_meta_data ->> 'role')::public.app_role, 'member');
  resolved_display_name := coalesce(
    new.raw_user_meta_data ->> 'display_name',
    concat_ws(' ', new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name')
  );

  insert into public.users (
    id,
    email,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    resolved_role,
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role,
        status = 'active',
        updated_at = timezone('utc', now());

  insert into public.member_profiles (
    user_id,
    first_name,
    last_name,
    display_name,
    mobile_number,
    preferred_locale,
    profile_completion
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(resolved_display_name, ''),
    nullif(new.raw_user_meta_data ->> 'mobile_number', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_locale', ''), 'en-MY'),
    25
  )
  on conflict (user_id) do update
    set first_name = coalesce(excluded.first_name, public.member_profiles.first_name),
        last_name = coalesce(excluded.last_name, public.member_profiles.last_name),
        display_name = coalesce(excluded.display_name, public.member_profiles.display_name),
        mobile_number = coalesce(excluded.mobile_number, public.member_profiles.mobile_number),
        preferred_locale = coalesce(excluded.preferred_locale, public.member_profiles.preferred_locale),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists sync_auth_user_on_insert on auth.users;
create trigger sync_auth_user_on_insert
after insert on auth.users
for each row execute procedure public.sync_auth_user();

drop trigger if exists sync_auth_user_on_update on auth.users;
create trigger sync_auth_user_on_update
after update of email, raw_user_meta_data, raw_app_meta_data on auth.users
for each row execute procedure public.sync_auth_user();

insert into public.users (
  id,
  email,
  role,
  status
)
select
  id,
  coalesce(email, ''),
  coalesce((raw_app_meta_data ->> 'role')::public.app_role, 'member'),
  'active'
from auth.users
on conflict (id) do update
set email = excluded.email,
    role = excluded.role,
    status = 'active',
    updated_at = timezone('utc', now());

insert into public.member_profiles (
  user_id,
  first_name,
  last_name,
  display_name,
  mobile_number,
  preferred_locale,
  profile_completion
)
select
  id,
  nullif(raw_user_meta_data ->> 'first_name', ''),
  nullif(raw_user_meta_data ->> 'last_name', ''),
  nullif(
    coalesce(
      raw_user_meta_data ->> 'display_name',
      concat_ws(' ', raw_user_meta_data ->> 'first_name', raw_user_meta_data ->> 'last_name')
    ),
    ''
  ),
  nullif(raw_user_meta_data ->> 'mobile_number', ''),
  coalesce(nullif(raw_user_meta_data ->> 'preferred_locale', ''), 'en-MY'),
  25
from auth.users
on conflict (user_id) do update
set first_name = coalesce(excluded.first_name, public.member_profiles.first_name),
    last_name = coalesce(excluded.last_name, public.member_profiles.last_name),
    display_name = coalesce(excluded.display_name, public.member_profiles.display_name),
    mobile_number = coalesce(excluded.mobile_number, public.member_profiles.mobile_number),
    preferred_locale = coalesce(excluded.preferred_locale, public.member_profiles.preferred_locale),
    updated_at = timezone('utc', now());
