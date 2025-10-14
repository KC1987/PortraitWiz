"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const [credits, setCredits] = useState<string | null>(null)

  useEffect(() => {
    const creditsParam = searchParams.get("credits")
    setCredits(creditsParam)
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="max-w-lg w-full shadow-xl">
        <CardHeader className="text-center space-y-4 pb-4">
          {/* Pixel Art Success Icon */}
          <div className="flex justify-center">
            <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              className="text-primary"
              fill="currentColor"
            >
              {/* Pixel art checkmark in a circle */}
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 12 L10 15 L17 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="square" />
            </svg>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Thank you for your purchase
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Credits Info */}
          {credits && (
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits Added</p>
                  <p className="text-3xl font-bold text-primary">+{credits}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="text-center space-y-2 py-4">
            <p className="text-muted-foreground">
              Your credits have been added to your account and are ready to use.
            </p>
            <p className="text-sm text-muted-foreground">
              Start creating amazing AI portraits now!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/" className="flex items-center justify-center gap-2">
                {/*<Home className="w-4 h-4" />*/}
                Create New Portrait
              </Link>
            </Button>
            <Button asChild className="flex-1" size="lg">
              <Link href="/dashboard/profile" className="flex items-center justify-center gap-2">
                {/*<User className="w-4 h-4" />*/}
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Decorative Pixel Pattern */}
          <div className="flex justify-center gap-1 opacity-20 pt-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
