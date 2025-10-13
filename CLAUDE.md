# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PortraitWiz is a Next.js 15 AI portrait generation app using Gemini 2.5 Flash Image Preview. It features a credit-based payment system with Stripe for payments and Supabase for authentication and database. The app uses Turbopack for fast development and builds.

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack on localhost:3000
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Important:** After testing, remember to kill localhost:3000 or other running server instances.

## Key Dependencies

- **Next.js 15**: App router with Turbopack
- **React 19**: Latest React version
- **Jotai**: Lightweight state management
- **Supabase (@supabase/ssr)**: Auth and database with SSR support
- **Stripe**: Payment processing
- **shadcn/ui**: UI component library built on Radix UI
- **Tailwind CSS v4**: Styling with PostCSS
- **Zod**: Schema validation
- **React Hook Form**: Form management with Zod resolvers

## Architecture

### State Management & Authentication Flow

The app uses **Jotai** for global state management with a centralized auth pattern:

1. **AuthProvider** (`providers/AuthProvider.tsx`) wraps the entire app in `layout.tsx`
2. **useUserData** hook (`lib/hooks.ts`) listens to Supabase auth changes and fetches user profile
3. **authAtom** (`lib/atoms.ts`) stores `{ user, profile }` globally
4. All client components access auth via `useAtomValue(authAtom)`

This architecture ensures a single source of truth for authentication state across the application.

### Supabase Client Pattern

There are **two separate Supabase clients**:

- **Client-side**: `utils/supabase/client.ts` - Synchronous, use in React components
- **Server-side**: `utils/supabase/server.ts` - **Async** (must `await`), use in API routes and Server Components

**Critical:** The server client's `createClient()` is async. Always use:
```ts
const supabase = await createClient();
```

### Stripe Payment Flow

1. **Client** (`components/button-checkout.tsx`): User clicks checkout button
   - Sends `{ packageId, userId, email }` to `/api/checkout`
   - Note: The checkout button component receives `amount` and `credits` as props but only uses them for display
2. **Checkout API** (`app/api/checkout/route.ts`):
   - Maps `packageId` to package details (`package-50`, `package-125`, `package-300`)
   - Creates Stripe checkout session with metadata: `{ userId, packageId, credits }`
   - Returns Stripe checkout URL
3. **User completes payment** on Stripe-hosted checkout page
   - Success redirects to `/success?session_id={CHECKOUT_SESSION_ID}`
   - Cancel redirects to home page
4. **Webhook** (`app/api/webhook/route.ts`):
   - Receives `checkout.session.completed` event
   - Extracts `userId` and `credits` from session metadata
   - Calls Supabase RPC `increment_credits` to atomically add credits to user account

### Credit Management

**Increment (Purchase):** Credits are added server-side via Stripe webhook calling the `increment_credits` Postgres function (see Database section).

**Deduct (Generation):** Credits are decremented server-side in the `/api/generate-image` route using the `deduct_credits` Postgres function, which atomically deducts and returns the new balance.

### Gemini Image Generation

The app uses reusable helper functions for API calls, located in `app/api/calls/`:

**generateImage** (`app/api/calls/image-gen.ts`):
- Encapsulates all Gemini API logic for image generation
- Supports **multi-image input** via `imageBase64Array` (up to 4 reference images)
- Gemini analyzes all reference images together in a single API call for better portrait accuracy
- Always uses `image/png` mime type
- Integrates with user-friendly error mapping (`lib/error-messages.ts`)
- Returns `{ imageBase64 }` or throws errors with `suggestion` and `isRetryable` metadata
- Used by `/api/generate-image` route

Pattern:
```ts
import { generateImage } from "../calls/image-gen";

const result = await generateImage({
  prompt: "A professional executive portrait",
  imageBase64Array: [image1, image2, image3]  // optional, 1-4 images
});
```

**Multi-Image Support:**
- Users can upload up to 4 reference images of themselves
- Gemini analyzes all images collectively to extract accurate facial features
- Single API call processes all images together (not multiple calls)
- Improves portrait quality through multi-angle analysis

