"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { createClient } from "@/utils/supabase/client"

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(254, { message: "Email is too long." })
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password is too long." })
    .regex(/(?=(.*[a-z]){2,})/, { message: "Include at least 2 lowercase letters." })
    .regex(/(?=(.*[A-Z]){2,})/, { message: "Include at least 2 uppercase letters." })
    .regex(/(?=(.*[0-9]){2,})/, { message: "Include at least 2 numbers." }),
})

export default function RegisterPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onRegisterFormSubmit(values: z.infer<typeof formSchema>) {
    if (!supabase) {
      form.setError("email", {
        type: "manual",
        message: "Service unavailable, please try again",
      })
      return
    }

    const trimmedValues = {
      email: values.email.trim(),
      password: values.password,
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedValues.email,
        password: trimmedValues.password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/enter` : undefined,
        },
      })

      if (error) {
        form.setError("email", {
          type: "manual",
          message: error.message,
        })
        return
      }

      if (data) {
        await supabase.auth.refreshSession()
        setSuccess(true)
      }
    } catch (error) {
      console.error("Registration error:", error)
      form.setError("email", {
        type: "manual",
        message: "Unexpected error. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12">
      {!success ? (
        <Card className="w-full max-w-md border-primary/10 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-semibold">Create your account</CardTitle>
            <CardDescription>Sign up with email to unlock your PortraitWiz dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onRegisterFormSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          placeholder="Create a secure password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Use at least 8 characters with 2 lowercase letters, 2 uppercase letters, and 2 numbers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>Create account</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link href="/enter" className="font-medium text-primary underline underline-offset-4">
                Sign in
              </Link>
            </p>
            <p>
              By continuing you agree to our{" "}
              <Link href="/terms" className="font-medium text-primary underline underline-offset-4">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-primary underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md border-primary/10 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </div>
            <CardTitle className="text-3xl font-semibold text-primary">Check your inbox</CardTitle>
            <CardDescription>
              We sent a confirmation email to complete your registration. Click the link inside to finish setting up
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Didn’t receive an email? Be sure to check your spam folder or{" "}
              <Link href="/contact" className="font-medium text-primary underline underline-offset-4">
                contact support
              </Link>
              .
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button className="w-full" asChild>
              <Link href="/enter">Go to sign in</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setSuccess(false)}>
              Register a different email
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
