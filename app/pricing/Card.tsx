"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { purchaseCredits } from "@/app/api/calls/buy-credits"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import { CheckCircle2, Sparkles } from "lucide-react"
import { formatPrice, pricePerCredit, type PricingPackage } from "@/lib/pricing-data"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  package: PricingPackage
  variant?: "default" | "compact"
}

export default function PricingCard({ package: pkg, variant = "default" }: PricingCardProps) {
  const { user } = useAtomValue(authAtom)
  const [isLoading, setIsLoading] = useState(false)

  async function handlePurchaseCredits() {
    if (!user?.id) {
      console.error("User not logged in")
      return
    }

    setIsLoading(true)
    try {
      const { url } = await purchaseCredits({
        packageId: pkg.id,
      })
      window.location.href = url
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        "w-full max-w-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        pkg.popular &&
          (variant === "compact"
            ? "border-primary border shadow-md"
            : "border-primary border-2 shadow-md scale-105"),
        variant === "compact" && "max-w-xs sm:max-w-sm hover:-translate-y-0"
      )}
    >
      {/* Popular Badge */}
      {pkg.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-0.5 text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {pkg.badge}
          </Badge>
        </div>
      )}

      <CardHeader className={cn("text-center pb-3 pt-6", variant === "compact" && "pb-2 pt-4")}>
        <CardTitle className={cn("text-xl font-semibold", variant === "compact" && "text-lg")}>
          {pkg.name}
        </CardTitle>
        {/*<div className={cn("mt-3", variant === "compact" && "mt-2")}>*/}
        {/*  <div className={cn("text-3xl font-bold", variant === "compact" && "text-2xl")}>*/}
        {/*    {formatPrice(pkg.price)}*/}
        {/*  </div>*/}
        {/*  <div*/}
        {/*    className={cn(*/}
        {/*      "text-xs text-muted-foreground mt-0.5",*/}
        {/*      variant === "compact" && "mt-0 text-[11px]"*/}
        {/*    )}*/}
        {/*  >*/}
        {/*    {pricePerCredit(pkg.price, pkg.credits)} per credit*/}
        {/*  </div>*/}
        {/*</div>*/}
        <CardDescription
          className={cn("text-sm font-medium mt-2", variant === "compact" && "text-xs mt-1")}
        >
          {pkg.credits} credits
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("pb-4", variant === "compact" && "pb-3")}>
        <ul className={cn("space-y-2", variant === "compact" && "space-y-1.5")}>
          {pkg.features.map((feature, index) => (
            <li
              key={index}
              className={cn("flex items-center gap-2", variant === "compact" && "gap-1.5")}
            >
              <CheckCircle2
                className={cn(
                  "w-4 h-4 text-primary flex-shrink-0",
                  variant === "compact" && "w-3.5 h-3.5"
                )}
              />
              <span
                className={cn("text-xs text-muted-foreground", variant === "compact" && "text-[11px]")}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className={cn("flex flex-col gap-2 pt-0", variant === "compact" && "gap-1.5")}>
        <Button
          onClick={handlePurchaseCredits}
          className={cn("w-full", variant === "compact" && "h-9 text-sm")}
          size={variant === "compact" ? "sm" : "default"}
          variant={pkg.popular ? "default" : "outline"}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Get Started"}
        </Button>
        <p
          className={cn(
            "text-[10px] text-center text-muted-foreground",
            variant === "compact" && "leading-tight"
          )}
        >
          100% Money-Back Guarantee
        </p>
      </CardFooter>
    </Card>
  )
}
