"use client"

import {useEffect, useState} from "react";
import { FormEvent } from "react";

import {useRouter} from "next/navigation";
import {useAtomValue} from "jotai";

import { createClient } from "@/utils/supabase/client"
import {authAtom} from "@/lib/atoms";

import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Check, CheckCircle2, CircleX, Loader2, LoaderCircle, XCircle} from "lucide-react";

// Design form schema
const usernameSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(22, { message: "Username is too long (22 characters)." })
    .regex(/^[a-z0-9._]+$/, { message: "Username can only contain lowercase letters, numbers, dots, and underscores." })
    .transform(val => val.toLowerCase().trim())
});

export default function EnterPage() {
  const navigation = useRouter()
  const supabase = createClient();

  const { user, profile } = useAtomValue(authAtom);

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  function onLoginWithEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear any previous errors
    setLoginError("");

    // Basic validation
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password");
      return;
    }

    // Optional: Set loading state
    setLoading(true);

    supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    }).then(({ data, error }) => {
      setLoading(false);

      if (error) {
        // Handle different error types with user-friendly messages
        if (error.message.includes("Invalid login credentials")) {
          setLoginError("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          setLoginError("Please verify your email before logging in");
        } else {
          setLoginError(error.message);
        }
        return; // Important: stop execution if there's an error
      }

      if (data?.user) {
        navigation.push("/");
        // console.log("Login successful");
      }
    }).catch((err: Error) => {
      // Catch any unexpected errors
      setLoading(false);
      setLoginError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    });
  }
  // Define form
  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    }
  });

  const username = form.watch("username");

  useEffect(() => {
      // Reset if empty or doesn't pass basic validation
      // if (!usernameToCheck || usernameToCheck.length < 3) {
      //   setIsAvailable(null);
      //   return;
      // }

      // Check if it passes regex validation (I'm checking zod errors, and don't call the function if errors are found)
      // if (!/^[a-z0-9._]+$/.test(usernameToCheck)) {
      //   setIsAvailable(null);
      //   return;
      // }

    const checkAvailability = async (usernameToCheck: string) => {
      setChecking(true);

      try {
        // console.log("checking...")
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', usernameToCheck.toLowerCase().trim())
          .maybeSingle();

        if (!error) {
          setIsAvailable(!data); // Available if no data found
        }
      } catch (err) {
        console.error("Error checking username:", err);
      } finally {
        setChecking(false);
      }
    };

    // Debounce logic
    const timer = setTimeout(() => {
      form.formState.isValid && checkAvailability(username);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, [ username, supabase ]);


  // On form submit
  function onUsernameFormSubmit(values: z.infer<typeof usernameSchema>) {
    // Error if username is not available
    if (!isAvailable) {
      form.setError("username", {
        type: "manual",
        message: "This username is not available",
      });
      return;
    }

    // Register the username
    setLoading(true);
    supabase
      .from('profiles')
      .insert({
        id: user?.id,
        username: values.username,
      }).then(({ data, error }) => {
          setLoading(false);
          if (error) {
            // setError(error.details);
            form.setError("username", {
              type: "manual",
              message: error.message,
            })
            return
          } else {
            console.log("Username set!");
            supabase.auth.refreshSession();
            // router.push("/");
            // window.location.href="/";
          }
    })
  }

  async function handleEnterWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "consent",
        }
      }
    })
    if (data) {
      console.log(data);

    }
    if (error) {
      console.log(error);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center" >
      { user && profile ? // User and dashboard exists (user dashboard page)
        <div>
          <h1 className="text-4xl" >Hello, {profile?.username}!</h1>
          <Button
            className="bg-sky-400"
            onClick={
              () => supabase.auth.signOut()
                .then( res => console.log( res.error || "Log Out Successful" ))
          }>
            Log Out
          </Button>
        </div>
        : user ?  // Only user exists (set username page)
          <Form {...form} >
            <form className="flex flex-col gap-2 max-w-md" onSubmit={form.handleSubmit(onUsernameFormSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Please choose your username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    {form.formState.isValid && checking ?
                      // Checking notification
                      <div className="flex items-center gap-1">
                        <LoaderCircle className="text-gray-600 w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">checking...</span>
                      </div>
                      : form.formState.isValid && isAvailable ?
                        // Username is available
                        <div className="flex items-center gap-1">
                          <Check className="text-lime-600 w-4 h-4" />
                          <span className="text-sm text-lime-600">username available</span>
                        </div>
                        : form.formState.isValid && isAvailable === false &&
                          // Username not available
                          <div className="flex items-center gap-1">
                            <CircleX className="text-red-500 w-4 h-4" />
                            <span className="text-sm text-red-500">username is taken</span>
                          </div>
                    }
                    <FormDescription>Username may include lower case letters, numbers, dots and underscores (_)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                type="submit"
              >
                { loading ?
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                  :
                  <>Continue</> }
              </Button>
            </form>
          </Form>
        : // New user signup page
        <div className="flex flex-col " >
          <Button className="bg-orange-500 max-w-[150]" onClick={handleEnterWithGoogle} >Enter With Google</Button>
          <form onSubmit={onLoginWithEmail} >
            <Input onChange={e => setLoginEmail(e.target.value)} value={loginEmail} placeholder="email" type="email" />
            <Input onChange={e => setLoginPassword(e.target.value)} value={loginPassword}  placeholder="password" type="password" />
            <Button type="submit" >Login</Button>
            <p className="text-red-500 text-sm">{loginError}</p>
          </form>
          <Link href="/register">Register with email</Link>
        </div>
      }

    </div>
  )
}