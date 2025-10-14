import { createClient } from "@/utils/supabase/client";
import type { AuthState, Profile } from "./atoms";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function useUserData(initialAuth?: AuthState) {
  const [user, setUser] = useState<User | null>(initialAuth?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(initialAuth?.profile ?? null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const supabase = createClient();

    if (!supabase) {
      setIsInitializing(false);
      return;
    }

    const fetchProfile = async (userId: string) => {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (isMounted) {
        setProfile(profileData);
      }

      return profileData;
    };

    const applySession = async (session: Session | null) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    };

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await applySession(session);

      if (isMounted) {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      await applySession(session);

      if (isMounted) {
        setIsInitializing(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, isInitializing };
}


