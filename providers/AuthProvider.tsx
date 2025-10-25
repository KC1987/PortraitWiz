"use client"

import { useAtom } from "jotai"
import { useEffect } from "react"
import { authAtom } from "@/lib/atoms"
import { createClient } from "@/utils/supabase/client"

// -----------------------------------------------------------------------------
// AuthProvider: keeps Supabase auth and profile in sync with Jotai state
// -----------------------------------------------------------------------------
export default function AuthProvider({ children }) {
  const supabase = createClient()
  const [auth, setAuth] = useAtom(authAtom)

  // -----------------------------
  // 1. Hydrate session on mount
  // -----------------------------
  useEffect(() => {
    let mounted = true

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          if (process.env.NODE_ENV === "development")
            console.log("[Auth] Initial session:", session)

          setAuth(prev => ({
            ...prev,
            user: session.user,
            session,
          }))
        }
      } catch (err) {
        console.error("[Auth] Session init error:", err)
      }
    }

    initSession()
    return () => { mounted = false }
  }, [supabase, setAuth])

  // -----------------------------------
  // 2. Subscribe to auth state changes
  // -----------------------------------
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (process.env.NODE_ENV === "development")
        console.log("[Auth] Event:", event)

      if (!session?.user) {
        // Signed out
        setAuth({ user: null, session: null, profile: null })
        return
      }

      // Signed in or token refreshed
      setAuth(prev => ({
        ...prev,
        user: session.user,
        session,
      }))
    })

    return () => subscription.unsubscribe()
  }, [supabase, setAuth])

  // -----------------------------------
  // 3. Fetch user profile when user changes
  // -----------------------------------
  useEffect(() => {
    if (!auth?.user?.id) return

    let cancelled = false

    const getProfile = async () => {
      // Optional: avoid redundant refetch if profile already loaded
      if (auth.profile && auth.profile.id === auth.user.id) return

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", auth.user.id)
          .maybeSingle()

        if (cancelled) return

        if (error) {
          console.error("[Auth] Profile fetch error:", error.message)
          return
        }

        if (process.env.NODE_ENV === "development")
          console.log("[Auth] Profile fetched:", data)

        if (!data) {
          // Optional: you could auto-create a profile here if desired
          // await supabase.from("profiles").insert({ id: auth.user.id, ...defaults })
          console.warn("[Auth] No profile found for user:", auth.user.id)
        }

        setAuth(prev => ({ ...prev, profile: data || null }))
      } catch (err) {
        if (!cancelled)
          console.error("[Auth] Profile fetch failed:", err)
      }
    }

    getProfile()
    return () => { cancelled = true }
  }, [auth?.user?.id, supabase, setAuth])

  // -----------------------------------
  // 4. Render children
  // -----------------------------------
  return <>{children}</>
}
