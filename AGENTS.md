# AGENTS.md

## Project Snapshot
- PortraitWiz is a Next.js 15 / React 19 application that generates AI-powered professional portraits.
- Users authenticate with Supabase, purchase credits through Stripe, and spend credits to run image generations.
- Image generation supports OpenAI `gpt-image-1` by default with automatic Gemini 2.5 Flash fallback when reference images are supplied.
- The UI is built with Tailwind CSS, shadcn/ui components, Lucide icons, and Jotai for lightweight global state.

## Tech Stack & Key Dependencies
- Next.js App Router (Turbopack during `dev`, `build`) running server components by default.
- Supabase (`@supabase/ssr`) for auth (browser + server clients) and the Postgres database.
- Stripe SDK for checkout sessions and webhooks that increment credits via Postgres RPC.
- Jotai (`lib/atoms.ts`) to store `{ user, profile, session }` client-side.
- shadcn/ui primitives, Tailwind CSS v4, sonner toasts, lucide-react icon set, next-themes for dark mode.
- Optional image providers: OpenAI Images API and Google Gemini 2.5 Flash Image Preview.

## Repository Layout Highlights
- `app/` route groups: landing (`page.tsx`), pricing, contact, auth, dashboard, API routes (`app/api/**`), legal pages, and Stripe success screen.
- `components/`: shared UI (`components/ui/*`), dashboard widgets, navbar/footer, and the main `ImageGen` experience.
- `lib/`: configuration data (`settings.ts`, `outfits.ts`, `female_outfits.ts`, `pricing-data.ts`), error mappers, atoms, and utilities.
- `providers/`: client wrappers for Supabase auth (`AuthProvider`) and theme switching.
- `utils/supabase/`: client/server/middleware helpers plus `migrations.md` describing required tables, RPC functions, and RLS policies.
- `public/`: shared SVG/illustration assets; `portrait-prompts.json` documents prompt recipes.

## Authentication & State Flow
- `providers/AuthProvider.tsx` runs on the client and:
  1. hydrates an initial Supabase session,
  2. subscribes to auth state changes,
  3. fetches the related `profiles` row,
  4. writes `{ user, session, profile }` into the global `authAtom`.
- Middleware (`middleware.ts`) enforces access:
  - redirects unauthenticated users away from `/dashboard/**`,
  - sends signed-in users with a username away from `/enter` and `/register`,
  - allows onboarding (username creation) for users lacking `profile.username`.
- Dashboard routes (`app/dashboard/**`) double-check auth on the client and push users back to `/enter` if not signed in.

## Credits & Payment Lifecycle
1. Pricing UI pulls packages from `lib/pricing-data.ts` and renders via `app/pricing/Card.tsx`.
2. Buying credits calls `/api/checkout` (`app/api/checkout/route.ts`):
   - verifies Supabase session,
   - maps `packageId` to price/credit metadata,
   - creates a Stripe Checkout Session with the user id, package id, and credit amount in metadata.
3. Stripe webhook (`app/api/webhook/route.ts`) validates signatures, extracts metadata, and invokes `increment_credits` RPC on Supabase.
4. After checkout, users land on `/success`, which reads the `credits` query string and presents quick actions.
5. In the UI, `InsufficientCreditsDialog` surfaces pricing options when a generation is attempted without credits.

## Image Generation Pipeline
1. Users interact with `components/main/image-gen/image-gen.tsx`:
   - Drag-and-drop up to four ≤5 MB reference images (converted to base64 strips),
   - Choose a background `setting` (`lib/settings.ts`) and gender-specific outfit prompt (`lib/outfits.ts`, `lib/female_outfits.ts`),
   - Add freeform instructions limited to 500 characters,
   - Reuse generated images as new references or download the PNG.
2. The component checks auth/credits, opens the "insufficient credits" dialog if needed, and POSTs to `/api/generate-image`.
3. `app/api/generate-image/route.ts`:
   - validates payload, provider overrides, optional size (`256|512|1024`) and quality (`standard|high`),
   - fetches the authenticated user and credits via Supabase server client,
   - fails with friendly messages from `lib/error-messages.ts` for auth or credit issues,
   - dispatches to `generateImage` helper (`app/api/calls/image-gen.ts`).
