-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Default posture: anonymous (public) browser clients have ZERO access to
-- every table below. Public forms never write to Postgres directly — they
-- POST to a Next.js Route Handler, which validates, rate-limits, and only
-- then inserts using the Supabase secret key (which bypasses RLS
-- entirely, by design, and must only ever be used in server-only code).
--
-- Authenticated access is granted only to rows in admin_profiles, and only
-- for reading/updating enquiries, notes, and audit logs — never for
-- granting themselves admin status.
-- ---------------------------------------------------------------------------

alter table enquiries enable row level security;
alter table admin_profiles enable row level security;
alter table admin_notes enable row level security;
alter table audit_logs enable row level security;

-- enquiries: admins may read and update (status/triage). No anon access.
-- No insert/delete policy is defined for any browser-facing role — inserts
-- happen exclusively via the service role from trusted server code.
create policy "Admins can read enquiries"
  on enquiries for select
  to authenticated
  using (is_admin());

create policy "Admins can update enquiries"
  on enquiries for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- admin_profiles: an admin may read their own profile and the roster of
-- other admins (useful for attributing notes/audit entries), but never
-- insert or modify rows themselves.
create policy "Admins can read admin profiles"
  on admin_profiles for select
  to authenticated
  using (is_admin());

-- admin_notes: admins can read and create notes; notes are immutable
-- history once created (no update/delete policy).
create policy "Admins can read notes"
  on admin_notes for select
  to authenticated
  using (is_admin());

create policy "Admins can create notes"
  on admin_notes for insert
  to authenticated
  with check (is_admin());

-- audit_logs: read-only for admins. Written exclusively by server code
-- using the service role.
create policy "Admins can read audit logs"
  on audit_logs for select
  to authenticated
  using (is_admin());
