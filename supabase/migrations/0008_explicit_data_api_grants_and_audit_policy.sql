-- ---------------------------------------------------------------------------
-- Explicit Data API privileges and append-only admin audit writes.
--
-- Keep SQL privileges separate from RLS: these grants expose only the
-- columns/operations used by the application, while policies still decide
-- which authenticated admin rows are accessible.
-- ---------------------------------------------------------------------------

-- Clear any legacy/default grants on these application tables. The public
-- browser role must never read protected data, and authenticated/service
-- roles receive only the operations used by server code below.
revoke all privileges on table
  public.enquiries,
  public.admin_profiles,
  public.admin_notes,
  public.audit_logs
from anon, authenticated, service_role, public;

-- Public enquiry Route Handlers use the server-only secret client. It inserts
-- the validated payload and reads back only the generated id and timestamp.
grant insert (
  enquiry_type,
  full_name,
  phone,
  email,
  interested_country,
  service_required,
  current_qualification,
  interested_course,
  message,
  source_path,
  referrer,
  utm_source,
  utm_medium,
  utm_campaign,
  consent,
  consent_at,
  abuse_fingerprint
) on table public.enquiries to service_role;
grant select (id, created_at) on table public.enquiries to service_role;

-- Admin dashboard queries and CSV export use the authenticated session client.
grant select on table public.enquiries to authenticated;
grant update (status) on table public.enquiries to authenticated;

-- requireAdmin and the notes relationship read only these profile columns.
grant select (id, auth_user_id, display_name, role)
  on table public.admin_profiles to authenticated;

grant select on table public.admin_notes to authenticated;
grant insert (enquiry_id, admin_user_id, note)
  on table public.admin_notes to authenticated;

-- Preserve the existing admin-only read policy for audit history. Mutations
-- append only; no authenticated UPDATE or DELETE grant is given.
grant select on table public.audit_logs to authenticated;
grant insert (admin_user_id, action, entity_type, entity_id, safe_metadata)
  on table public.audit_logs to authenticated;

-- Policies call this SECURITY DEFINER helper. It is needed by authenticated
-- admin queries/policies only, not by anonymous or service-role callers.
revoke execute on function public.is_admin() from public, anon, service_role;
grant execute on function public.is_admin() to authenticated;

-- The application supplies the authenticated admin's profile id. Enforce
-- that attribution in the database as well, so callers cannot write audit
-- rows on behalf of another admin.
drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (
    (select public.is_admin())
    and admin_user_id = (
      select profile.id
      from public.admin_profiles as profile
      where profile.auth_user_id = (select auth.uid())
    )
  );
