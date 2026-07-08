# Admin Guide

## Creating the First Admin User

There is no public sign-up. An admin account is created in two steps:

### 1. Create the Supabase Auth user

In the Supabase dashboard: **Authentication → Users → Add User**, and set
a strong initial password (have the admin change it after first login, or
send an invite email via the dashboard's invite flow instead of setting a
password directly).

Alternatively, via the Supabase Admin API / CLI:

```bash
supabase auth admin create-user \
  --email counselor@viaabroadoverseas.com \
  --password '<temporary-strong-password>'
```

Copy the generated user's UUID (`id`).

### 2. Link the admin profile

Run this in the Supabase SQL editor, substituting the real user id and
name:

```sql
insert into admin_profiles (auth_user_id, display_name, role)
values ('00000000-0000-0000-0000-000000000000', 'Counselor Name', 'admin');
```

The user can now sign in at `/admin/login`. Without this row, a valid
Supabase login still results in being redirected back to the login page —
authentication alone is not authorization (see `docs/SECURITY.md`).

### Adding more admins

Repeat both steps for each additional staff member. All admins currently
share the single `admin` role; the `admin_role` enum and `admin_profiles`
schema are structured so additional roles (e.g. a read-only role) can be
added later without a breaking migration.

## Signing In

Go to `/admin/login`, enter the admin's email and password. On success you
land on `/admin` (or the page you originally tried to reach).

## Dashboard Overview (`/admin`)

Shows live counts (new / contacted / qualified / consultation requests)
computed directly from the `enquiries` table, plus the 8 most recent
submissions. Nothing here is hardcoded — an empty database shows zeros and
an empty recent-submissions list, not placeholder data.

## Managing Enquiries (`/admin/enquiries`)

- **Filter** by enquiry type, status, and interested country using the
  filter bar (a plain GET form — filters are shareable/bookmarkable URLs).
- **Search** by name, email, or phone.
- **Sort** newest/oldest first.
- Pagination shows 20 records per page; the full table is never loaded
  into the browser at once.
- **Export CSV** downloads the currently filtered result set (up to 5,000
  rows), with spreadsheet formula-injection protection applied to every
  cell.

## Enquiry Detail (`/admin/enquiries/[id]`)

- Full submitted answers, source page, and UTM attribution (when present).
- **Call** / **Email** / **WhatsApp** (WhatsApp only if configured)
  quick-action links.
- **Status** dropdown — updates immediately via a Server Action, writes an
  audit log entry (`enquiry_status_updated`), and refreshes the page data.
- **Internal Notes** — staff-only notes attached to the enquiry, each
  timestamped and attributed to the admin who wrote it. Notes are
  append-only (no edit/delete) to preserve an honest history.

## Signing Out

Use **Sign Out** in the sidebar (desktop) or the mobile top bar icon. This
clears the Supabase session cookie.

## Troubleshooting

- **"Admin System Not Yet Configured" screen** — `NEXT_PUBLIC_SUPABASE_URL`
  / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` are not
  set in this environment. See the root `README.md`.
- **Logged in but redirected back to `/admin/login`** — the Supabase user
  exists but has no matching row in `admin_profiles`. Complete step 2
  above.
- **CSV export downloads an empty file** — the current filters match zero
  enquiries; clear filters and try again.