4. `generateImage` selects a provider:
   - defaults to env `IMAGE_GENERATION_PROVIDER` or `openai`,
   - forces Gemini when reference images are included, because OpenAI rejects them,
   - delegates to `generateOpenAIImage` (OpenAI fetch wrapper with extra logging and error mapping) or `generateGeminiImage` (Google REST call using `GEMINI_API_KEY`).
5. On success the route calls Supabase `deduct_credits` RPC, returns `{ image_data, credits_data }`, and the client updates the global atom to reflect the new balance.
6. Dedicated `/api/openai-image` mirrors the same guardrails but only targets OpenAI; it still blocks reference-image payloads.

## Contact & Support
- The contact page (`app/contact/page.tsx`) uses react-hook-form with Zod validation and posts to `/api/contact`.
- `/api/contact/route.ts` re-validates input and stores submissions in the `contact_messages` table (see `utils/supabase/migrations.md` for schema and RLS guidance).

## API Surface (routes under `app/api`)
- `POST /api/generate-image` — core generation endpoint with automatic provider selection and credit deduction.
- `POST /api/openai-image` — OpenAI-only generation variant.
- `POST /api/checkout` — create Stripe checkout session.
- `POST /api/webhook` — Stripe webhook; requires `STRIPE_WEBHOOK_SECRET` and service key access to `increment_credits`.
- `POST /api/contact` — persist contact form submissions.

## Database Expectations
- Supabase auth with a `profiles` table (`id uuid`, `username`, `credits`, etc.) joined to `auth.users`.
- Stored functions:
  - `increment_credits(user_id uuid, amount int)` — used by webhook.
  - `deduct_credits(user_id uuid, amount int)` — returns new balance on generation.
- Optional tables in `migrations.md`: `generated_images` for storing outputs, `contact_messages` for support inbox.
- Remember to enable RLS and apply the policies described in `utils/supabase/migrations.md`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY` (required for reference image runs and Gemini fallback)
- Optional: `IMAGE_GENERATION_PROVIDER` to set default provider (`openai` | `gemini`)

## UI & UX Notes
- `app/layout.tsx` wraps the app with `AuthProvider`, `ThemeProvider`, navbar/footer, Sonner toaster, and Vercel Speed Insights.
- Navbar shows credits in a badge and exposes a dropdown with profile/settings links; signing out clears `authAtom`.
- Dashboard currently offers Profile and Settings tabs:
  - `ProfileTab` pulls data from `authAtom` (username, email, credits).
  - `SettingsTab` lets users update `profile.username` via Supabase client (currently does not refresh the global atom after a successful update; consider syncing state for immediate UI feedback).
- Theme toggling uses `components/ui/theme-toggle.tsx` with next-themes.
- Tailwind utility `cn` merges class strings; components rely on 2-space indentation and standard shadcn patterns.

## Developer Workflow & Tooling
- Scripts (`package.json`):
  - `npm run dev` — Next.js dev server with Turbopack.
  - `npm run build` — production build (also Turbopack).
  - `npm run start` — serve built app.
  - `npm run lint` — Flat ESLint (`next/core-web-vitals`, TypeScript rules).
- `next.config.ts` currently ignores ESLint and TypeScript errors during builds; address issues locally with `npm run lint` before shipping.
- No automated tests yet; document manual QA for flows you touch.
- TypeScript strictness is minimal in some areas (e.g., `AuthProvider` props are untyped) — add explicit types when expanding public APIs/components.

## Known Gaps / Follow-ups
- Username updates in `components/dashboard/SettingsTab.tsx` do not push the new value back into `authAtom`; refresh is needed to see changes in the navbar.
- `lib/hooks.ts` is empty; remove or populate with shared hooks as the project grows.
- Default Next.js metadata (`app/layout.tsx`) still uses generic "Create Next App" values — update before launch.
- Consider persisting generated images (see `generated_images` table instructions) if gallery/history features are required.

## Reference Materials
- `portrait-prompts.json` — curated prompt presets and variations.
- `gemini-api-guide.md` — detailed Gemini setup and troubleshooting.
- `CLAUDE.md` — alternate agent instructions with overlapping architectural context.
- `utils/supabase/migrations.md` — database schema/RLS reference.
