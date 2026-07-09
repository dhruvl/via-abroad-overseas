# Deployment

Production model: **Vercel** (app) + **Supabase** (database/auth) +
**Resend** (email) + **Cloudflare Turnstile** (bot protection) +
**Upstash** (rate limiting) + **GitHub** (source control + CI).

## 1. GitHub

1. Push this repository to a GitHub repo (private, unless you choose
   otherwise).
2. Confirm `.github/workflows/ci.yml` runs on pull requests (lint,
   typecheck, unit tests, build, e2e).

## 2. Supabase (Production Database Setup)

1. Create a new Supabase project (separate from any staging/dev project).
2. In **Project Settings → API Keys**, copy the Project URL, the
   `publishable` key (`sb_publishable_...`), and the `secret` key
   (`sb_secret_...`).
3. Apply migrations in order (SQL editor, or `supabase db push` with the
   CLI linked to this project) from `supabase/migrations/`.
4. Confirm Row Level Security is **enabled** on `enquiries`,
   `admin_profiles`, `admin_notes`, and `audit_logs` (Table Editor → each
   table → RLS toggle).
5. Create the first admin user and link their `admin_profiles` row — see
   `docs/ADMIN_GUIDE.md`.
6. Disable public sign-ups for this project if not already the default
   (**Authentication → Providers → Email → disable "Allow new users to
   sign up"** if you want to be extra explicit — this app never exposes a
   sign-up UI regardless).
7. Test: attempt to query `enquiries` with the publishable key and no
   session (should return zero rows / permission denied) — confirms RLS
   is actually enforced, not just enabled.
8. Test: sign in as the admin user at `/admin/login` in a preview
   deployment and confirm the dashboard loads real data.

## 3. Resend (Email)

1. Create a Resend account and API key.
2. Add and verify your sending domain (e.g. `viaabroadoverseas.com`):
   add the **SPF**, **DKIM**, and **DMARC** DNS records Resend provides
   under **Domains** in the Resend dashboard.
3. Set `RESEND_FROM_EMAIL` to a verified address on that domain, e.g.
   `"VIA ABROAD OVERSEAS <hello@viaabroadoverseas.com>"`.
4. Set `BUSINESS_NOTIFICATION_EMAIL` to the mailbox that should receive
   new-enquiry notifications (`viaabroadoverseas@gmail.com` by default).
5. Send a test enquiry through the deployed contact form and confirm both
   the business notification and student confirmation emails arrive.

## 4. Cloudflare Turnstile

1. Create a Turnstile widget in the Cloudflare dashboard.
2. Restrict it to your production hostname(s) (and Vercel preview domains
   if you want bot protection on previews too).
3. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
4. Confirm `ALLOW_UNVERIFIED_TURNSTILE_IN_DEV` is **not** set in
   production environment variables.

## 5. Upstash

1. Create an Upstash Redis database (choose a region close to your Vercel
   deployment region for latency).
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

## 6. Vercel

1. Import the GitHub repository into Vercel.
2. Configure environment variables for **Production**, **Preview**, and
   **Development** separately in Vercel's Project Settings → Environment
   Variables:
   - Production: real Supabase/Resend/Turnstile/Upstash/GA4 credentials
     pointed at your production project/domain restrictions.
   - Preview: either the same non-destructive values, or a separate
     staging Supabase project — do **not** point Preview at production
     Turnstile hostname restrictions unless preview URLs are allow-listed.
   - Never mark `SUPABASE_SECRET_KEY` or other server-only secrets as
     exposed to the browser (Vercel only exposes `NEXT_PUBLIC_*`
     variables client-side by Next.js convention regardless, but keep
     naming consistent).
3. Set `NEXT_PUBLIC_SITE_URL` to your final production domain
   (`https://www.viaabroadoverseas.com` or similar) — this feeds
   canonical URLs, the sitemap, Open Graph tags, and email links. If you
   do NOT set it, the app now automatically falls back to Vercel's
   production domain (`VERCEL_PROJECT_PRODUCTION_URL`), so canonical/sitemap
   URLs are never `localhost` on a deployed build — but you should still
   set it explicitly once a custom domain exists.
4. Deploy.

> **CRITICAL — `NEXT_PUBLIC_*` values are baked in at BUILD time.** Adding
> or changing any `NEXT_PUBLIC_*` variable in Vercel does nothing to an
> already-running deployment; you MUST trigger a fresh production
> deployment (redeploy) for the new values to take effect. Symptoms of a
> build that ran without them: canonical tags / sitemap show
> `http://localhost:3000`, and the admin pages render "Admin System Not
> Yet Configured" (because `NEXT_PUBLIC_SUPABASE_URL` /
> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` were empty at build time). Server
> secrets (`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`,
> `UPSTASH_*`) are read at request time and do not require a rebuild, but
> keeping everything set before the first production build is simplest.

## 7. Domain Configuration

1. Add your custom domain in Vercel (**Project → Domains**).
2. Configure DNS per Vercel's instructions (A/CNAME records).
3. Choose a canonical host (e.g. `www`) and let Vercel redirect the other
   (apex → `www` or vice versa) — configure this in the Domains panel.
4. HTTPS is automatic via Vercel; the app additionally sends
   `Strict-Transport-Security` in production (see `next.config.ts`).
5. Update `NEXT_PUBLIC_SITE_URL` to match the final canonical domain and
   redeploy.
6. Re-verify the Resend sending domain's SPF/DKIM/DMARC records once DNS
   has propagated.

## 8. CI/CD

`.github/workflows/ci.yml` runs on every pull request and push to `main`:
install → lint → typecheck → unit tests → production build, followed by a
Playwright e2e job. No secrets are referenced in the workflow — the build
and tests are designed to succeed using the graceful-degradation behavior
described in the root `README.md`, so preview/PR builds never need
production credentials.

## Post-Deployment Checklist

- [ ] Home page and all public routes load over HTTPS on the final domain
- [ ] Contact form submission appears in `/admin/enquiries`
- [ ] Business notification email received
- [ ] Student confirmation email received
- [ ] Admin login works; non-admin Supabase users are correctly denied
- [ ] `/sitemap.xml` and `/robots.txt` resolve and reference the correct
      domain
- [ ] Lighthouse/Core Web Vitals spot-check on the home page (mobile)
- [ ] GA4 realtime report shows a pageview after accepting cookie consent