**Image Generation Flow:**
1. `/api/generate-image` receives `{ prompt, imageBase64Array? }` from client
2. Validates user authentication via Supabase server client
3. Checks user has sufficient credits (≥1)
4. Calls `generateImage()` helper with prompt and optional image array
5. On success: deducts 1 credit via `deduct_credits` RPC
6. Returns generated image data and new credit balance
7. On failure: returns user-friendly error with suggestion

## Database

### Schema
- **profiles** table: `{ id (uuid), username (text), credits (int), ... }`
  - Note: Images are NOT stored in the database - users generate and download immediately

### Required Functions

**increment_credits** - Add credits after successful payment:
```sql
CREATE OR REPLACE FUNCTION increment_credits(user_id uuid, amount int)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
```

**deduct_credits** - Deduct credits and return new balance:
```sql
CREATE OR REPLACE FUNCTION deduct_credits(user_id uuid, amount int)
RETURNS int AS $$
DECLARE
  new_credits int;
BEGIN
  UPDATE profiles
  SET credits = credits - amount
  WHERE id = user_id
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$ LANGUAGE plpgsql;
```

See `utils/supabase/migrations.md` for complete migration scripts including RLS policies.

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GEMINI_API_KEY`

## API Routes

- **POST /api/checkout**: Creates Stripe checkout session for credit purchase
  - Input: `{ packageId }` (userId and email from authenticated session)
  - Packages defined in `lib/pricing-data.ts`:
    - `package-50`: 50 credits at $19.99
    - `package-150`: 150 credits at $44.99 (Popular/Best Value)
    - `package-250`: 250 credits at $69.99 (Professional)
  - Returns: `{ url }` (Stripe checkout URL)

- **POST /api/webhook**: Stripe webhook handler for payment completion
  - Handles `checkout.session.completed` event
  - Calls `increment_credits` RPC to add credits to user account

- **POST /api/generate-image**: Generate AI portrait image
  - Input: `{ prompt, imageBase64Array? }` (array of up to 4 base64 images)
  - Requires authentication
  - Validates max 4 images server-side
  - Checks credits ≥1 before generation
  - Returns user-friendly errors with suggestions via `lib/error-messages.ts`
  - Returns: `{ image_data: { imageBase64 }, credits_data }`

## Error Handling

The app implements comprehensive user-friendly error handling for AI generation failures:

**Error Mapping System** (`lib/error-messages.ts`):
- Maps technical Gemini API errors to user-friendly messages
- Provides actionable suggestions for users
- Includes `isRetryable` flag for appropriate UI handling
- Categories: rate limits, content policy, network issues, invalid input, server errors

**Integration:**
- `app/api/calls/image-gen.ts`: Catches Gemini errors and attaches user-friendly metadata
- `app/api/generate-image/route.ts`: Returns structured error responses with suggestions
- UI components: Display errors with AlertCircle icon, message, and suggestion

## Middleware & Route Protection

**Server-side route protection** (`middleware.ts`):
- Protected routes (`/dashboard/*`): Require authentication, redirect to `/enter` if not logged in
- Guest-only routes (`/enter`, `/register`): Redirect authenticated users with profiles to `/dashboard`
- Exception: Users without username can access `/enter` to complete profile setup
- Fetches both user session AND profile data for comprehensive auth checks

## Pricing System

**Centralized Configuration** (`lib/pricing-data.ts`):
- Single source of truth for all pricing packages
- Type-safe interfaces with helper functions (`formatPrice`, `pricePerCredit`)
- Pricing cards are dynamically generated from this data
- Supports badges (e.g., "Best Value"), popular flags, feature lists

**Current Packages:**
- 50 credits: $19.99 (Starter)
- 150 credits: $44.99 (Popular - Best Value)
- 250 credits: $69.99 (Professional)

## Additional Resources

- **portrait-prompts.json**: Comprehensive documentation of all AI prompts used for portrait generation, including base prompts, background variations, and outfit options
- **gemini-api-guide.md**: Complete guide for working with Gemini Image Generation API, including setup, request/response patterns, error handling, and best practices

## React Hooks Guidelines

- Hooks can **only** be used in React components
- API routes (`app/api/**/route.ts`) **cannot** use hooks
- For shared logic between components and API routes, create utility functions that can be called from both contexts
- Hooks must be called at the top level of components (not inside callbacks/conditions)
- Use shadcn/ui components where possible