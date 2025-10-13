import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <SearchX className="w-10 h-10 text-primary" />
              </div>
              <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Page Not Found
          </h2>

          {/* Message */}
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="hover:scale-105 transition-transform duration-200">
              <Link href="/">Go Home</Link>
            </Button>
            {/*<Button asChild size="lg" variant="outline">*/}
            {/*  <Link href="/pricing">View Pricing</Link>*/}
            {/*</Button>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
