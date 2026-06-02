# How to run ClientFlow (clientora)

## What this project is

A **Next.js 15** app (ClientFlow CRM) with three portals after login:

| URL | Who |
|-----|-----|
| `/` | Marketing landing (no login) |
| `/auth/signup`, `/auth/login` | Everyone |
| `/freelancer/...` | Freelancer role |
| `/client/...` | Client role |
| `/admin/...` | Admin role (needs `profiles.role = admin` in Supabase) |
| `/portal/[token]` | Public read-only workspace snapshot (uses service role on server) |

Backend is **Supabase** (Postgres + Auth + Storage + Realtime). SQL lives in `supabase/migrations/`. The app expects tables like `profiles`, `referral_codes`, `project_requests`, `workspaces`, etc.

## Run locally (quick)

1. **Install** (once): `npm install`

2. **Environment**: copy `.env.example` to **`.env.local`** (create this file yourself; it is gitignored) and fill:

   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project (Settings → API).
   - Optional: `SUPABASE_SERVICE_ROLE_KEY` (server only) for `/admin` actions and `/portal/[token]`.
   - Optional: `GEMINI_API_KEY` for `/api/ai` (AI assistant button).

3. **Database**: in Supabase, run migrations (CLI):

   ```bash
   npx supabase link --project-ref YOUR_REF
   npx supabase db push
   ```

   Or paste SQL from `supabase/migrations/20250512120000_clientflow_initial.sql` into the SQL editor and run.

4. **Start dev server**:

   ```bash
   npm run dev
   ```

   Open **http://localhost:3000** — you should see the landing page.

5. **Auth**: sign up as Freelancer or Client. The `profiles` row is created by the DB trigger `handle_new_user` when `auth.users` is inserted (metadata must include `role` and `full_name` from signup).

## What works without real Supabase

Almost nothing that touches the database: middleware still calls Supabase to refresh the session, so **you need valid URL + anon key** (can be a real project with empty DB until you migrate).

## Other commands

- `npm run build` — production build (needs same env vars as runtime for middleware).
- `npm run test:e2e` — Playwright smoke test (starts dev server; needs `PLAYWRIGHT_BASE_URL` or default `http://127.0.0.1:3000`).

## Project map (high level)

- `app/` — routes (marketing, auth, freelancer, client, admin, `api/ai`, `portal`).
- `app/actions/` — server actions (mutations).
- `lib/supabase/` — browser + server Supabase clients; `admin.ts` = service role (never expose to client).
- `components/` — UI, layouts, workspace widgets, AI assistant.
- `hooks/` — realtime hooks for chat, notifications, requests.

If something fails on startup, check the terminal: missing `NEXT_PUBLIC_SUPABASE_*` is the most common cause.
