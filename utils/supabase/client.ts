import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single instance that's cached at module level
let client: SupabaseClient | null = null;

export const createClient = () => {
  if (client) {
    return client;
  }

  client = createBrowserClient(supabaseUrl!, supabaseKey!);
  return client;
};
