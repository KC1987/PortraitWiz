import { atom } from "jotai";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username?: string;
  credits: number;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
}

export const authAtom = atom<AuthState>({ user: null, profile: null });