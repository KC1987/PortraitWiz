"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAtomValue, useSetAtom } from "jotai"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, CircleX, Loader2, LoaderCircle } from "lucide-react"

import { createClient } from "@/utils/supabase/client"
import { authAtom } from "@/lib/atoms"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(22, { message: "Username is too long (22 characters)." })
    .regex(/^[a-z0-9._]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, dots, and underscores.",
    })
    .transform((val) => val.toLowerCase().trim()),
})

export default function EnterPage() {
  const navigation = useRouter()
  const supabase = createClient()

  const { user, profile } = useAtomValue(authAtom)
  const setAuth = useSetAtom(authAtom)

  const [authError, setAuthError] = useState<string | null>(null)
  const [emailLoading, setEmailLoading] = useState(false)
  const [usernameSubmitting, setUsernameSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const [checking, setChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const isAuthenticated = Boolean(user)
  const hasUsername = Boolean(profile?.username)

  const heroBadge = hasUsername
    ? "Signed in"
    : isAuthenticated
      ? "Finish setup"
      : "Welcome back"
  const heroHeading = hasUsername
    ? `Welcome back, ${profile?.username}!`
    : isAuthenticated
      ? "Claim your Supershoot handle"
      : "Step back into your AI portrait studio"
  const heroSubheading = hasUsername
    ? "Head straight to your dashboard or keep exploring new looks."
    : isAuthenticated
      ? "Choose a unique username to personalize your gallery and share your portraits."
      : "Continue crafting stunning portraits with the tools you already love."

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
    mode: "onChange",
  })

  const username = form.watch("username")

  useEffect(() => {
    const trimmed = username?.toLowerCase().trim() ?? ""

    if (!trimmed || trimmed.length < 3) {
      setIsAvailable(null)
      setChecking(false)
      return
    }

    if (!form.formState.isValid) {
      setIsAvailable(null)
      setChecking(false)
      return
    }

    let isActive = true
    const timer = setTimeout(async () => {
      const supabaseClient = createClient()
      if (!supabaseClient || !isActive) {
        if (isActive) {
          setChecking(false)
        }
        return
      }

      setChecking(true)
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("username")
          .eq("username", trimmed)
          .maybeSingle()

        if (!error) {
          setIsAvailable(!data)
        }
      } catch (error) {
        console.error("Error checking username:", error)
      } finally {
        if (isActive) {
          setChecking(false)
        }
      }
    }, 600)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [form.formState.isValid, username])

  async function onLoginWithEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setAuthError(null)

    if (!loginEmail || !loginPassword) {
      setAuthError("Please enter both email and password.")
      return
    }

    if (!supabase) {
      setAuthError("Authentication service is not available.")
      return
    }

    setEmailLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setAuthError("Invalid email or password.")
        } else if (error.message.includes("Email not confirmed")) {
          setAuthError("Please verify your email before logging in.")
        } else {
          setAuthError(error.message)
        }
        return
      }

      if (data?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle()

        setAuth((prev) => ({
          ...prev,
          user: data.user ?? prev.user,
          profile: profileData ?? prev.profile,
          isInitializing: false,
        }))

        navigation.refresh()
        navigation.push(profileData?.username ? "/dashboard" : "/")
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("An unexpected error occurred. Please try again.")
    } finally {
      setEmailLoading(false)
    }
  }

  async function onUsernameFormSubmit(values: z.infer<typeof usernameSchema>) {
    if (!supabase || !user?.id) {
      form.setError("username", {
        type: "manual",
        message: "Service unavailable, please try again.",
      })
      return
    }

    if (!isAvailable) {
      form.setError("username", {
        type: "manual",
        message: "This username is not available.",
      })
      return
    }

    setUsernameSubmitting(true)

    try {
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        username: values.username,
      })

      if (error) {
        form.setError("username", {
          type: "manual",
          message: error.message,
        })
        return
      }

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      setAuth((prev) => ({
        ...prev,
        user: prev.user ?? user,
        profile:
          updatedProfile ??
          prev.profile ?? {
            id: user.id,
            username: values.username,
            credits: 0,
          },
        isInitializing: false,
      }))

      navigation.refresh()
      navigation.push("/dashboard")
    } catch (error) {
      console.error("Username registration error:", error)
      form.setError("username", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setUsernameSubmitting(false)
    }
  }

  async function handleEnterWithGoogle() {
    if (!supabase || googleLoading) return

    setAuthError(null)
    setGoogleLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window?.location?.origin}/auth/callback`,
          queryParams: {
            // prompt: "consent",
          },
        },
      })

      if (error) {
        setAuthError("We couldn't connect to Google. Please try again.")
        setGoogleLoading(false)
        return
      }

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setAuthError("We couldn't connect to Google. Please try again.")
      setGoogleLoading(false)
    }
  }

  async function handleSignOut() {
    if (!supabase) return

    setSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setAuthError(error.message)
      } else {
        setAuth({ user: null, profile: null, isInitializing: false })
        navigation.refresh()
      }
    } catch (error) {
      console.error("Sign out error:", error)
      setAuthError("Unable to sign out at the moment. Please try again.")
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute left-1/2 top-[-160px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-70 sm:top-[-220px] sm:h-[620px] sm:w-[620px]" />
        <div className="absolute bottom-[-140px] right-[-120px] h-[360px] w-[360px] rounded-full bg-sky-400/15 blur-3xl sm:h-[440px] sm:w-[440px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl space-y-10">
          {/*<div className="space-y-4 text-center">*/}
          {/*  <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">*/}
          {/*    {heroBadge}*/}
          {/*  </span>*/}
          {/*  <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">*/}
          {/*    {heroHeading}*/}
          {/*  </h1>*/}
          {/*  <p className="text-sm text-muted-foreground sm:text-base">*/}
          {/*    {heroSubheading}*/}
          {/*  </p>*/}
          {/*</div>*/}

          <Card className="border-border/70 bg-background/85 shadow-xl backdrop-blur-md">
            {hasUsername ? (
              <>
                <CardHeader className="space-y-2 text-center">
                  <CardTitle className="text-2xl font-semibold">
                    You&apos;re ready to create
                  </CardTitle>
                  <CardDescription>
                    Jump into your dashboard to launch a new session or manage
                    your portraits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="w-full transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Link href="/dashboard">Go to dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-primary/5"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      "Sign out"
                    )}
                  </Button>
                </CardContent>
              </>
            ) : isAuthenticated ? (
              <Form {...form}>
                <form
                  className="space-y-6 px-6 pb-6 pt-2 sm:px-8 sm:pb-8"
                  onSubmit={form.handleSubmit(onUsernameFormSubmit)}
                >
                  <div className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-semibold">
                      Pick a username
                    </CardTitle>
                    <CardDescription>
                      This will appear on shared galleries and in your navbar.
                    </CardDescription>
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.handle"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-[20px] pt-2">
                          {form.formState.isValid && checking ? (
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                              Checking availability...
                            </span>
                          ) : form.formState.isValid && isAvailable ? (
                            <span className="flex items-center gap-2 text-sm text-emerald-500">
                              <Check className="h-4 w-4" />
                              Username available
                            </span>
                          ) : form.formState.isValid && isAvailable === false ? (
                            <span className="flex items-center gap-2 text-sm text-destructive">
                              <CircleX className="h-4 w-4" />
                              Username is taken
                            </span>
                          ) : null}
                        </div>
                        <FormDescription>
                          Use lowercase letters, numbers, dots, or underscores.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={usernameSubmitting || checking}
                  >
                    {usernameSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <CardContent className="space-y-8 px-6 pb-8 pt-6 sm:px-8">
                <div className="space-y-4">
                  {/*<div className="rounded-2xl border border-primary/15 bg-white/80 p-4 shadow-[0_18px_45px_-22px_rgba(14,116,144,0.45)] ring-1 ring-primary/10 backdrop-blur-md transition-all duration-200 dark:border-slate-600/40 dark:bg-slate-900/65 dark:ring-primary/25">*/}
                    <Button
                      onClick={handleEnterWithGoogle}
                      disabled={googleLoading}
                      className={cn(
                        "group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary via-blue-500 to-sky-500 px-6 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(14,116,144,0.65)] transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-18px_rgba(14,165,233,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed dark:from-sky-500 dark:via-indigo-500 dark:to-blue-500"
                      )}
                    >
                      {googleLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <span className="flex size-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm shadow-sky-900/20 ring-2 ring-white/80 transition-all duration-200 group-hover:scale-105 group-hover:ring-primary/40">
                            <GoogleIcon />
                          </span>
                          <span className="flex flex-col items-start text-left leading-tight">
                            <span>Continue with Google</span>
                            <span className="text-xs font-normal text-white/80">
                              One-tap secure sign-in
                            </span>
                          </span>
                        </>
                      )}
                    </Button>
                  {/*</div>*/}
                  {authError && !emailLoading && (
                    <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {authError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or continue with email
                  <span className="h-px flex-1 bg-border" />
                </div>

                <form className="space-y-5" onSubmit={onLoginWithEmail}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(event) =>
                        setLoginPassword(event.target.value)
                      }
                    />
                  </div>
                  {authError && (
                    <p className="text-sm text-destructive">{authError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={emailLoading}
                  >
                    {emailLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  New to Supershoot?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Create an account
                  </Link>
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6 12.23c0-.76-.06-1.32-.19-1.9H12v3.44h5.44c-.11.86-.72 2.15-2.06 3.01l-.03.18 2.99 2.32.21.02c1.93-1.78 3.05-4.41 3.05-7.07Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.75 0 5.05-.9 6.73-2.45l-3.2-2.47c-.86.6-2.01 1.02-3.53 1.02-2.7 0-4.99-1.78-5.8-4.24l-.16.01-3.13 2.43-.04.15C5.54 19.98 8.52 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.2 13.85c-.2-.58-.32-1.2-.32-1.85s.12-1.27.32-1.85l-.01-.19-3.17-2.46-.1.05C2.33 8.73 2 10.33 2 12c0 1.67.33 3.27.92 4.68l3.28-2.53Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.5c1.9 0 3.18.82 3.91 1.51l2.86-2.8C17.03 2.58 14.75 1.5 12 1.5 8.52 1.5 5.54 3.52 4.05 6.32l3.28 2.53C8.01 7.28 9.3 5.5 12 5.5Z"
        fill="#EA4335"
      />
    </svg>
  )
}
