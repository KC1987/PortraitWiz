"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {createClient} from "@/utils/supabase/client";
import {useState} from "react";
import {Loader2} from "lucide-react";

// Design form schema
const formSchema = z.object({
  email: z.email()
    .min(1, { message: "Email is required." })
    .max(254, { message: "Email is too long." }), // RFC 5321 standard max length
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password is too long." })
    .regex(/(?=(.*[a-z]){2,})/, { message: "Password must contain at least 2 lowercase letters." })
    .regex(/(?=(.*[A-Z]){2,})/, { message: "Password must contain at least 2 uppercase letters." })
    .regex(/(?=(.*[0-9]){2,})/, { message: "Password must contain at least 2 numbers." })
    // .regex(/(?=(.*[^A-Za-z0-9]){2,})/, { message: "Password must contain at least 2 special characters." })
});


export default function RegisterPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

    // Define form
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      }
    });

    // On form submit
    function onRegisterFormSubmit(values: z.infer<typeof formSchema>) {
      setLoading(true);

      supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: "http://localhost:3000/enter"
        }
      }).then(({ data, error }) => {
        setLoading(false);

        if (error) {
          // console.log(error);
          form.setError("email", {
            type: "manual",
            message: error.message,
          })
          return
        }

        if (data) {
          // console.log(data);
          supabase.auth.refreshSession().then(() => setSuccess(true));
        }
      })
    }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center" >
      { !success ? (
        <>
          <h1>Register New User</h1>
          <Form {...form} >
            <form className="flex flex-col gap-2 max-w-md" onSubmit={form.handleSubmit(onRegisterFormSubmit)}>
              {/*Email*/}
              <FormField
                control={form.control}
                name="email"
                render={ ({ field }) => (
                  <FormItem>
                    {/*<FormLabel>Email</FormLabel>*/}
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    {/*<FormDescription>Please enter your email address</FormDescription>*/}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*Password*/}
              <FormField
                control={form.control}
                name="password"
                render={ ({ field }) => (
                  <FormItem>
                    {/*<FormLabel>Password</FormLabel>*/}
                    <FormControl>
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormDescription>Password must be at least 8 characters long and must contain at least 2 lowercase letters, 2 uppercase letters, and 2 numbers.</FormDescription>
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
        </>
      ) : (
        <div>
          <h1 className="text-xl text-lime-600" >Email registered successfully!</h1>
          <p>In order to complete the registration, please check your inbox for the confirmation email.</p>
        </div>
      )}
    </div>
  )
}