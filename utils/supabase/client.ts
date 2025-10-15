import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient>;

export const createClient = (): BrowserSupabaseClient | null => {
  // During SSR/build, env vars might not be available
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    // SSR/build environment - return a no-op mock client
    // This prevents crashes during prerendering
    return null;
  }

  // Validate env vars are available in browser
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not configured");
    return null;
  }

  // Create a fresh client instance to properly read updated cookies
  // This is critical for auth state after redirects (e.g., Stripe payments)
  return createBrowserClient(supabaseUrl, supabaseKey);
};
