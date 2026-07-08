-- Admin profiles map a Supabase Auth user to an internal role. Rows are
-- created manually / via invitation by a project owner — there is no
-- public registration flow, and application code never lets a user grant
-- themselves this row.
create table admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null,
  role admin_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index admin_profiles_auth_user_id_idx on admin_profiles (auth_user_id);

comment on table admin_profiles is 'Internal admin users. Created manually/by invitation only — never via public sign-up.';

-- Helper used throughout RLS policies to check whether the current
-- authenticated user is a known admin. SECURITY DEFINER so it can read
-- admin_profiles regardless of the calling role's row-level policies,
-- without granting the caller broader access.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_profiles where auth_user_id = auth.uid()
  );
$$;
