# TAKWEEN

A bilingual company platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The English and Arabic public pages are available at `/en` and `/ar`; `/` redirects to English.

## Supabase configuration

Copy `.env.example` to `.env.local` and provide the Supabase project URL and public anon/publishable key:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The server and browser clients are in `src/lib/supabase`. They intentionally use only the public key; never put a service-role key, payment secret, or other private credential in a `NEXT_PUBLIC_*` variable. No Supabase project or payment provider is connected yet.

## Current foundation

- Responsive mauve-and-white public landing page with English LTR and Arabic RTL routes.
- Locale-aware metadata, language switch, and shared copy definitions.
- Bilingual employee login using Supabase Auth password sign-in; sign-up is intentionally not exposed.
- Protected employee dashboard routes with session verification, sign-out, and responsive navigation.
- Role checks use the active employee's `public.profiles.role`, verified server-side after Supabase Auth user verification. Accepted values are `super_admin`, `admin`, `manager`, and `employee`; auth metadata is not an authorization source.
- Dashboard sections apply role-specific access checks. Their employee, task, and role-management tools are still placeholders for later phases.
- Supabase SSR/browser clients and a session-refresh proxy with explicit missing-configuration messaging.
- `.env.example` is safe to commit; put real credentials in the ignored `.env.local`.

## Employee authentication setup

1. Copy `.env.example` to `.env.local`, fill in the Supabase project URL and public anon/publishable key, and restart the app.
2. Enable email/password authentication in the Supabase project and invite/create employee accounts using its trusted admin tools. This app does not provide public sign-up.
3. Apply the reviewed employee-schema migration, then assign `public.profiles.role` using a trusted server-side Supabase Admin API or database administration process. Never expose a service-role key in the browser or a `NEXT_PUBLIC_*` variable. This project does not include role assignment or a service-role client.
4. Visit `/en/login` or `/ar/login`. Unauthenticated users are redirected from the dashboard to the matching login route.

The employee area stays locked and the login form stays disabled until both environment variables are present. A Supabase project must also have the reviewed employee-schema migration applied before dashboard role lookup can succeed. Role-based navigation is a UI/access foundation, not a substitute for database Row Level Security: enforce authorization in all server actions and APIs. No migration is automatically applied by this project.

## Planned phases

1. Foundation and bilingual public-site shell (complete).
2. Authentication and employee dashboard foundation (complete; role-specific modules are placeholders).
3. Supabase employee schema and RLS migration review (current; migration is unapplied).
4. Internal tasks, communication, company calendar, and notifications.
5. Customer services, booking workflow, and secure payment-provider preparation.
6. End-to-end verification and accessibility/responsive review.

No deployment, paid service, or live payment action is performed by this project setup.

## Checks

```bash
npm run lint
npm run build
```
